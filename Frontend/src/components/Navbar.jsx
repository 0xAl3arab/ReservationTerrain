import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ user: propUser, onLogout: propLogout }) => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [internalUser, setInternalUser] = useState(null);
    const dropdownRef = useRef(null);

    // Use prop user if provided, otherwise use internal state
    const user = propUser || internalUser;

    // Fetch user profile if not provided as prop
    useEffect(() => {
        if (!propUser) {
            const token = localStorage.getItem("kc_access_token");
            if (token) {
                // 1. Immediate UI update from Token
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    setInternalUser({
                        firstName: payload.given_name || "User",
                        lastName: payload.family_name || "",
                        email: payload.email
                    });
                } catch (e) {
                    console.error("Error decoding token:", e);
                }

                // 2. Background fetch for fresh data
                fetch("http://localhost:8080/client/profile", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                    .then(res => res.ok ? res.json() : null)
                    .then(data => {
                        if (data) {
                            setInternalUser({
                                firstName: data.prenom,
                                lastName: data.nom,
                                email: data.email,
                                id: data.id
                            });
                        }
                    })
                    .catch(err => console.error("Background profile fetch failed:", err));
            } else {
                setInternalUser(null);
            }
        }
    }, [propUser]);

    const handleLogout = () => {
        if (propLogout) {
            propLogout();
        } else {
            localStorage.removeItem("kc_access_token");
            localStorage.removeItem("kc_refresh_token");
            setInternalUser(null);
            window.location.href = "/login";
        }
    };

    // Close dropdown when clicking outside
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
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate("/")}>
                        <span className="text-2xl font-extrabold text-[#0B2CFF] tracking-tighter">WePlay</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center">
                        <a href="/#complexes" className="text-gray-600 hover:text-[#0B2CFF] font-medium transition-colors">Découvrir les terrains</a>
                        <a href="/find-team" className="text-gray-600 hover:text-[#0B2CFF] font-medium transition-colors">Trouver une équipe</a>
                        <a href="/join-us" className="text-gray-600 hover:text-[#0B2CFF] font-medium transition-colors">Rejoignez-nous</a>
                        <a href="/rules" className="text-gray-600 hover:text-[#0B2CFF] font-medium transition-colors">Règlement / Conditions</a>

                    </div>

                    {/* Auth Buttons (Desktop) */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
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

                                {/* Dropdown Menu */}
                                {profileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                                        {/* User Info Header */}
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#0B2CFF] to-[#001B87] text-white flex items-center justify-center font-bold shadow-md">
                                                    {user.firstName ? user.firstName.charAt(0).toUpperCase() : "U"}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{user.firstName} {user.lastName}</div>
                                                    <div className="text-xs text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="py-2">
                                            <button
                                                onClick={() => {
                                                    setProfileDropdownOpen(false);
                                                    navigate('/profile');
                                                }}
                                                className="w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors flex items-center space-x-3 group"
                                            >
                                                <svg className="w-5 h-5 text-gray-400 group-hover:text-[#0B2CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 group-hover:text-[#0B2CFF]">Paramètres du profil</div>
                                                    <div className="text-xs text-gray-500">Modifier vos informations</div>
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setProfileDropdownOpen(false);
                                                    navigate('/history');
                                                }}
                                                className="w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors flex items-center space-x-3 group"
                                            >
                                                <svg className="w-5 h-5 text-gray-400 group-hover:text-[#0B2CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 group-hover:text-[#0B2CFF]">Historique</div>
                                                    <div className="text-xs text-gray-500">Vos réservations passées</div>
                                                </div>
                                            </button>
                                        </div>

                                        {/* Logout */}
                                        <div className="border-t border-gray-100 pt-2">
                                            <button
                                                onClick={() => {
                                                    setProfileDropdownOpen(false);
                                                    handleLogout();
                                                }}
                                                className="w-full px-4 py-2.5 text-left hover:bg-red-50 transition-colors flex items-center space-x-3 group"
                                            >
                                                <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 group-hover:text-red-500">Déconnexion</div>
                                                    <div className="text-xs text-gray-500">Se déconnecter du compte</div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                )}
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
                    <a href="/#complexes" className="block text-gray-600 font-medium py-2">Découvrir les terrains</a>
                    <a href="/find-team" className="block text-gray-600 font-medium py-2">Trouver une équipe</a>
                    <a href="/join-us" className="block text-gray-600 font-medium py-2">Rejoignez-nous</a>
                    <a href="/rules" className="block text-gray-600 font-medium py-2">Règlement / Conditions</a>
                    {user ? (
                        <>
                            <div className="border-t border-gray-100 my-2 pt-2">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#0B2CFF] to-[#001B87] text-white flex items-center justify-center font-bold shadow-md">
                                        {user.firstName ? user.firstName.charAt(0).toUpperCase() : "U"}
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900">{user.firstName} {user.lastName}</div>
                                        <div className="text-xs text-gray-500">{user.email}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/profile')}
                                    className="block w-full text-left text-gray-700 hover:bg-blue-50 font-medium py-2 px-2 rounded transition-colors"
                                >
                                    📋 Paramètres du profil
                                </button>
                                <button
                                    onClick={() => navigate('/history')}
                                    className="block w-full text-left text-gray-700 hover:bg-blue-50 font-medium py-2 px-2 rounded transition-colors"
                                >
                                    🕒 Historique
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left text-red-500 hover:bg-red-50 font-medium py-2 px-2 rounded transition-colors"
                                >
                                    🚪 Déconnexion
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

export default Navbar;
