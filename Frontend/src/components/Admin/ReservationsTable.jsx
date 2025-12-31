import React, { useState, useEffect } from 'react';

const ReservationsTable = ({ reservations, loading, onAction, onSelectionChange }) => {
    const [selectedIds, setSelectedIds] = useState([]);

    // Reset selection when reservations change
    useEffect(() => {
        setSelectedIds([]);
        if (onSelectionChange) onSelectionChange([]);
    }, [reservations, onSelectionChange]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = reservations.map(r => r.id);
            setSelectedIds(allIds);
            if (onSelectionChange) onSelectionChange(allIds);
        } else {
            setSelectedIds([]);
            if (onSelectionChange) onSelectionChange([]);
        }
    };

    const handleSelectOne = (id) => {
        let newSelected;
        if (selectedIds.includes(id)) {
            newSelected = selectedIds.filter(sid => sid !== id);
        } else {
            newSelected = [...selectedIds, id];
        }
        setSelectedIds(newSelected);
        if (onSelectionChange) onSelectionChange(newSelected);
    };

    return (
        <div className="bg-[#141414] border border-[#222] rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/5">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#1a1a1a] text-gray-400 text-[11px] uppercase tracking-wider font-semibold border-b border-[#222]">
                        <tr>
                            <th className="px-6 py-4 w-10">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-600 bg-[#222] text-[#0B2CFF] focus:ring-[#0B2CFF]"
                                    onChange={handleSelectAll}
                                    checked={reservations.length > 0 && selectedIds.length === reservations.length}
                                />
                            </th>
                            <th className="px-6 py-4">Date & Time</th>
                            <th className="px-6 py-4">Complex</th>
                            <th className="px-6 py-4">Terrain</th>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222]">
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-32 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0B2CFF] mb-4"></div>
                                        <p className="text-gray-500 text-sm animate-pulse">Loading reservations...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : reservations.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-32 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="bg-[#1a1a1a] p-4 rounded-full mb-4">
                                            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        </div>
                                        <p className="text-gray-400 font-medium">No reservations found</p>
                                        <p className="text-gray-600 text-xs mt-1">Try adjusting your filters</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            reservations.map((res) => (
                                <tr key={res.id} className={`hover:bg-[#1a1a1a] transition-colors group ${selectedIds.includes(res.id) ? 'bg-[#1a1a1a]' : ''}`}>
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-600 bg-[#222] text-[#0B2CFF] focus:ring-[#0B2CFF]"
                                            checked={selectedIds.includes(res.id)}
                                            onChange={() => handleSelectOne(res.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-white text-sm">{res.date}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">{res.heureDebut} - {res.heureFin} <span className="text-gray-600">({res.duree}m)</span></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-300 text-sm font-medium">{res.complexNom || "N/A"}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-white font-medium text-sm">{res.terrainNom}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0B2CFF] to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                                                {res.clientNom ? res.clientNom.charAt(0) : '?'}
                                            </div>
                                            <div>
                                                <div className="text-white text-sm font-medium">{res.clientNom}</div>
                                                <div className="text-xs text-gray-500">{res.clientEmail ? `(${res.clientEmail})` : ""}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${res.status === 'CONFIRMEE' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                            res.status === 'ANNULEE' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                res.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${res.status === 'CONFIRMEE' ? 'bg-green-400' :
                                                res.status === 'ANNULEE' ? 'bg-red-400' :
                                                    res.status === 'COMPLETED' ? 'bg-blue-400' :
                                                        'bg-yellow-400'
                                                }`}></span>
                                            {res.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onAction('edit', res)}
                                                className="text-gray-500 hover:text-blue-400 transition-colors p-2 hover:bg-[#222] rounded-lg"
                                                title="Edit"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                            </button>
                                            <button
                                                onClick={() => onAction('cancel', res)}
                                                className="text-gray-500 hover:text-red-400 transition-colors p-2 hover:bg-[#222] rounded-lg"
                                                title="Delete"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination (Mock UI) */}
            <div className="bg-[#1a1a1a] px-6 py-4 border-t border-[#222] flex items-center justify-between">
                <div className="text-xs text-gray-500">
                    Showing <span className="font-bold text-white">1</span> to <span className="font-bold text-white">{reservations.length}</span> of <span className="font-bold text-white">{reservations.length}</span> results
                </div>
                <div className="flex gap-2">
                    <button disabled className="px-3 py-1 bg-[#222] text-gray-500 rounded text-xs font-bold cursor-not-allowed">Previous</button>
                    <button disabled className="px-3 py-1 bg-[#222] text-gray-500 rounded text-xs font-bold cursor-not-allowed">Next</button>
                </div>
            </div>
        </div>
    );
};

export default ReservationsTable;
