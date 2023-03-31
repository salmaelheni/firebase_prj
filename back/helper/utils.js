const { firebase, db } = require("../db");

const mapUser = function (user) {
  var customClaims = user.customClaims || { role: "" };
  var role = customClaims.role ? customClaims.role : "";
  return {
    uid: user.uid,
    email: user.email || "",
    role: role,
    lastSignInTime: user.metadata.lastSignInTime,
    creationTime: user.metadata.creationTime,
  };
};
const createResponse = function (status,success,message,data) {
  return {
    status: status || null,
    success: success || null,
    message: message || null,
    data: data || null
  };
};

const createToken = async function (role,uid) {
  var token_access_exp = Math.floor(Date.now() / 1000) + 3600;
  var token_refresh_exp = Math.floor(Date.now() / 1000) + 108000;

  var payload_access = {
    uid:uid,
    role: role,
    expiresIn: token_access_exp,
  };

  const tokenAccess = await firebase
    .auth()
    .createCustomToken(uid, payload_access);

  var payload_refresh = {
    role: role,
    expiresIn: token_refresh_exp,
  };

  const tokenRefresh = await firebase
    .auth()
    .createCustomToken(uid, payload_refresh);

  return {
    accessToken: tokenAccess,
    refreshToken: tokenRefresh,
    exp: token_access_exp,
  };
};




module.exports = { mapUser,createToken,createResponse };
