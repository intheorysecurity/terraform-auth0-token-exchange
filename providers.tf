terraform {
  required_providers {
    auth0 = {
      source  = "auth0/auth0"
      version = "1.28.0"
    }
    heroku = {
      source  = "heroku/heroku"
      version = "5.2.8"
    }
  }
}

provider "heroku" {
  # Configuration options
  email   = var.heroku_email
  api_key = var.heroku_api_key
}

#Configure the Auth0 Provider
provider "auth0" {
  domain        = var.auth0_domain
  client_id     = var.auth0_client_id
  client_secret = var.auth0_client_secret
  debug         = var.auth0_debug
}