import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { reservationService } from '../../services/reservationService';

const PaiementPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { terrain, complex, date, heureDebut, heureFin, duration } = location.state || {};

    const [selectedPayment, setSelectedPayment] = useState('domicile');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    // Load user info
    React.useEffect(() => {
        loadUser();

        // Redirect if no reservation data
        if (!terrain || !complex || !date || !heureDebut || !heureFin) {
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

    // Calculate total price
    const calculatePrice = () => {
        if (!terrain || !duration) return 0;
        const hours = duration / 60;
        return (parseFloat(terrain.prixTerrain) * hours).toFixed(2);
    };

    const handleConfirm = async () => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('kc_access_token');
            if (!token) {
                navigate('/login');
                return;
            }

            // Create reservation
            const reservationData = {
                terrainId: terrain.id,
                date: date,
                heureDebut: heureDebut,
                heureFin: heureFin
            };

            const response = await reservationService.createReservation(reservationData, token);

            // Navigate to confirmation page with all details
            navigate('/confirmation', {
                state: {
                    reservation: response,
                    terrain,
                    complex,
                    date,
                    heureDebut,
                    heureFin,
                    paymentMethod: selectedPayment,
                    totalPrice: calculatePrice()
                }
            });

        } catch (err) {
            if (err.message === '401') {
                localStorage.removeItem('kc_access_token');
                localStorage.removeItem('kc_refresh_token');
                navigate('/login');
                return;
            }
            setError(err.message || 'Une erreur est survenue lors de la réservation');
        } finally {
            setLoading(false);
        }
    };

    if (!terrain || !complex) {
        return null;
    }

    const totalPrice = calculatePrice();

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} onLogout={handleLogout} />

            {/* Header */}
            <div className="bg-gradient-to-r from-[#0B2CFF] to-[#001B87] text-white py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold">Paiement</h1>
                    <p className="text-blue-100 mt-2">Finalisez votre réservation</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Payment Selection */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Mode de paiement</h2>

                            {/* Payment Options */}
                            <div className="space-y-4">
                                {/* Cash on Arrival */}
                                <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedPayment === 'domicile'
                                    ? 'border-[#0B2CFF] bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="domicile"
                                        checked={selectedPayment === 'domicile'}
                                        onChange={(e) => setSelectedPayment(e.target.value)}
                                        className="mt-1 w-5 h-5 text-[#0B2CFF] focus:ring-[#0B2CFF]"
                                    />
                                    <div className="ml-4 flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-gray-900">Paiement à domicile</span>
                                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Payez en espèces lors de votre arrivée au complexe
                                        </p>
                                    </div>
                                </label>

                                {/* Other payment methods (disabled for now) */}
                                <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg opacity-50 cursor-not-allowed">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="card"
                                        disabled
                                        className="mt-1 w-5 h-5"
                                    />
                                    <div className="ml-4 flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-gray-900">Carte bancaire</span>
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Bientôt disponible
                                        </p>
                                    </div>
                                </label>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-start">
                                        <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Reservation Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Récapitulatif</h3>

                            <div className="space-y-3 mb-6">
                                <div>
                                    <p className="text-sm text-gray-600">Complexe</p>
                                    <p className="font-semibold text-gray-900">{complex.nom}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600">Terrain</p>
                                    <p className="font-semibold text-gray-900">{terrain.nom || `Terrain ${terrain.id}`}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600">Date</p>
                                    <p className="font-semibold text-gray-900">
                                        {new Date(date).toLocaleDateString('fr-FR', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600">Horaire</p>
                                    <p className="font-semibold text-gray-900">
                                        {heureDebut} - {heureFin}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600">Durée</p>
                                    <p className="font-semibold text-gray-900">{duration} minutes</p>
                                </div>
                            </div>

                            <div className="border-t pt-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-[#0B2CFF]">{totalPrice} MAD</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleConfirm}
                                    disabled={loading}
                                    className="w-full py-3 px-4 bg-[#0B2CFF] text-white font-semibold rounded-lg hover:bg-[#001B87] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-200"
                                >
                                    {loading ? 'Confirmation...' : 'Confirmer la réservation'}
                                </button>

                                <button
                                    onClick={() => navigate(-1)}
                                    disabled={loading}
                                    className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Retour
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

export default PaiementPage;
