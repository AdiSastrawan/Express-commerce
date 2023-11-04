import { Cart } from "../models/Cart.js"
import authToken from "../middleware/authToken.js"
import express from "express"
import verifiedAuth from "../middleware/verifiedAuth.js"

const router = express.Router()

router.get("/", authToken, (req, res) => {
  Cart.find({ user: req.user.id })
    .populate({
      path: "product",
      select: "name price image ",
      populate: { path: "stock", select: "quantity size_id" },
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
      return res.status(200).json(data)
    })
})
router.get("/all", authToken, verifiedAuth, (req, res) => {
  Cart.find()
    .populate({ path: "product", select: "name image price", populate: { path: "stock", select: "quantity" } })
    .populate({ path: "size" })
    .populate({
      path: "user",
      select: "username email",
    })
    .then((data) => {
      res.json(data)
    })
})
router.get("/checkout", authToken, verifiedAuth, (req, res) => {
  Cart.find({ $and: [{ isSelected: true }, { user: req.user.id }] })
    .populate({ path: "product", select: "name image price", populate: { path: "stock", select: "quantity" } })
    .populate({ path: "size" })
    .populate({
      path: "user",
      select: "username email",
    })
    .then((data) => {
      res.json(data)
    })
})
router.post("/", authToken, verifiedAuth, async (req, res) => {
  const findCart = await Cart.findOne({ $and: [{ size: req.query.size }, { product: req.query.product }, { user: req.query.user }] })
  if (findCart != null) {
    findCart.quantity = parseInt(findCart.quantity) + parseInt(req.query.quantity)
    try {
      await findCart.save()
      return res.json({ message: "Cart saved successfully" })
    } catch (error) {
      return res.json({ error: error.message })
    }
  }
  const cart = new Cart({
    quantity: req.query.quantity,
    size: req.query.size,
    product: req.query.product,
    user: req.query.user,
  })

  cart
    .save()
    .then((data) => {
      res.json({ message: "Successfully created " })
    })
    .catch((err) => {
      res.status(500).json({ message: err.message })
    })
})
router.put("/select/all", verifiedAuth, authToken, (req, res) => {
  Cart.updateMany({ user: req.user.id }, { isSelected: req.body.isSelected })
    .then(() => {
      return res.json({ message: "Successfully updated" })
    })
    .catch((err) => {
      return res.json({ message: err.message })
    })
})
router.put("/:id", authToken, verifiedAuth, (req, res) => {
  Cart.findByIdAndUpdate(req.params.id, { quantity: req.body.quantity })
    .then(() => {
      return res.status(200).json({ message: "Successfully updated" })
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message })
    })
})

router.put("/select/:id", authToken, verifiedAuth, (req, res) => {
  Cart.findByIdAndUpdate(req.params.id, { isSelected: req.body.isSelected })
    .then(() => {
      return res.json({ message: "Successfully updated" })
    })
    .catch((err) => {
      return res.json({ message: err.message })
    })
})
router.delete("/:id", authToken, verifiedAuth, (req, res) => {
  Cart.findByIdAndDelete(req.params.id)
    .then(() => {
      res.json({ message: "Successfully delete" })
    })
    .catch((err) => {
      res.json({ message: err.message })
    })
})
router.delete("/", authToken, verifiedAuth, (req, res) => {
  Cart.deleteMany({ user: req.user.id })
    .then(() => res.json({ message: "Successfully delete cart" }))
    .catch((err) => {
      res.json({ message: err.message })
    })
})
export default router
