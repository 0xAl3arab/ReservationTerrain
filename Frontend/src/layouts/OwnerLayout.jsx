import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";

const OwnerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Permet de savoir sur quelle page on est

  const handleLogout = () => {
    localStorage.removeItem("ownerToken");
    navigate("/owner/login");
  };

  // Fonction pour styliser les liens (Actif vs Inactif)
  const getLinkClass = (path) => {
    const isActive = location.pathname.startsWith(path);
    return `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 font-medium group ${
      isActive 
        ? "bg-white text-[#0B2CFF] shadow-lg" // Style Actif (Blanc text Bleu)
        : "text-blue-100 hover:bg-white/10 hover:text-white" // Style Inactif
    }`;
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* --- SIDEBAR BLEUE --- */}
      <aside className="w-72 bg-gradient-to-b from-[#001B87] to-[#0B2CFF] text-white flex flex-col shadow-2xl z-20">
        
        {/* En-tête Logo */}
        <div className="p-8 border-b border-white/10">
          <h1 className="text-3xl font-extrabold tracking-tighter cursor-pointer" onClick={() => navigate('/')}>
            WePlay <span className="text-xs font-normal opacity-70 block mt-1 tracking-normal font-sans">Espace Propriétaire</span>
          </h1>
        </div>
        
        {/* Menu de Navigation */}
        <nav className="flex-1 p-6 space-y-4">
          <Link to="/owner/dashboard" className={getLinkClass("/owner/dashboard")}>
            <span className="text-xl">📊</span>
            <span>Tableau de bord</span>
          </Link>
          
          <Link to="/owner/complexes" className={getLinkClass("/owner/complexes")}>
            <span className="text-xl">🏢</span>
            <span>Mes Complexes</span>
          </Link>

          <Link to="/owner/reservations" className={getLinkClass("/owner/reservations")}>
            <span className="text-xl">📅</span>
            <span>Réservations</span>
          </Link>
        </nav>

        {/* Pied de page Sidebar (Profil + Déconnexion) */}
        <div className="p-6 bg-black/10 backdrop-blur-sm border-t border-white/10">
          <div className="flex items-center gap-3 mb-6 px-2">
             <div className="h-10 w-10 rounded-full bg-white text-[#0B2CFF] flex items-center justify-center font-bold shadow-md">
                P
             </div>
             <div>
                 <p className="text-sm font-bold text-white">Mon Compte</p>
                 <p className="text-xs text-blue-200">Propriétaire</p>
             </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-600 text-red-100 hover:text-white py-3 rounded-xl transition-all duration-300 font-semibold border border-red-500/30 hover:border-red-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* --- CONTENU PRINCIPAL --- */}
      <main className="flex-1 overflow-y-auto">
        {/* On ajoute un padding pour que le contenu ne colle pas aux bords */}
        <div className="min-h-full">
            <Outlet />
        </div>
      </main>
    </div>
  );
};

export default OwnerLayout;