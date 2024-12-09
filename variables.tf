//Auth0 Config Block
variable "auth0_application_name" {
  type    = string
  default = "Sample NodeJS Application"
}

variable "auth0_app_type" {
  type    = string
  default = "regular_web"
}

variable "auth0_grant_types" {
  type    = list(string)
  default = ["implicit"]
}

variable "auth0_domain" {
  type    = string
  default = "domain.us.auth0.com"
}

variable "auth0_app_scopes" {
  type    = string
  default = "openid email profile address offline_access"
}

//Client ID use to call Auth0 Management API to create an application
variable "auth0_client_id" {
  type = string
}

variable "auth0_client_secret" {
  type = string
}

variable "auth0_debug" {
  type        = bool
  default     = false
  description = "Indicates whether to turn on debug mode."
}

#Heroku
variable "heroku_email" {
  type        = string
  description = "Heroku username"
}

variable "heroku_api_key" {
  type        = string
  description = "Heroku API Key"
}

variable "heroku_app_name" {
  type        = string
  description = "Heroku App Name"
}

variable "app_local_path" {
  type        = string
  default     = "src/project"
  description = "Default Location of NodeJS code"
}

variable "json_secret" {
  type    = string
  default = "Password123!"
}