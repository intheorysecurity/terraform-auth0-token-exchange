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
    * Make sure to save the following values: domain, client ID and client Secret
* Heroku Developer Account -- If you do not have an Heroku account, you can create one [here](https://signup.heroku.com/)
    * Make sure to create a new API key.

### Demo Setup Steps
1. Register Machine-to-Machine Applications [How-to](https://auth0.com/docs/get-started/auth0-overview/create-applications/machine-to-machine-apps).  This application will be use to leverage Auth0 API within the Terraform script.

### Installation and Configuration
1. Clone the repo
```bat
git clone https://github.com/intheorysecurity/terraform-auth0-token-exchange.git
```

2. Go to the terraform-auth0-token-exchange director.
```bat
cd terraform-auth0-token-exchange
```

3. Copy the contents of the terraform.tfvars.example file.
```powershell
#Windows
copy terraform.tfvars.example terraform.tfvars

#Linux
cp terraform.tfvars.example terraform.tfvars
```

4. Update the following variables in the terraform.tfvars file from the info gathered during the [Demo Setup Steps](#demo-setup-steps)
    * NOTE: The json_secret can be any random string, it is used to sign the custom made JWT.

```powershell
auth0_domain           = "token-exchange-demo.us.auth0.com"
auth0_client_id        = "value"
auth0_client_secret    = "value"

heroku_email    = "value"
heroku_api_key  = "value"
heroku_app_name = "token-exchange-beta"

json_secret = "secret"
```

5. In your terminal window enter the following commands
```bat
terraform init
terraform apply
```

6. At the prompt end in "yes".

7. Since Token exchange is currently in beta you will have to manually create the action scripted required.
8. From the Auth0 admin console, go to Actions -> Triggers
9. Click on custom-token-exchange-beta.
10. Click the + icon to the right of Add Action and select Build from scratch.
11. Enter the following name: Token Exchange Action Beta
12. Copy and paste the action code located in the src/actions directory of this github project.
13. Add the following dependences to the action
    * Name: jsonwebtoken
    * Version: latest
14. Add the following secrets:
    * Name: password
    * Value: "insert the value of the json_secret"
15. Save and Deploy the action
16. Finally add the created action to the into the Action flow.
17. Test the application by going to the URL provided from Terraform Output.

## Contributing
---
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
---
[MIT](https://choosealicense.com/licenses/mit/)