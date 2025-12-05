const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const tenantRoutes = require('./routes/tenants');
const syncRoutes = require('./routes/sync');
const analyticsRoutes = require('./routes/analytics');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
    console.log('Server error:', err.message);
});