import React, { useState } from 'react';

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
        <div className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border ${isStatusOpen ? 'border-gray-200' : 'border-red-200'}`}>
            {/* Status Badge */}
            <div className="relative">
                <div className="h-2 bg-gradient-to-r from-[#0B2CFF] to-[#001B87]"></div>
                <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${isStatusOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {isStatusOpen ? 'Ouvert' : 'Fermé'}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Terrain Name */}
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {terrain.nom || `Terrain ${terrain.id}`}
                </h3>

                {/* Info Grid */}
                <div className="space-y-3 mb-6">
                    {/* Price */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-[#0B2CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Prix
                        </span>
                        <span className="text-lg font-bold text-[#0B2CFF]">
                            {terrain.prixTerrain} MAD <span className="text-sm font-normal text-gray-400">/ heure</span>
                        </span>
                    </div>

                    {/* Opening Hours */}
                    <div className="flex items-center justify-between">
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
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${buttonConfig.className}`}
                >
                    {buttonConfig.text}
                </button>
            </div>
        </div>
    );
};

export default TerrainCard;
