import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        storeName: '',
        storeUrl: '',
        accessToken: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 to-slate-800 p-12 flex-col justify-between">
                <div>
                    <h1 className="text-white text-3xl font-bold">Xeno Insights</h1>
                    <p className="text-slate-400 mt-2">Shopify Analytics Platform</p>
                </div>
                <div>
                    <h2 className="text-white text-4xl font-bold leading-tight">
                        Start analyzing your Shopify store today
                    </h2>
                    <p className="text-slate-400 mt-4">
                        Connect your store in minutes. No complex setup required.
                    </p>
                </div>
                <p className="text-slate-500 text-sm">Xeno FDE Assignment 2025</p>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="lg:hidden mb-8">
                        <h1 className="text-2xl font-bold text-slate-900">Xeno Insights</h1>
                        <p className="text-slate-500">Shopify Analytics Platform</p>
                    </div>

                    <h2 className="text-2xl font-semibold text-slate-900">Create your account</h2>
                    <p className="text-slate-500 mt-1 mb-8">Connect your Shopify store</p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                                placeholder="Create a password"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Store Name
                            </label>
                            <input
                                type="text"
                                name="storeName"
                                value={formData.storeName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                                placeholder="My Awesome Store"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Shopify Store URL
                            </label>
                            <input
                                type="text"
                                name="storeUrl"
                                value={formData.storeUrl}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                                placeholder="yourstore.myshopify.com"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Admin API Access Token
                            </label>
                            <input
                                type="text"
                                name="accessToken"
                                value={formData.accessToken}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                                placeholder="shpat_xxxxx"
                                required
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                Found in Shopify Admin - Settings - Apps - Develop apps
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-slate-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-slate-900 font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;