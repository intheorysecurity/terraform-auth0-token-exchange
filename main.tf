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

# resource "auth0_action" "token_exchange_action" {
#   name    = "Token Exchange Action Beta"
#   runtime = "node18"
#   deploy  = true
#   code    = templatefile("${path.module}/src/actions/token-exchange-action.js", { client_id = "${auth0_client.token_exchange_app.client_id}" })
#   supported_triggers {
#     id      = "custom-token-exchange-beta"
#     version = "v1"
#   }
#   dependencies {
#     name    = "jsonwebtoken"
#     version = "latest"
#   }
#   secrets {
#     name  = "password"
#     value = var.json_secret
#   }
# }

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
    JSON_SECRET = "${var.json_secret}"
  }
}

resource "heroku_app_config_association" "configuration" {
  app_id = heroku_app.default.id
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