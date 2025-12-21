import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const ComplexeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [terrains, setTerrains] = useState([]);
  const [loading, setLoading] = useState(true);

  // Vérification basique du token pour savoir si l'user est connecté
  const token = localStorage.getItem("kc_access_token");
  // Simuler un objet user simple pour la Navbar si connecté
  const user = token ? { firstName: "Membre" } : null; 

  useEffect(() => {
    const fetchTerrains = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/complexes/${id}/terrains`);
        if (response.ok) {
            const data = await response.json();
            setTerrains(data);
        }
      } catch (error) {
        console.error("Erreur", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTerrains();
  }, [id]);

  const handleReservation = (terrainId) => {
    if (!token) {
        navigate("/login");
    } else {
        alert("Fonctionnalité de réservation complète à venir ! (Module Client)");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("kc_access_token");
    localStorage.removeItem("kc_refresh_token");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar user={user} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 py-12 flex-grow w-full">
        <button onClick={() => navigate("/")} className="text-[#0B2CFF] mb-6 font-medium hover:underline flex items-center gap-2">
            <span>←</span> Retour à la liste
        </button>

        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Terrains disponibles</h1>
        <p className="text-gray-500 mb-10">Choisissez votre terrain et réservez votre créneau.</p>

        {loading ? (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B2CFF]"></div>
            </div>
        ) : terrains.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl shadow-sm text-center border border-gray-100">
                <p className="text-gray-500 text-lg">Aucun terrain disponible dans ce complexe pour le moment.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {terrains.map((t) => (
                    <div key={t.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                        <div className="h-48 bg-gray-200 relative overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                             <img 
                                src="https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=800" 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                alt="Terrain" 
                             />
                             <span className="absolute top-4 right-4 z-20 bg-green-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                {t.status}
                             </span>
                             <div className="absolute bottom-4 left-4 z-20 text-white">
                                <h3 className="text-xl font-bold">{t.nom}</h3>
                             </div>
                        </div>
                        
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4 text-gray-600 text-sm">
                                <div className="flex items-center gap-1">
                                    <span>⚽</span> 5 vs 5
                                </div>
                                <div className="flex items-center gap-1">
                                    <span>🕒</span> {t.heureOuverture}h - {t.heureFermeture}h
                                </div>
                            </div>
                            
                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400 font-medium">Tarif</span>
                                    <span className="text-xl font-bold text-[#0B2CFF]">{t.prixTerrain} MAD</span>
                                </div>
                                <button 
                                    onClick={() => handleReservation(t.id)}
                                    className="bg-[#0B2CFF] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#001B87] transition-all shadow-md shadow-blue-200 active:scale-95"
                                >
                                    Réserver
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ComplexeDetailsPage;