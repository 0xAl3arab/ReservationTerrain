import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import ComplexCard from "../../components/ComplexCard";

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
            // 1. Immediate UI update from Token (Restores previous working behavior)
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser({
                    firstName: payload.given_name || "User",
                    lastName: payload.family_name || "",
                    email: payload.email
                });
            } catch (e) {
                console.error("Error decoding token:", e);
            }

            // 2. Background fetch for fresh data (Keeps the new feature)
            const fetchUserProfile = async () => {
                try {
                    const response = await fetch("http://localhost:8080/client/profile", {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setUser({
                            firstName: data.prenom,
                            lastName: data.nom,
                            email: data.email
                        });
                    } else if (response.status === 401) {
                        localStorage.removeItem("kc_access_token");
                        localStorage.removeItem("kc_refresh_token");
                        setUser(null);
                    }
                } catch (error) {
                    console.error("Background profile fetch failed:", error);
                }
            };

            fetchUserProfile();
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("kc_access_token");
        localStorage.removeItem("kc_refresh_token");
        setUser(null);
        window.location.reload();
    };

    const [activeTerrainsCount, setActiveTerrainsCount] = useState(0);

    // Data Fetching
    const fetchComplexes = async () => {
        setLoading(true);
        setError(null);
        try {
            const [complexesRes, activeCountRes] = await Promise.all([
                fetch("http://localhost:8080/api/complexes"),
                fetch("http://localhost:8080/api/terrains/active/total-count")
            ]);

            if (!complexesRes.ok) throw new Error("Erreur réseau");

            const data = await complexesRes.json();
            if (activeCountRes.ok) {
                const count = await activeCountRes.json();
                setActiveTerrainsCount(count);
            }

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
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Terrains disponibles <span className="text-gray-400 font-normal text-lg ml-2">({filteredComplexes.length})</span>
                        </h2>
                    </div>
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
