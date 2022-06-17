var jwt = require("jsonwebtoken");
const JWT_SECRET = "fuck_Your_mom_a$$";

const fetchUser = (req, res, next) => {
  // Get the user from the jwt token and add id to req object
  const token = req.header("authToken");
  if (!token) {
    return res
      .status(401)
      .send({ error: "Please authenticate using valid token !" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    return res
      .status(401)
      .send({ error: "Please authenticate using valid token !" });
  }
};

module.exports = fetchUser;
