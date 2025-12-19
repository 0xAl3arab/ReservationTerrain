import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: "http://localhost:8180",
    realm: "reservation-realm",
    clientId: "reservation-frontend", // ton client front
});

export default keycloak;
