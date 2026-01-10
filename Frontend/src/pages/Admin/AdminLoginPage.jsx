import { useState } from "react";
import { useNavigate } from "react-router-dom";
import messiImage from "../../assets/messi.jpg";

function AdminLoginPage() {
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
            const res = await fetch("http://localhost:8080/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `Erreur ${res.status}`);
            }

            const data = await res.json();

            if (data.access_token) {
                localStorage.setItem("admin_access_token", data.access_token);
                localStorage.setItem("admin_refresh_token", data.refresh_token);
            }

            setTimeout(() => {
                navigate("/admin/dashboard");
            }, 500);
        } catch (err) {
            console.error("Admin Login error:", err);
            setError("Email ou mot de passe incorrect.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-sans relative overflow-hidden">
            {/* Messi Background Image - Blended */}
            <div className="absolute top-0 right-0 w-[60%] h-full pointer-events-none z-0">
                <div className="relative w-full h-full">
                    <img
                        src={messiImage}
                        alt="Background"
                        className="absolute top-0 right-0 h-full w-auto object-cover opacity-30"
                    />
                    {/* Gradient overlays to blend with background */}
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#0a0a0a]/60 to-[#0a0a0a]"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/40 via-transparent to-[#0a0a0a]/80"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
                </div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo/Brand */}
                <div className="text-center mb-10">
                    <h1 className="text-6xl font-black text-white tracking-tighter mb-2">
                        WEPLAY<span className="text-[#0B2CFF]">.</span>
                    </h1>
                    <p className="text-gray-400 text-sm uppercase tracking-[0.2em] font-medium">Administration Portal</p>
                </div>

                {/* Login Card */}
                <div className="bg-[#141414] border border-[#222] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-10 backdrop-blur-xl">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                        <p className="text-gray-500">Enter your credentials to access the dashboard.</p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                                Email Address
                            </label>
                            <input
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="admin@weplay.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full bg-[#1a1a1a] border border-[#333] rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0B2CFF] focus:border-transparent transition-all duration-300"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-2xl px-5 py-4 pr-12 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0B2CFF] focus:border-transparent transition-all duration-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none"
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
                            className="w-full bg-white text-black font-bold px-6 py-4 rounded-2xl hover:bg-[#0B2CFF] hover:text-white transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-8 group"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                                    <span>Authenticating...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-[#222] text-center">
                        <button
                            onClick={() => navigate("/")}
                            className="text-gray-500 text-xs hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Website
                        </button>
                    </div>
                </div>

                <p className="text-center mt-8 text-gray-600 text-[10px] uppercase tracking-widest">
                    &copy; 2025 WePlay Sports Management. All rights reserved.
                </p>
            </div>
        </div>
    );
}

export default AdminLoginPage;
