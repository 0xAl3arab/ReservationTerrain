import { jwtDecode } from "jwt-decode";

// Keycloak access tokens of reservation-realm only live 5 minutes, and most pages
// read their token straight from localStorage, so we keep those tokens fresh here.
const KEYCLOAK_TOKEN_URL = "http://localhost:8180/realms/reservation-realm/protocol/openid-connect/token";

// clientId must be the client that issued the token: all three are issued by
// reservation-frontend (the backend's logins use keycloak.login-client-id).
const CLIENT_ID = "reservation-frontend";
const SESSIONS = [
    // issued by the backend's /auth/client/login
    { access: "kc_access_token", refresh: "kc_refresh_token", clientId: CLIENT_ID },
    // issued directly by OwnerLoginPage
    { access: "owner_token", refresh: "owner_refresh_token", clientId: CLIENT_ID },
    // issued by the backend's /admin/login; only AdminDashboard goes through authService
    { access: "admin_access_token", refresh: "admin_refresh_token", clientId: CLIENT_ID },
];

const REFRESH_MARGIN_MS = 90 * 1000;

const expiresSoon = (token) => {
    try {
        return jwtDecode(token).exp * 1000 < Date.now() + REFRESH_MARGIN_MS;
    } catch {
        return true;
    }
};

const refreshSession = async ({ access, refresh, clientId }) => {
    const accessToken = localStorage.getItem(access);
    if (!accessToken || !expiresSoon(accessToken)) return;

    const refreshToken = localStorage.getItem(refresh);
    if (!refreshToken) return;

    try {
        const res = await fetch(KEYCLOAK_TOKEN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                client_id: clientId,
                refresh_token: refreshToken,
            }),
        });
        if (!res.ok) throw new Error(`refresh failed: ${res.status}`);

        const data = await res.json();
        localStorage.setItem(access, data.access_token);
        if (data.refresh_token) localStorage.setItem(refresh, data.refresh_token);
    } catch (e) {
        // Session is over (idle too long or logged out in Keycloak): drop the tokens
        // so pages send the user back to their login screen.
        console.warn(`Token refresh failed for ${access}:`, e);
        localStorage.removeItem(access);
        localStorage.removeItem(refresh);
    }
};

const refreshAll = () => Promise.all(SESSIONS.map(refreshSession));

// Resolves once expired tokens have been refreshed, so the first page load
// never starts with a stale token. Keeps refreshing in the background after that.
export const startTokenRefresher = () => {
    setInterval(refreshAll, 60 * 1000);
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") refreshAll();
    });
    return refreshAll();
};
