import { useState } from "react";
import { useNavigate } from "react-router-dom";

function OwnerLoginPage() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
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
        <div className="min-h-screen bg-gradient-to-br from-[#0B2CFF] to-[#001B87] flex items-center justify-center p-6 font-sans">
            <div className="max-w-md w-full">
                {/* Logo Section */}
                <div className="text-center mb-10">
                    <h1 className="text-6xl font-black text-white italic tracking-tighter mb-2">WePlay</h1>
                    <div className="inline-block bg-white/10 backdrop-blur-md px-4 py-1 rounded-full border border-white/20">
                        <span className="text-white text-[10px] font-black uppercase tracking-widest">Espace Responsable</span>
                    </div>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-50 rounded-full opacity-50"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Connexion</h2>
                        <p className="text-gray-400 font-medium mb-8">Gérez votre complexe sportif en temps réel.</p>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold mb-6 border border-red-100 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Professionnel</label>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="responsable@weplay.com"
                                    className="w-full p-4 bg-gray-50 border-transparent border-2 rounded-2xl focus:bg-white focus:border-[#0B2CFF] transition-all outline-none font-medium text-gray-900"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mot de passe</label>
                                <div className="relative">
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full p-4 bg-gray-50 border-transparent border-2 rounded-2xl focus:bg-white focus:border-[#0B2CFF] transition-all outline-none font-medium text-gray-900"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0B2CFF] transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {showPassword ?
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /> :
                                                <>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </>
                                            }
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#0B2CFF] text-white font-black py-5 rounded-2xl hover:bg-[#001B87] transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                            >
                                {loading ? (
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    "Accéder au Dashboard"
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <button
                                onClick={() => navigate("/")}
                                className="text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-[#0B2CFF] transition-colors"
                            >
                                ← Retour au site client
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OwnerLoginPage;
