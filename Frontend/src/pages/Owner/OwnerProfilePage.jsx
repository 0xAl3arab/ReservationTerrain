import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ownerService from "../../services/ownerService";

function OwnerProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ nom: "", prenom: "", numTele: "" });
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await ownerService.getProfile();
            setProfile(data);
            setForm({ nom: data.nom, prenom: data.prenom, numTele: data.numTele });
        } catch (err) {
            navigate("/login/owner");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await ownerService.updateProfile(form);
            setProfile({ ...profile, ...form });
            setIsEditing(false);
        } catch (err) {
            console.error("Update failed");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B2CFF]"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Header bleu identique au profil client */}
            <div className="bg-gradient-to-br from-[#0B2CFF] to-[#001B87] text-white py-12 px-6">
                <div className="max-w-5xl mx-auto flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-extrabold mb-2">Mon Profil Responsable</h1>
                        <p className="text-blue-200">Gérez vos accès et les informations de votre complexe</p>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => navigate("/owner/dashboard")} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-semibold transition-all">Dashboard</button>
                        <button onClick={() => { localStorage.removeItem('owner_token'); navigate('/login/owner') }} className="bg-red-500/20 hover:bg-red-500/40 text-red-100 px-4 py-2 rounded-lg font-semibold transition-all">Déconnexion</button>
                    </div>
                </div>
            </div>

            <main className="max-w-5xl mx-auto w-full px-6 py-10 -mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Colonne Gauche : Infos Perso */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#0B2CFF] to-[#001B87] text-white flex items-center justify-center font-extrabold text-3xl shadow-xl">
                                    {profile?.prenom?.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{profile?.nom} {profile?.prenom}</h2>
                                    <p className="text-gray-500">{profile?.email}</p>
                                </div>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={`ml-auto px-6 py-2 rounded-xl font-bold transition-all ${isEditing ? 'bg-gray-100 text-gray-600' : 'bg-[#0B2CFF] text-white shadow-lg shadow-blue-200'}`}
                                >
                                    {isEditing ? "Annuler" : "Modifier"}
                                </button>
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Prénom</label>
                                        <input
                                            disabled={!isEditing}
                                            value={form.prenom}
                                            onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                                            className={`w-full p-3 rounded-xl border transition-all ${isEditing ? 'bg-gray-50 border-gray-200 focus:ring-2 focus:ring-[#0B2CFF]' : 'bg-gray-100 border-transparent cursor-not-allowed'}`}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Nom</label>
                                        <input
                                            disabled={!isEditing}
                                            value={form.nom}
                                            onChange={(e) => setForm({ ...form, nom: e.target.value })}
                                            className={`w-full p-3 rounded-xl border transition-all ${isEditing ? 'bg-gray-50 border-gray-200 focus:ring-2 focus:ring-[#0B2CFF]' : 'bg-gray-100 border-transparent cursor-not-allowed'}`}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Téléphone</label>
                                    <input
                                        disabled={!isEditing}
                                        value={form.numTele}
                                        onChange={(e) => setForm({ ...form, numTele: e.target.value })}
                                        className={`w-full p-3 rounded-xl border transition-all ${isEditing ? 'bg-gray-50 border-gray-200 focus:ring-2 focus:ring-[#0B2CFF]' : 'bg-gray-100 border-transparent cursor-not-allowed'}`}
                                    />
                                </div>
                                {isEditing && (
                                    <button type="submit" className="w-full bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 hover:bg-green-600 transition-all">Enregistrer les modifications</button>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Colonne Droite : Mon Complexe */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="h-32 bg-gray-200 relative">
                                <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=500" className="w-full h-full object-cover" />
                                <div className="absolute top-4 right-4 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">Vérifié</div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xs font-bold text-[#0B2CFF] uppercase mb-1">Mon Complexe</h3>
                                <h2 className="text-xl font-extrabold text-gray-900 mb-4">{profile?.nomComplexe}</h2>
                                <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    {profile?.adresse}, {profile?.ville}
                                </div>
                                <button
                                    onClick={() => navigate("/owner/terrains")}
                                    className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-all"
                                >
                                    Gérer les terrains
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

export default OwnerProfilePage; 