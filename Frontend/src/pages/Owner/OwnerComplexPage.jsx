import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ownerService from "../../services/ownerService";
import OwnerNavbar from "../../components/OwnerNavbar";

const OwnerComplexPage = () => {
    const [owner, setOwner] = useState(null);
    const [complexe, setComplexe] = useState({ nom: "", ville: "", adress: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await ownerService.getProfile();
                setOwner(data);
                setComplexe({
                    nom: data.nomComplexe || "",
                    ville: data.ville || "",
                    adress: data.adresse || ""
                });
            } catch (err) {
                console.error("Error fetching profile", err);
                if (err.response && err.response.status === 401) {
                    navigate("/owner/login");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            await ownerService.updateComplexe(complexe);
            setIsEditing(false);
            // Refresh profile to get updated details
            const data = await ownerService.getProfile();
            setOwner(data);
        } catch (err) {
            setError("Erreur lors de la mise à jour du complexe.");
        } finally {
            setSaving(false);
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
        <div className="min-h-screen bg-[#fafafa] font-sans">
            <OwnerNavbar owner={owner} onLogout={handleLogout} />

            {/* Header / Bandeau */}
            <div className="bg-[#0B2CFF] h-64 w-full relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-white blur-3xl"></div>
                    <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-blue-300 blur-3xl"></div>
                </div>
                <div className="max-w-7xl mx-auto px-6 h-full flex flex-col justify-center relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-1.5 bg-white rounded-full"></div>
                        <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">Mon Complexe</h1>
                    </div>
                    <p className="text-blue-100 font-bold max-w-2xl text-lg opacity-80">
                        Gérez les informations visibles de votre complexe sportif sur WePlay.
                    </p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 pb-20">
                <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="p-8 md:p-12">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                            <div>
                                <span className="bg-blue-50 text-[#0B2CFF] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-3 inline-block">Complex details</span>
                                <h2 className="text-3xl font-black text-gray-900">{owner?.nomComplexe}</h2>
                            </div>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-[#0B2CFF] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20 flex items-center gap-3"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Modifier les informations
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nom du Complexe</p>
                                <p className="text-xl font-bold text-gray-900">{owner?.nomComplexe || "Non défini"}</p>
                            </div>
                            <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Ville</p>
                                <p className="text-xl font-bold text-gray-900">{owner?.ville || "Non définie"}</p>
                            </div>
                            <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Adresse</p>
                                <p className="text-xl font-bold text-gray-900">{owner?.adresse || "Non définie"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal ÉDITION */}
            {isEditing && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsEditing(false)}></div>
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-300">
                        <div className="bg-[#0B2CFF] p-8 text-white">
                            <h3 className="text-2xl font-black uppercase tracking-tighter italic">Édition du complexe</h3>
                            <p className="text-blue-100 text-sm font-bold opacity-80 uppercase tracking-widest mt-1">Mettre à jour les infos publiques</p>
                        </div>

                        <form onSubmit={handleUpdate} className="p-8 space-y-6">
                            {error && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100 flex items-center gap-3">
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nom du Complexe</label>
                                <input
                                    type="text"
                                    value={complexe.nom}
                                    onChange={(e) => setComplexe({ ...complexe, nom: e.target.value })}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[#0B2CFF] focus:bg-white rounded-2xl p-4 font-bold text-gray-900 transition-all outline-none"
                                    placeholder="Ex: Arena Soccer"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Ville</label>
                                    <input
                                        type="text"
                                        value={complexe.ville}
                                        onChange={(e) => setComplexe({ ...complexe, ville: e.target.value })}
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-[#0B2CFF] focus:bg-white rounded-2xl p-4 font-bold text-gray-900 transition-all outline-none"
                                        placeholder="Ex: Casablanca"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Adresse</label>
                                    <input
                                        type="text"
                                        value={complexe.adress}
                                        onChange={(e) => setComplexe({ ...complexe, adress: e.target.value })}
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-[#0B2CFF] focus:bg-white rounded-2xl p-4 font-bold text-gray-900 transition-all outline-none"
                                        placeholder="Ex: 123 Rue de l'Avenir"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-all"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-[2] bg-[#0B2CFF] text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
                                >
                                    {saving ? "Sauvegarde..." : "Enregistrer les modifications"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OwnerComplexPage;
