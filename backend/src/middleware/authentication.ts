const jwt = require("jsonwebtoken");

async function authenticateToken(req, res, next) {
  // get token from header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // check if token exists
  if (token == null) return res.status(401).send();

  // verify token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send();

    req.user = user;

    next();
  });
}

module.exports = authenticateToken;
