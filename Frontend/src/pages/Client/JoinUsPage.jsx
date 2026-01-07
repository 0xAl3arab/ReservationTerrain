import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const JoinUsPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-grow container mx-auto px-4 py-12">
                <div className="bg-white rounded-2xl shadow-sm p-8 max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-[#0B2CFF] mb-6">Rejoignez-nous</h1>
                    <p className="text-gray-600 mb-4">
                        Vous êtes propriétaire d'un complexe sportif ? Devenez partenaire de WePlay et augmentez votre visibilité.
                    </p>
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Pourquoi nous rejoindre ?</h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li>Gestion simplifiée de vos réservations</li>
                            <li>Visibilité accrue auprès des sportifs</li>
                            <li>Outils de statistiques et de reporting</li>
                            <li>Support dédié 7j/7</li>
                        </ul>
                    </div>
                    <div className="mt-8 text-center">
                        <button className="bg-[#0B2CFF] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#001B87] transition-colors shadow-lg shadow-blue-200">
                            Devenir partenaire
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default JoinUsPage;
