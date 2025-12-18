import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const ConfirmationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { reservation, terrain, complex, date, heureDebut, heureFin, paymentMethod, totalPrice } = location.state || {};

    const [user, setUser] = useState(null);

    useEffect(() => {
        loadUser();

        // Redirect if no reservation data
        if (!reservation || !terrain || !complex) {
            navigate('/');
        }
    }, []);

    const loadUser = () => {
        const token = localStorage.getItem('kc_access_token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser({
                    firstName: payload.given_name || 'User',
                    lastName: payload.family_name || '',
                    email: payload.email
                });
            } catch (error) {
                console.error('Error decoding token:', error);
                localStorage.removeItem('kc_access_token');
                localStorage.removeItem('kc_refresh_token');
                setUser(null);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('kc_access_token');
        localStorage.removeItem('kc_refresh_token');
        setUser(null);
        navigate('/login');
    };

    if (!reservation || !terrain || !complex) {
        return null;
    }

    const getPaymentMethodLabel = (method) => {
        switch (method) {
            case 'domicile':
                return 'Paiement à domicile';
            case 'card':
                return 'Carte bancaire';
            default:
                return method;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} onLogout={handleLogout} />

            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold mb-2">Votre réservation est faite avec succès</h1>
                    <p className="text-green-100 text-lg">Nous avons hâte de vous accueillir !</p>
                </div>
            </div>

            {/* Reservation Details */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#0B2CFF] to-[#001B87] px-6 py-4">
                        <h2 className="text-2xl font-bold text-white">Détails de la réservation</h2>
                        <p className="text-blue-100 text-sm mt-1">Référence: #{reservation.id}</p>
                    </div>

                    {/* Details Grid */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Complexe */}
                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                    <svg className="w-6 h-6 text-[#0B2CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Complexe</p>
                                    <p className="font-bold text-gray-900 text-lg">{complex.nom}</p>
                                    <p className="text-sm text-gray-600 mt-1">{complex.adress}, {complex.ville}</p>
                                </div>
                            </div>

                            {/* Terrain */}
                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Terrain</p>
                                    <p className="font-bold text-gray-900 text-lg">{terrain.nom || `Terrain ${terrain.id}`}</p>
                                    <p className="text-sm text-gray-600 mt-1">Type: Football</p>
                                </div>
                            </div>

                            {/* Date */}
                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Date</p>
                                    <p className="font-bold text-gray-900 text-lg">
                                        {new Date(date).toLocaleDateString('fr-FR', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Time */}
                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Horaire</p>
                                    <p className="font-bold text-gray-900 text-lg">{heureDebut} - {heureFin}</p>
                                    <p className="text-sm text-gray-600 mt-1">Durée: {reservation.duree} minutes</p>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Mode de paiement</p>
                                    <p className="font-bold text-gray-900 text-lg">{getPaymentMethodLabel(paymentMethod)}</p>
                                </div>
                            </div>

                            {/* Total Price */}
                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Montant total</p>
                                    <p className="font-bold text-[#0B2CFF] text-2xl">{totalPrice} MAD</p>
                                </div>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-[#0B2CFF] mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="text-sm text-gray-700">
                                    <p className="font-semibold mb-1">Informations importantes</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Veuillez arriver 10 minutes avant l'heure de début</li>
                                        <li>Présentez votre pièce d'identité à l'accueil</li>
                                        <li>Le paiement sera effectué à votre arrivée</li>
                                        <li>En cas d'annulation, contactez le complexe au moins 24h à l'avance</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-3 bg-[#0B2CFF] text-white font-semibold rounded-lg hover:bg-[#001B87] transition-colors shadow-md shadow-blue-200"
                    >
                        Retour à l'accueil
                    </button>
                    <button
                        onClick={() => navigate('/profile')}
                        className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Voir mon profil
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ConfirmationPage;
