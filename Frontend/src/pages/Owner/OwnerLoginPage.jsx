import { useState } from "react";
import { useNavigate } from "react-router-dom";

function OwnerLoginPage() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false); // État pour afficher/cacher
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            params.append('client_id', 'reservation-frontend');
            params.append('grant_type', 'password');
            params.append('username', form.email);
            params.append('password', form.password);

            const res = await fetch("http://localhost:8180/realms/reservation-realm/protocol/openid-connect/token", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: params,
            });

            if (!res.ok) throw new Error("Identifiants incorrects");

            const data = await res.json();
            localStorage.setItem("owner_token", data.access_token);

            setTimeout(() => {
                navigate("/owner/dashboard");
            }, 500);
        } catch (err) {
            setError("Email ou mot de passe incorrect.");
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
                    <p className="text-blue-200 text-lg italic">Espace Responsable</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Connexion Responsable</h2>
                    <p className="text-gray-500 mb-6">Accédez à la gestion de votre complexe</p>

                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Email Professionnel
                            </label>
                            <input
                                name="email"
                                type="email"
                                placeholder="owner@example.com"
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
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"} // Type dynamique
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0B2CFF] focus:border-transparent transition-all"
                                />
                                {/* Bouton pour afficher/cacher */}
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#0B2CFF] text-white font-semibold px-6 py-4 rounded-xl hover:bg-[#001B87] transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Connexion...</span>
                                </>
                            ) : (
                                <span>Se connecter</span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-gray-100 pt-6">
                        <button
                            onClick={() => navigate("/")}
                            className="text-gray-400 text-sm hover:text-gray-600 transition-colors"
                        >
                            ← Retour au site principal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OwnerLoginPage;