import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ownerService from "../../services/ownerService";

function OwnerDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await ownerService.getDashboardStats();
                setStats(data);
            } catch (err) {
                console.error("Erreur stats");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B2CFF]"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header WePlay Style Client */}
            <div className="bg-gradient-to-br from-[#0B2CFF] to-[#001B87] text-white py-16 px-6 shadow-2xl">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-12">
                        <h1 className="text-5xl font-extrabold tracking-tighter italic">WePlay</h1>
                        <nav className="flex gap-8 font-bold text-blue-100 uppercase text-xs tracking-widest">
                            <button className="text-white border-b-2 border-white pb-1">Dashboard</button>
                            <button onClick={() => navigate("/owner/terrains")} className="hover:text-white transition-all">Mes Terrains</button>
                            <button onClick={() => navigate("/owner/reservations")} className="hover:text-white transition-all">Réservations</button>
                            <button onClick={() => navigate("/owner/profile")} className="hover:text-white transition-all">Mon Profil</button>
                        </nav>
                    </div>
                    <h2 className="text-5xl font-black mb-4">Tableau de bord</h2>
                    <p className="text-blue-200 text-xl font-medium opacity-90">Aperçu en temps réel de la performance de votre complexe</p>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-6 py-12 -mt-16">
                {/* Stats Grid avec ombres douces */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-10 rounded-[2rem] shadow-xl border border-gray-50 hover:scale-105 transition-transform">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Revenu Total</p>
                        <h3 className="text-4xl font-extrabold text-[#0B2CFF] tracking-tight">{stats?.totalRevenue || 0} MAD</h3>
                    </div>
                    <div className="bg-white p-10 rounded-[2rem] shadow-xl border border-gray-50 hover:scale-105 transition-transform">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Réservations</p>
                        <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">{stats?.totalReservations || 0}</h3>
                    </div>
                    <div className="bg-white p-10 rounded-[2rem] shadow-xl border border-gray-50 hover:scale-105 transition-transform">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Terrains Ouverts</p>
                        <h3 className="text-4xl font-extrabold text-green-500 tracking-tight">{stats?.activeTerrains || 0}</h3>
                    </div>
                </div>

                {/* Banner de réservation automatique */}
                <div className="mt-12 bg-white rounded-[2.5rem] p-12 shadow-2xl border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <span className="bg-green-100 text-green-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-4">Système Automatique Actif</span>
                        <h3 className="text-3xl font-black text-gray-900 leading-tight">Vos réservations passent<br />maintenant en direct.</h3>
                    </div>
                    <button
                        onClick={() => navigate("/owner/reservations")}
                        className="bg-[#0B2CFF] text-white font-bold px-10 py-5 rounded-2xl hover:bg-[#001B87] transition-all shadow-xl shadow-blue-500/40 text-lg"
                    >
                        Vérifier le Planning
                    </button>
                </div>
            </main>
        </div>
    );
}

export default OwnerDashboard;