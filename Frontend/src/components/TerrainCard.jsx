import React, { useState } from 'react';
import defaultPhoto from '../assets/terrain.jpeg';

const TerrainCard = ({ terrain, selectedDate, selectedTime, availability, onReserve }) => {
    // availability can be: 'available', 'unavailable', 'closed'

    const getButtonConfig = () => {
        switch (availability) {
            case 'available':
                return {
                    text: 'Réserver',
                    className: 'bg-[#0B2CFF] text-white hover:bg-[#001B87] shadow-md shadow-blue-200 hover:shadow-lg',
                    disabled: false
                };
            case 'unavailable':
                return {
                    text: 'Non disponible',
                    className: 'bg-gray-400 text-white cursor-not-allowed',
                    disabled: true
                };
            case 'closed':
                return {
                    text: 'Fermé',
                    className: 'bg-red-500 text-white cursor-not-allowed',
                    disabled: true
                };
            default:
                return {
                    text: 'Réserver',
                    className: 'bg-[#0B2CFF] text-white hover:bg-[#001B87]',
                    disabled: false
                };
        }
    };

    const buttonConfig = getButtonConfig();
    const status = terrain.status?.toLowerCase();
    const isStatusOpen = status === 'ouvert' || status === 'opened' || status === 'open';

    return (
        <div className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border ${isStatusOpen ? 'border-gray-200' : 'border-red-200'} group`}>
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <img
                    src={terrain.photo || defaultPhoto}
                    alt={terrain.nom}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=800'; }}
                />

                {/* Status Badge */}
                <div className="absolute top-3 right-3 z-20">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${isStatusOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {isStatusOpen ? 'Ouvert' : 'Fermé'}
                    </span>
                </div>

                {/* Terrain Name Overlay (Optional, but looks good) */}
                <div className="absolute bottom-3 left-4 z-20">
                    <h3 className="text-white font-bold text-lg shadow-black/50 drop-shadow-md">
                        {terrain.nom || `Terrain ${terrain.id}`}
                    </h3>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Info Grid */}
                <div className="space-y-3 mb-6">
                    {/* Price */}
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-[#0B2CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Prix
                        </span>
                        <span className="text-lg font-bold text-[#0B2CFF]">
                            {terrain.prixTerrain} MAD <span className="text-xs font-normal text-gray-400">/h</span>
                        </span>
                    </div>

                    {/* Opening Hours */}
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-[#0B2CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Horaires
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                            {String(terrain.heureOuverture).padStart(2, '0')}:00 - {String(terrain.heureFermeture).padStart(2, '0')}:00
                        </span>
                    </div>
                </div>

                {/* Reserve Button */}
                <button
                    onClick={() => onReserve(terrain)}
                    disabled={buttonConfig.disabled}
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center ${buttonConfig.className}`}
                >
                    {buttonConfig.text}
                    {!buttonConfig.disabled && (
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
};

export default TerrainCard;
