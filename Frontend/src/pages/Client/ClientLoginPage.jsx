import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ClientLoginPage() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Call backend login endpoint
            const res = await fetch("http://localhost:8080/auth/client/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `Erreur ${res.status}`);
            }

            const data = await res.json();

            // Save tokens to localStorage
            if (data.access_token) {
                localStorage.setItem("kc_access_token", data.access_token);
                localStorage.setItem("kc_refresh_token", data.refresh_token);
            }

            // Redirect to home
            setTimeout(() => {
                navigate("/");
            }, 500);
        } catch (err) {
            console.error("Login error:", err);
            if (err.message.includes("401") || err.message.includes("403")) {
                setError("Email ou mot de passe incorrect.");
            } else {
                setError("Impossible de se connecter. Veuillez vérifier votre connexion.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0B2CFF] to-[#001B87] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-extrabold text-white tracking-tighter mb-2">WePlay</h1>
                    <p className="text-blue-200 text-lg">Réserve ton terrain en un clic</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Connexion Client</h2>
                    <p className="text-gray-500 mb-6">Connectez-vous pour accéder à votre compte</p>

                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Email
                            </label>
                            <input
                                name="email"
                                type="email"
                                placeholder="jean.dupont@example.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0B2CFF] focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Mot de passe
                            </label>
                            <input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0B2CFF] focus:border-transparent transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#0B2CFF] text-white font-semibold px-6 py-4 rounded-xl hover:bg-[#001B87] transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Connexion en cours...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    <span>Se connecter</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600 text-sm">
                            Pas encore de compte?{" "}
                            <button
                                onClick={() => navigate("/signup")}
                                className="text-[#0B2CFF] font-semibold hover:underline"
                            >
                                S'inscrire
                            </button>
                        </p>
                    </div>

                    <div className="mt-4 text-center">
                        <button
                            onClick={() => navigate("/")}
                            className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
                        >
                            ← Retour à l'accueil
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClientLoginPage;
