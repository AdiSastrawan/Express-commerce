import express from "express";
import { Type } from "../models/Type.js";
import authToken from "../middleware/authToken.js";
import mongoose from "mongoose";

const route = express.Router();

route.get("/", authToken, (req, res) => {
  Type.find().then(function (data) {
    res.send({ data: data });
  });
});
route.post("/", authToken, (req, res) => {
  const type = new Type({
    name: req.query.name,
  });
  type
    .save()
    .then((doc) => {
      res.send({ user: req.user, message: "Succesfully insert data" });
    })
    .catch((err) => {
      res.send({ message: err.message });
    });
});
route.get("/:id", authToken, (req, res) => {
  Type.findOne({ _id: req.params.id }).then((result) => {
    res.send(result);
  });
});
route.put("/:id", authToken, (req, res) => {
  Type.findByIdAndUpdate(req.params.id, { name: req.query.name }).then((data, err) => {
    if (err) res.send({ message: err.message });
    res.json({ message: "Succesfully update data" });
  });
});
route.delete("/:id", authToken, (req, res) => {
  Type.findByIdAndDelete(req.params.id).then((err) => {
    if (err) res.send({ message: err.message });
    res.json({ message: "Succesfully delete data" });
  });
});
export default route;
