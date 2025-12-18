const API_BASE_URL = 'http://localhost:8080/api';

export const complexeService = {
    // Get all complexes
    getAllComplexes: async () => {
        const response = await fetch(`${API_BASE_URL}/complexes`);
        if (!response.ok) {
            throw new Error('Failed to fetch complexes');
        }
        return response.json();
    },

    // Get a single complex by ID
    getComplexeById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/complexes/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch complex details');
        }
        return response.json();
    },

    // Get terrains for a specific complex
    getTerrainsByComplexe: async (complexeId) => {
        const response = await fetch(`${API_BASE_URL}/complexes/${complexeId}/terrains`);
        if (!response.ok) {
            throw new Error('Failed to fetch terrains');
        }
        return response.json();
    }
};
