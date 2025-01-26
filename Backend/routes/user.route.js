const express = require("express");
const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const BlacklistModel = require("../Models/blacklist.model");
const dotenv = require("dotenv").config();

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      res.status(401).json({ message: "User already registered" });
    }
    bcrypt.hash(password, 5, async function (err, hash) {
      if (err) {
        console.log(`Error while bcrypting ${err}`);
        return;
      }

      if (hash) {
        const newUser = new UserModel({
          userName,
          email,
          password: hash,
        });
        await newUser.save();
        res
          .status(201)
          .json({ message: "User registered Successfully", newUser });
      }
    });
  } catch (error) {
    res.status(404).send(`Error while registering ${error}`);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).send(`User not registered or incorrect email`);
    }
    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        console.log(`Error while bcrypting ${err}`);
        return;
      }
      if (result) {
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);

        res
          .status(201)
          .json({ message: "User LoggedIn Successfully", token, user });
      } else {
        res.status(401).json({
          message: "Wrong password",
          err,
        });
      }
    });
  } catch (error) {
    res.status(404).send(`Error while loggingIn ${error}`);
  }
});

userRouter.get("/logout", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const blacklistedToken = new BlacklistModel({
      blacklistToken: token,
    });

    await blacklistedToken.save();
    res.status(203).json({ message: "user logout successfully " });
  } catch (error) {
    res.status(404).send(`Error while logging out ${error}`);
  }
});

module.exports = userRouter;
