import React, { useState, useEffect, useRef } from "react";
import marcusVideo from "../assets/marcus.mp4";

const Hero = ({ user }) => {
    const [textIndex, setTextIndex] = useState(0);
    const videoRef = useRef(null);
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

    // Skip last 4 seconds of video
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            // When video reaches 4 seconds before the end, restart it
            if (video.duration - video.currentTime <= 4) {
                video.currentTime = 0;
            }
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }, []);

    return (
        <section className="relative bg-gradient-to-br from-[#0B2CFF] to-[#001B87] text-white overflow-hidden">
            <div className="flex flex-col md:flex-row min-h-[600px] md:min-h-[700px] relative">
                {/* Left Side - Text Content */}
                <div className="w-full md:w-[55%] flex items-center justify-center px-4 sm:px-6 lg:px-12 py-16 md:py-20 relative z-10">
                    {/* Background Pattern/Glow */}
                    <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
                        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl mix-blend-overlay"></div>
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#001B87] rounded-full blur-3xl mix-blend-multiply"></div>
                    </div>

                    <div className="max-w-xl text-center md:text-left relative z-10">
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
                </div>

                {/* Diagonal Geometric Flags Divider */}
                <div className="absolute right-0 top-0 bottom-0 left-[45%] pointer-events-none z-5 hidden md:block overflow-hidden">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 700" preserveAspectRatio="none">
                        {/* Diagonal triangular flags pattern */}
                        <path d="M0 0 L100 350 L0 700 Z" fill="#0B2CFF" opacity="0.15" transform="rotate(-15 100 350)" />
                        <path d="M40 0 L140 350 L40 700 Z" fill="#ffffff" opacity="0.1" transform="rotate(-15 100 350)" />
                        <path d="M80 0 L180 350 L80 700 Z" fill="#001B87" opacity="0.2" transform="rotate(-15 100 350)" />
                        <path d="M120 0 L220 350 L120 700 Z" fill="#0B2CFF" opacity="0.12" transform="rotate(-15 100 350)" />
                        <path d="M160 0 L260 350 L160 700 Z" fill="#ffffff" opacity="0.08" transform="rotate(-15 100 350)" />
                    </svg>
                </div>

                {/* Right Side - Full Video with Diagonal Edge */}
                <div className="w-full md:w-[55%] md:absolute md:right-0 md:top-0 md:bottom-0 relative overflow-hidden"
                    style={{ clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)' }}>
                    {/* Video Background */}
                    <video
                        ref={videoRef}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src={marcusVideo} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    {/* Gradient Overlay - Blends video with background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0B2CFF]/40 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30"></div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
