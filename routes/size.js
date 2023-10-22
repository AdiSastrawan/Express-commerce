import express from "express";
import { Size } from "../models/Size.js";
import authToken from "../middleware/authToken.js";
import mongoose from "mongoose";

const route = express.Router();

route.get("/", authToken, (req, res) => {
  Size.find().then(function (data) {
    res.send(data);
  });
});
route.post("/", authToken, (req, res) => {
  const product = new Size({
    name: req.body.name,
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
  Size.findById(req.params.id)
    .then((data) => {
      return res.json(data);
    })
    .catch((err) => {
      console.error(err);
    });
});
route.put("/:id", authToken, (req, res) => {
  Size.findByIdAndUpdate(req.params.id, { name: req.body.name }).then((data, err) => {
    if (err) res.send({ message: err.message });
    res.json({ message: "Succesfully update data" });
  });
});
route.delete("/:id", authToken, (req, res) => {
  Size.findByIdAndDelete(req.params.id).then((err) => {
    if (err) res.send({ message: err.message });
    res.json({ message: "Succesfully delete data" });
  });
});
export default route;
