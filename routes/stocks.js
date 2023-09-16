import express from "express";
import { Stock } from "../models/Stock.js";
import authToken from "../middleware/authToken.js";
import mongoose from "mongoose";

const route = express.Router();

route.get("/", authToken, (req, res) => {
  Stock.find().then(function (data) {
    res.send({ data: data });
  });
});
route.post("/", authToken, (req, res) => {
  const product = new Stock({
    quantity: req.query.quantity,
    product_id: req.query.product_id,
    size_id: req.query.size_id,
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
  Stock.findById(req.params.id).then((data) => {
    res.json({ data });
  });
});
route.put("/:id", authToken, (req, res) => {
  Stock.findByIdAndUpdate(req.params.id, {
    quantity: req.query.quantity,
    product_id: req.query.product_id,
    size_id: req.query.size_id,
  }).then((data, err) => {
    if (err) res.send({ message: err.message });
    res.json({ message: "Succesfully update data" });
  });
});
route.delete("/:id", authToken, (req, res) => {
  Stock.findByIdAndDelete(req.params.id).then((err) => {
    if (err) res.send({ message: err.message });
    res.json({ message: "Succesfully delete data" });
  });
});
export default route;
