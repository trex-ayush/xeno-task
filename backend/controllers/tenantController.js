const pool = require('../db/connection');

const getStatus = async (req, res) => {
    const tenantId = req.user.tenant_id;

    try {
        const tenantResult = await pool.query(
            'SELECT store_name, store_url, created_at FROM tenants WHERE id = $1',
            [tenantId]
        );

        if (tenantResult.rows.length === 0) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        const customerCount = await pool.query(
            'SELECT COUNT(*) FROM customers WHERE tenant_id = $1',
            [tenantId]
        );

        const productCount = await pool.query(
            'SELECT COUNT(*) FROM products WHERE tenant_id = $1',
            [tenantId]
        );

        const orderCount = await pool.query(
            'SELECT COUNT(*) FROM orders WHERE tenant_id = $1',
            [tenantId]
        );

        const lastSync = await pool.query(
            'SELECT created_at, status FROM sync_logs WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 1',
            [tenantId]
        );

        res.json({
            tenant: tenantResult.rows[0],
            counts: {
                customers: parseInt(customerCount.rows[0].count),
                products: parseInt(productCount.rows[0].count),
                orders: parseInt(orderCount.rows[0].count)
            },
            lastSync: lastSync.rows[0] || null
        });

    } catch (err) {
        console.log('Get status error:', err.message);
        res.status(500).json({ error: 'Failed to fetch status' });
    }
};

module.exports = { getStatus };