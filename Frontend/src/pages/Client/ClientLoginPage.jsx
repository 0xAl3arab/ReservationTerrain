import { useState } from "react";
import keycloak from "../../keycloak"; // adapter le chemin

function ClientLoginPage() {
    const [clientInfo, setClientInfo] = useState(null);
    const [error, setError] = useState(null);

    const handleLogin = async () => {
        try {
            // 1. Login via Keycloak
            await keycloak.init({ onLoad: "login-required" });
            console.log("Token Keycloak:", keycloak.token);

            // 2. Appel du backend avec le token
            const res = await fetch("http://localhost:8080/auth/client/login", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                },
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(`Backend status ${res.status}: ${txt}`);
            }

            const data = await res.json();
            setClientInfo(data);
            setError(null);
        } catch (e) {
            console.error("Login error:", e);
            setError(e.message);
        }
    };

    return (
        <div>
            <h2>Client Login</h2>
            <button onClick={handleLogin}>Se connecter avec Keycloak</button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <h3>Client connecté</h3>
            <pre>{clientInfo && JSON.stringify(clientInfo, null, 2)}</pre>
        </div>
    );
}

export default ClientLoginPage;
