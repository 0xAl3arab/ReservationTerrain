import React, { useState, useEffect } from 'react';

const EditReservationModal = ({ isOpen, onClose, reservation, onUpdate }) => {
    const [formData, setFormData] = useState({
        date: '',
        heureDebut: '',
        heureFin: '',
        status: '',
        terrainId: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [terrains, setTerrains] = useState([]);

    useEffect(() => {
        if (reservation) {
            setFormData({
                date: reservation.date,
                heureDebut: reservation.heureDebut,
                heureFin: reservation.heureFin,
                status: reservation.status,
                terrainId: reservation.terrainId
            });
            // Fetch terrains for the complex to allow switching terrain
            // For now, we'll just keep the current terrain or fetch if needed
            // Assuming we might want to change terrain within the same complex
        }
    }, [reservation]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem("admin_access_token");
            const response = await fetch(`http://localhost:8080/api/reservations/${reservation.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    heureDebut: formData.heureDebut.length === 5 ? formData.heureDebut + ':00' : formData.heureDebut,
                    heureFin: formData.heureFin.length === 5 ? formData.heureFin + ':00' : formData.heureFin
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to update reservation');
            }

            const updatedReservation = await response.json();
            onUpdate(updatedReservation);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !reservation) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-[#141414] border border-[#333] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                <div className="bg-[#1a1a1a] px-6 py-4 border-b border-[#333] flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Edit Reservation</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 text-white focus:border-[#0B2CFF] outline-none transition-colors"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Start Time</label>
                            <input
                                type="time"
                                name="heureDebut"
                                value={formData.heureDebut}
                                onChange={handleChange}
                                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 text-white focus:border-[#0B2CFF] outline-none transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">End Time</label>
                            <input
                                type="time"
                                name="heureFin"
                                value={formData.heureFin}
                                onChange={handleChange}
                                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 text-white focus:border-[#0B2CFF] outline-none transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 text-white focus:border-[#0B2CFF] outline-none transition-colors"
                        >
                            <option value="CONFIRMEE">Confirmed</option>
                            <option value="PENDING">Pending</option>
                            <option value="ANNULEE">Cancelled</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-[#222] text-white font-bold rounded-lg hover:bg-[#333] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-[#0B2CFF] text-white font-bold rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditReservationModal;
