import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import generateToken from "../utils/generateToken.js";
import authToken from "../middleware/authToken.js";
import db_connection from "../config/db-connection.js";
import { v4 as uuidv4, v4 } from "uuid";
dotenv.config();
const route = express.Router();
route.post("/token", async (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.status(401).json({ message: "Not authenticated" });
  db_connection.query("SELECT * FROM users WHERE refresh_token = '" + refreshToken + "'", (err, data) => {
    if (data.length <= 0) {
      res.status(404).json({ message: "Invalid Token" });
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
});
route.post("/login", (req, res) => {
  const { username, password } = req.body;
  const sql = `SELECT * FROM users WHERE username = '${username}'`;
  db_connection.query(sql, (err, data) => {
    if (err) console.error(err);
    if (data.length <= 0) {
      res.status(400).json({ message: "Username or Password Incorrect" });
    }
    // res.json(data);
    bcrypt.compare(password, data[0].password).then((match) => {
      if (!match) {
        res.status(400).json({ message: "Username or Password Incorrect" });
      } else {
        const payload = {
          name: data.username,
          email: data.email,
        };
        const accessToken = generateToken(payload);
        const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN);
        db_connection.query(`UPDATE users SET refresh_token = '${refresh_token}' WHERE username = '${data[0].username}'`, (err, data) => {
          if (err) {
            throw err;
          }
          res.json({ access_token: accessToken, refresh_token: refresh_token });
        });
      }
    });
  });
});
route.post("/register", (req, res) => {
  const { username, email, password, confirm_password } = req.body;
  if (password != confirm_password) {
    res.send({ message: "Confirm password is not the same" });
  }
  const payload = {
    username: username,
    email: email,
  };
  const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN);
  bcrypt.hash(password, 10).then((hash) => {
    const sql = `INSERT INTO users (id, username, email, password, refresh_token, created_at, updated_at) VALUES ('${v4()}','${username}','${email}','${hash}','${refresh_token}',NOW(),NOW())`;
    db_connection.query(sql, (error, data) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error sending users");
      } else {
        const accessToken = generateToken(payload);
        res.json({ accessToken, refresh_token });
      }
    });
  });
});

route.delete("/logout", async (req, res) => {
  const sql_query = `UPDATE users SET refresh_token = NULL WHERE refresh_token = '${req.body.refresh_token}'`;
  db_connection.query(sql_query, (err, data) => {
    if (err) throw err;

    res.sendStatus(204).json({ message: "Log out Succesfully" });
  });
});
// route.get("/user-login", authToken, async (req, res) => {
//   const user = await User.findOne({ refresh_token: req.body.refresh_token });
//   res.json({ name: user.username, email: user.email });
// });
export default route;
