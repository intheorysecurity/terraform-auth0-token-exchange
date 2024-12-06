resource "auth0_client" "token_exchange_app" {
  name        = "Token Exchange Demo App"
  app_type    = "non_interactive"
  description = "Token Exchange Demo Application"
  jwt_configuration {
    alg                 = "RS256"
    lifetime_in_seconds = 36000
    secret_encoded      = false
  }
}

resource "auth0_client_credentials" "token_exchange_app_creds" {
  client_id             = auth0_client.token_exchange_app.client_id
  authentication_method = "client_secret_post"
}

resource "auth0_action" "token_exchange_action" {
  name    = "Token Exchange Action Beta"
  runtime = "node18"
  deploy  = true
  code    = templatefile("${path.path.module}/src/actions/token-exchange-action.js", { client_id = "${auth0_client.token_exchange_app.client_id}" })
  supported_triggers {
    id      = "credentials-exchange"
    version = "v2"
  }
  dependencies {
    name    = "jsonwebtoken"
    version = "latest"
  }
  secrets {
    name  = password
    value = var.json_secret
  }
}