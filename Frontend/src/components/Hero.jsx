import React, { useState, useEffect } from "react";

const Hero = ({ user }) => {
    const [textIndex, setTextIndex] = useState(0);
    const phrases = [
        "Tu veux réserver un terrain ? Fais‑le maintenant.",
        "Tu veux rejoindre une équipe ? Fais‑le maintenant.",
        "Tu veux organiser un match ? Fais‑le maintenant."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setTextIndex((prev) => (prev + 1) % phrases.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative bg-gradient-to-br from-[#0B2CFF] to-[#001B87] text-white overflow-hidden">
            {/* Background Pattern/Glow */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl mix-blend-overlay"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#001B87] rounded-full blur-3xl mix-blend-multiply"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10 flex flex-col md:flex-row items-center">
                {/* Left Content */}
                <div className="w-full md:w-1/2 text-center md:text-left mb-12 md:mb-0">
                    {user && (
                        <p className="text-blue-200 font-semibold mb-4 text-lg animate-fade-in">
                            Salut, {user.firstName} {user.lastName} ! Prêt à jouer ?
                        </p>
                    )}
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
                        Réserve ton stade <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                            en un clic.
                        </span>
                    </h1>

                    {/* Animated Text */}
                    <div className="h-8 mb-8">
                        <p className="text-lg md:text-xl text-blue-100 font-medium transition-all duration-500 transform translate-y-0 opacity-100">
                            {phrases[textIndex]}
                        </p>
                    </div>

                    <p className="text-blue-200 text-lg mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed">
                        Trouve les meilleurs terrains près de chez toi, invite tes amis et organise tes matchs sans prise de tête.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <a
                            href="#complexes"
                            className="bg-white text-[#0B2CFF] font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-blue-50 hover:scale-105 transition-all transform"
                        >
                            Réserver un terrain
                        </a>
                        <button className="bg-blue-600/50 backdrop-blur-sm border border-blue-400/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-blue-600/70 transition-all">
                            Rejoindre une équipe
                        </button>
                    </div>
                </div>

                {/* Right Visual */}
                <div className="w-full md:w-1/2 flex justify-center md:justify-end relative">
                    <div className="relative w-80 h-96 md:w-96 md:h-[450px] bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-all duration-500">
                        {/* Abstract Field Representation */}
                        <div className="absolute inset-4 border-2 border-white/30 rounded-2xl flex flex-col justify-between p-4">
                            <div className="w-full h-1/2 border-b-2 border-white/30 flex items-center justify-center">
                                <div className="w-16 h-16 border-2 border-white/30 rounded-full"></div>
                            </div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg shadow-white/50"></div>
                        </div>
                        <div className="absolute -bottom-6 -right-6 bg-white text-[#0B2CFF] px-6 py-3 rounded-xl font-bold shadow-xl">
                            5 vs 5
                        </div>
                        <div className="absolute -top-6 -left-6 bg-[#0B2CFF] text-white px-6 py-3 rounded-xl font-bold shadow-xl border border-white/20">
                            100% Fun
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
