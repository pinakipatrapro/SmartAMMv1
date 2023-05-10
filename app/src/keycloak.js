import Keycloak from 'keycloak-js'

const keycloakConfig = {
  url: 'https://keycloak.c-05dceb2.kyma.ondemand.com/auth',
  realm: 'SmartAMM',
  clientId: 'smartamm-local'
}

const authClient = new Keycloak(keycloakConfig)

export default authClient