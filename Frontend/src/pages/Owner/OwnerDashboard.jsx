import { useEffect, useState, useRef } from "react";
import axios from "axios";
import keycloak from "../../keycloak";
import "./OwnerDashboard.css";

const OwnerDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [terrains, setTerrains] = useState([]);
  
  // --- NOUVEAU : State pour les réservations ---
  const [reservations, setReservations] = useState([]);

  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({ 
    numTele: "", nomComplexe: "", photoProfil: "" 
  });

  const [terrainForm, setTerrainForm] = useState({
    nom: "", type: "5x5", prixHeure: "", adresse: "", photoUrl: ""
  });
  
  const [message, setMessage] = useState("");
  const isRun = useRef(false);

  // --- INITIALISATION ---
  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;

    keycloak.init({ onLoad: "check-sso" }).then((authenticated) => {
      setIsAuthenticated(authenticated);
      if (authenticated) {
        fetchProfile();
        fetchTerrains();
        fetchReservations(); // <--- On charge les réservations
      }
    });
  }, []);

  // --- API CALLS ---
  const fetchProfile = () => {
    axios.get("http://localhost:8080/api/owner/profile", {
        headers: { Authorization: `Bearer ${keycloak.token}` },
      }).then((res) => {
        setOwnerProfile(res.data);
        setFormData({ 
            numTele: res.data.numTele || "", 
            nomComplexe: res.data.nomComplexe || "",
            photoProfil: res.data.photoProfil || "" 
        });
      }).catch((err) => console.error(err));
  };

  const fetchTerrains = () => {
    axios.get("http://localhost:8080/api/terrains/mes-terrains", {
        headers: { Authorization: `Bearer ${keycloak.token}` },
    }).then((res) => setTerrains(res.data))
      .catch((err) => console.error(err));
  };

  // --- NOUVEAU : Récupérer les réservations ---
  const fetchReservations = () => {
    axios.get("http://localhost:8080/api/reservations/owner", {
        headers: { Authorization: `Bearer ${keycloak.token}` },
    }).then((res) => setReservations(res.data))
      .catch((err) => console.error("Erreur loading reservations", err));
  };

  // --- HANDLERS ---
  const handleProfileChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleTerrainChange = (e) => setTerrainForm({ ...terrainForm, [e.target.name]: e.target.value });

  const saveProfile = () => {
    axios.put("http://localhost:8080/api/owner/profile", formData, { 
        headers: { Authorization: `Bearer ${keycloak.token}` } 
    }).then((res) => {
        setOwnerProfile(res.data);
        setMessage("✅ Profil mis à jour !");
        setTimeout(() => setMessage(""), 3000);
    });
  };

  const handleSubmitTerrain = () => {
    const payload = { ...terrainForm, prixHeure: parseFloat(terrainForm.prixHeure) };
    const config = { headers: { Authorization: `Bearer ${keycloak.token}` } };

    if (editId) {
        axios.put(`http://localhost:8080/api/terrains/${editId}`, payload, config)
            .then((res) => {
                const updatedTerrains = terrains.map(t => t.id === editId ? res.data : t);
                setTerrains(updatedTerrains);
                resetForm();
                setMessage("✅ Terrain modifié !");
            }).catch(err => console.error(err));
    } else {
        axios.post("http://localhost:8080/api/terrains", payload, config)
            .then((res) => {
                setTerrains([...terrains, res.data]);
                resetForm();
                setMessage("✅ Terrain ajouté !");
            }).catch(err => console.error(err));
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const startEdit = (terrain) => {
    setEditId(terrain.id);
    setTerrainForm({
        nom: terrain.nom, type: terrain.type, prixHeure: terrain.prixHeure,
        adresse: terrain.adresse || "", photoUrl: terrain.photoUrl || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditId(null);
    setTerrainForm({ nom: "", type: "5x5", prixHeure: "", adresse: "", photoUrl: "" });
  };

  const deleteTerrain = (id) => {
    if(!window.confirm("Supprimer ce terrain ?")) return;
    axios.delete(`http://localhost:8080/api/terrains/${id}`, {
        headers: { Authorization: `Bearer ${keycloak.token}` }
    }).then(() => setTerrains(terrains.filter(t => t.id !== id)));
  };

  if (!isAuthenticated) return <div className="owner-login-container"><button className="btn-primary" onClick={() => keycloak.login()}>Se connecter</button></div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>⚽ ReservationTerrain <span style={{fontSize:'0.8em', color:'#888'}}>/ Propriétaire</span></h1>
        <button className="btn-logout" onClick={() => keycloak.logout()}>Se déconnecter</button>
      </header>

      <div className="dashboard-content">
        {message && <div style={{gridColumn: "1 / -1"}} className="success-message">{message}</div>}

        {/* --- 1. PROFIL --- */}
        <div className="card">
            <div className="profile-header">
                {ownerProfile?.photoProfil ? (
                    <img src={ownerProfile.photoProfil} alt="Profil" className="avatar-img" />
                ) : (
                    <div className="avatar">{ownerProfile?.prenom?.charAt(0)}</div>
                )}
                <h3>{ownerProfile?.prenom} {ownerProfile?.nom}</h3>
            </div>
            <div className="form-group"><label>Photo (URL)</label><input className="form-input" type="text" name="photoProfil" value={formData.photoProfil} onChange={handleProfileChange} /></div>
            <div className="form-group"><label>Nom du Complexe</label><input className="form-input" type="text" name="nomComplexe" value={formData.nomComplexe} onChange={handleProfileChange} /></div>
            <div className="form-group"><label>Téléphone</label><input className="form-input" type="text" name="numTele" value={formData.numTele} onChange={handleProfileChange} /></div>
            <button className="btn-primary" onClick={saveProfile}>Mettre à jour Profil</button>
        </div>

        {/* --- 2. GESTION TERRAIN --- */}
        <div className="card" style={{border: editId ? "2px solid #f39c12" : "none"}}>
            <h2 style={{color: editId ? "#f39c12" : "inherit"}}>{editId ? "✏️ Modifier Terrain" : "➕ Ajouter Terrain"}</h2>
            <div className="form-group"><label>Nom</label><input className="form-input" type="text" name="nom" value={terrainForm.nom} onChange={handleTerrainChange} /></div>
            <div className="form-group"><label>Photo (URL)</label><input className="form-input" type="text" name="photoUrl" value={terrainForm.photoUrl} onChange={handleTerrainChange} /></div>
            <div className="form-row">
                <div className="form-group" style={{flex:1}}><label>Type</label><select className="form-input" name="type" value={terrainForm.type} onChange={handleTerrainChange}><option value="5x5">5 vs 5</option><option value="7x7">7 vs 7</option></select></div>
                <div className="form-group" style={{flex:1}}><label>Prix (DH)</label><input className="form-input" type="number" name="prixHeure" value={terrainForm.prixHeure} onChange={handleTerrainChange} /></div>
            </div>
            <div className="form-group"><label>Adresse</label><input className="form-input" type="text" name="adresse" value={terrainForm.adresse} onChange={handleTerrainChange} /></div>
            <div style={{display:'flex', gap:'10px'}}>
                <button className="btn-primary" style={{backgroundColor: editId ? "#f39c12" : "#3498db", flex: 1}} onClick={handleSubmitTerrain}>{editId ? "Mettre à jour" : "Ajouter"}</button>
                {editId && <button className="btn-primary" style={{backgroundColor: "#95a5a6", width: "auto"}} onClick={resetForm}>Annuler</button>}
            </div>
        </div>

        {/* --- 3. LISTE DES TERRAINS --- */}
        <div className="terrain-section">
            <h2 style={{marginBottom: '1rem'}}>📋 Mes Terrains ({terrains.length})</h2>
            <div className="terrain-grid">
                {terrains.map((terrain) => (
                    <div key={terrain.id} className="terrain-card">
                        {terrain.photoUrl ? <img src={terrain.photoUrl} className="terrain-img" alt={terrain.nom} /> : <div className="no-image">⚽</div>}
                        <div className="terrain-header"><h4>{terrain.nom}</h4><span className="badge-type">{terrain.type}</span></div>
                        <div className="terrain-price">{terrain.prixHeure} DH</div>
                        <div style={{display:'flex', gap:'10px', marginTop:'auto'}}>
                            <button className="btn-delete" style={{backgroundColor: "#f39c12"}} onClick={() => startEdit(terrain)}>Modifier</button>
                            <button className="btn-delete" onClick={() => deleteTerrain(terrain.id)}>Supprimer</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* --- 4. PLANNING RESERVATIONS (NOUVEAU) --- */}
        <div className="card" style={{gridColumn: "1 / -1", marginTop: "20px"}}>
            <h2>📅 Planning des Réservations</h2>
            {reservations.length === 0 ? (
                <p style={{color: "#888", fontStyle: "italic", marginTop:"10px"}}>Aucune réservation pour le moment.</p>
            ) : (
                <div style={{overflowX: "auto"}}>
                    <table style={{width: "100%", borderCollapse: "collapse", marginTop: "15px"}}>
                        <thead>
                            <tr style={{backgroundColor: "#f8f9fa", textAlign: "left", borderBottom: "2px solid #ddd"}}>
                                <th style={{padding: "12px"}}>Terrain</th>
                                <th style={{padding: "12px"}}>Date</th>
                                <th style={{padding: "12px"}}>Heure</th>
                                <th style={{padding: "12px"}}>Client</th>
                                <th style={{padding: "12px"}}>Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((res) => (
                                <tr key={res.id} style={{borderBottom: "1px solid #eee"}}>
                                    <td style={{padding: "12px", fontWeight: "bold"}}>{res.terrain?.nom}</td>
                                    <td style={{padding: "12px"}}>{res.dateHeureDebut?.split('T')[0]}</td>
                                    <td style={{padding: "12px"}}>
                                        {res.dateHeureDebut?.split('T')[1]?.slice(0,5)} - {res.dateHeureFin?.split('T')[1]?.slice(0,5)}
                                    </td>
                                    <td style={{padding: "12px"}}>
                                        {res.client ? `${res.client.nom} ${res.client.prenom || ''}` : "Client Inconnu"}
                                    </td>
                                    <td style={{padding: "12px"}}>
                                        <span style={{
                                            backgroundColor: res.statut === 'CONFIRMEE' ? '#d4edda' : '#fff3cd',
                                            color: res.statut === 'CONFIRMEE' ? '#155724' : '#856404',
                                            padding: "4px 8px", borderRadius: "4px", fontSize: "0.85rem", fontWeight: "bold"
                                        }}>
                                            {res.statut}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default OwnerDashboard;