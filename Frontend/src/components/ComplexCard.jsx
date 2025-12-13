import React from "react";

const ComplexCard = ({ complex }) => {
    // Use pre-calculated display data from parent to ensure stability during filtering
    const minPrice = complex.displayMinPrice;
    const terrainCount = complex.displayTerrainCount;

    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden flex flex-col md:flex-row group">
            {/* Image Placeholder */}
            <div className="w-full md:w-64 h-48 md:h-auto bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                <img
                    src={`https://source.unsplash.com/random/800x600/?stadium,soccer,${complex.id}`}
                    alt={complex.nom}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=800'; }}
                />
                <div className="absolute bottom-3 left-3 z-20 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-[#0B2CFF] uppercase tracking-wide">
                    {complex.ville}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#0B2CFF] transition-colors">
                            {complex.nom}
                        </h3>
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md">
                            Ouvert
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm mb-4 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {complex.adress}
                    </p>

                    <div className="flex flex-wrap gap-3 mb-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800">
                            {terrainCount} Terrains
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Parking
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Douches
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-medium">À partir de</span>
                        <span className="text-lg font-bold text-[#0B2CFF]">{minPrice} MAD <span className="text-sm font-normal text-gray-400">/ heure</span></span>
                    </div>
                    <button className="bg-[#0B2CFF] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#001B87] transition-colors shadow-md shadow-blue-200">
                        Voir les terrains
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComplexCard;
