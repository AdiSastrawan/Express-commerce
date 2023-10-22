import express from "express";
import { Type } from "../models/Type.js";
import authToken from "../middleware/authToken.js";
import mongoose from "mongoose";
import multer from "multer";
import storage from "../config/storageConfig.js";
import fs from "fs";
const route = express.Router();
const upload = multer({ storage: storage });
route.get("/", authToken, (req, res) => {
  Type.find().then(function (data) {
    res.send({ data: data });
  });
});
route.post("/", upload.single("image"), authToken, (req, res) => {
  const type = new Type({
    name: req.body.name,
    image: req.file.path || null,
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
  console.log(req.params.id);
  Type.findOne({ _id: req.params.id }).then((result) => {
    return res.send(result);
  });
});
route.put("/:id", upload.single("image"), authToken, async (req, res) => {
  if (req.file) {
    const type = await Type.findById(req.params.id);
    if (type.image != null) {
      fs.unlink(type.image, (e) => {
        if (e) throw e;
        console.log(`succesfully delete ${type.image}`);
      });
    }
    Type.findByIdAndUpdate(req.params.id, { name: req.body.name, image: req.file.path }).then((data, err) => {
      if (err) return res.send({ message: err.message });
      return res.json({ message: "Succesfully update data" });
    });
  } else {
    Type.findByIdAndUpdate(req.params.id, { name: req.body.name }).then((data, err) => {
      if (err) return res.send({ message: err.message });
      return res.json({ message: "Succesfully update data" });
    });
  }
});
route.delete("/:id", authToken, (req, res) => {
  Type.findByIdAndDelete(req.params.id).then((err) => {
    if (err) res.send({ message: err.message });
    res.json({ message: "Succesfully delete data" });
  });
});
export default route;
