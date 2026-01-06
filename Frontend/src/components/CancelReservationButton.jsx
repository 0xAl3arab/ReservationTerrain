import React, { useState, useEffect } from 'react';

const CancelReservationButton = ({ reservation, onCancelSuccess }) => {
    const [timeLeft, setTimeLeft] = useState(null);
    const [canCancel, setCanCancel] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            let reservationStart;

            // Handle array format [yyyy, MM, dd] and [HH, mm, ss] if necessary
            if (Array.isArray(reservation.date)) {
                const [year, month, day] = reservation.date;
                const [hour, minute] = Array.isArray(reservation.heureDebut) ? reservation.heureDebut : reservation.heureDebut.split(':');
                reservationStart = new Date(year, month - 1, day, hour, minute);
            } else {
                // Handle string format "yyyy-MM-dd" and "HH:mm:ss"
                reservationStart = new Date(`${reservation.date}T${reservation.heureDebut}`);
            }

            const now = new Date();
            const diff = reservationStart - now;

            // Debug log
            console.log(`Reservation ${reservation.id}: Start=${reservationStart}, Now=${now}, Diff=${diff / 1000 / 60 / 60}h`);

            // 3 hours in milliseconds
            const threeHoursMs = 3 * 60 * 60 * 1000;

            // Time until the cancellation deadline (Start Time - 3 hours)
            const timeUntilDeadline = diff - threeHoursMs;

            if (timeUntilDeadline > 0) {
                setCanCancel(true);

                // Format time left
                const hours = Math.floor(timeUntilDeadline / (1000 * 60 * 60));
                const minutes = Math.floor((timeUntilDeadline % (1000 * 60 * 60)) / (1000 * 60));

                setTimeLeft(`${hours}h ${minutes}m`);
            } else {
                setCanCancel(false);
                setTimeLeft(null);
            }
        };

        // Initial calculation
        calculateTimeLeft();

        // Update every minute
        const timer = setInterval(calculateTimeLeft, 60000);

        return () => clearInterval(timer);
    }, [reservation]);

    const handleCancel = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('kc_access_token');
            const response = await fetch(`http://localhost:8080/api/reservations/${reservation.id}/cancel`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Success
                setShowConfirm(false);
                if (onCancelSuccess) onCancelSuccess();
            } else {
                const errorData = await response.json();
                alert(`Erreur: ${errorData.message || "Impossible d'annuler la réservation"}`);
            }
        } catch (error) {
            console.error("Cancellation error:", error);
            alert("Une erreur est survenue lors de l'annulation.");
        } finally {
            setLoading(false);
        }
    };

    if (reservation.status === 'ANNULEE') {
        return (
            <button disabled className="text-gray-400 text-sm font-medium border border-gray-200 bg-gray-50 px-3 py-1 rounded-full cursor-not-allowed flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Annulée
            </button>
        );
    }

    if (!canCancel) {
        return (
            <button disabled className="text-gray-400 text-sm font-medium border border-gray-200 bg-gray-50 px-3 py-1 rounded-full cursor-not-allowed flex items-center gap-1" title="Annulation impossible moins de 3h avant">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Non annulable
            </button>
        );
    }

    return (
        <>
            <button
                onClick={() => setShowConfirm(true)}
                className="text-red-600 hover:text-red-800 text-sm font-medium border border-red-200 hover:border-red-400 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full transition-colors flex items-center gap-1"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Annuler ({timeLeft})
            </button>

            {showConfirm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in transform transition-all scale-100">
                        <div className="text-center mb-6">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmer l'annulation</h3>
                            <p className="text-gray-500">
                                Êtes-vous sûr de vouloir annuler cette réservation ?
                                <br />
                                <span className="text-sm text-red-500 font-medium mt-2 block">
                                    Cette action est irréversible.
                                </span>
                            </p>
                        </div>

                        <div className="flex justify-center space-x-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                disabled={loading}
                                className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                            >
                                Retour
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={loading}
                                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg shadow-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Annulation...</span>
                                    </>
                                ) : (
                                    <span>Confirmer l'annulation</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CancelReservationButton;
