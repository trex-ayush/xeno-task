import { useState, useEffect } from 'react';
import { analyticsAPI } from '../api';

const TopProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await analyticsAPI.getTopProducts(5);
            setProducts(response.data.products);
        } catch (err) {
            console.error('Failed to fetch top products:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Products</h3>

            {loading ? (
                <div className="text-slate-500 text-center py-8">Loading...</div>
            ) : products.length === 0 ? (
                <div className="text-slate-500 text-center py-8">No product data</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="text-left py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                                <th className="text-right py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Sold</th>
                                <th className="text-right py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td className="py-3">
                                        <div className="font-medium text-slate-900">{product.title}</div>
                                        <div className="text-sm text-slate-500">
                                            Rs. {parseFloat(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </div>
                                    </td>
                                    <td className="text-right text-slate-600">{product.units_sold}</td>
                                    <td className="text-right font-medium text-slate-900">
                                        Rs. {parseFloat(product.revenue).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
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

export default TopProducts;