import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function ClientProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    // Profile form state
    const [profileForm, setProfileForm] = useState({
        prenom: "",
        nom: "",
        email: "",
        numTele: ""
    });

    // Password form state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Load profile data on mount
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("kc_access_token");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const res = await fetch("http://localhost:8080/client/profile", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error(`Erreur ${res.status}`);
            }

            const data = await res.json();
            setProfile(data);
            setProfileForm({
                prenom: data.prenom || "",
                nom: data.nom || "",
                email: data.email || "",
                numTele: data.numTele || ""
            });
        } catch (err) {
            console.error(err);
            if (err.message.includes("401")) {
                // Clear invalid tokens
                localStorage.removeItem("kc_access_token");
                localStorage.removeItem("kc_refresh_token");

                setError("Votre session a expiré. Redirection vers la page de connexion...");
                // Auto-redirect to login after showing the message
                setTimeout(() => navigate("/login"), 1500);
            } else {
                setError("Impossible de charger le profil. Veuillez réessayer plus tard.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleProfileChange = (e) => {
        setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const token = localStorage.getItem("kc_access_token");
            const res = await fetch("http://localhost:8080/client/profile", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(profileForm)
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `Erreur ${res.status}`);
            }

            const data = await res.json();
            setProfile(data);
            setSuccess("Profil mis à jour avec succès!");

            // Page reload removed to prevent session issues. Local state is already updated.
            // setTimeout(() => {
            //     window.location.reload();
            // }, 1000);
        } catch (err) {
            console.error(err);
            if (err.message.includes("401")) {
                // Clear invalid tokens
                localStorage.removeItem("kc_access_token");
                localStorage.removeItem("kc_refresh_token");

                setError("Session expirée. Redirection vers la page de connexion...");
                setTimeout(() => navigate("/login"), 1500);
            } else if (err.message.includes("Email déjà utilisé")) {
                setError("Cet email est déjà utilisé par un autre compte.");
            } else {
                setError("Une erreur est survenue lors de la mise à jour. Veuillez réessayer.");
            }
        } finally {
            setProfileLoading(false);
            setIsEditing(false);
        }
    };

    const toggleEdit = () => {
        if (isEditing) {
            // Cancel edit: reset form
            if (profile) {
                setProfileForm({
                    prenom: profile.prenom || "",
                    nom: profile.nom || "",
                    email: profile.email || "",
                    numTele: profile.numTele || ""
                });
            }
        }
        setIsEditing(!isEditing);
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordLoading(true);
        setError(null);
        setSuccess(null);

        // Validate passwords match
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            setPasswordLoading(false);
            return;
        }

        // Validate password length
        if (passwordForm.newPassword.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères");
            setPasswordLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem("kc_access_token");
            const res = await fetch("http://localhost:8080/client/password", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword
                })
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `Erreur ${res.status}`);
            }

            setSuccess("Mot de passe changé avec succès!");
            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        } catch (err) {
            console.error(err);
            if (err.message.includes("401")) {
                // Clear invalid tokens
                localStorage.removeItem("kc_access_token");
                localStorage.removeItem("kc_refresh_token");

                setError("Session expirée. Redirection vers la page de connexion...");
                setTimeout(() => navigate("/login"), 1500);
            } else {
                setError("Erreur lors du changement de mot de passe. Vérifiez votre mot de passe actuel.");
            }
        } finally {
            setPasswordLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B2CFF]"></div>
            </div>
        );
    }

    // Prepare user object for Navbar
    const navbarUser = profile ? {
        firstName: profile.prenom,
        lastName: profile.nom,
        email: profile.email
    } : null;

    const handleLogout = () => {
        localStorage.removeItem("kc_access_token");
        localStorage.removeItem("kc_refresh_token");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar user={navbarUser} onLogout={handleLogout} />

            {/* Header */}
            <div className="bg-gradient-to-br from-[#0B2CFF] to-[#001B87] text-white py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <button
                        onClick={() => navigate("/")}
                        className="text-white/80 hover:text-white mb-4 flex items-center gap-2 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Retour
                    </button>
                    <h1 className="text-4xl font-extrabold mb-2">Paramètres du profil</h1>
                    <p className="text-blue-200">Gérez vos informations personnelles et votre sécurité</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Success/Error Messages */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                        <p className="text-sm font-medium">{success}</p>
                    </div>
                )}

                {/* Profile Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#0B2CFF] to-[#001B87] text-white flex items-center justify-center font-bold text-2xl shadow-lg">
                            {profile?.prenom ? profile.prenom.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Informations personnelles</h2>
                            <p className="text-gray-500">Mettez à jour vos informations de profil</p>
                        </div>
                        <button
                            onClick={toggleEdit}
                            className={`ml-auto px-4 py-2 rounded-lg font-semibold transition-colors ${isEditing
                                ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                : "bg-[#0B2CFF] text-white hover:bg-[#001B87]"
                                }`}
                        >
                            {isEditing ? "Annuler" : "Modifier"}
                        </button>
                    </div>

                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    Prénom
                                </label>
                                <input
                                    type="text"
                                    name="prenom"
                                    value={profileForm.prenom}
                                    onChange={handleProfileChange}
                                    required
                                    disabled={!isEditing}
                                    className={`w-full border rounded-lg px-4 py-3 transition-all ${isEditing
                                        ? "bg-gray-50 border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0B2CFF] focus:border-transparent"
                                        : "bg-gray-100 border-transparent text-gray-600 cursor-not-allowed"
                                        }`}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    Nom
                                </label>
                                <input
                                    type="text"
                                    name="nom"
                                    value={profileForm.nom}
                                    onChange={handleProfileChange}
                                    required
                                    disabled={!isEditing}
                                    className={`w-full border rounded-lg px-4 py-3 transition-all ${isEditing
                                        ? "bg-gray-50 border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0B2CFF] focus:border-transparent"
                                        : "bg-gray-100 border-transparent text-gray-600 cursor-not-allowed"
                                        }`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={profileForm.email}
                                onChange={handleProfileChange}
                                required
                                disabled={!isEditing}
                                className={`w-full border rounded-lg px-4 py-3 transition-all ${isEditing
                                    ? "bg-gray-50 border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0B2CFF] focus:border-transparent"
                                    : "bg-gray-100 border-transparent text-gray-600 cursor-not-allowed"
                                    }`}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Téléphone
                            </label>
                            <input
                                type="tel"
                                name="numTele"
                                value={profileForm.numTele}
                                onChange={handleProfileChange}
                                disabled={!isEditing}
                                className={`w-full border rounded-lg px-4 py-3 transition-all ${isEditing
                                    ? "bg-gray-50 border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0B2CFF] focus:border-transparent"
                                    : "bg-gray-100 border-transparent text-gray-600 cursor-not-allowed"
                                    }`}
                            />
                        </div>

                        {isEditing && (
                            <button
                                type="submit"
                                disabled={profileLoading}
                                className="w-full bg-[#0B2CFF] text-white font-semibold px-6 py-4 rounded-xl hover:bg-[#001B87] transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {profileLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Enregistrement...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Enregistrer les modifications</span>
                                    </>
                                )}
                            </button>
                        )}
                    </form>
                </div>

                {/* Password Change */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <svg className="w-8 h-8 text-[#0B2CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Changer le mot de passe</h2>
                            <p className="text-gray-500">Assurez-vous d'utiliser un mot de passe sécurisé</p>
                        </div>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Mot de passe actuel
                            </label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordForm.currentPassword}
                                onChange={handlePasswordChange}
                                required
                                disabled={!isEditing}
                                className={`w-full border rounded-lg px-4 py-3 transition-all ${isEditing
                                    ? "bg-gray-50 border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0B2CFF] focus:border-transparent"
                                    : "bg-gray-100 border-transparent text-gray-600 cursor-not-allowed"
                                    }`}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Nouveau mot de passe
                            </label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordForm.newPassword}
                                onChange={handlePasswordChange}
                                required
                                minLength={6}
                                disabled={!isEditing}
                                className={`w-full border rounded-lg px-4 py-3 transition-all ${isEditing
                                    ? "bg-gray-50 border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0B2CFF] focus:border-transparent"
                                    : "bg-gray-100 border-transparent text-gray-600 cursor-not-allowed"
                                    }`}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Confirmer le nouveau mot de passe
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordForm.confirmPassword}
                                onChange={handlePasswordChange}
                                required
                                minLength={6}
                                disabled={!isEditing}
                                className={`w-full border rounded-lg px-4 py-3 transition-all ${isEditing
                                    ? "bg-gray-50 border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0B2CFF] focus:border-transparent"
                                    : "bg-gray-100 border-transparent text-gray-600 cursor-not-allowed"
                                    }`}
                            />
                        </div>

                        {isEditing && (
                            <button
                                type="submit"
                                disabled={passwordLoading}
                                className="w-full bg-red-600 text-white font-semibold px-6 py-4 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {passwordLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Changement en cours...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        <span>Changer le mot de passe</span>
                                    </>
                                )}
                            </button>
                        )}
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ClientProfilePage;
