const pool = require('../db/connection');

const getOverview = async (req, res) => {
    const tenantId = req.user.tenant_id;

    try {
        const customers = await pool.query(
            'SELECT COUNT(*) FROM customers WHERE tenant_id = $1',
            [tenantId]
        );

        const orders = await pool.query(
            'SELECT COUNT(*) FROM orders WHERE tenant_id = $1',
            [tenantId]
        );

        const revenue = await pool.query(
            'SELECT COALESCE(SUM(total_price), 0) as total FROM orders WHERE tenant_id = $1',
            [tenantId]
        );

        const products = await pool.query(
            'SELECT COUNT(*) FROM products WHERE tenant_id = $1',
            [tenantId]
        );

        const avgOrderValue = await pool.query(
            'SELECT COALESCE(AVG(total_price), 0) as avg FROM orders WHERE tenant_id = $1',
            [tenantId]
        );

        res.json({
            totalCustomers: parseInt(customers.rows[0].count),
            totalOrders: parseInt(orders.rows[0].count),
            totalRevenue: parseFloat(revenue.rows[0].total),
            totalProducts: parseInt(products.rows[0].count),
            avgOrderValue: parseFloat(avgOrderValue.rows[0].avg).toFixed(2)
        });

    } catch (err) {
        console.log('Overview error:', err.message);
        res.status(500).json({ error: 'Failed to fetch overview' });
    }
};

const getOrdersByDate = async (req, res) => {
    const tenantId = req.user.tenant_id;
    const { from, to } = req.query;

    try {
        let query = `
            SELECT DATE(order_date) as date, COUNT(*) as orders, SUM(total_price) as revenue
            FROM orders
            WHERE tenant_id = $1
        `;
        const params = [tenantId];

        if (from) {
            params.push(from);
            query += ` AND order_date >= $${params.length}`;
        }

        if (to) {
            params.push(to);
            query += ` AND order_date <= $${params.length}`;
        }

        query += ' GROUP BY DATE(order_date) ORDER BY date ASC';

        const result = await pool.query(query, params);

        res.json({ data: result.rows });

    } catch (err) {
        console.log('Orders by date error:', err.message);
        res.status(500).json({ error: 'Failed to fetch orders by date' });
    }
};

const getTopCustomers = async (req, res) => {
    const tenantId = req.user.tenant_id;
    const limit = req.query.limit || 5;

    try {
        const result = await pool.query(
            `SELECT c.id, c.email, c.first_name, c.last_name, 
                    COUNT(o.id) as order_count,
                    COALESCE(SUM(o.total_price), 0) as total_spent
             FROM customers c
             LEFT JOIN orders o ON c.id = o.customer_id
             WHERE c.tenant_id = $1
             GROUP BY c.id
             ORDER BY total_spent DESC
             LIMIT $2`,
            [tenantId, limit]
        );

        res.json({ customers: result.rows });

    } catch (err) {
        console.log('Top customers error:', err.message);
        res.status(500).json({ error: 'Failed to fetch top customers' });
    }
};

const getRevenueTrend = async (req, res) => {
    const tenantId = req.user.tenant_id;
    const { period } = req.query;

    try {
        let groupBy;
        let dateFormat;

        if (period === 'weekly') {
            groupBy = "DATE_TRUNC('week', order_date)";
            dateFormat = 'week';
        } else if (period === 'monthly') {
            groupBy = "DATE_TRUNC('month', order_date)";
            dateFormat = 'month';
        } else {
            groupBy = 'DATE(order_date)';
            dateFormat = 'day';
        }

        const result = await pool.query(
            `SELECT ${groupBy} as period, 
                    SUM(total_price) as revenue,
                    COUNT(*) as orders
             FROM orders
             WHERE tenant_id = $1
             GROUP BY ${groupBy}
             ORDER BY period ASC`,
            [tenantId]
        );

        res.json({ 
            period: dateFormat,
            data: result.rows 
        });

    } catch (err) {
        console.log('Revenue trend error:', err.message);
        res.status(500).json({ error: 'Failed to fetch revenue trend' });
    }
};

const getTopProducts = async (req, res) => {
    const tenantId = req.user.tenant_id;
    const limit = req.query.limit || 5;

    try {
        const result = await pool.query(
            `SELECT p.id, p.title, p.price,
                    COALESCE(SUM(oi.quantity), 0) as units_sold,
                    COALESCE(SUM(oi.quantity * oi.price), 0) as revenue
             FROM products p
             LEFT JOIN order_items oi ON p.id = oi.product_id
             WHERE p.tenant_id = $1
             GROUP BY p.id
             ORDER BY units_sold DESC
             LIMIT $2`,
            [tenantId, limit]
        );

        res.json({ products: result.rows });

    } catch (err) {
        console.log('Top products error:', err.message);
        res.status(500).json({ error: 'Failed to fetch top products' });
    }
};

const getOrderStatus = async (req, res) => {
    const tenantId = req.user.tenant_id;

    try {
        const financial = await pool.query(
            `SELECT financial_status, COUNT(*) as count
             FROM orders
             WHERE tenant_id = $1
             GROUP BY financial_status`,
            [tenantId]
        );

        const fulfillment = await pool.query(
            `SELECT fulfillment_status, COUNT(*) as count
             FROM orders
             WHERE tenant_id = $1
             GROUP BY fulfillment_status`,
            [tenantId]
        );

        res.json({
            financial: financial.rows,
            fulfillment: fulfillment.rows
        });

    } catch (err) {
        console.log('Order status error:', err.message);
        res.status(500).json({ error: 'Failed to fetch order status' });
    }
};

module.exports = { 
    getOverview, 
    getOrdersByDate, 
    getTopCustomers, 
    getRevenueTrend,
    getTopProducts,
    getOrderStatus
};