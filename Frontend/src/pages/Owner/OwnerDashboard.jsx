import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ownerService from "../../services/ownerService";
import OwnerNavbar from "../../components/OwnerNavbar";

function OwnerDashboard() {
    const [stats, setStats] = useState(null);
    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, profileData] = await Promise.all([
                    ownerService.getDashboardStats(),
                    ownerService.getProfile()
                ]);
                setStats(statsData);
                setOwner(profileData);
            } catch (err) {
                console.error("Erreur lors du chargement des données", err);
                if (err.response && err.response.status === 401) {
                    navigate("/owner/login");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("owner_token");
        navigate("/owner/login");
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B2CFF]"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans">
            <OwnerNavbar owner={owner} onLogout={handleLogout} />

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-10 flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-bold mb-2">Tableau de bord</h2>
                        <p className="text-gray-500 font-medium">
                            Bienvenue, <span className="text-gray-900 font-bold">{owner?.prenom}</span>. Voici l’état de votre complexe <span className="text-gray-900 font-bold">{owner?.nomComplexe}</span>.
                        </p>
                    </div>
                    <div className="bg-white border border-gray-100 px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Opérationnel</span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Stats & Quick Actions */}
                    <div className="flex-1 space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white border border-gray-100 p-8 rounded-3xl relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <svg className="w-24 h-24 text-[#0B2CFF]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6z" /></svg>
                                </div>
                                <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-4">Revenu Total</p>
                                <span className="text-5xl font-black text-[#0B2CFF]">{stats?.totalRevenue || 0} <span className="text-lg">MAD</span></span>
                            </div>

                            <div className="bg-white border border-gray-100 p-8 rounded-3xl relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <svg className="w-24 h-24 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-4">Terrains Actifs</p>
                                <span className="text-5xl font-black text-green-600">{stats?.activeTerrains || 0}</span>
                            </div>

                            <div className="bg-white border border-gray-100 p-8 rounded-3xl relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <svg className="w-24 h-24 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
                                </div>
                                <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-4">En Attente</p>
                                <span className="text-5xl font-black text-orange-500">{stats?.pendingReservations || 0}</span>
                            </div>

                            <div className="bg-white border border-gray-100 p-8 rounded-3xl relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <svg className="w-24 h-24 text-gray-900" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" /></svg>
                                </div>
                                <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-4">Total Réservations</p>
                                <span className="text-5xl font-black text-gray-900">{stats?.totalReservations || 0}</span>
                            </div>
                        </div>

                        {/* Recent Reservations Table */}
                        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                            <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
                                <h3 className="text-lg font-bold">Réservations Récentes</h3>
                                <button onClick={() => navigate("/owner/reservations")} className="text-[#0B2CFF] text-xs font-black uppercase tracking-widest hover:underline text-sm">Voir tout</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="px-8 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Client</th>
                                            <th className="px-8 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Terrain</th>
                                            <th className="px-8 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Date/Heure</th>
                                            <th className="px-8 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {stats?.recentReservations?.length > 0 ? (
                                            stats.recentReservations.map(res => (
                                                <tr key={res.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-8 py-4">
                                                        <p className="font-bold text-sm">{res.clientNom} {res.clientPrenom}</p>
                                                    </td>
                                                    <td className="px-8 py-4">
                                                        <span className="text-xs font-bold text-gray-500">{res.terrainNom}</span>
                                                    </td>
                                                    <td className="px-8 py-4">
                                                        <p className="text-xs font-bold">{res.date}</p>
                                                        <p className="text-[10px] text-[#0B2CFF] font-black">{res.heureDebut} - {res.heureFin}</p>
                                                    </td>
                                                    <td className="px-8 py-4">
                                                        <span className={`text-[9px] font-black px-2 py-1 rounded uppercase tracking-tighter ${res.status === 'VALIDEE' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-[#0B2CFF]'}`}>
                                                            {res.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-8 py-10 text-center text-gray-400 text-sm italic">Aucune réservation récente</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white border border-gray-100 rounded-3xl p-10 text-center shadow-sm">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold mb-1">Gestion Rapide</h3>
                            <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">Administrez vos installations et gérez vos terrains directement ici.</p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => navigate("/owner/terrains")}
                                    className="bg-[#0B2CFF] hover:bg-[#001B87] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 text-sm"
                                >
                                    Gérer mes terrains
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Complex Summary */}
                    <div className="lg:w-1/3 space-y-6">
                        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm sticky top-24">
                            <div className="h-40 bg-gray-50 relative">
                                <img src="https://i.pinimg.com/736x/0e/bf/e8/0ebfe849481ebf3972634812d9859cc8.jpg" className="w-full h-full object-cover" alt="Complex" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-4 left-6">
                                    <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">Complexe Actif</p>
                                    <h3 className="text-xl font-bold text-white uppercase italic tracking-tighter">{owner?.nomComplexe}</h3>
                                </div>
                            </div>
                            <div className="p-8 space-y-6">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Informations</p>
                                    <div className="flex items-center gap-3 text-gray-600 mb-3">
                                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        <span className="text-sm font-bold">{owner?.ville}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        <span className="text-sm font-bold">{owner?.numTele}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate("/owner/complexe")}
                                    className="w-full bg-gray-50 hover:bg-gray-100 text-gray-900 py-4 rounded-xl font-bold transition-all border border-gray-100 text-sm"
                                >
                                    Modifier le complexe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default OwnerDashboard;
