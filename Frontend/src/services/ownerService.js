import axios from 'axios';

const API_URL = 'http://localhost:8080/api/owners';

const getAuthHeaders = () => {
    const token = localStorage.getItem('owner_token');
    return { Authorization: `Bearer ${token}` };
};

const getProfile = async () => {
    const response = await axios.get(`${API_URL}/profile`, { headers: getAuthHeaders() });
    return response.data;
};

const getMyTerrains = async () => {
    const response = await axios.get(`${API_URL}/terrains`, { headers: getAuthHeaders() });
    return response.data;
};

const addTerrain = async (terrainData) => {
    const response = await axios.post(`${API_URL}/terrains`, terrainData, { headers: getAuthHeaders() });
    return response.data;
};

const updateProfile = async (profileData) => {
    const response = await axios.put(`${API_URL}/profile`, profileData, { headers: getAuthHeaders() });
    return response.data;
};

const updateTerrain = async (id, terrainData) => {
    const response = await axios.put(`${API_URL}/terrains/${id}`, terrainData, { headers: getAuthHeaders() });
    return response.data;
};

const getReservations = async () => {
    const response = await axios.get(`${API_URL}/reservations`, { headers: getAuthHeaders() });
    return response.data;
};

const validateReservation = async (id) => {
    const response = await axios.put(`${API_URL}/reservations/${id}/validate`, {}, { headers: getAuthHeaders() });
    return response.data;
};

const cancelReservation = async (id) => {
    const response = await axios.put(`${API_URL}/reservations/${id}/cancel`, {}, { headers: getAuthHeaders() });
    return response.data;
};

const getDashboardStats = async () => {
    const response = await axios.get(`${API_URL}/dashboard-stats`, { headers: getAuthHeaders() });
    return response.data;
};

const ownerService = {
    getProfile,
    getMyTerrains,
    addTerrain,
    updateProfile,
    updateTerrain,
    getReservations,
    validateReservation,
    cancelReservation,
    getDashboardStats,
};

export default ownerService;
