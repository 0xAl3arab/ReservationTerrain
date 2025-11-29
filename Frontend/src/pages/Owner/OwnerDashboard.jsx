import { useEffect, useState, useRef } from "react";
import axios from "axios";
import keycloak from "../../keycloak";
import "./OwnerDashboard.css";

const OwnerDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ownerProfile, setOwnerProfile] = useState(null);
  
  // State pour la liste des terrains
  const [terrains, setTerrains] = useState([]);

  // State pour le formulaire Profil
  const [formData, setFormData] = useState({
    numTele: "",
    nomComplexe: ""
  });

  // State pour le formulaire Terrain (Nouveau)
  const [terrainForm, setTerrainForm] = useState({
    nom: "",
    type: "5x5", // Valeur par défaut
    prixHeure: "",
    adresse: ""
  });
  
  const [message, setMessage] = useState("");
  const isRun = useRef(false);

  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;

    keycloak.init({ onLoad: "check-sso" }).then((authenticated) => {
      setIsAuthenticated(authenticated);
      if (authenticated) {
        fetchProfile();
        fetchTerrains(); // <--- On charge aussi les terrains
      }
    });
  }, []);

  // --- APPELS API ---

  const fetchProfile = () => {
    axios.get("http://localhost:8080/api/owner/profile", {
        headers: { Authorization: `Bearer ${keycloak.token}` },
      })
      .then((res) => {
        setOwnerProfile(res.data);
        setFormData({
            numTele: res.data.numTele || "",
            nomComplexe: res.data.nomComplexe || ""
        });
      })
      .catch((err) => console.error("Erreur Profil", err));
  };

  const fetchTerrains = () => {
    axios.get("http://localhost:8080/api/terrains/mes-terrains", {
        headers: { Authorization: `Bearer ${keycloak.token}` },
    })
    .then((res) => setTerrains(res.data))
    .catch((err) => console.error("Erreur Terrains", err));
  };

  // --- GESTION FORMULAIRES ---

  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTerrainChange = (e) => {
    setTerrainForm({ ...terrainForm, [e.target.name]: e.target.value });
  };

  const saveProfile = () => {
    axios.put("http://localhost:8080/api/owner/profile", 
      { numTele: formData.numTele, nomComplexe: formData.nomComplexe }, 
      { headers: { Authorization: `Bearer ${keycloak.token}` } }
    ).then((res) => {
        setOwnerProfile(res.data);
        setMessage("✅ Profil mis à jour !");
        setTimeout(() => setMessage(""), 3000);
    });
  };

  const addTerrain = () => {
    // Conversion du prix en nombre
    const payload = { ...terrainForm, prixHeure: parseFloat(terrainForm.prixHeure) };

    axios.post("http://localhost:8080/api/terrains", payload, {
        headers: { Authorization: `Bearer ${keycloak.token}` }
    }).then((res) => {
        setTerrains([...terrains, res.data]); // Ajoute le nouveau terrain à la liste
        setTerrainForm({ nom: "", type: "5x5", prixHeure: "", adresse: "" ,   photoUrl: "" }); // Reset form
        setMessage("✅ Terrain ajouté !");
        setTimeout(() => setMessage(""), 3000);
    }).catch(err => console.error("Erreur Ajout Terrain", err));
  };

  const deleteTerrain = (id) => {
    if(!window.confirm("Voulez-vous vraiment supprimer ce terrain ?")) return;

    axios.delete(`http://localhost:8080/api/terrains/${id}`, {
        headers: { Authorization: `Bearer ${keycloak.token}` }
    }).then(() => {
        setTerrains(terrains.filter(t => t.id !== id)); // Retire le terrain de la liste
    });
  };

  // --- RENDU LOGIN ---
  if (!isAuthenticated) {
    return (
      <div className="owner-login-container">
        <div className="login-card">
          <h2>Espace Propriétaire</h2>
          <button className="btn-primary" onClick={() => keycloak.login()}>Se connecter</button>
        </div>
      </div>
    );
  }

  // --- RENDU DASHBOARD ---
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>⚽ ReservationTerrain <span style={{fontSize:'0.8em', color:'#888'}}>/ Propriétaire</span></h1>
        <button className="btn-logout" onClick={() => keycloak.logout()}>Se déconnecter</button>
      </header>

      <div className="dashboard-content">
        {message && <div style={{gridColumn: "1 / -1"}} className="success-message">{message}</div>}

        {/* --- CARTE PROFIL --- */}
        <div className="card">
            <div className="profile-header">
                <div className="avatar">{ownerProfile?.prenom?.charAt(0)}</div>
                <h3>{ownerProfile?.prenom} {ownerProfile?.nom}</h3>
            </div>
            <div className="form-group">
                <label>Nom du Complexe</label>
                <input className="form-input" type="text" name="nomComplexe" value={formData.nomComplexe} onChange={handleProfileChange} />
            </div>
            <div className="form-group">
                <label>Téléphone</label>
                <input className="form-input" type="text" name="numTele" value={formData.numTele} onChange={handleProfileChange} />
            </div>
            <button className="btn-primary" onClick={saveProfile}>Mettre à jour Profil</button>
        </div>

        {/* --- CARTE AJOUT TERRAIN --- */}
        <div className="card">
            <h2>➕ Ajouter un Terrain</h2>
            <div className="form-group">
                <label>Nom du Terrain</label>
                <input className="form-input" type="text" name="nom" placeholder="Ex: Terrain A" value={terrainForm.nom} onChange={handleTerrainChange} />
            </div>
            <div className="form-group">
                <label>Photo (Lien URL)</label>
                <input 
                    className="form-input" 
                    type="text" 
                    name="photoUrl" 
                    placeholder="" 
                    value={terrainForm.photoUrl} 
                    onChange={handleTerrainChange} 
                />
            </div>
            <div className="form-row">
                <div className="form-group" style={{flex:1}}>
                    <label>Type</label>
                    <select className="form-input" name="type" value={terrainForm.type} onChange={handleTerrainChange}>
                        <option value="5x5">5 vs 5</option>
                        <option value="7x7">7 vs 7</option>
                        <option value="11x11">11 vs 11</option>
                    </select>
                </div>
                <div className="form-group" style={{flex:1}}>
                    <label>Prix / Heure (DH)</label>
                    <input className="form-input" type="number" name="prixHeure" placeholder="300" value={terrainForm.prixHeure} onChange={handleTerrainChange} />
                </div>
            </div>
            <div className="form-group">
                <label>Adresse (si différente du complexe)</label>
                <input className="form-input" type="text" name="adresse" value={terrainForm.adresse} onChange={handleTerrainChange} />
            </div>
            <button className="btn-primary" style={{backgroundColor: '#3498db'}} onClick={addTerrain}>Ajouter ce terrain</button>
        </div>

        {/* --- LISTE DES TERRAINS --- */}
        <div className="terrain-section">
            <h2 style={{marginBottom: '1rem'}}>📋 Mes Terrains ({terrains.length})</h2>
            <div className="terrain-grid">
                {terrains.map((terrain) => (
                    <div key={terrain.id} className="terrain-card">
                          {terrain.photoUrl ? (
                            <img src={terrain.photoUrl} alt={terrain.nom} className="terrain-img" />
                        ) : (
                            <div className="no-image">⚽ Pas d'image</div>
                        )}

                        <div className="terrain-header">
                            <h4>{terrain.nom}</h4>
                            <span className="badge-type">{terrain.type}</span>
                        </div>
                        <p style={{color:'#666', fontSize:'0.9rem'}}>📍 {terrain.adresse || "Adresse du complexe"}</p>
                        <div className="terrain-price">{terrain.prixHeure} DH <small>/heure</small></div>
                        <button className="btn-delete" onClick={() => deleteTerrain(terrain.id)}>Supprimer</button>
                    </div>
                ))}
            </div>
            {terrains.length === 0 && <p style={{fontStyle:'italic', color:'#888'}}>Aucun terrain ajouté pour le moment.</p>}
        </div>

      </div>
    </div>
  );
};

export default OwnerDashboard;