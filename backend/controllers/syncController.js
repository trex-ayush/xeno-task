const pool = require('../db/connection');
const shopifyService = require('../services/shopify');

const syncAll = async (req, res) => {
    const tenantId = req.user.tenant_id;

    try {
        const tenantResult = await pool.query(
            'SELECT store_url, access_token FROM tenants WHERE id = $1',
            [tenantId]
        );

        if (tenantResult.rows.length === 0) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        const { store_url, access_token } = tenantResult.rows[0];

        await pool.query(
            'INSERT INTO sync_logs (tenant_id, sync_type, status) VALUES ($1, $2, $3)',
            [tenantId, 'full', 'in_progress']
        );

        const customers = await shopifyService.fetchCustomers(store_url, access_token);
        const products = await shopifyService.fetchProducts(store_url, access_token);
        const orders = await shopifyService.fetchOrders(store_url, access_token);

        let customersSynced = 0;
        let productsSynced = 0;
        let ordersSynced = 0;

        for (const customer of customers) {
            await pool.query(
                `INSERT INTO customers (tenant_id, shopify_id, email, first_name, last_name, phone, total_spent)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 ON CONFLICT (tenant_id, shopify_id) 
                 DO UPDATE SET email = $3, first_name = $4, last_name = $5, phone = $6, total_spent = $7`,
                [
                    tenantId,
                    customer.id,
                    customer.email,
                    customer.first_name,
                    customer.last_name,
                    customer.phone,
                    parseFloat(customer.total_spent) || 0
                ]
            );
            customersSynced++;
        }

        for (const product of products) {
            const price = product.variants?.[0]?.price || 0;

            await pool.query(
                `INSERT INTO products (tenant_id, shopify_id, title, vendor, product_type, price)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 ON CONFLICT (tenant_id, shopify_id)
                 DO UPDATE SET title = $3, vendor = $4, product_type = $5, price = $6`,
                [
                    tenantId,
                    product.id,
                    product.title,
                    product.vendor,
                    product.product_type,
                    parseFloat(price)
                ]
            );
            productsSynced++;
        }

        for (const order of orders) {
            let customerId = null;

            if (order.customer?.id) {
                const customerResult = await pool.query(
                    'SELECT id FROM customers WHERE tenant_id = $1 AND shopify_id = $2',
                    [tenantId, order.customer.id]
                );

                if (customerResult.rows.length > 0) {
                    customerId = customerResult.rows[0].id;
                }
            }

            const orderResult = await pool.query(
                `INSERT INTO orders (tenant_id, shopify_id, customer_id, order_number, total_price, financial_status, fulfillment_status, order_date)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                 ON CONFLICT (tenant_id, shopify_id)
                 DO UPDATE SET customer_id = $3, total_price = $5, financial_status = $6, fulfillment_status = $7
                 RETURNING id`,
                [
                    tenantId,
                    order.id,
                    customerId,
                    order.order_number,
                    parseFloat(order.total_price),
                    order.financial_status,
                    order.fulfillment_status,
                    order.created_at
                ]
            );

            const orderId = orderResult.rows[0].id;

            await pool.query(
                'DELETE FROM order_items WHERE order_id = $1',
                [orderId]
            );

            for (const item of order.line_items || []) {
                let productId = null;

                const productResult = await pool.query(
                    'SELECT id FROM products WHERE tenant_id = $1 AND shopify_id = $2',
                    [tenantId, item.product_id]
                );

                if (productResult.rows.length > 0) {
                    productId = productResult.rows[0].id;
                }

                await pool.query(
                    'INSERT INTO order_items (tenant_id, order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4, $5)',
                    [tenantId, orderId, productId, item.quantity, parseFloat(item.price)]
                );
            }

            ordersSynced++;
        }

        await pool.query(
            `UPDATE sync_logs SET status = $1, records_synced = $2 
             WHERE tenant_id = $3 AND status = 'in_progress'`,
            ['completed', customersSynced + productsSynced + ordersSynced, tenantId]
        );

        res.json({
            message: 'Sync completed',
            synced: {
                customers: customersSynced,
                products: productsSynced,
                orders: ordersSynced
            }
        });

    } catch (err) {
        console.log('Sync error:', err.message);

        await pool.query(
            `UPDATE sync_logs SET status = $1, error_message = $2 
             WHERE tenant_id = $3 AND status = 'in_progress'`,
            ['failed', err.message, tenantId]
        );

        res.status(500).json({ error: 'Sync failed' });
    }
};

const getSyncLogs = async (req, res) => {
    const tenantId = req.user.tenant_id;

    try {
        const result = await pool.query(
            'SELECT * FROM sync_logs WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 20',
            [tenantId]
        );

        res.json({ logs: result.rows });

    } catch (err) {
        console.log('Get sync logs error:', err.message);
        res.status(500).json({ error: 'Failed to fetch sync logs' });
    }
};

module.exports = { syncAll, getSyncLogs };