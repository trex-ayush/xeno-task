const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/connection');

const register = async (req, res) => {
    const { email, password, storeName, storeUrl, accessToken } = req.body;

    if (!email || !password || !storeName || !storeUrl || !accessToken) {
        return res.status(400).json({ error: 'All fields required' });
    }

    try {
        const userExists = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const tenantResult = await pool.query(
            'INSERT INTO tenants (store_name, store_url, access_token) VALUES ($1, $2, $3) RETURNING id',
            [storeName, storeUrl, accessToken]
        );

        const tenantId = tenantResult.rows[0].id;

        const hashedPassword = await bcrypt.hash(password, 10);

        const userResult = await pool.query(
            'INSERT INTO users (tenant_id, email, password) VALUES ($1, $2, $3) RETURNING id, email',
            [tenantId, email, hashedPassword]
        );

        const token = jwt.sign(
            { userId: userResult.rows[0].id, tenantId },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: { id: userResult.rows[0].id, email }
        });

    } catch (err) {
        console.log('Register error:', err.message);
        res.status(500).json({ error: 'Registration failed' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }

    try {
        const result = await pool.query(
            'SELECT id, email, password, tenant_id FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, tenantId: user.tenant_id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, email: user.email }
        });

    } catch (err) {
        console.log('Login error:', err.message);
        res.status(500).json({ error: 'Login failed' });
    }
};

const getProfile = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT u.id, u.email, t.store_name, t.store_url 
             FROM users u 
             JOIN tenants t ON u.tenant_id = t.id 
             WHERE u.id = $1`,
            [req.user.id]
        );

        res.json({ user: result.rows[0] });

    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

module.exports = { register, login, getProfile };