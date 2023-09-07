import express from "express";
import { Product } from "../models/Product.js";
import authToken from "../middleware/authToken.js";
import db_connection from "../config/db-connection.js";

const route = express.Router();

route.get("/", authToken, (req, res) => {
  const sql = `SELECT * FROM products`;
  db_connection.query(sql, (err, data) => {
    if (err) {
      throw err;
    }
    res.json(data);
  });
});
route.post("/", authToken, (req, res) => {
  const product = new Product({
    name: req.query.name,
    size: req.query.size,
    price: req.query.price,
    image: req.query.image,
    type: req.query.type,
    stock: req.query.stock,
  });
  product
    .save()
    .then((doc) => {
      res.send({ user: req.user, message: "Succesfully insert data" });
    })
    .catch((err) => {
      res.send({ message: err.message });
    });
});
export default route;
