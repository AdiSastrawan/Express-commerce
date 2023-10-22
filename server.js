import express from "express"
import productRoutes from "./routes/products.js"
import authRoutes from "./routes/auth.js"
import typeRoutes from "./routes/types.js"
import sizeRoutes from "./routes/size.js"
import cartRoutes from "./routes/cart.js"
import stockRoutes from "./routes/stocks.js"
import roleRoutes from "./routes/role.js"
import transactionRoutes from "./routes/transaction.js"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

import cors from "cors"
import cookieParser from "cookie-parser"
import db_connection from "./config/db-connection.js"
import credentials from "./middleware/credentials.js"
import corsOptions from "./config/corsOptions.js"
import sendEmail from "./utils/sendEmail.js"
import invoice from "./template/email/invoice.js"
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
// sendEmail(
//   "aykens110703@gmail.com",
//   invoice({
//     _id: "X5oJ6dbV",
//     products: [
//       { name: "I Love myself T-Shirt", price: 400003, quantity: "1", size: "M", _id: { $oid: "65338e791c250576a3d29561" } },
//       { name: "I tried to be perfect", price: 120000, quantity: "1", size: "S", _id: { $oid: "65338e791c250576a3d29562" } },
//     ],
//     user_name: "Aykens",
//     user_email: "aykens110703@gmail.com",
//     information: { country: "Indonesia", first_name: "Adi", last_name: "Sastrawan", address: "Shivananda Villa", city: "Buleleng", post_code: "81152", phone: "+6289685756351" },
//     created_at: Date.now(),
//     modified_at: Date.now(),
//   }),
//   "Thank you for your order!!"
// )
app.listen(port, () => {
  console.log("listening on port " + port)
})
