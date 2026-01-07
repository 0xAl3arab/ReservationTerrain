import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ownerService from "../../services/ownerService";

function OwnerReservationsPage() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => { fetchReservations(); }, []);

    const fetchReservations = async () => {
        try {
            const data = await ownerService.getReservations();
            setReservations(data);
        } catch (err) { console.error("Error"); }
        finally { setLoading(false); }
    };

    const handleCancel = async (id) => {
        if (window.confirm("Voulez-vous vraiment annuler cette réservation et libérer le terrain ?")) {
            try {
                await ownerService.cancelReservation(id);
                fetchReservations();
            } catch (err) { alert("Erreur"); }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Header WePlay */}
            <div className="bg-gradient-to-br from-[#0B2CFF] to-[#001B87] text-white py-16 px-6">
                <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-extrabold tracking-tighter italic cursor-pointer" onClick={() => navigate("/owner/dashboard")}>WePlay</h1>
                    <button onClick={() => navigate("/owner/dashboard")} className="text-blue-100 font-bold hover:text-white">← Dashboard</button>
                </div>
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-5xl font-black mb-2">Réservations</h2>
                    <p className="text-blue-100 text-lg">Planning des matchs confirmés automatiquement</p>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-6 py-12 -mt-10">
                <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Client</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Terrain</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Horaire</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Statut</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {reservations.map((res) => (
                                    <tr key={res.id} className="hover:bg-blue-50/40 transition-colors">
                                        <td className="px-10 py-8">
                                            <p className="font-extrabold text-gray-900 text-lg">{res.clientNom} {res.clientPrenom}</p>
                                            <p className="text-sm text-gray-400 font-bold">{res.clientNumTele}</p>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="bg-blue-50 text-[#0B2CFF] px-4 py-2 rounded-xl font-bold text-sm">{res.terrainNom}</span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <p className="font-black text-gray-800 uppercase text-sm">{res.date}</p>
                                            <p className="text-[#0B2CFF] font-bold">{res.heureDebut} - {res.heureFin}</p>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${res.status === 'VALIDEE' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                }`}>{res.status}</span>
                                        </td>
                                        <td className="px-10 py-8 text-center">
                                            {res.status === 'VALIDEE' && (
                                                <button
                                                    onClick={() => handleCancel(res.id)}
                                                    className="text-red-500 font-black text-xs uppercase hover:underline tracking-tighter"
                                                >
                                                    Annuler le match
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default OwnerReservationsPage;