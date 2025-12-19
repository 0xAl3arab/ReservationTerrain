import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom"; // J'ai ajouté Link ici

const Navbar = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Fermer le menu déroulant si on clique à l'extérieur
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setProfileDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    
                    {/* --- LOGO --- */}
                    <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate("/")}>
                        <span className="text-2xl font-extrabold text-[#0B2CFF] tracking-tighter">WePlay</span>
                    </div>

                    {/* --- MENU BUREAU (Desktop) --- */}
                    <div className="hidden md:flex space-x-8 items-center">
                        <a href="/#complexes" className="text-gray-600 hover:text-[#0B2CFF] font-medium transition-colors">
                            Découvrir les terrains
                        </a>
                        <a href="#" className="text-gray-600 hover:text-[#0B2CFF] font-medium transition-colors">
                            Comment ça marche ?
                        </a>
                    </div>

                    {/* --- BOUTONS DROITE (Desktop) --- */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            /* === UTILISATEUR CONNECTÉ === */
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                    className="flex items-center space-x-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                                >
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#0B2CFF] to-[#001B87] text-white flex items-center justify-center font-bold text-sm shadow-md">
                                        {user.firstName ? user.firstName.charAt(0).toUpperCase() : "U"}
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-semibold text-gray-900">{user.firstName} {user.lastName}</div>
                                        <div className="text-xs text-gray-500">{user.email}</div>
                                    </div>
                                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown */}
                                {profileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <div className="font-semibold text-gray-900">{user.firstName}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </div>
                                        <div className="py-2">
                                            <button onClick={() => { setProfileDropdownOpen(false); navigate('/profile'); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Paramètres du profil
                                            </button>
                                            <button onClick={() => { setProfileDropdownOpen(false); onLogout(); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                                Déconnexion
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* === VISITEUR (NON CONNECTÉ) === */
                            <>
                                {/* --- SOLUTION : Utilisation de LINK au lieu de BUTTON --- */}
                               {/* Remplace l'ancien lien par celui-ci */}
<Link 
    to="/owner/login" 
    className="relative z-[9999] text-sm font-medium text-gray-500 hover:text-[#0B2CFF] transition-colors mr-4 cursor-pointer"
>
    Vous êtes propriétaire ?
</Link>
                                {/* ------------------------------------------------------- */}

                                <button onClick={() => navigate("/login")} className="text-[#0B2CFF] font-semibold hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors">
                                    Se connecter
                                </button>
                                <button onClick={() => navigate("/signup")} className="bg-[#0B2CFF] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#001B87] shadow-lg transition-all">
                                    Créer un compte
                                </button>
                            </>
                        )}
                    </div>

                    {/* --- BOUTON MENU MOBILE --- */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600 hover:text-[#0B2CFF] focus:outline-none">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* --- MENU MOBILE DÉROULANT --- */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-2 shadow-lg">
                    <a href="/#complexes" className="block text-gray-600 font-medium py-2">Découvrir les terrains</a>
                    
                    {user ? (
                        <button onClick={onLogout} className="block w-full text-left text-red-500 font-medium py-2">Déconnexion</button>
                    ) : (
                        <div className="flex flex-col space-y-2 mt-4">
                            {/* Lien Owner Mobile */}
                            <Link 
                                to="/owner/login" 
                                className="block w-full text-center text-gray-600 font-medium border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50"
                                onClick={() => setMobileMenuOpen(false)} // Ferme le menu après clic
                            >
                                🏢 Espace Propriétaire
                            </Link>

                            <button onClick={() => navigate("/login")} className="w-full text-[#0B2CFF] font-semibold border border-[#0B2CFF] px-4 py-2 rounded-lg">
                                Se connecter
                            </button>
                            <button onClick={() => navigate("/signup")} className="w-full bg-[#0B2CFF] text-white font-semibold px-4 py-2 rounded-lg">
                                Créer un compte
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;