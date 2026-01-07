import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const RulesPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-grow container mx-auto px-4 py-12">
                <div className="bg-white rounded-2xl shadow-sm p-8 max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-[#0B2CFF] mb-6">Règlement et Conditions</h1>

                    <div className="space-y-6 text-gray-600">
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Réservations</h2>
                            <p>
                                Toute réservation effectuée sur la plateforme WePlay est ferme et définitive.
                                Les utilisateurs s'engagent à respecter les horaires réservés.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Annulations</h2>
                            <p>
                                L'annulation est possible jusqu'à 3 heures avant le début de la séance.
                                Passé ce délai, aucun remboursement ne sera effectué.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Comportement</h2>
                            <p>
                                Les utilisateurs doivent respecter le matériel et les installations des complexes partenaires.
                                Tout comportement inapproprié pourra entraîner la suspension du compte.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Paiement</h2>
                            <p>
                                Le paiement s'effectue sur place ou en ligne selon les conditions du complexe.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default RulesPage;
