import { Link, useNavigate, useLocation } from "react-router-dom";

function AdminNavbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const adminEmail = "admin@weplay.com"; // In a real app, get this from context or token

    const handleLogout = () => {
        localStorage.removeItem("admin_access_token");
        localStorage.removeItem("admin_refresh_token");
        navigate("/admin/login");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="border-b border-[#222] bg-[#141414]/50 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link to="/admin/dashboard" className="text-2xl font-black tracking-tighter">
                        WEPLAY<span className="text-[#0B2CFF]">.</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
                        <Link
                            to="/admin/dashboard"
                            className={`${isActive("/admin/dashboard") ? "text-white" : "hover:text-white"} transition-colors`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/admin/complexes"
                            className={`${isActive("/admin/complexes") ? "text-white" : "hover:text-white"} transition-colors`}
                        >
                            Complexes
                        </Link>
                        <Link
                            to="/admin/reservations"
                            className={`${isActive("/admin/reservations") ? "text-white" : "hover:text-white"} transition-colors`}
                        >
                            Reservations
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-white">Welcome</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Super Admin</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-[#222] hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default AdminNavbar;
