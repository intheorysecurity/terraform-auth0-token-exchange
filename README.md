# Auth0 Token Exchange Demo (BETA)

This projects aims to show you how to leverage Auth0 Token Exchange feature

## Disclaimer :warning:
---
This project serves as a Sample Demo, that you can tweak or completely re-purpose.

## Assumptions
This project assumes you have the following basic knowledge of the Auth0 platform.

## Prerequisties
* Terraform v1.8.1+
* Auth0 Tenant -- If you do not already have an Auth0 Tenant, you can create one [here](https://auth0.com/signup?place=header&type=button&text=sign%20up).

### Demo Setup Steps
1. Register Machine-to-Machine Applications [How-to](https://auth0.com/docs/get-started/auth0-overview/create-applications/machine-to-machine-apps)

### Installation and Configuration
1. Clone the repo
```bat
git clone https://github.com/intheorysecurity/terraform-auth0-token-exchange.git
```

2. Copy the contents of the terraform.tfvars.example file.
```powershell
#Windows
copy terraform.tfvars.example terraform.tfvars

#Linux
cp terraform.tfvars.example terraform.tfvars
```
3. Update the following variables in the terraform.tfvars file from the info gathered during the [Demo Setup Steps](#demo-setup-steps)

```powershell
auth0_domain           = "token-exchange-demo.us.auth0.com"
auth0_client_id        = "value"
auth0_client_secret    = "value"

heroku_email    = "value"
heroku_api_key  = "value"
heroku_app_name = "token-exchange-beta"

json_secret = "secret"
```

## Contributing
---
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
---
[MIT](https://choosealicense.com/licenses/mit/)