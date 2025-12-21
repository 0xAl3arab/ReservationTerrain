import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OwnerLoginPage = () => {
  const navigate = useNavigate();
  
  // États du formulaire
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- LOGIQUE DE CONNEXION (Direct Access Grant) ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Préparation des données pour Keycloak
    const params = new URLSearchParams();
    params.append("client_id", "reservation-frontend"); // Doit correspondre à Keycloak
    params.append("grant_type", "password");
    params.append("username", email);
    params.append("password", password);

    try {
      // 1. Appel direct à l'API Keycloak
      const response = await axios.post(
        "http://localhost:8180/realms/reservation-realm/protocol/openid-connect/token",
        params
      );

      // 2. Si succès, on récupère le token
      const token = response.data.access_token;
      
      // 3. On le sauvegarde localement pour les futurs appels API
      localStorage.setItem("ownerToken", token);

      // 4. Redirection vers le tableau de bord
      navigate("/owner/dashboard");

    } catch (err) {
      console.error("Erreur login", err);
      // Gestion basique des erreurs
      if (err.response && err.response.status === 401) {
        setError("Email ou mot de passe incorrect.");
      } else {
        setError("Impossible de se connecter au serveur.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B2CFF] to-[#001B87] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        
        {/* --- LOGO / TITRE --- */}
        <div className="text-center mb-8">
            <h1 className="text-5xl font-extrabold text-white tracking-tighter mb-2">WePlay</h1>
            <p className="text-blue-200 text-lg font-medium">Espace Propriétaire</p>
        </div>

        {/* --- CARTE DE CONNEXION --- */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connexion Pro</h2>
            <p className="text-gray-500 mb-6">Connectez-vous pour gérer vos complexes</p>

            {/* Message d'erreur */}
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-pulse">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
                
                {/* Champ Email */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Identifiant
                    </label>
                    <input 
                        type="text" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0B2CFF] focus:border-transparent transition-all"
                        placeholder="Ex: ahmed"
                        required
                    />
                </div>

                {/* Champ Mot de passe */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Mot de passe
                    </label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0B2CFF] focus:border-transparent transition-all"
                        placeholder="••••••••"
                        required
                    />
                </div>

                {/* Bouton de connexion */}
                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#0B2CFF] text-white font-semibold px-6 py-4 rounded-xl hover:bg-[#001B87] transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Connexion en cours...</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                            <span>Se connecter</span>
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <button
                    onClick={() => navigate("/")}
                    className="text-gray-500 text-sm hover:text-gray-700 transition-colors flex items-center justify-center gap-1 w-full"
                >
                    ← Retour à l'accueil
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerLoginPage;