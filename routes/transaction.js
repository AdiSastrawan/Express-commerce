import express from "express";
import authToken from "../middleware/authToken.js";
import { Transaction } from "../models/Transaction.js";
import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { Stock } from "../models/Stock.js";
import { Size } from "../models/Size.js";

const route = express.Router();

route.get("/", authToken, (req, res) => {
  Transaction.find({ user_email: req.user.email }).then(function (data) {
    res.send({ data: data });
  });
});

route.post("/", authToken, (req, res) => {
  console.log(req.body.products);
  const products = typeof req.body.products == "object" ? req.body.products : JSON.parse(req.body.products);

  products.forEach(async (element) => {
    try {
      await Cart.findByIdAndRemove(element.id);
      const size = await Size.findOne({ name: element.size });
      const find = await Stock.findOne({ $and: [{ product_id: element.product_id }, { size_id: size._id }] });
      find.quantity = find.quantity - parseInt(element.quantity);
      await find.save();
    } catch (error) {
      return res.sendStatus(404).json({ message: "Cart id not found" });
    }
  });
  const transaction = new Transaction({
    products: products.map((product) => {
      return { name: product.name, quantity: product.quantity, size: product.size, price: product.price };
    }),
    user_name: req.user.name,
    user_email: req.user.email,
  });
  transaction.save().then(() => {
    return res.json({ success: true, message: "Successfully add data" });
  });
});

export default route;
