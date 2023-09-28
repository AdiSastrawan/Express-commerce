import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import generateToken from "../utils/generateToken.js";
import authToken from "../middleware/authToken.js";
import { Role } from "../models/Role.js";

dotenv.config();
const route = express.Router();
route.post("/token", async (req, res) => {
  const refreshToken = req.cookies.jwt;
  if (refreshToken == null) return res.status(401).json({ message: "Not authenticated" });
  const user = await User.findOne({ refresh_token: refreshToken });
  if (!user) {
    return res.status(400).json({ message: "Invalid Token" });
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, payload) => {
    if (!err) {
      const accessToken = generateToken({ id: payload.id, name: payload.name, email: payload.email, role: payload.role });
      return res.json({ accessToken: accessToken });
    } else {
      return res.sendStatus(403);
    }
  });
});
route.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ $or: [{ username: username }, { email: username }] }).populate({ path: "role_id", select: "name" });
  if (!user) {
    return res.status(400).json({ message: "Username or Password Incorrect" });
  }
  bcrypt.compare(password, user.password).then((match) => {
    if (!match) {
      return res.status(400).json({ message: "Username or Password Incorrect" });
    } else {
      const payload = {
        id: user._id,
        name: user.username,
        email: user.email,
        role: user.role_id.name,
      };
      const accessToken = generateToken(payload);
      const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN);
      user.refresh_token = refresh_token;
      user.save().then((u) => {
        res.cookie("jwt", refresh_token, { httpOnly: true, secure: true, sameSite: "None", maxAge: 24 * 60 * 60 * 1000 });
        res.json({ accessToken });
      });
    }
  });
});
route.post("/register", async (req, res) => {
  const { username, email, password, confirm_password } = req.body;
  if (password != confirm_password) {
    return res.statusCode(400).send({ message: "Confirm password is not the same" });
  }
  const role = await Role.findOne({ name: "costumer" });
  if (role == null) {
    res.json({ message: "Role does not exist" });
    return 0;
  }
  bcrypt.hash(password, 10).then((hash) => {
    const user = new User({
      username: username,
      email: email,
      password: hash,
      refresh_token: jwt.sign({ name: username, email: email }, process.env.REFRESH_TOKEN),
      role_id: role._id,
    });
    user
      .save()
      .then((data) => {
        const payload = {
          id: data._id,
          name: username,
          email: email,
          role: role.name,
        };
        const accessToken = generateToken(payload);
        res.cookie("jwt", user.refresh_token, { secure: true, httpOnly: true, sameSite: "None", maxAge: 86400000 });

        res.json({ accessToken, message: "User Successfully Registered" });
      })
      .catch((error) => {
        res.send({ message: "Error: " + error.message });
      });
  });
});

route.delete("/logout", async (req, res) => {
  console.log(req.cookies);
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(401).json({ message: "You must be logged in" });
  }
  const user = await User.findOne({ refresh_token: cookies.jwt });
  // return res.send(user);
  if (!user) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(404);
  }
  user.refresh_token = null;
  user
    .save()
    .then(() => {
      res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
      return res.sendStatus(200);
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
