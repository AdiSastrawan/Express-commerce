import express from "express";
import { Product } from "../models/Product.js";
import { Stock } from "../models/Stock.js";
import authToken from "../middleware/authToken.js";
import mongoose from "mongoose";
import storage from "../config/storageConfig.js";
import fs from "fs";
import multer from "multer";

const upload = multer({ storage: storage });

const route = express.Router();

route.get("/", (req, res) => {
  const page = req.query.page || 1;
  const displayPage = 10;
  Product.find({})
    .populate({ path: "stock", select: "quantity", populate: { path: "size_id", select: "name" } })
    .populate({ path: "type", select: "name" })
    .select("name price image type stock desc")
    .limit(displayPage)
    .skip(displayPage * (page - 1))
    .then(function (data) {
      Product.estimatedDocumentCount().then((count) => {
        return res.json({ data, displayPage: displayPage, prev: page - 1 < 1 ? null : page - 1, next: Math.abs(count / displayPage) > page + 1 ? page + 1 : null, totalData: count, current: page });
      });
    })
    .catch(function (err) {
      res.sendStatus(500).json({ error: "Internal Server Error" });
    });
});
route.post("/", authToken, upload.single("image"), async (req, res) => {
  // console.log(JSON.parse(req.body.stock));
  // return 0;
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    image: req.file.path,
    type: req.body.type,
    desc: req.body.desc,
    stock: null,
  });
  console.log(typeof req.body.stock);

  let temp = typeof req.body.stock == "object" ? [...req.body.stock] : [...JSON.parse(req.body.stock)];
  temp.forEach((e) => {
    e["product_id"] = product._id;
  });
  const stock = await Stock.insertMany(temp);
  product.stock = stock.map((stock) => stock._id);
  try {
    await product.save();
    return res.send(product);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});
route.get("/:id", authToken, (req, res) => {
  Product.findById(req.params.id)
    .populate({ path: "stock", select: "quantity", populate: { path: "size_id", select: "name" } })
    .populate({ path: "type", select: "name" })
    .select("name price image type stock desc")
    .then((data) => {
      res.json(data);
    });
});
route.put("/:id", authToken, upload.single("image"), async (req, res) => {
  let temp = typeof req.body.stock == "object" ? [...req.body.stock] : [...JSON.parse(req.body.stock)];
  temp.forEach(async (element) => {
    // console.log(element);
    await Stock.findOneAndUpdate({ $and: [{ product_id: req.params.id }, { size_id: element.size_id }] }, { quantity: element.quantity });
  });
  // return 0;
  if (req.file) {
    const product = await Product.findById(req.params.id);
    fs.unlink(product.image, (e) => {
      if (e) throw e;
      console.log(`succesfully delete ${product.image}`);
    });
    Product.findByIdAndUpdate(req.params.id, { name: req.body.name, price: req.body.price, image: req.file.path, type: req.body.type, desc: req.body.desc }).then((data, err) => {
      if (err) return res.send({ message: err.message });
      return res.json({ message: "Succesfully update data" });
    });
  } else {
    Product.findByIdAndUpdate(req.params.id, { name: req.body.name, price: req.body.price, type: req.body.type, desc: req.body.desc }).then((data, err) => {
      if (err) return res.send({ message: err.message });
      return res.json({ message: "Succesfully update data" });
    });
  }
});
route.delete("/:id", authToken, (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then(() => {
      Stock.deleteMany({ product_id: req.params.id }).then(() => {
        return res.json({ message: "Succesfully delete data" });
      });
    })
    .catch((err) => {
      return res.sendStatus(500).json({ message: err });
    });
});
export default route;
