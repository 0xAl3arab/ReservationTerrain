import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

const OwnerLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("ownerToken");
    navigate("/owner/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold text-center border-b border-slate-700">
          Owner Panel
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {/* Ces composants Link rendent les boutons cliquables */}
          <Link to="/owner/dashboard" className="block p-3 rounded hover:bg-slate-700 transition">
            📊 Dashboard
          </Link>
          <Link to="/owner/complexes" className="block p-3 rounded hover:bg-slate-700 transition">
            🏢 Mes Complexes
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button 
            onClick={handleLogout}
            className="w-full bg-red-600 py-2 rounded hover:bg-red-700 transition font-bold"
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {/* CONTENU CENTRAL */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default OwnerLayout;