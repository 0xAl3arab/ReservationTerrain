import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // 👈 C'est cet import qui permet de faire des liens

const OwnerComplexes = () => {
  const [complexes, setComplexes] = useState([]);

  useEffect(() => {
    const fetchComplexes = async () => {
      const token = localStorage.getItem("ownerToken");
      
      if (!token) {
        window.location.href = "/owner/login";
        return;
      }

      try {
        const response = await axios.get("http://localhost:8080/api/owners/complexes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComplexes(response.data);
      } catch (error) {
        console.error("Erreur chargement", error);
      }
    };
    fetchComplexes();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">🏢 Mes Complexes</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {complexes.length === 0 ? (
            <div className="text-gray-500">Aucun complexe trouvé.</div>
        ) : (
            complexes.map((c) => (
                <div key={c.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition flex flex-col justify-between h-56">
                    <div>
                        <h2 className="font-bold text-xl mb-1 text-slate-900">{c.nom}</h2>
                        <p className="text-gray-600">📍 {c.ville}</p>
                        <p className="text-gray-400 text-sm mt-1">{c.adress}</p>
                    </div>
                    
                    {/* 👇 C'EST ICI QUE LE BOUTON EST CRÉÉ 👇 */}
                    <Link 
                        to={`/owner/complexes/${c.id}`} 
                        className="block w-full text-center bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition mt-4"
                    >
                        Gérer les terrains →
                    </Link>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default OwnerComplexes;