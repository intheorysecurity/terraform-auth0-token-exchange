# Token Exchange Demo App (Node.js)

This is the small Node/Express app used by the Terraform demo. It:

- Mints a **demo “legacy” JWT** (signed with `JSON_SECRET`)
- Calls Auth0 **Token Exchange** (`/oauth/token` with the token-exchange grant)
- Displays the Auth0 response in the browser
- Uses the Auth0 Token Exchange Action: [`src/actions/token-exchange-action.js`](../actions/token-exchange-action.js)

## Run locally (no Heroku)

### Prerequisites

- Node.js + npm
- An Auth0 tenant that has the **Token Exchange Profile + Action** configured (via Terraform in the repo root, or manually)
  - If you’re enabling this manually, see Auth0 docs: [Configure Custom Token Exchange](https://auth0.com/docs/authenticate/custom-token-exchange/configure-custom-token-exchange)

### Configure environment variables

1. Install dependencies:

```bash
npm install
```

2. Create a local `.env` file from the template:

```bash
cp env.example .env
```

3. Fill in `.env`:

- **`AUTH0_DOMAIN`**: your tenant domain (no `https://`)
- **`AUTH0_API_CLIENT_ID` / `AUTH0_API_CLIENT_SECRET`**: the M2M application credentials that are allowed to perform token exchange
- **`JSON_SECRET`**: must match the Auth0 Action secret used to verify the “legacy” JWT

If you used Terraform to deploy the demo app to Heroku, these values are automatically configured as Heroku config vars.

If you are running locally and need to find the values, you can fetch them from Terraform state/outputs or the Auth0 dashboard:

- `terraform console` (from the repo root)
- or by looking at the created Auth0 application in the Auth0 dashboard

### Start the app

For dev (auto-reload):

```bash
npm run dev
```

For production-style:

```bash
npm start
```

Then open `http://localhost:3000`.

## What the UI does

- **Generate Token**: calls `POST /api/createtoken` to mint a demo JWT using `JSON_SECRET`
- **Call Auth0**: calls `POST /api/tokenexchange` which exchanges the demo JWT for an Auth0 token using the Token Exchange grant

## Notes

- This is a demo app. It includes basic hardening (rate limiting + security headers) but is not intended as production guidance.

## License

[MIT](https://choosealicense.com/licenses/mit/)
