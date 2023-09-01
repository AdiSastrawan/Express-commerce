import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default function authToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).json({ error: "User Not Logged in yet" });
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, payload) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = payload;

    next();
  });
}
