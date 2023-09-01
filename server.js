import express from "express";
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";
import db_connection from "./config/db-connection.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
db_connection();
app.use(express.json());
app.use("/", authRoutes);
app.use("/product", productRoutes);
app.listen(port, () => {
  console.log("listening on port " + port);
});
