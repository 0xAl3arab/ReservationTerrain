import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const HistoryPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateFilter, setDateFilter] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('kc_access_token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                // Fetch user profile
                const userResponse = await fetch('http://localhost:8080/client/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    // Map the response to match what Navbar expects (firstName, lastName, email)
                    // ClientResponseDTO has prenom, nom, email
                    setUser({
                        firstName: userData.prenom,
                        lastName: userData.nom,
                        email: userData.email
                    });
                } else {
                    localStorage.removeItem('kc_access_token');
                    localStorage.removeItem('kc_refresh_token');
                    navigate('/login');
                    return;
                }

                // Fetch reservations
                const reservationsResponse = await fetch('http://localhost:8080/api/my-reservations', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (reservationsResponse.ok) {
                    const reservationsData = await reservationsResponse.json();
                    // Sort by date descending (newest first)
                    reservationsData.sort((a, b) => new Date(b.date) - new Date(a.date));
                    setReservations(reservationsData);
                } else {
                    setError("Impossible de charger l'historique des réservations.");
                }

            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Une erreur est survenue lors du chargement des données.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('kc_access_token');
        localStorage.removeItem('kc_refresh_token');
        navigate('/');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'CONFIRMEE':
                return 'bg-green-100 text-green-800';
            case 'EN_ATTENTE':
                return 'bg-yellow-100 text-yellow-800';
            case 'ANNULEE':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'CONFIRMEE':
                return 'Confirmée';
            case 'EN_ATTENTE':
                return 'En attente';
            case 'ANNULEE':
                return 'Annulée';
            default:
                return status;
        }
    };

    const filteredReservations = dateFilter
        ? reservations.filter(res => res.date === dateFilter)
        : reservations;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B2CFF]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar user={user} onLogout={handleLogout} />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Historique des réservations</h1>
                            <p className="text-gray-500 mt-1">Retrouvez toutes vos réservations passées et à venir</p>
                        </div>

                        <div className="flex items-center space-x-2">
                            <label htmlFor="dateFilter" className="text-sm font-medium text-gray-700">Filtrer par date:</label>
                            <input
                                type="date"
                                id="dateFilter"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#0B2CFF] focus:border-[#0B2CFF] outline-none"
                            />
                            {dateFilter && (
                                <button
                                    onClick={() => setDateFilter('')}
                                    className="text-sm text-gray-500 hover:text-[#0B2CFF]"
                                >
                                    Effacer
                                </button>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-700 border-l-4 border-red-500 m-6">
                            {error}
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        {filteredReservations.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">Aucune réservation trouvée</h3>
                                <p className="mt-1 text-gray-500">Vous n'avez pas encore effectué de réservation ou aucune réservation ne correspond à votre filtre.</p>
                                <button
                                    onClick={() => navigate('/')}
                                    className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#0B2CFF] hover:bg-[#001B87] focus:outline-none"
                                >
                                    Réserver un terrain
                                </button>
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date & Heure
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Terrain / Complexe
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Prix
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Statut
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredReservations.map((reservation) => (
                                        <tr key={reservation.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {new Date(reservation.date).toLocaleDateString('fr-FR', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {reservation.heureDebut} - {reservation.heureFin}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{reservation.terrainNom}</div>
                                                <div className="text-sm text-gray-500">{reservation.complexNom}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900">{reservation.price} MAD</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                                                    {getStatusLabel(reservation.status)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default HistoryPage;
