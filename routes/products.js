import express from "express";
import { Product } from "../models/Product.js";
import authToken from "../middleware/authToken.js";

const route = express.Router();

route.get("/", authToken, (req, res) => {
  console.log(req.user);
  Product.find({}).then(function (data) {
    res.send({ data: data });
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
