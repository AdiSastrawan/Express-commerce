import { Cart } from "../models/Cart.js";
import authToken from "../middleware/authToken.js";
import express from "express";

const router = express.Router();

router.get("/", authToken, (req, res) => {
  Cart.find({ user: req.user.id })
    .populate({
      path: "product",
      select: "name price ",
      populate: { path: "stock", select: "quantity size_id", populate: { path: "size_id", select: "name" } },
    })
    .populate({
      path: "user",
      select: "username email",
    })
    .then((data) => {
      res.json(data);
    });
});
router.get("/all", authToken, (req, res) => {
  Cart.find()
    .populate({
      path: "product",
      select: "name price ",
      populate: { path: "stock", select: "quantity size_id", populate: { path: "size_id", select: "name" } },
    })
    .populate({
      path: "user",
      select: "username email",
    })
    .then((data) => {
      res.json(data);
    });
});
router.post("/", authToken, (req, res) => {
  const cart = new Cart({
    quantity: req.query.quantity,
    product: req.query.product,
    user: req.query.user,
  });

  cart
    .save()
    .then((data) => {
      res.json({ message: "Successfully created " });
    })
    .catch((err) => {
      res.json({ message: err.message });
    });
});
router.delete("/:id", authToken, (req, res) => {
  Cart.findByIdAndDelete(req.params.id)
    .then(() => {
      res.json({ message: "Successfully delete" });
    })
    .catch((err) => {
      res.json({ message: err.message });
    });
});
router.delete("/", authToken, (req, res) => {
  Cart.deleteMany({ user: req.user.id })
    .then(() => res.json({ message: "Successfully delete cart" }))
    .catch((err) => {
      res.json({ message: err.message });
    });
});
export default router;
