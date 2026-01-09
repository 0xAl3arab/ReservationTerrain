import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AnnonceService from "../../services/AnnonceService";

const FindTeamPage = () => {
    const [annonces, setAnnonces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [cityFilter, setCityFilter] = useState("");

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [complexes, setComplexes] = useState([]);
    const [selectedComplex, setSelectedComplex] = useState("");
    const [selectedTerrain, setSelectedTerrain] = useState("");
    const [nbrJoueur, setNbrJoueur] = useState(1);
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);

    // Auth & User Profile
    useEffect(() => {
        const token = localStorage.getItem("kc_access_token");
        if (token) {
            fetch("http://localhost:8080/client/profile", {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    if (data) {
                        setUser({ ...data, id: data.id }); // Ensure ID is available
                    }
                })
                .catch(err => console.error("Error fetching profile:", err));
        }
    }, []);

    // Fetch Annonces
    const fetchAnnonces = async () => {
        setLoading(true);
        try {
            const data = await AnnonceService.getAllAnnonces(cityFilter);
            setAnnonces(data);
        } catch (err) {
            setError("Impossible de charger les annonces.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnonces();
    }, [cityFilter]);

    // Fetch Complexes for Form
    useEffect(() => {
        if (isModalOpen) {
            fetch("http://localhost:8080/api/complexes")
                .then(res => res.json())
                .then(data => setComplexes(data))
                .catch(err => console.error("Error fetching complexes:", err));
        }
    }, [isModalOpen]);

    const handleCreateAnnonce = async (e) => {
        e.preventDefault();
        setFormError(null);
        setFormSuccess(null);

        if (!user) {
            setFormError("Vous devez être connecté pour créer une annonce.");
            return;
        }

        try {
            await AnnonceService.createAnnonce({
                clientId: user.id,
                terrainId: selectedTerrain,
                nbrJoueur: parseInt(nbrJoueur)
            });
            setFormSuccess("Annonce créée avec succès !");
            setTimeout(() => {
                setIsModalOpen(false);
                setFormSuccess(null);
                fetchAnnonces();
            }, 1500);
        } catch (err) {
            setFormError("Erreur lors de la création de l'annonce.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("kc_access_token");
        localStorage.removeItem("kc_refresh_token");
        setUser(null);
        window.location.href = "/login";
    };

    // Filter complexes to get terrains
    const availableTerrains = selectedComplex
        ? complexes.find(c => c.id === parseInt(selectedComplex))?.terrains || []
        : [];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar user={user} onLogout={handleLogout} />

            {/* Header */}
            <div className="bg-gradient-to-br from-[#0B2CFF] to-[#001B87] text-white py-16 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
                <div className="relative z-10 container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Trouver une équipe</h1>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                        Rejoignez des matchs ou créez votre propre annonce pour trouver des joueurs.
                    </p>
                </div>
            </div>

            <main className="flex-grow container mx-auto px-4 py-12">
                {/* Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="w-full md:w-1/3">
                        <input
                            type="text"
                            placeholder="Filtrer par ville..."
                            value={cityFilter}
                            onChange={(e) => setCityFilter(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B2CFF] shadow-sm"
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#0B2CFF] hover:bg-[#001B87] text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Créer une annonce
                    </button>
                </div>

                {/* List */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B2CFF]"></div>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-10">{error}</div>
                ) : annonces.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-lg">Aucune annonce disponible pour le moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {annonces.map((annonce) => (
                            <div key={annonce.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">{annonce.clientName}</h3>
                                        <p className="text-sm text-gray-500">{new Date(annonce.date).toLocaleDateString()}</p>
                                    </div>
                                    <span className="bg-blue-100 text-[#0B2CFF] text-xs font-bold px-3 py-1 rounded-full">
                                        {annonce.ville}
                                    </span>
                                </div>
                                <div className="space-y-2 mb-6">
                                    <p className="text-gray-600 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {annonce.complexeName} - {annonce.terrainName}
                                    </p>
                                    <p className="text-gray-600 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        Recherche : <span className="font-bold text-gray-900">{annonce.nbrJoueur} joueurs</span>
                                    </p>
                                </div>
                                <button className="w-full bg-gray-50 hover:bg-gray-100 text-[#0B2CFF] font-semibold py-3 rounded-xl transition-colors border border-gray-200">
                                    Contacter
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-fadeIn">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Créer une annonce</h2>

                        {formError && <div className="mb-4 text-red-500 text-sm bg-red-50 p-3 rounded-lg">{formError}</div>}
                        {formSuccess && <div className="mb-4 text-green-500 text-sm bg-green-50 p-3 rounded-lg">{formSuccess}</div>}

                        <form onSubmit={handleCreateAnnonce} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Complexe</label>
                                <select
                                    value={selectedComplex}
                                    onChange={(e) => {
                                        setSelectedComplex(e.target.value);
                                        setSelectedTerrain("");
                                    }}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0B2CFF] focus:border-transparent"
                                    required
                                >
                                    <option value="">Sélectionner un complexe</option>
                                    {complexes.map(c => (
                                        <option key={c.id} value={c.id}>{c.nom} ({c.ville})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Terrain</label>
                                <select
                                    value={selectedTerrain}
                                    onChange={(e) => setSelectedTerrain(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0B2CFF] focus:border-transparent"
                                    required
                                    disabled={!selectedComplex}
                                >
                                    <option value="">Sélectionner un terrain</option>
                                    {availableTerrains.map(t => (
                                        <option key={t.id} value={t.id}>{t.nom} ({t.prixTerrain} DH)</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nombre de joueurs recherchés</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="22"
                                    value={nbrJoueur}
                                    onChange={(e) => setNbrJoueur(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0B2CFF] focus:border-transparent"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#0B2CFF] hover:bg-[#001B87] text-white font-bold py-4 rounded-xl shadow-lg transition-all mt-4"
                            >
                                Publier l'annonce
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default FindTeamPage;
