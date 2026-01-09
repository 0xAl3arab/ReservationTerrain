const API_URL = "http://localhost:8080/annonces";

const getAuthHeaders = () => {
    const token = localStorage.getItem("kc_access_token");
    return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
};

const AnnonceService = {
    getAllAnnonces: async (city = "", terrainId = "") => {
        const params = new URLSearchParams();
        if (city) params.append("city", city);
        if (terrainId) params.append("terrainId", terrainId);

        const response = await fetch(`${API_URL}?${params.toString()}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch annonces");
        return response.json();
    },

    createAnnonce: async (annonceData) => {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(annonceData),
        });
        if (!response.ok) throw new Error("Failed to create annonce");
        return response.json();
    },
};

export default AnnonceService;
