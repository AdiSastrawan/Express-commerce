import express from "express";
import { Product } from "../models/Product.js";
import authToken from "../middleware/authToken.js";
import mongoose from "mongoose";

const route = express.Router();

route.get("/", (req, res) => {
  Product.find({})
    .populate({ path: "stock", select: "quantity", populate: { path: "size_id", select: "name" } })
    .populate({ path: "type", select: "name" })
    .select("name price image type stock")
    .then(function (data) {
      res.json(data);
    })
    .catch(function (err) {
      res.sendStatus(500).json({ error: "Internal Server Error" });
    });
});
route.post("/", authToken, (req, res) => {
  const product = new Product({
    name: req.query.name,
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
route.get("/:id", authToken, (req, res) => {
  Product.findById(req.params.id)
    .populate({ path: "stock", select: "quantity", populate: { path: "size_id", select: "name" } })
    .populate({ path: "type", select: "name" })
    .select("name price image type stock")
    .then((data) => {
      res.json(data);
    });
});
route.put("/:id", authToken, (req, res) => {
  Product.findByIdAndUpdate(req.params.id, { name: req.query.name, price: req.query.price, image: req.query.image, type: req.query.type, stock: req.query.stock }).then((data, err) => {
    if (err) res.send({ message: err.message });
    res.json({ message: "Succesfully update data" });
  });
});
route.delete("/:id", authToken, (req, res) => {
  Product.findByIdAndDelete(req.params.id).then((err) => {
    if (err) res.send({ message: err.message });
    res.json({ message: "Succesfully delete data" });
  });
});
export default route;
