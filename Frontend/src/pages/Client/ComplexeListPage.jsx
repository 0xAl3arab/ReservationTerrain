import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// --- Subcomponents ---

const Navbar = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate("/")}>
                        <span className="text-2xl font-extrabold text-[#0B2CFF] tracking-tighter">WePlay</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center">
                        <a href="#complexes" className="text-gray-600 hover:text-[#0B2CFF] font-medium transition-colors">Découvrir les terrains</a>
                        <a href="#" className="text-gray-600 hover:text-[#0B2CFF] font-medium transition-colors">Comment ça marche ?</a>
                        {user && (
                            <a href="#" className="text-gray-600 hover:text-[#0B2CFF] font-medium transition-colors">Mon compte</a>
                        )}
                    </div>

                    {/* Auth Buttons (Desktop) */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-3">
                                <div className="h-8 w-8 rounded-full bg-[#0B2CFF] text-white flex items-center justify-center font-bold text-sm">
                                    {user.firstName ? user.firstName.charAt(0).toUpperCase() : "U"}
                                </div>
                                <span className="text-sm font-semibold text-gray-700">{user.firstName} {user.lastName}</span>
                                <button
                                    onClick={onLogout}
                                    className="text-sm text-gray-500 hover:text-red-500 font-medium transition-colors"
                                >
                                    Déconnexion
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate("/login")}
                                    className="text-[#0B2CFF] font-semibold hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
                                >
                                    Se connecter
                                </button>
                                <button
                                    onClick={() => navigate("/signup")}
                                    className="bg-[#0B2CFF] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#001B87] shadow-lg shadow-blue-500/30 transition-all"
                                >
                                    Créer un compte
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-gray-600 hover:text-[#0B2CFF] focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-2 shadow-lg">
                    <a href="#complexes" className="block text-gray-600 font-medium py-2">Découvrir les terrains</a>
                    <a href="#" className="block text-gray-600 font-medium py-2">Comment ça marche ?</a>
                    {user ? (
                        <>
                            <div className="border-t border-gray-100 my-2 pt-2">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="h-8 w-8 rounded-full bg-[#0B2CFF] text-white flex items-center justify-center font-bold text-sm">
                                        {user.firstName ? user.firstName.charAt(0).toUpperCase() : "U"}
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700">{user.firstName} {user.lastName}</span>
                                </div>
                                <button
                                    onClick={onLogout}
                                    className="block w-full text-left text-red-500 font-medium py-2"
                                >
                                    Déconnexion
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col space-y-2 mt-4">
                            <button
                                onClick={() => navigate("/login")}
                                className="w-full text-[#0B2CFF] font-semibold border border-[#0B2CFF] px-4 py-2 rounded-lg"
                            >
                                Se connecter
                            </button>
                            <button
                                onClick={() => navigate("/signup")}
                                className="w-full bg-[#0B2CFF] text-white font-semibold px-4 py-2 rounded-lg"
                            >
                                Créer un compte
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

const Hero = ({ user }) => {
    const [textIndex, setTextIndex] = useState(0);
    const phrases = [
        "Tu veux réserver un terrain ? Fais‑le maintenant.",
        "Tu veux rejoindre une équipe ? Fais‑le maintenant.",
        "Tu veux organiser un match ? Fais‑le maintenant."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setTextIndex((prev) => (prev + 1) % phrases.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative bg-gradient-to-br from-[#0B2CFF] to-[#001B87] text-white overflow-hidden">
            {/* Background Pattern/Glow */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl mix-blend-overlay"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#001B87] rounded-full blur-3xl mix-blend-multiply"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10 flex flex-col md:flex-row items-center">
                {/* Left Content */}
                <div className="w-full md:w-1/2 text-center md:text-left mb-12 md:mb-0">
                    {user && (
                        <p className="text-blue-200 font-semibold mb-4 text-lg animate-fade-in">
                            Salut, {user.firstName} {user.lastName} ! Prêt à jouer ?
                        </p>
                    )}
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
                        Réserve ton stade <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                            en un clic.
                        </span>
                    </h1>

                    {/* Animated Text */}
                    <div className="h-8 mb-8">
                        <p className="text-lg md:text-xl text-blue-100 font-medium transition-all duration-500 transform translate-y-0 opacity-100">
                            {phrases[textIndex]}
                        </p>
                    </div>

                    <p className="text-blue-200 text-lg mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed">
                        Trouve les meilleurs terrains près de chez toi, invite tes amis et organise tes matchs sans prise de tête.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <a
                            href="#complexes"
                            className="bg-white text-[#0B2CFF] font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-blue-50 hover:scale-105 transition-all transform"
                        >
                            Réserver un terrain
                        </a>
                        <button className="bg-blue-600/50 backdrop-blur-sm border border-blue-400/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-blue-600/70 transition-all">
                            Rejoindre une équipe
                        </button>
                    </div>
                </div>

                {/* Right Visual */}
                <div className="w-full md:w-1/2 flex justify-center md:justify-end relative">
                    <div className="relative w-80 h-96 md:w-96 md:h-[450px] bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-all duration-500">
                        {/* Abstract Field Representation */}
                        <div className="absolute inset-4 border-2 border-white/30 rounded-2xl flex flex-col justify-between p-4">
                            <div className="w-full h-1/2 border-b-2 border-white/30 flex items-center justify-center">
                                <div className="w-16 h-16 border-2 border-white/30 rounded-full"></div>
                            </div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg shadow-white/50"></div>
                        </div>
                        <div className="absolute -bottom-6 -right-6 bg-white text-[#0B2CFF] px-6 py-3 rounded-xl font-bold shadow-xl">
                            5 vs 5
                        </div>
                        <div className="absolute -top-6 -left-6 bg-[#0B2CFF] text-white px-6 py-3 rounded-xl font-bold shadow-xl border border-white/20">
                            100% Fun
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const ComplexCard = ({ complex }) => {
    // Use pre-calculated display data from parent to ensure stability during filtering
    const minPrice = complex.displayMinPrice;
    const terrainCount = complex.displayTerrainCount;

    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden flex flex-col md:flex-row group">
            {/* Image Placeholder */}
            <div className="w-full md:w-64 h-48 md:h-auto bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                <img
                    src={`https://source.unsplash.com/random/800x600/?stadium,soccer,${complex.id}`}
                    alt={complex.nom}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=800'; }}
                />
                <div className="absolute bottom-3 left-3 z-20 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-[#0B2CFF] uppercase tracking-wide">
                    {complex.ville}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#0B2CFF] transition-colors">
                            {complex.nom}
                        </h3>
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md">
                            Ouvert
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm mb-4 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {complex.adress}
                    </p>

                    <div className="flex flex-wrap gap-3 mb-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800">
                            {terrainCount} Terrains
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Parking
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Douches
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-medium">À partir de</span>
                        <span className="text-lg font-bold text-[#0B2CFF]">{minPrice} MAD <span className="text-sm font-normal text-gray-400">/ heure</span></span>
                    </div>
                    <button className="bg-[#0B2CFF] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#001B87] transition-colors shadow-md shadow-blue-200">
                        Voir les terrains
                    </button>
                </div>
            </div>
        </div>
    );
};

const ComplexeListPage = () => {
    const [complexes, setComplexes] = useState([]);
    const [filteredComplexes, setFilteredComplexes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    // Filters state
    const [filters, setFilters] = useState({
        name: "",
        ville: "",
        minPrice: "",
        maxPrice: ""
    });

    // Auth check
    useEffect(() => {
        const token = localStorage.getItem("kc_access_token");
        if (token) {
            // Simple mock decode or just assume user is logged in
            // Ideally use jwt-decode, but here we'll just set a mock user if token exists
            // or try to parse if it's a JWT.
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser({
                    firstName: payload.given_name || "User",
                    lastName: payload.family_name || "",
                    email: payload.email
                });
            } catch (e) {
                // Fallback if token is invalid or not JWT
                setUser({ firstName: "Membre", lastName: "" });
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("kc_access_token");
        localStorage.removeItem("kc_refresh_token");
        setUser(null);
        window.location.reload();
    };

    // Data Fetching
    const fetchComplexes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("http://localhost:8080/api/complexes");
            if (!response.ok) throw new Error("Erreur réseau");
            const data = await response.json();

            // Stabilize mock data here
            const enrichedData = data.map(c => {
                const hasTerrains = c.terrains && c.terrains.length > 0;
                return {
                    ...c,
                    // Use real data if available, otherwise use stable mock data
                    // We generate mock data based on ID to be deterministic if we wanted, 
                    // but since we save it in state, random here is fine as it runs once per fetch.
                    displayMinPrice: hasTerrains
                        ? Math.min(...c.terrains.map(t => parseInt(t.prixTerrain) || 9999))
                        : (Math.floor(Math.random() * 3) + 3) * 50,
                    displayTerrainCount: hasTerrains
                        ? c.terrains.length
                        : Math.floor(Math.random() * 4) + 2
                };
            });

            setComplexes(enrichedData);
            setFilteredComplexes(enrichedData);
        } catch (err) {
            console.error(err);
            setError("Impossible de charger les complexes. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplexes();
    }, []);

    // Filter Logic
    useEffect(() => {
        let result = complexes;

        if (filters.name) {
            result = result.filter(c => c.nom.toLowerCase().includes(filters.name.toLowerCase()));
        }

        if (filters.ville) {
            result = result.filter(c => c.ville.toLowerCase().includes(filters.ville.toLowerCase()));
        }

        if (filters.minPrice) {
            result = result.filter(c => c.displayMinPrice >= parseInt(filters.minPrice));
        }

        if (filters.maxPrice) {
            result = result.filter(c => c.displayMinPrice <= parseInt(filters.maxPrice));
        }

        setFilteredComplexes(result);
    }, [filters, complexes]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const resetFilters = () => {
        setFilters({ name: "", ville: "", minPrice: "", maxPrice: "" });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Navbar user={user} onLogout={handleLogout} />

            <Hero user={user} />

            <main id="complexes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-10 relative z-20">
                {/* Filter Bar */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-10 border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nom du complexe</label>
                            <input
                                type="text"
                                name="name"
                                value={filters.name}
                                onChange={handleFilterChange}
                                placeholder="Ex: Urban Soccer"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B2CFF] focus:border-transparent transition-all"
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ville</label>
                            <input
                                type="text"
                                name="ville"
                                value={filters.ville}
                                onChange={handleFilterChange}
                                placeholder="Ex: Casablanca"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B2CFF] focus:border-transparent transition-all"
                            />
                        </div>
                        <div className="w-full md:w-32">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Prix Min</label>
                            <input
                                type="number"
                                name="minPrice"
                                value={filters.minPrice}
                                onChange={handleFilterChange}
                                placeholder="0"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B2CFF] focus:border-transparent transition-all"
                            />
                        </div>
                        <div className="w-full md:w-32">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Prix Max</label>
                            <input
                                type="number"
                                name="maxPrice"
                                value={filters.maxPrice}
                                onChange={handleFilterChange}
                                placeholder="500"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B2CFF] focus:border-transparent transition-all"
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button
                                onClick={resetFilters}
                                className="px-4 py-3 text-gray-500 font-semibold hover:text-gray-700 transition-colors"
                            >
                                Réinitialiser
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Terrains disponibles <span className="text-gray-400 font-normal text-lg ml-2">({filteredComplexes.length})</span>
                    </h2>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B2CFF]"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-red-100">
                        <p className="text-red-500 font-medium mb-4">{error}</p>
                        <button
                            onClick={fetchComplexes}
                            className="text-[#0B2CFF] font-semibold hover:underline"
                        >
                            Réessayer
                        </button>
                    </div>
                ) : filteredComplexes.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <p className="text-gray-500 text-lg">Aucun complexe ne correspond à vos critères.</p>
                        <button
                            onClick={resetFilters}
                            className="mt-4 text-[#0B2CFF] font-semibold hover:underline"
                        >
                            Effacer les filtres
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredComplexes.map((complex) => (
                            <ComplexCard key={complex.id} complex={complex} />
                        ))}
                    </div>
                )}
            </main>

            {/* Footer Simple */}
            <footer className="bg-white border-t border-gray-200 py-12 mt-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <span className="text-2xl font-extrabold text-[#0B2CFF] tracking-tighter block mb-4">WePlay</span>
                    <p className="text-gray-500 text-sm">© 2025 WePlay. Tous droits réservés.</p>
                </div>
            </footer>
        </div>
    );
};

export default ComplexeListPage;
