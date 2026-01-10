import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OwnerNavbar = ({ owner, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

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

    const navLinks = [
        { label: "Dashboard", path: "/owner/dashboard" },
        { label: "Mes Terrains", path: "/owner/terrains" },
        { label: "Réservations", path: "/owner/reservations" },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-[#0B2CFF] shadow-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <div className="flex items-center cursor-pointer group" onClick={() => navigate("/owner/dashboard")}>
                        <span className="text-2xl font-black tracking-tighter text-white">
                            WEPLAY<span className="text-blue-300">.</span>
                        </span>
                        <span className="ml-2 bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm border border-white/10">
                            Owner
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-6 text-sm font-bold">
                        {navLinks.map((link) => (
                            <button
                                key={link.path}
                                onClick={() => navigate(link.path)}
                                className={`${isActive(link.path) ? "text-white" : "text-blue-100 hover:text-white"} transition-all relative py-2`}
                            >
                                {link.label}
                                {isActive(link.path) && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-full"></span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-white">{owner?.prenom} {owner?.nom}</p>
                        <p className="text-[10px] text-blue-100 uppercase tracking-widest font-black opacity-80">{owner?.nomComplexe || "Responsable"}</p>
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                            className="h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white font-bold text-sm transition-all shadow-lg backdrop-blur-md"
                        >
                            {owner?.prenom ? owner.prenom.charAt(0).toUpperCase() : "O"}
                        </button>

                        {profileDropdownOpen && (
                            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden text-gray-900">
                                <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100">
                                    <p className="text-sm font-bold text-gray-900">{owner?.prenom} {owner?.nom}</p>
                                    <p className="text-[10px] text-gray-500 truncate">{owner?.email}</p>
                                </div>
                                <div className="py-2">
                                    <button
                                        onClick={() => {
                                            setProfileDropdownOpen(false);
                                            navigate('/owner/profile');
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-[#0B2CFF] transition-all flex items-center gap-3"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Mon Profil
                                    </button>
                                    <button
                                        onClick={() => {
                                            setProfileDropdownOpen(false);
                                            navigate('/owner/complexe');
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-[#0B2CFF] transition-all flex items-center gap-3"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        Mon Complexe
                                    </button>
                                </div>
                                <div className="border-t border-gray-100 pt-1">
                                    <button
                                        onClick={() => {
                                            setProfileDropdownOpen(false);
                                            onLogout();
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm font-bold text-red-500 hover:bg-red-50 transition-all flex items-center gap-3"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Déconnexion
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="bg-white/10 text-white p-2 rounded-xl border border-white/20 backdrop-blur-sm"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <div className="md:hidden bg-[#0B2CFF] border-t border-white/10 p-4 space-y-2">
                    {navLinks.map((link) => (
                        <button
                            key={link.path}
                            onClick={() => {
                                navigate(link.path);
                                setMobileMenuOpen(false);
                            }}
                            className={`block w-full text-left font-bold text-sm py-4 px-6 rounded-2xl transition-all ${isActive(link.path) ? "bg-white text-[#0B2CFF]" : "text-white hover:bg-white/10"}`}
                        >
                            {link.label}
                        </button>
                    ))}
                    <div className="border-t border-white/10 pt-4">
                        <button
                            onClick={() => {
                                navigate('/owner/profile');
                                setMobileMenuOpen(false);
                            }}
                            className="block w-full text-left font-bold text-sm py-4 px-6 rounded-2xl text-white hover:bg-white/10"
                        >
                            👤 Mon Profil
                        </button>
                        <button
                            onClick={() => {
                                navigate('/owner/complexe');
                                setMobileMenuOpen(false);
                            }}
                            className="block w-full text-left font-bold text-sm py-4 px-6 rounded-2xl text-white hover:bg-white/10"
                        >
                            🏢 Mon Complexe
                        </button>
                        <button
                            onClick={onLogout}
                            className="block w-full text-left font-bold text-sm py-4 px-6 rounded-2xl text-white hover:bg-white/10"
                        >
                            🚪 Déconnexion
                        </button>
                    </div>
                </div>
            )}
        </nav>

    );
};

export default OwnerNavbar;
