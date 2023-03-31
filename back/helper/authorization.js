const { firebase,db } = require("../db");
const jwt_decode = require("jwt-decode");



async function  isAuthenticated(req, res, next) {

  const authorization = req.headers.authorization;
  if (!authorization) return res.status(401).send({ message: "missing token" });

  if (!authorization.startsWith("Bearer"))
    return res.status(401).send({ message: "missing bearer " });

  const split = authorization.split(" ");
  if (split.length !== 2)
    return res.status(401).send({ message: "Unauthorized" });

  const IdToken = split[1];
   
  try {
    const decodedToken = jwt_decode(IdToken);
    var currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.claims.expiresIn < currentTime) {
      return res.status(401).send("Token has expired");
    } 
    res.locals = {
      ...res.locals,
      uid: decodedToken.uid,
      role: decodedToken.claims.role,
      email: decodedToken.claims.email,
    };
    res.data={
      decodedToken:IdToken
    }
    next();
  } catch (err) {
    console.error(`${err.code} -  ${err.message}`);
    return res.status(401).send({ message: "Unauthorized" });
  }
}

function isAuthorized(req, res, next, opts) {
  
  const { role, email, uid } = res.locals;
  const { id } = req.params;

  if (opts.allowSameUser && id && uid === id) next();

  if (!role) return res.status(403).send();

  if (opts.hasRole.includes(role)) next();

  return res.status(403).send("error");
}

module.exports = { isAuthenticated, isAuthorized };
