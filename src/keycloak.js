import Keycloak from "keycloak-js";
const keycloak = new Keycloak({
 url: "http://localhost:8000/",
 realm: "Test",
 clientId: "TS-local",
});

export default keycloak;