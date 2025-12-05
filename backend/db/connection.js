const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.on('connect', () => {
    console.log('Connected to PostgreSQL');
});

pool.on('error', (err) => {
    console.error('PostgreSQL error:', err);
});

module.exports = pool;