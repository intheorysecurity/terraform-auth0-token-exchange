var jwt = require("jsonwebtoken");

exports.onExecuteCustomTokenExchange = async (event, api) => {
  // validate and decode your token, and extract user details
  if (event.client.client_id === "${client_id}") {
    const user = validateToken(event.transaction.subject_token);

    if (user !== undefined) {
      api.authentication.setUserByProfile("Username-Password-Authentication", {
        user_id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone_number,
        user_metdata: {
          department: user.department,
        },
      });
    }
  }
};

function validateToken(token) {
  try {
    var decoded = jwt.verify(token, event.secrets.password);
    return decoded;
  } catch (err) {
    console.log(err);
  }
}
