import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ownerService from "../../services/ownerService";
import OwnerNavbar from "../../components/OwnerNavbar";

function OwnerReservationsPage() {
    const [reservations, setReservations] = useState([]);
    const [owner, setOwner] = useState(null);
    const [terrains, setTerrains] = useState([]);
    const [filters, setFilters] = useState({ terrainId: "", date: "" });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resData, profileData, terrainsData] = await Promise.all([
                    ownerService.getReservations(filters.terrainId, filters.date),
                    ownerService.getProfile(),
                    ownerService.getMyTerrains()
                ]);
                setReservations(resData);
                setOwner(profileData);
                setTerrains(terrainsData);
            } catch (err) {
                console.error("Error fetching data", err);
                if (err.response && err.response.status === 401) {
                    navigate("/owner/login");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate, filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleCancel = async (id) => {
        if (window.confirm("Voulez-vous vraiment annuler cette réservation et libérer le terrain ?")) {
            try {
                await ownerService.cancelReservation(id);
                const updatedRes = await ownerService.getReservations();
                setReservations(updatedRes);
            } catch (err) {
                alert("Erreur lors de l'annulation");
            }
        }
    };

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
        <div className="min-h-screen bg-[#fafafa] font-sans text-gray-900">
            <OwnerNavbar owner={owner} onLogout={handleLogout} />

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-10 flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-bold mb-2">Réservations</h2>
                        <p className="text-gray-500 font-medium">Planning des matchs confirmés pour votre complexe.</p>
                    </div>

                    <div className="flex gap-4 items-center">
                        <div className="relative">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Flitrer par Terrain</label>
                            <select
                                name="terrainId"
                                value={filters.terrainId}
                                onChange={handleFilterChange}
                                className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 font-bold text-sm text-gray-900 focus:border-[#0B2CFF] outline-none shadow-sm transition-all min-w-[180px]"
                            >
                                <option value="">Tous les terrains</option>
                                {terrains.map(t => (
                                    <option key={t.id} value={t.id}>{t.nom}</option>
                                ))}
                            </select>
                        </div>
                        <div className="relative">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Filtre par Date</label>
                            <input
                                type="date"
                                name="date"
                                value={filters.date}
                                onChange={handleFilterChange}
                                className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-gray-900 focus:border-[#0B2CFF] outline-none shadow-sm transition-all"
                            />
                        </div>
                        {(filters.terrainId || filters.date) && (
                            <button
                                onClick={() => setFilters({ terrainId: "", date: "" })}
                                className="mt-5 text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-600 transition-colors"
                            >
                                Réinitialiser
                            </button>
                        )}
                    </div>
                </div>


                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Client</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Terrain</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Horaire</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Statut</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {reservations.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-medium">
                                            Aucune réservation trouvée.
                                        </td>
                                    </tr>
                                ) : (
                                    reservations.map((res) => (
                                        <tr key={res.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <p className="font-bold text-gray-900 transition-colors group-hover:text-[#0B2CFF]">{res.clientNom} {res.clientPrenom}</p>
                                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">{res.clientNumTele}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="bg-blue-50 text-[#0B2CFF] px-3 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider">
                                                    {res.terrainNom}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="font-black text-gray-900 text-[11px] uppercase tracking-widest mb-1">{res.date}</p>
                                                <p className="text-[#0B2CFF] text-[10px] font-bold bg-blue-50 px-2 py-0.5 rounded uppercase inline-block">
                                                    {res.heureDebut} - {res.heureFin}
                                                </p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-1.5 w-1.5 rounded-full ${res.status === 'VALIDEE' ? 'bg-green-500' : res.status === 'CONFIRMEE' ? 'bg-[#0B2CFF]' : 'bg-red-500'}`}></div>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${res.status === 'VALIDEE'
                                                        ? 'text-green-600'
                                                        : res.status === 'CONFIRMEE'
                                                            ? 'text-[#0B2CFF]'
                                                            : 'text-red-600'
                                                        }`}>
                                                        {res.status === 'CONFIRMEE' ? 'Confirmée' : res.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                {(res.status === 'VALIDEE' || res.status === 'CONFIRMEE') && (
                                                    <button
                                                        onClick={() => handleCancel(res.id)}
                                                        className="bg-red-50 text-red-500 px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                    >
                                                        Annuler
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default OwnerReservationsPage;
