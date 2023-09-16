import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import generateToken from "../utils/generateToken.js";
import authToken from "../middleware/authToken.js";

dotenv.config();
const route = express.Router();
route.post("/token", async (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.status(401).json({ message: "Not authenticated" });
  const user = await User.findOne({ refresh_token: refreshToken });
  if (!user) {
    res.status(400).json({ message: "Invalid Token" });
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, payload) => {
    if (!err) {
      const accessToken = generateToken({ name: payload.name, email: payload.email });
      res.json({ accessToken: accessToken });
    } else {
      res.sendStatus(403);
    }
  });
});
route.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ $or: [{ username: username }, { email: username }] });
  if (!user) {
    res.status(400).json({ message: "Username or Password Incorrect" });
  }
  bcrypt.compare(password, user.password).then((match) => {
    if (!match) {
      res.status(400).json({ message: "Username or Password Incorrect" });
    } else {
      const payload = {
        id: user._id,
        name: user.username,
        email: user.email,
      };
      const accessToken = generateToken(payload);
      user.refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN);
      user.save().then((u) => {
        res.json({ accessToken, refreshToken: u.refresh_token });
      });
    }
  });
});
route.post("/register", (req, res) => {
  const { username, email, password, confirm_password } = req.body;
  if (password != confirm_password) {
    res.statusCode(400).send({ message: "Confirm password is not the same" });
  }
  bcrypt.hash(password, 10).then((hash) => {
    const user = new User({
      username: username,
      email: email,
      password: hash,
      refresh_token: jwt.sign({ name: username, email: email }, process.env.REFRESH_TOKEN),
    });
    user
      .save()
      .then((data) => {
        const payload = {
          id: _id,
          name: username,
          email: email,
        };
        const accessToken = generateToken(payload);

        res.json({ accessToken, refreshToken: user.refresh_token, message: "User Successfully Registered" });
      })
      .catch((error) => {
        res.send({ message: "Error: " + error.message });
      });
  });
});

route.delete("/logout", async (req, res) => {
  const user = await User.findOne({ refresh_token: req.body.refresh_token });
  user.refresh_token = null;
  user
    .save()
    .then(() => {
      res.sendStatus(204).json({ message: "User Logged Out" });
    })
    .catch((error) => {
      res.sendStatus(400).send({ message: "Error: " + error.message });
    });
});
route.get("/user-login", authToken, async (req, res) => {
  const user = await User.findOne({ refresh_token: req.body.refresh_token });
  res.json({ name: user.username, email: user.email });
});
export default route;
