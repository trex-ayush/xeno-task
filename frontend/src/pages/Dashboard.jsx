import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import OverviewCards from '../components/OverviewCards';
import OrdersChart from '../components/OrdersChart';
import TopCustomers from '../components/TopCustomers';
import RevenueChart from '../components/RevenueChart';
import TopProducts from '../components/TopProducts';
import { syncAPI, analyticsAPI } from '../api';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [message, setMessage] = useState('');
    const [overview, setOverview] = useState(null);

    useEffect(() => {
        fetchOverview();
    }, []);

    const fetchOverview = async () => {
        setLoading(true);
        try {
            const response = await analyticsAPI.getOverview();
            setOverview(response.data);
        } catch (err) {
            console.error('Failed to fetch overview:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        setSyncing(true);
        setMessage('');
        try {
            const response = await syncAPI.trigger();
            const { customers, products, orders } = response.data.synced;
            setMessage(`Synced ${customers} customers, ${products} products, ${orders} orders`);
            fetchOverview();
        } catch (err) {
            setMessage('Sync failed: ' + (err.response?.data?.error || 'Unknown error'));
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar onSync={handleSync} syncing={syncing} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 mt-1">Welcome back, {user?.email}</p>
                </div>

                {message && (
                    <div className={`px-4 py-3 rounded-lg mb-6 ${message.includes('failed') ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
                        {message}
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-slate-500">Loading dashboard...</div>
                    </div>
                ) : (
                    <>
                        <OverviewCards data={overview} />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                            <OrdersChart />
                            <RevenueChart />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                            <TopCustomers />
                            <TopProducts />
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default Dashboard;