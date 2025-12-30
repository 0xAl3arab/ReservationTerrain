import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminNavbar from "../../components/Admin/AdminNavbar";

function AdminDashboard() {
    const navigate = useNavigate();
    const [adminEmail, setAdminEmail] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("admin_access_token");
        if (!token) {
            navigate("/admin/login");
            return;
        }
        setAdminEmail("admin@weplay.com");
    }, [navigate]);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
            <AdminNavbar />

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-10 flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-bold mb-2">Main Dashboard</h2>
                        <p className="text-gray-500">Welcome back to your administration panel.</p>
                    </div>
                    <div className="bg-[#141414] border border-[#222] px-4 py-2 rounded-xl flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold text-green-500 uppercase tracking-wider">Connected</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-[#141414] border border-[#222] p-8 rounded-3xl">
                        <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-4">Total Complexes</p>
                        <span className="text-4xl font-bold">--</span>
                    </div>

                    <div className="bg-[#141414] border border-[#222] p-8 rounded-3xl">
                        <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-4">Total Reservations</p>
                        <span className="text-4xl font-bold">128</span>
                    </div>

                    <div className="bg-[#141414] border border-[#222] p-8 rounded-3xl">
                        <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-4">Active Terrains</p>
                        <span className="text-4xl font-bold">12</span>
                    </div>
                </div>

                {/* Quick Actions or Recent Activity */}
                <div className="bg-[#141414] border border-[#222] rounded-3xl p-12 text-center">
                    <div className="w-20 h-20 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Welcome to WePlay Admin</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">Use the navigation bar to manage complexes, reservations, and users.</p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => navigate("/admin/complexes")}
                            className="bg-[#0B2CFF] hover:bg-[#001B87] text-white px-6 py-3 rounded-xl font-bold transition-all"
                        >
                            Manage Complexes
                        </button>
                        <button className="bg-[#222] hover:bg-[#333] text-white px-6 py-3 rounded-xl font-bold transition-all">
                            View Reports
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;
