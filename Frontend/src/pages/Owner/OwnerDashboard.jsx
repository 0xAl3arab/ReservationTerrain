import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OwnerDashboard = () => {
  const navigate = useNavigate();

  // États pour stocker les données reçues du Backend
  const [statsData, setStatsData] = useState({
    totalComplexes: 0,
    totalTerrains: 0,
    reservationsAujourdhui: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      // 1. On récupère le token stocké lors du login
      const token = localStorage.getItem("ownerToken");

      // 2. Si pas de token, on redirige vers le login
      if (!token) {
        navigate("/owner/login");
        return;
      }

      try {
        // 3. Appel au Backend pour récupérer les stats calculées
        // Assure-toi que ton Backend tourne sur le port 8080
        const response = await axios.get("http://localhost:8080/api/owners/dashboard-stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // 4. On met à jour l'état avec les vrais chiffres
        console.log("Données reçues du backend :", response.data); // Pour débugger
        setStatsData(response.data);
        setLoading(false);

      } catch (error) {
        console.error("Erreur chargement dashboard", error);

        // 5. Gestion de l'expiration du token (Erreur 401 ou 403)
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem("ownerToken");
            navigate("/owner/login");
        }
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  // Configuration des cartes (Titres, Valeurs, Couleurs)
  const statsCards = [
    { 
      title: "CHIFFRE D'AFFAIRES (MOIS)", 
      value: "0 MAD", // Valeur fictive pour l'instant (module paiement futur)
      color: "bg-green-100 text-green-600", 
      icon: "💰" 
    },
    { 
      title: "RÉSERVATIONS (AUJ.)", 
      value: statsData.reservationsAujourdhui, // Vient du Backend
      color: "bg-blue-100 text-blue-600", 
      icon: "📅" 
    },
    { 
      title: "TOTAL COMPLEXES", 
      value: statsData.totalComplexes, // Vient du Backend (Calculé)
      color: "bg-purple-100 text-purple-600", 
      icon: "🏢" 
    },
    { 
      title: "TERRAINS ACTIFS", 
      value: statsData.totalTerrains, // Vient du Backend (Calculé)
      color: "bg-orange-100 text-orange-600", 
      icon: "⚽" 
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Tableau de Bord</h1>
        <p className="text-gray-500 mt-2">Bienvenue sur votre espace de gestion WePlay.</p>
      </div>

      {/* --- SECTION STATISTIQUES (KPIs) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-slate-800">
                    {loading ? "-" : stat.value}
                </p>
              </div>
              <div className={`h-14 w-14 rounded-full flex items-center justify-center text-2xl ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- SECTION DÉTAILS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Colonne Gauche : Activité Récente (Fictive pour la démo) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">Activité Récente</h2>
            <button className="text-sm text-blue-600 hover:underline font-medium">Tout voir</button>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-lg">
                    👤
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">Client Anonyme #{i}</p>
                    <p className="text-xs text-gray-500">Réservation • Terrain 5x5</p>
                  </div>
                </div>
                <div className="text-right">
                    <span className="block text-sm font-bold text-blue-600">18:00</span>
                    <span className="block text-xs text-gray-400">Aujourd'hui</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Colonne Droite : État du Parc */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-6">État du Parc</h2>
          
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 p-8 text-center">
            <span className="text-4xl mb-3">📈</span>
            <p className="text-slate-500 font-medium">Graphique d'occupation</p>
            <p className="text-xs text-slate-400 mt-1">(Bientôt disponible)</p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Complexes ouverts</span>
                <span className="font-bold text-green-600">100%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "100%" }}></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OwnerDashboard;