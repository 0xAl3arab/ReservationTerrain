const API_BASE_URL = 'http://localhost:8080/api';

export const reservationService = {
    // Create a new reservation
    createReservation: async (reservationData, token) => {
        const response = await fetch(`${API_BASE_URL}/reservations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(reservationData)
        });

        if (response.status === 401) {
            throw new Error('401');
        }

        const contentType = response.headers.get("content-type");
        let data;
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = { message: await response.text() };
        }

        if (!response.ok) {
            throw new Error(data.message || 'Failed to create reservation');
        }

        return data;
    },

    // Get reservations for a terrain on a specific date
    getTerrainReservations: async (terrainId, date) => {
        const dateParam = date ? `?date=${date}` : '';
        const response = await fetch(`${API_BASE_URL}/terrains/${terrainId}/reservations${dateParam}`);

        if (!response.ok) {
            throw new Error('Failed to fetch reservations');
        }

        return response.json();
    }
};
