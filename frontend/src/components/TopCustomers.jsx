import { useState, useEffect } from 'react';
import { analyticsAPI } from '../api';

const TopCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await analyticsAPI.getTopCustomers(5);
            setCustomers(response.data.customers);
        } catch (err) {
            console.error('Failed to fetch top customers:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Customers</h3>

            {loading ? (
                <div className="text-slate-500 text-center py-8">Loading...</div>
            ) : customers.length === 0 ? (
                <div className="text-slate-500 text-center py-8">No customer data</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="text-left py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                                <th className="text-right py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Orders</th>
                                <th className="text-right py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Spent</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {customers.map((customer) => (
                                <tr key={customer.id}>
                                    <td className="py-3">
                                        <div className="font-medium text-slate-900">
                                            {customer.first_name} {customer.last_name}
                                        </div>
                                        <div className="text-sm text-slate-500">{customer.email}</div>
                                    </td>
                                    <td className="text-right text-slate-600">{customer.order_count}</td>
                                    <td className="text-right font-medium text-slate-900">
                                        Rs. {parseFloat(customer.total_spent).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TopCustomers;