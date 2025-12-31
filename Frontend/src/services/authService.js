import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:8080";
const KEYCLOAK_TOKEN_URL = "http://localhost:8180/realms/reservation-realm/protocol/openid-connect/token";
const CLIENT_ID = "admin-cli"; // From application.properties

export const authService = {
    login: async (email, password) => {
        const res = await fetch(`${API_URL}/admin/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) throw new Error("Login failed");

        const data = await res.json();
        if (data.access_token) {
            localStorage.setItem("admin_access_token", data.access_token);
            localStorage.setItem("admin_refresh_token", data.refresh_token);
            return true;
        }
        return false;
    },

    logout: () => {
        localStorage.removeItem("admin_access_token");
        localStorage.removeItem("admin_refresh_token");
        window.location.href = "/admin/login";
    },

    getToken: async () => {
        let token = localStorage.getItem("admin_access_token");
        if (!token) return null;

        if (authService.isTokenExpired(token)) {
            token = await authService.refreshToken();
        }

        return token;
    },

    isTokenExpired: (token) => {
        try {
            const decoded = jwtDecode(token);
            // Check if expired or expiring in next 10 seconds
            return decoded.exp * 1000 < Date.now() + 10000;
        } catch (e) {
            return true;
        }
    },

    refreshToken: async () => {
        const refreshToken = localStorage.getItem("admin_refresh_token");
        if (!refreshToken) {
            authService.logout();
            return null;
        }

        try {
            const params = new URLSearchParams();
            params.append("grant_type", "refresh_token");
            params.append("client_id", CLIENT_ID);
            params.append("refresh_token", refreshToken);

            const res = await fetch(KEYCLOAK_TOKEN_URL, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: params
            });

            if (!res.ok) {
                throw new Error("Refresh failed");
            }

            const data = await res.json();
            if (data.access_token) {
                localStorage.setItem("admin_access_token", data.access_token);
                if (data.refresh_token) {
                    localStorage.setItem("admin_refresh_token", data.refresh_token);
                }
                return data.access_token;
            }
            return null;
        } catch (e) {
            console.error("Token refresh failed:", e);
            authService.logout();
            return null;
        }
    },

    fetchAuth: async (url, options = {}) => {
        let token = await authService.getToken();

        if (!token) {
            // Redirect to login if no valid token can be obtained
            window.location.href = "/admin/login";
            return Promise.reject("No token");
        }

        const headers = {
            ...options.headers,
            "Authorization": `Bearer ${token}`
        };

        return fetch(url, { ...options, headers });
    }
};
