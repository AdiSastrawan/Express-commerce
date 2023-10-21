import express from "express";
import authToken from "../middleware/authToken.js";
import { Transaction } from "../models/Transaction.js";
import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { nanoid } from "nanoid";
import { Stock } from "../models/Stock.js";
import { Size } from "../models/Size.js";

const route = express.Router();

route.get("/", authToken, (req, res) => {
  Transaction.find({ user_email: req.user.email }).then(function (data) {
    res.send({ data: data });
  });
});

route.post("/", authToken, async (req, res) => {
  try {
    console.log(req.body);
    const products = typeof req.body.products == "object" ? req.body.products : JSON.parse(req.body.products);
    let isError = false;
    for (let i = 0; i < products.length; i++) {
      const cart = await Cart.findByIdAndRemove(products[i].id);
      const size = await Size.findOne({ name: products[i].size });
      const find = await Stock.findOne({ $and: [{ product_id: products[i].product_id }, { size_id: size._id }] });
      find.quantity = find.quantity - parseInt(products[i].quantity);
      await find.save();
    }
    if (isError == true) throw new Error("Cart not Found");

    const transaction = new Transaction({
      _id: nanoid(8),
      products: products.map((product) => {
        return { name: product.name, quantity: product.quantity, size: product.size, price: product.price };
      }),
      user_name: req.user.name,
      user_email: req.user.email,
      information: req.body.information,
    });
    await transaction.save();
    return res.json({ success: true, message: "Successfully add data" });
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

export default route;
