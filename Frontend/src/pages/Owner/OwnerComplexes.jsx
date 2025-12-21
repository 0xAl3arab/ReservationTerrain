import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const OwnerComplexes = () => {
  const [complexes, setComplexes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // États pour la Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nom: "", ville: "", adress: "", description: "" });

  const navigate = useNavigate();
  const token = localStorage.getItem("ownerToken");

  // --- CHARGEMENT ---
  const fetchComplexes = async () => {
    if (!token) { navigate("/owner/login"); return; }
    try {
      const response = await axios.get("http://localhost:8080/api/owners/complexes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplexes(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) { navigate("/owner/login"); }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplexes(); }, []);

  // --- CRÉATION ---
  const handleCreateComplex = async (e) => {
    e.preventDefault();
    try {
        await axios.post("http://localhost:8080/api/owners/complexes", formData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        alert("Complexe créé !");
        setIsModalOpen(false);
        setFormData({ nom: "", ville: "", adress: "", description: "" });
        fetchComplexes();
    } catch (error) { alert("Erreur création"); }
  };

  // --- SUPPRESSION ---
  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce complexe ?")) {
        try {
            await axios.delete(`http://localhost:8080/api/owners/complexes/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Mise à jour locale de la liste
            setComplexes(complexes.filter(c => c.id !== id));
        } catch (error) {
            alert("Impossible de supprimer. Vérifiez qu'il n'y a pas de réservations en cours.");
        }
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-full relative">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Mes Complexes</h1>
            <p className="text-gray-500 mt-1">Gérez vos établissements.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-[#0B2CFF] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#001B87] transition shadow-md flex items-center gap-2">
            + Ajouter
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {complexes.length === 0 ? (
                <div className="col-span-3 text-center py-10 bg-white rounded shadow text-gray-500">
                    Aucun complexe trouvé.
                </div>
            ) : (
                complexes.map((c) => (
                    <div key={c.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 relative group flex flex-col justify-between h-full">
                        
                        {/* BOUTON SUPPRIMER (POUBELLE) */}
                        <button 
                            onClick={() => handleDelete(c.id)}
                            className="absolute top-4 right-4 bg-white/80 backdrop-blur text-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white transition shadow z-10"
                            title="Supprimer"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>

                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl">🏟️</div>
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{c.nom}</h2>
                            <div className="flex items-center text-gray-500 text-sm mb-1">📍 {c.ville}</div>
                            <div className="flex items-center text-gray-400 text-xs pl-4">{c.adress}</div>
                        </div>
                        
                        <div className="p-6 pt-0 mt-auto">
                            <Link to={`/owner/complexes/${c.id}`} className="block w-full text-center bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                                Gérer les terrains →
                            </Link>
                        </div>
                    </div>
                ))
            )}
        </div>
      )}

      {/* MODAL D'AJOUT */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Nouveau Complexe</h2>
                <form onSubmit={handleCreateComplex} className="space-y-4">
                    <input type="text" required className="w-full border p-3 rounded-lg" placeholder="Nom du complexe" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} />
                    <input type="text" required className="w-full border p-3 rounded-lg" placeholder="Ville" value={formData.ville} onChange={(e) => setFormData({...formData, ville: e.target.value})} />
                    <input type="text" required className="w-full border p-3 rounded-lg" placeholder="Adresse complète" value={formData.adress} onChange={(e) => setFormData({...formData, adress: e.target.value})} />
                    <div className="flex gap-3 mt-6">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 py-3 rounded-xl font-bold">Annuler</button>
                        <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg">Créer</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default OwnerComplexes;