import express from "express";
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";
import db_connection from "./config/db-connection.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use("/", authRoutes);
app.use("/product", productRoutes);

app.get("/users", (request, response) => {
  db_connection.query("SELECT * FROM users", (error, data) => {
    if (error) {
      console.error(error);
      response.status(500).send("Error retrieving users");
    } else {
      response.send(data);
    }
  });
});
app.listen(port, () => {
  console.log("listening on port " + port);
});
