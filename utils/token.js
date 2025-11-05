const jwt = require("jsonwebtoken");

function generateToken(user) {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      type: user.type,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.log(error);
    return null;
  }
}
module.exports = { generateToken, verifyToken };
