/**
 * Handler to be executed while executing a custom token exchange request
 * @param {Event} event - Details about the incoming token exchange request.
 * @param {CustomTokenExchangeAPI} api - Methods and utilities to define token exchange process.
 */
var jwt = require("jsonwebtoken");
const ManagementClient = require("auth0").ManagementClient;

exports.onExecuteCustomTokenExchange = async (event, api) => {
  // validate and decode your token, and extract user details
  if (event.client.client_id === "${client_id}") {
    console.log("Token: " + event.transaction.subject_token);
    const user = validateToken(
      event.transaction.subject_token,
      event.secrets.password
    );

    console.log(user);

    if (user !== undefined && user.sub.startsWith("auth0|")) {
      console.log("User has auth0 style sub");
      api.authentication.setUserById(user.sub);
    } else {
      //Search for the user by email
      const management = new ManagementClient({
        domain: event.secrets.AUTH0_DOMAIN,
        clientId: event.secrets.AUTH0_MGMT_CLIENT_ID,
        clientSecret: event.secrets.AUTH0_MGMT_CLIENT_SECRET,
        scope: "read:users",
      });
      try {
        console.log("looking for user with auth0 Management API");
        const searchResult = await management.users.listUsersByEmail({
          email: user.email,
        });
        console.log("Finished Search");
        console.log(searchResult);
        if (searchResult[0]?.user_id) {
          console.log("Found a user");
          console.log(searchResult[0]?.user_id)
          api.authentication.setUserById(searchResult[0]?.user_id);
        } else {
          //User not found, use setUserByConnection method and allow creation of user
          console.log("User not found, will create user");
          api.authentication.setUserByConnection(
            "Username-Password-Authentication",
            {
              user_id: user.sub,
              email: user.email,
              email_verified: true,
              given_name: user.given_name,
              family_name: user.family_name,
            },
            { updateBehavior: "replace", creationBehavior: "create_if_not_exists" }
          );

          api.user.setUserMetadata("info", "User created via token exchange");
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
};

function validateToken(token, secret) {
  try {
    var decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    console.log(err);
  }
}
