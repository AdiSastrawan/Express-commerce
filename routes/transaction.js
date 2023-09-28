import express from "express";
import authToken from "../middleware/authToken.js";
import { Transaction } from "../models/Transaction.js";

const route = express.Router();

route.get("/", authToken, (req, res) => {
  Transaction.find().then(function (data) {
    res.send({ data: data });
  });
});
route.post("/", authToken, (req, res) => {
  const transaction = new Transaction({
    products: [{ name: "BurgerKill", price: 200000, quantity: 20, size: "L" }],
    user_name: req.user.name,
    user_email: req.user.email,
  });
  console.log(transaction);
  transaction.save().then(() => {
    return res.json({ success: true, message: "Successfully add data" });
  });
});

export default route;
