import { useState } from "react";
import { useNavigate } from "react-router-dom";
import playerImage from "../../assets/player.png";

function ClientLoginPage() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
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
        <div className="min-h-screen bg-gradient-to-br from-[#0B2CFF] to-[#001B87] flex items-center justify-center p-4 overflow-hidden relative">
            {/* Decorative Geometric Flags */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <svg className="absolute top-[10%] left-[5%] w-24 h-24 text-white opacity-10 transform -rotate-12" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M0 0 L100 50 L0 100 Z" />
                </svg>
                <svg className="absolute top-[20%] right-[10%] w-32 h-32 text-blue-400 opacity-20 transform rotate-45" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M0 0 L100 50 L0 100 Z" />
                </svg>
                <svg className="absolute bottom-[30%] left-[15%] w-16 h-16 text-blue-300 opacity-15 transform rotate-12" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M0 0 L100 50 L0 100 Z" />
                </svg>
                <svg className="absolute bottom-[10%] right-[20%] w-40 h-40 text-white opacity-5 transform -rotate-45" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M0 0 L100 50 L0 100 Z" />
                </svg>
                <svg className="absolute top-[40%] left-[10%] w-12 h-12 text-white opacity-20 transform rotate-90" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M50 0 L100 100 L0 100 Z" />
                </svg>
                <svg className="absolute top-[15%] left-[40%] w-8 h-8 text-blue-200 opacity-30 transform rotate-180" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M50 0 L100 100 L0 100 Z" />
                </svg>
            </div>

            <div className="relative flex items-center justify-center z-10">
                <div className="w-full max-w-md z-10 relative">
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
                                    placeholder="exemple@email.com"
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
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 pr-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0B2CFF] focus:border-transparent transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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

                {/* Player Image */}
                <div className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 -translate-x-[25%] w-[500px] h-auto z-0 pointer-events-none">
                    <img
                        src={playerImage}
                        alt="Football Player"
                        className="w-full h-auto opacity-90 object-cover"
                    />
                </div>
            </div>

            {/* Background Wave */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <svg className="absolute bottom-0 left-0 w-full h-auto" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#001B87" fillOpacity="0.3" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320H0Z"></path>
                </svg>
            </div>
        </div>
    );
}

export default ClientLoginPage;
