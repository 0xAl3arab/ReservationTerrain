import React, { useState } from 'react';

const CreateOwnerModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        numTele: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem("admin_access_token");
            const response = await fetch('http://localhost:8080/api/owners/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to create owner');
            }

            const newOwner = await response.json();
            onSuccess(newOwner);
            onClose();
        } catch (err) {
            console.error("Error creating owner:", err);
            setError(err.message || "Failed to create owner. Email might be taken.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Create New Owner</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">First Name</label>
                            <input
                                type="text"
                                name="prenom"
                                value={formData.prenom}
                                onChange={handleChange}
                                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 text-white focus:border-[#0B2CFF] outline-none transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Last Name</label>
                            <input
                                type="text"
                                name="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 text-white focus:border-[#0B2CFF] outline-none transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 text-white focus:border-[#0B2CFF] outline-none transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                        <input
                            type="tel"
                            name="numTele"
                            value={formData.numTele}
                            onChange={handleChange}
                            className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 text-white focus:border-[#0B2CFF] outline-none transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 text-white focus:border-[#0B2CFF] outline-none transition-colors"
                            required
                            minLength={6}
                        />
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
                            {loading ? 'Creating...' : 'Create Owner'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateOwnerModal;
