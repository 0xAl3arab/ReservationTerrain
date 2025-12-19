import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import keycloak from './keycloak';

const root = createRoot(document.getElementById('root'));

// Affiche un message de chargement pour savoir si React démarre
root.render(
  <div className="flex items-center justify-center h-screen">
    <p className="text-xl">Chargement de l'application...</p>
  </div>
);

// Initialisation de Keycloak
keycloak.init({
  onLoad: 'check-sso',
  // ❌ J'AI SUPPRIMÉ LA LIGNE silentCheckSsoRedirectUri QUI BLOQUAIT
  checkLoginIframe: false, 
}).then((authenticated) => {

  const path = window.location.pathname;

  // Si l'utilisateur veut aller sur /owner (sauf login) sans être connecté
  if (!authenticated && path.startsWith("/owner") && !path.includes("/owner/login")) {
      keycloak.login();
  } else {
      // On lance l'application
      root.render(
        <StrictMode>
          <App />
        </StrictMode>,
      );
  }

}).catch((error) => {
  console.error("Erreur Keycloak", error);
  root.render(<div className="p-10 text-red-600">Erreur de connexion Keycloak (Regarde la console F12)</div>);
});