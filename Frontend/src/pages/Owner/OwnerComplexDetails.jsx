import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const OwnerComplexDetails = () => {
  const { id } = useParams(); // Récupère l'ID du complexe depuis l'URL
  const navigate = useNavigate();
  
  // États pour les données et le chargement
  const [terrains, setTerrains] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // État pour le formulaire d'ajout de terrain
  const [nouveauTerrain, setNouveauTerrain] = useState({
    nom: "",
    prixTerrain: "",
    status: "DISPONIBLE", // Valeur par défaut
    heureOuverture: 9,
    heureFermeture: 23,
    dureeCreneau: 60
  });

  // Récupération du token de sécurité
  const token = localStorage.getItem("ownerToken");

  // --- 1. Charger les terrains au démarrage ---
  useEffect(() => {
    // Si pas de token, on redirige vers le login
    if (!token) {
        navigate("/owner/login");
        return;
    }
    fetchTerrains();
  }, [id]);

  const fetchTerrains = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/owners/complexes/${id}/terrains`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTerrains(response.data);
    } catch (error) {
      console.error("Erreur chargement terrains", error);
      if (error.response && error.response.status === 401) {
          navigate("/owner/login"); // Token expiré
      }
    } finally {
      setLoading(false);
    }
  };

  // --- 2. Gérer la soumission du formulaire (Ajout) ---
  const handleAddTerrain = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8080/api/owners/complexes/${id}/terrains`, nouveauTerrain, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("✅ Terrain ajouté avec succès !");
      
      // Réinitialiser le formulaire
      setNouveauTerrain({
        nom: "",
        prixTerrain: "",
        status: "DISPONIBLE",
        heureOuverture: 9,
        heureFermeture: 23,
        dureeCreneau: 60
      });

      // Recharger la liste pour voir le nouveau terrain
      fetchTerrains(); 

    } catch (error) {
      console.error("Erreur ajout", error);
      alert("❌ Erreur lors de l'ajout du terrain. Vérifiez les informations.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Bouton Retour */}
      <button 
        onClick={() => navigate("/owner/complexes")} 
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
      >
        <span className="mr-2">←</span> Retour à mes complexes
      </button>

      <h1 className="text-3xl font-extrabold text-slate-900 mb-8 border-b border-gray-200 pb-4">
        Gestion des Terrains <span className="text-gray-400 text-lg font-normal ml-2">(Complexe #{id})</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* === COLONNE GAUCHE : LISTE DES TERRAINS (Prend 2/3 de la largeur) === */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">🏟️ Terrains existants</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
              {terrains.length} Total
            </span>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-10 text-gray-500">Chargement des données...</div>
            ) : terrains.length === 0 ? (
              <div className="bg-yellow-50 p-6 rounded-xl text-yellow-800 border border-yellow-200 text-center">
                <p className="font-semibold">Aucun terrain configuré.</p>
                <p className="text-sm mt-1">Utilisez le formulaire à droite pour ajouter votre premier terrain.</p>
              </div>
            ) : (
              terrains.map((t) => (
                <div key={t.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{t.nom}</h3>
                    <div className="text-sm text-gray-500 mt-1 flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        💰 <span className="font-medium text-slate-700">{t.prixTerrain} MAD/h</span>
                      </span>
                      <span className="flex items-center gap-1">
                        🕒 {t.heureOuverture}h - {t.heureFermeture}h
                      </span>
                    </div>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    t.status === "DISPONIBLE" 
                        ? "bg-green-50 text-green-700 border-green-200" 
                        : "bg-red-50 text-red-700 border-red-200"
                  }`}>
                    {t.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* === COLONNE DROITE : FORMULAIRE D'AJOUT (Prend 1/3 de la largeur) === */}
        <div className="h-fit">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-6">
                <h2 className="text-xl font-bold mb-6 text-[#0B2CFF] flex items-center gap-2">
                    <span>+</span> Nouveau Terrain
                </h2>
                
                <form onSubmit={handleAddTerrain} className="space-y-5">
                    
                    {/* Nom */}
                    <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Nom du terrain</label>
                    <input 
                        type="text" 
                        required
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                        placeholder="Ex: Terrain A (Synthétique)"
                        value={nouveauTerrain.nom}
                        onChange={(e) => setNouveauTerrain({...nouveauTerrain, nom: e.target.value})}
                    />
                    </div>

                    {/* Prix */}
                    <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Prix par heure (MAD)</label>
                    <input 
                        type="text" // String car ton backend attend un String pour le prix
                        required
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                        placeholder="Ex: 300"
                        value={nouveauTerrain.prixTerrain}
                        onChange={(e) => setNouveauTerrain({...nouveauTerrain, prixTerrain: e.target.value})}
                    />
                    </div>

                    {/* Horaires */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Ouverture</label>
                            <input 
                                type="number" 
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                value={nouveauTerrain.heureOuverture} 
                                onChange={(e)=>setNouveauTerrain({...nouveauTerrain, heureOuverture: e.target.value})} 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Fermeture</label>
                            <input 
                                type="number" 
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                value={nouveauTerrain.heureFermeture} 
                                onChange={(e)=>setNouveauTerrain({...nouveauTerrain, heureFermeture: e.target.value})} 
                            />
                        </div>
                    </div>

                    {/* Bouton Submit */}
                    <button 
                        type="submit" 
                        className="w-full bg-[#0B2CFF] text-white font-bold py-3 rounded-xl hover:bg-[#001B87] transition-all shadow-md hover:shadow-lg active:scale-95 mt-4"
                    >
                        Sauvegarder le terrain
                    </button>
                </form>
            </div>
        </div>

      </div>
    </div>
  );
};

export default OwnerComplexDetails;