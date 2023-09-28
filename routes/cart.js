import { Cart } from "../models/Cart.js";
import authToken from "../middleware/authToken.js";
import express from "express";

const router = express.Router();

router.get("/", authToken, (req, res) => {
  console.log(req.user.id);
  Cart.find({ user: req.user.id })
    .populate({
      path: "product",
      select: "name price image ",
    })
    .populate({
      path: "user",
      select: "username email",
    })
    .populate({
      path: "size",
      select: "name",
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
    })
    .populate({ path: "size" })
    .populate({
      path: "user",
      select: "username email",
    })
    .then((data) => {
      res.json(data);
    });
});
router.post("/", authToken, async (req, res) => {
  const findCart = await Cart.findOne({ $and: [{ size: req.query.size }, { product: req.query.product }, { user: req.query.user }] });
  if (findCart != null) {
    findCart.quantity = parseInt(findCart.quantity) + parseInt(req.query.quantity);
    try {
      await findCart.save();
      return res.json({ message: "Cart saved successfully" });
    } catch (error) {
      return res.json({ error: error.message });
    }
  }
  const cart = new Cart({
    quantity: req.query.quantity,
    size: req.query.size,
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
