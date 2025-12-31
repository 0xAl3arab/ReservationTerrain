import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminNavbar from "../../components/Admin/AdminNavbar";
import { authService } from "../../services/authService";

function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalComplexes: 0,
        activeTerrains: 0,
        totalReservations: 0,
        weeklyReservationsCount: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, [navigate]);

    const fetchDashboardData = async () => {
        try {
            // Calculate current week range (Mon-Sun)
            const today = new Date();
            const day = today.getDay(); // 0 (Sun) - 6 (Sat)
            const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
            const monday = new Date(today.setDate(diff));
            const sunday = new Date(today.setDate(monday.getDate() + 6));

            const formatDate = (date) => date.toISOString().split('T')[0];

            const [countRes, activeTerrainsRes, totalResRes, weeklyResCountRes] = await Promise.all([
                authService.fetchAuth("http://localhost:8080/api/complexes/count"),
                authService.fetchAuth("http://localhost:8080/api/terrains/active/total-count"),
                authService.fetchAuth("http://localhost:8080/api/reservations/count"),
                authService.fetchAuth(`http://localhost:8080/api/reservations/week/count?from=${formatDate(monday)}&to=${formatDate(sunday)}`)
            ]);

            if (countRes.ok && activeTerrainsRes.ok && totalResRes.ok && weeklyResCountRes.ok) {
                const totalComplexes = await countRes.json();
                const activeTerrains = await activeTerrainsRes.json();
                const totalReservations = await totalResRes.json();
                const weeklyReservationsCount = await weeklyResCountRes.json();

                setStats({
                    totalComplexes,
                    activeTerrains,
                    totalReservations,
                    weeklyReservationsCount
                });
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

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

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Stats & Quick Actions */}
                    <div className="flex-1 space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-[#141414] border border-[#222] p-8 rounded-3xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <svg className="w-24 h-24 text-[#0B2CFF]" fill="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                </div>
                                <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-4">Total Complexes</p>
                                <span className="text-5xl font-black text-white">{stats.totalComplexes}</span>
                            </div>

                            <div className="bg-[#141414] border border-[#222] p-8 rounded-3xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <svg className="w-24 h-24 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-4">Active Terrains</p>
                                <span className="text-5xl font-black text-green-500">{stats.activeTerrains}</span>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-[#141414] border border-[#222] rounded-3xl p-12 text-center">
                            <div className="w-20 h-20 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Quick Management</h3>
                            <p className="text-gray-500 max-w-md mx-auto mb-8">Manage your sports complexes and view detailed reports.</p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => navigate("/admin/complexes")}
                                    className="bg-[#0B2CFF] hover:bg-[#001B87] text-white px-6 py-3 rounded-xl font-bold transition-all w-full md:w-auto"
                                >
                                    Manage Complexes
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Reservation Stats */}
                    <div className="lg:w-1/3 space-y-6">
                        <div className="bg-[#141414] border border-[#222] p-8 rounded-3xl h-48 flex flex-col justify-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                            <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-2">Total Reservations</p>
                            <span className="text-4xl font-black text-white">{stats.totalReservations}</span>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-xs font-bold bg-[#222] px-2 py-1 rounded text-green-500">
                                    +{stats.weeklyReservationsCount}
                                </span>
                                <span className="text-xs text-gray-500">this week</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;
