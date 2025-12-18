import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reservationService } from '../services/reservationService';

const ReservationModal = ({ isOpen, onClose, terrain, complex, selectedDate, selectedTime, onSuccess }) => {
    const navigate = useNavigate();
    const [date, setDate] = useState(selectedDate || new Date().toISOString().split('T')[0]);
    const [heureDebut, setHeureDebut] = useState('');
    const [heureFin, setHeureFin] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [existingReservations, setExistingReservations] = useState([]);
    const [fetchingReservations, setFetchingReservations] = useState(false);

    useEffect(() => {
        if (selectedDate) {
            setDate(selectedDate);
        }
    }, [selectedDate]);

    useEffect(() => {
        if (selectedTime && !fetchingReservations) {
            const hour = selectedTime.hour();
            if (!isSlotReserved(hour)) {
                setHeureDebut(selectedTime.format('HH:00'));
                // Default end time to 1 hour later, but check if it's valid
                const endHour = hour + 1;
                const nextRes = getNextReservationStart(hour);
                if (endHour <= nextRes) {
                    setHeureFin(`${String(endHour).padStart(2, '0')}:00`);
                } else {
                    setHeureFin('');
                }
            } else {
                setHeureDebut('');
                setHeureFin('');
                setError('Ce créneau est déjà réservé. Veuillez en choisir un autre.');
            }
        }
    }, [selectedTime, isOpen, fetchingReservations]);

    const getNextReservationStart = (startHour) => {
        let nextReservationStart = terrain.heureFermeture;
        existingReservations.forEach(res => {
            const resStart = parseInt(res.heureDebut.split(':')[0]);
            if (resStart > startHour && resStart < nextReservationStart) {
                nextReservationStart = resStart;
            }
        });
        return nextReservationStart;
    };

    useEffect(() => {
        if (!isOpen) {
            setError('');
            setExistingReservations([]);
        } else if (terrain && date) {
            fetchExistingReservations();
        }
    }, [isOpen, terrain, date]);

    const fetchExistingReservations = async () => {
        setFetchingReservations(true);
        try {
            const reservations = await reservationService.getTerrainReservations(terrain.id, date);
            setExistingReservations(reservations);
        } catch (err) {
            console.error('Error fetching reservations:', err);
        } finally {
            setFetchingReservations(false);
        }
    };

    if (!isOpen || !terrain) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Calculate duration
        const start = parseInt(heureDebut.split(':')[0]);
        const end = parseInt(heureFin.split(':')[0]);

        if (end <= start) {
            setError("L'heure de fin doit être après l'heure de début");
            return;
        }

        const duration = (end - start) * 60;

        // Navigate to payment page with reservation details
        navigate('/paiement', {
            state: {
                terrain,
                complex,
                date,
                heureDebut: heureDebut + ':00',
                heureFin: heureFin + ':00',
                duration
            }
        });

        onClose();
    };

    // Generate time options based on terrain opening hours
    const generateTimeOptions = () => {
        const options = [];
        for (let i = terrain.heureOuverture; i <= terrain.heureFermeture; i++) {
            options.push(`${String(i).padStart(2, '0')}:00`);
        }
        return options;
    };

    const isSlotReserved = (hour) => {
        return existingReservations.some(res => {
            const resStart = parseInt(res.heureDebut.split(':')[0]);
            const resEnd = parseInt(res.heureFin.split(':')[0]);
            return hour >= resStart && hour < resEnd;
        });
    };

    const getAvailableStartTimes = () => {
        const options = [];
        for (let i = terrain.heureOuverture; i < terrain.heureFermeture; i++) {
            if (!isSlotReserved(i)) {
                options.push(`${String(i).padStart(2, '0')}:00`);
            }
        }
        return options;
    };

    const getAvailableEndTimes = () => {
        if (!heureDebut) return [];
        const startHour = parseInt(heureDebut.split(':')[0]);
        const options = [];

        const nextReservationStart = getNextReservationStart(startHour);

        for (let i = startHour + 1; i <= nextReservationStart; i++) {
            options.push(`${String(i).padStart(2, '0')}:00`);
        }
        return options;
    };

    const startTimes = getAvailableStartTimes();
    const endTimes = getAvailableEndTimes();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#0B2CFF] to-[#001B87] p-6 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold mb-1">Réserver un terrain</h2>
                            <p className="text-blue-100 text-sm">{terrain.nom || `Terrain ${terrain.id}`}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Date */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Date de réservation
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2CFF] focus:border-transparent"
                            />
                        </div>

                        {/* Time Range */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Heure de début
                                </label>
                                <select
                                    value={heureDebut}
                                    onChange={(e) => {
                                        setHeureDebut(e.target.value);
                                        setHeureFin(''); // Reset end time when start changes
                                    }}
                                    required
                                    disabled={fetchingReservations}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2CFF] focus:border-transparent disabled:bg-gray-100"
                                >
                                    <option value="">{fetchingReservations ? 'Chargement...' : 'Choisir'}</option>
                                    {startTimes.map(time => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Heure de fin
                                </label>
                                <select
                                    value={heureFin}
                                    onChange={(e) => setHeureFin(e.target.value)}
                                    required
                                    disabled={!heureDebut || fetchingReservations}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2CFF] focus:border-transparent disabled:bg-gray-100"
                                >
                                    <option value="">Choisir</option>
                                    {endTimes.map(time => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-[#0B2CFF] mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="text-sm text-gray-700">
                                    <p className="font-semibold mb-1">Horaires d'ouverture</p>
                                    <p>{String(terrain.heureOuverture).padStart(2, '0')}:00 - {String(terrain.heureFermeture).padStart(2, '0')}:00</p>
                                    <p className="mt-2"><span className="font-semibold">Prix:</span> {terrain.prixTerrain} MAD/heure</p>
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-[#0B2CFF] text-white font-semibold rounded-lg hover:bg-[#001B87] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-200"
                            >
                                {loading ? 'Réservation...' : 'Confirmer'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReservationModal;
