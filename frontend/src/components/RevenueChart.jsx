import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { analyticsAPI } from '../api';

const RevenueChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('daily');

    useEffect(() => {
        fetchRevenue();
    }, [period]);

    const fetchRevenue = async () => {
        setLoading(true);
        try {
            const response = await analyticsAPI.getRevenueTrend(period);
            const formattedData = response.data.data.map(item => ({
                period: new Date(item.period).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
                revenue: parseFloat(item.revenue),
                orders: parseInt(item.orders)
            }));
            setData(formattedData);
        } catch (err) {
            console.error('Failed to fetch revenue:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Revenue Trend</h3>
                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
            </div>

            {loading ? (
                <div className="text-slate-500 text-center py-16">Loading...</div>
            ) : data.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                        <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: '#fff', 
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                            }}
                            formatter={(value) => [`Rs. ${value.toLocaleString('en-IN')}`, 'Revenue']}
                        />
                        <Bar dataKey="revenue" fill="#0f172a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="text-slate-500 text-center py-16">No revenue data available</div>
            )}
        </div>
    );
};

export default RevenueChart;