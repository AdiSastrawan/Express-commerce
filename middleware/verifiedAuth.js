import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export default function verifiedAuth(req, res, next) {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]
  if (token != null) {
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, payload) => {
      if (payload.verified) {
        next()
      }
      //   return res.status(403).json({ error: { message: "Account not verified yet" } })
    })
  }
}
