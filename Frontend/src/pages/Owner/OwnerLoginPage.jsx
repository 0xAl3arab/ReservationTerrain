import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OwnerLoginPage = () => {
  const navigate = useNavigate();
  
  // États pour stocker ce que l'utilisateur tape
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault(); // Empêche le rechargement de page
    setError(null);

    // Préparation des données pour Keycloak (Format x-www-form-urlencoded)
    const params = new URLSearchParams();
    params.append("client_id", "reservation-frontend"); // Ton client ID
    params.append("grant_type", "password");
    params.append("username", email); // Keycloak appelle ça username même si c'est un email
    params.append("password", password);

    try {
      // 1. On envoie les infos à Keycloak
      const response = await axios.post(
        "http://localhost:8180/realms/reservation-realm/protocol/openid-connect/token",
        params
      );

      // 2. Si ça marche, on récupère le token
      const token = response.data.access_token;
      
      // 3. On le stocke dans le navigateur
      localStorage.setItem("ownerToken", token);

      // 4. On redirige vers le tableau de bord
      console.log("Connexion réussie ! Token stocké.");
      navigate("/owner/complexes");

    } catch (err) {
      console.error("Erreur login", err);
      setError("Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        
        <h1 className="text-2xl font-bold text-center text-slate-800 mb-6">Espace Propriétaire</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Identifiant (Email)</label>
            <input 
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="ahmed"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-300"
          >
            Se connecter
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <a href="/" className="text-gray-500 hover:text-blue-600">← Retour au site</a>
        </div>

      </div>
    </div>
  );
};

export default OwnerLoginPage;