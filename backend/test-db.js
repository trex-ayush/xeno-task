require('dotenv').config();
const pool = require('./db/connection');

pool.query('SELECT NOW()')
    .then(res => {
        console.log('Connected:', res.rows[0]);
        process.exit(0);
    })
    .catch(err => {
        console.log('Error:', err.message);
        process.exit(1);
    });