const jwt = require("jsonwebtoken");
const BlacklistModel = require("../Models/blacklist.model");
const UserModel = require("../Models/user.model");
const dotenv = require("dotenv").config();

const Auth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Token not found" });
    }

    const token = req.headers.authorization.split(" ")[1];

    const blacklistedToken = await BlacklistModel.findOne({
      blacklistToken: token,
    });

    if (blacklistedToken) {
      return res
        .status(403)
        .json({ message: "You are logged out. Please login again." });
    }

    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Invalid or expired token", error: err.message });
      }

      const user = await UserModel.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
console.log(req);
      req.user = user;
      next();
    });
  } catch (error) {
    console.error("Error in Auth middleware:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = Auth;
