import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onSync, syncing }) => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <span className="text-xl font-bold text-slate-900">Xeno Insights</span>
                        <span className="hidden sm:block ml-3 px-2 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded">
                            Shopify Analytics
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onSync}
                            disabled={syncing}
                            className="px-4 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition"
                        >
                            {syncing ? 'Syncing...' : 'Sync Data'}
                        </button>

                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;