import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
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
                        Transform your Shopify data into actionable insights
                    </h2>
                    <p className="text-slate-400 mt-4">
                        Connect your store and get real-time analytics on customers, orders, and revenue.
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

                    <h2 className="text-2xl font-semibold text-slate-900">Welcome back</h2>
                    <p className="text-slate-500 mt-1 mb-8">Sign in to your account</p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-slate-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-slate-900 font-medium hover:underline">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;