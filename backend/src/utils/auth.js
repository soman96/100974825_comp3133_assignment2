const jwt = require("jsonwebtoken");

// create signed JWT token with user info
function signToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// extract user info from JWT token in request header
function getUserFromReq(req) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return null;

  const token = header.slice("Bearer ".length).trim();
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

module.exports = { signToken, getUserFromReq };