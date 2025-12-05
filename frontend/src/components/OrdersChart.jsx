import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { analyticsAPI } from '../api';

const OrdersChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({ from: '', to: '' });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await analyticsAPI.getOrdersByDate(dateRange);
            const formattedData = response.data.data.map(item => ({
                date: new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
                orders: parseInt(item.orders),
                revenue: parseFloat(item.revenue)
            }));
            setData(formattedData);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = () => {
        setLoading(true);
        fetchOrders();
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Orders Over Time</h3>
                <div className="flex items-center gap-2 mt-3 sm:mt-0">
                    <input
                        type="date"
                        value={dateRange.from}
                        onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                        className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                    <span className="text-slate-400">to</span>
                    <input
                        type="date"
                        value={dateRange.to}
                        onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                        className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                    <button
                        onClick={handleFilter}
                        className="px-3 py-1.5 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
                    >
                        Apply
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-slate-500 text-center py-16">Loading...</div>
            ) : data.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                        <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: '#fff', 
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                            }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="orders" 
                            stroke="#0f172a" 
                            strokeWidth={2}
                            dot={{ fill: '#0f172a', strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <div className="text-slate-500 text-center py-16">No order data available</div>
            )}
        </div>
    );
};

export default OrdersChart;