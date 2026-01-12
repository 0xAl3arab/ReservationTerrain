import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const JoinUsPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            <div className="flex-grow container mx-auto px-4 py-16">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-5xl mx-auto border border-gray-100">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-[#0B2CFF] to-[#001B87] p-10 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-white/5 backdrop-blur-sm"></div>
                        <div className="relative z-10">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                                Rejoignez-nous
                            </h1>
                            <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                                Vous êtes propriétaire d'un complexe sportif ? Devenez partenaire de WePlay et augmentez votre visibilité.
                            </p>
                        </div>
                    </div>

                    <div className="p-10 md:p-14">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            {/* Benefits List */}
                            <div className="space-y-8">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                    <span className="bg-blue-100 text-[#0B2CFF] p-2 rounded-lg mr-3">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </span>
                                    Pourquoi nous rejoindre ?
                                </h2>
                                <ul className="space-y-4">
                                    {[
                                        { text: "Gestion simplifiée de vos réservations", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
                                        { text: "Visibilité accrue auprès des sportifs", icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" },
                                        { text: "Outils de statistiques et de reporting", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" },
                                        { text: "Support dédié 7j/7", icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" }
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-start p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors duration-300 group">
                                            <div className="flex-shrink-0 mr-4">
                                                <div className="w-10 h-10 rounded-full bg-white text-[#0B2CFF] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                                    </svg>
                                                </div>
                                            </div>
                                            <span className="text-gray-700 font-medium pt-2 group-hover:text-[#0B2CFF] transition-colors">{item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Call to Action Card */}
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl text-white shadow-2xl relative overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-[#0B2CFF] rounded-full opacity-20 blur-xl"></div>
                                <h3 className="text-2xl font-bold mb-4 relative z-10">Prêt à commencer ?</h3>
                                <p className="text-gray-300 mb-8 relative z-10">
                                    Rejoignez le réseau WePlay dès aujourd'hui et transformez la gestion de votre complexe.
                                </p>
                                <button
                                    onClick={() => window.open('https://wa.me/212700611644', '_blank')}
                                    className="w-full bg-[#0B2CFF] hover:bg-[#001B87] text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-blue-900/50 transition-all duration-300 flex items-center justify-center group relative z-10"
                                >
                                    <span>Devenir partenaire</span>
                                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default JoinUsPage;
