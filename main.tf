resource "auth0_client" "token_exchange_app" {
  name            = "Token Exchange Demo App"
  app_type        = "non_interactive"
  description     = "Token Exchange Demo Application"
  oidc_conformant = true
  jwt_configuration {
    alg                 = "RS256"
    lifetime_in_seconds = 36000
    secret_encoded      = false
  }
  token_exchange {
    allow_any_profile_of_type = ["custom_authentication"]
  }
}

resource "auth0_client_credentials" "token_exchange_app_creds" {
  client_id             = auth0_client.token_exchange_app.client_id
  authentication_method = "client_secret_post"
}

resource "auth0_action" "token_exchange_action" {
  name    = "Token Exchange Action"
  runtime = "node22"
  deploy  = true
  code    = templatefile("${path.module}/src/actions/token-exchange-action.js", { client_id = "${auth0_client.token_exchange_app.client_id}" })
  supported_triggers {
    id      = "custom-token-exchange"
    version = "v1"
  }
  dependencies {
    name    = "jsonwebtoken"
    version = "latest"
  }

  dependencies {
    name    = "auth0"
    version = "latest"
  }

  secrets {
    name  = "password"
    value = var.json_secret
  }

  secrets {
    name  = "AUTH0_DOMAIN"
    value = var.auth0_domain
  }

  secrets {
    name  = "AUTH0_MGMT_CLIENT_ID"
    value = var.auth0_client_id
  }

  secrets {
    name  = "AUTH0_MGMT_CLIENT_SECRET"
    value = var.auth0_client_secret
  }
}

resource "auth0_token_exchange_profile" "my_token_exchange_profile" {
  name               = "token_exchange_profile"
  subject_token_type = "http://acme.com/legacy-token"
  action_id          = auth0_action.token_exchange_action.id
  type               = "custom_authentication"
}

resource "auth0_resource_server" "my_resource_server" {
  name                                            = "Token Exchange API"
  identifier                                      = "http://acme.com/legacy-token"
  signing_alg                                     = "RS256"
  allow_offline_access                            = true
  token_lifetime                                  = 8600
  skip_consent_for_verifiable_first_party_clients = true
}

resource "auth0_client_grant" "my_client_grant" {
  client_id = auth0_client_credentials.token_exchange_app_creds.id
  audience  = auth0_resource_server.my_resource_server.identifier
  scopes    = []
}

resource "heroku_app" "default" {
  name       = var.heroku_app_name
  region     = "us"
  buildpacks = ["heroku/nodejs"]
}

resource "heroku_config" "common" {
  sensitive_vars = {
    AUTH0_DOMAIN            = "${var.auth0_domain}"
    AUTH0_API_CLIENT_ID     = "${auth0_client.token_exchange_app.client_id}"
    AUTH0_API_CLIENT_SECRET = "${auth0_client_credentials.token_exchange_app_creds.client_secret}"
    JSON_SECRET             = "${var.json_secret}"
  }
}

resource "heroku_app_config_association" "configuration" {
  app_id         = heroku_app.default.id
  sensitive_vars = heroku_config.common.sensitive_vars
}

resource "heroku_build" "nodejsapp" {
  app_id = heroku_app.default.id
  source {
    path = var.app_local_path
  }
}

output "heroku_app_url" {
  value = heroku_app.default.web_url
}