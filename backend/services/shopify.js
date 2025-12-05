const axios = require('axios');

const createShopifyClient = (storeUrl, accessToken) => {
    const baseURL = `https://${storeUrl}/admin/api/2024-01`;

    const client = axios.create({
        baseURL,
        headers: {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json'
        }
    });

    return client;
};

const fetchCustomers = async (storeUrl, accessToken) => {
    const client = createShopifyClient(storeUrl, accessToken);
    const response = await client.get('/customers.json?limit=250');
    return response.data.customers;
};

const fetchProducts = async (storeUrl, accessToken) => {
    const client = createShopifyClient(storeUrl, accessToken);
    const response = await client.get('/products.json?limit=250');
    return response.data.products;
};

const fetchOrders = async (storeUrl, accessToken) => {
    const client = createShopifyClient(storeUrl, accessToken);
    const response = await client.get('/orders.json?limit=250&status=any');
    return response.data.orders;
};

const verifyCredentials = async (storeUrl, accessToken) => {
    try {
        const client = createShopifyClient(storeUrl, accessToken);
        const response = await client.get('/shop.json');
        return { valid: true, shop: response.data.shop };
    } catch (err) {
        return { valid: false, shop: null };
    }
};

module.exports = {
    fetchCustomers,
    fetchProducts,
    fetchOrders,
    verifyCredentials
};