import express from "express"
import productRoutes from "./routes/products.js"
import authRoutes from "./routes/auth.js"
import typeRoutes from "./routes/types.js"
import sizeRoutes from "./routes/size.js"
import cartRoutes from "./routes/cart.js"
import stockRoutes from "./routes/stocks.js"
import roleRoutes from "./routes/role.js"
import dahsboardRoutes from "./routes/dashboard.js"
import transactionRoutes from "./routes/transaction.js"
import userRoutes from "./routes/superuser.js"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

import cors from "cors"
import cookieParser from "cookie-parser"
import db_connection from "./config/db-connection.js"
import credentials from "./middleware/credentials.js"
import corsOptions from "./config/corsOptions.js"

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)
dotenv.config()
const app = express()
app.use(cookieParser())
app.use("/public", express.static(path.join(__dirname, "public")))
const port = process.env.PORT || 3000
app.use(cors(corsOptions))
app.use(credentials)
db_connection()
app.use(express.json())
app.use("/", authRoutes)
app.use("/products", productRoutes)
app.use("/types", typeRoutes)
app.use("/size", sizeRoutes)
app.use("/stocks", stockRoutes)
app.use("/carts", cartRoutes)
app.use("/roles", roleRoutes)
app.use("/transaction", transactionRoutes)
app.use("/superuser", userRoutes)
app.use("/dashboard", dahsboardRoutes)
app.listen(port, () => {
  console.log("listening on port " + port)
})
