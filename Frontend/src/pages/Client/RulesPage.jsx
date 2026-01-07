import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const RulesPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            <div className="flex-grow container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                            Règlement et <span className="text-[#0B2CFF]">Conditions</span>
                        </h1>
                        <p className="text-gray-500 text-lg">
                            Veuillez lire attentivement les règles d'utilisation de notre plateforme.
                        </p>
                    </div>

                    <div className="grid gap-6">
                        {/* Section 1: Réservations */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 bg-blue-50 rounded-xl p-3 mr-6">
                                    <svg className="w-8 h-8 text-[#0B2CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-3">1. Réservations</h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        Toute réservation effectuée sur la plateforme WePlay est ferme et définitive.
                                        Les utilisateurs s'engagent à respecter les horaires réservés.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Annulations */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 bg-red-50 rounded-xl p-3 mr-6">
                                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-3">2. Annulations</h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        L'annulation est possible jusqu'à 3 heures avant le début de la séance.
                                        Passé ce délai, aucun remboursement ne sera effectué.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Comportement */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 bg-yellow-50 rounded-xl p-3 mr-6">
                                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-3">3. Comportement</h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        Les utilisateurs doivent respecter le matériel et les installations des complexes partenaires.
                                        Tout comportement inapproprié pourra entraîner la suspension du compte.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Paiement */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 bg-green-50 rounded-xl p-3 mr-6">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-3">4. Paiement</h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        Le paiement s'effectue sur place ou en ligne selon les conditions du complexe.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default RulesPage;
