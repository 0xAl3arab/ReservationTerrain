import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import TerrainCard from '../../components/TerrainCard';
import ReservationModal from '../../components/ReservationModal';
import { complexeService } from '../../services/complexeService';
import { reservationService } from '../../services/reservationService';

const TerrainDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [complex, setComplex] = useState(null);
    const [terrains, setTerrains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [terrainAvailability, setTerrainAvailability] = useState({});
    const [user, setUser] = useState(null);

    // Reservation modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTerrain, setSelectedTerrain] = useState(null);

    useEffect(() => {
        loadUser();
        loadData();
    }, [id]);

    useEffect(() => {
        if (terrains.length > 0 && selectedDate) {
            checkAvailability();
        }
    }, [terrains, selectedDate]);

    const loadUser = () => {
        const token = localStorage.getItem('kc_access_token');
        if (token) {
            try {
                // Decode token to get user info
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser({
                    firstName: payload.given_name || 'User',
                    lastName: payload.family_name || '',
                    email: payload.email
                });
            } catch (error) {
                console.error('Error decoding token:', error);
                // Clear invalid data
                localStorage.removeItem('kc_access_token');
                localStorage.removeItem('kc_refresh_token');
                setUser(null);
            }
        } else {
            setUser(null);
        }
    };

    const loadData = async () => {
        setLoading(true);
        setError('');

        try {
            // Load complex details and terrains in parallel
            const [complexData, terrainsData] = await Promise.all([
                complexeService.getComplexeById(id),
                complexeService.getTerrainsByComplexe(id)
            ]);

            setComplex(complexData);
            setTerrains(terrainsData);
        } catch (err) {
            setError('Impossible de charger les informations du complexe');
            console.error('Error loading data:', err);
        } finally {
            setLoading(false);
        }
    };

    const checkAvailability = async () => {
        const availability = {};

        for (const terrain of terrains) {
            // 1. Check if terrain is open (status check)
            const status = terrain.status?.toLowerCase();
            const isStatusOpen = status === 'ouvert' || status === 'opened' || status === 'open';

            if (!isStatusOpen) {
                availability[terrain.id] = 'closed';
                continue;
            }

            // If no time selected, just show as available (since status is open)
            availability[terrain.id] = 'available';
        }

        setTerrainAvailability(availability);
    };

    const handleReserve = (terrain) => {
        // Check if user is logged in
        const token = localStorage.getItem('kc_access_token');
        if (!token) {
            // Redirect to login
            navigate('/login');
            return;
        }

        setSelectedTerrain(terrain);
        setIsModalOpen(true);
    };

    const handleReservationSuccess = () => {
        // Reload data to update availability
        loadData();
    };

    const handleLogout = () => {
        localStorage.removeItem('kc_access_token');
        localStorage.removeItem('kc_refresh_token');
        setUser(null);
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar user={user} onLogout={handleLogout} />
                <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0B2CFF] mx-auto mb-4"></div>
                        <p className="text-gray-600">Chargement...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar user={user} onLogout={handleLogout} />
                <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                    <div className="text-center">
                        <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-900 font-semibold mb-2">{error}</p>
                        <button
                            onClick={() => navigate('/')}
                            className="text-[#0B2CFF] hover:underline"
                        >
                            Retour à la liste des complexes
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // Calculate min price from terrains
    const minPrice = terrains.length > 0
        ? Math.min(...terrains.map(t => parseFloat(t.prixTerrain) || 0))
        : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} onLogout={handleLogout} />

            {/* Complex Header */}
            <div className="bg-gradient-to-r from-[#0B2CFF] to-[#001B87] text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <button
                            onClick={() => navigate('/')}
                            className="text-blue-200 hover:text-white flex items-center text-sm"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Retour aux complexes
                        </button>
                    </div>

                    {/* Complex Info */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">{complex?.nom}</h1>
                            <div className="flex flex-wrap gap-4 text-blue-100">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {complex?.ville}
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    {complex?.adress}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <div className="bg-white/10 backdrop-blur rounded-lg px-6 py-4">
                                <p className="text-blue-200 text-sm mb-1">À partir de</p>
                                <p className="text-3xl font-bold">{minPrice} MAD <span className="text-lg font-normal">/ heure</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Terrains Grid */}
                {terrains.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-gray-600 font-semibold">Aucun terrain disponible pour ce complexe</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Terrains disponibles ({terrains.length})
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {terrains.map(terrain => (
                                <TerrainCard
                                    key={terrain.id}
                                    terrain={terrain}
                                    selectedDate={selectedDate}
                                    selectedTime={null}
                                    availability={terrainAvailability[terrain.id] || 'available'}
                                    onReserve={handleReserve}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <Footer />

            {/* Reservation Modal */}
            <ReservationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                terrain={selectedTerrain}
                complex={complex}
                selectedDate={selectedDate}
                selectedTime={null}
                onSuccess={handleReservationSuccess}
            />
        </div>
    );
};

export default TerrainDetailsPage;
