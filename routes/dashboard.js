import express from "express"
import adminMiddleware from "../middleware/adminMiddleware.js"
import { User } from "../models/User.js"
import { Role } from "../models/Role.js"
import { Stock } from "../models/Stock.js"
import { Transaction } from "../models/Transaction.js"
import { Product } from "../models/Product.js"
const route = express.Router()

route.get("/new-costumer", adminMiddleware, async (req, res) => {
  const costumer = await Role.findOne({ name: "costumer" })
  console.log(costumer._id)
  const user = await User.find({ role_id: costumer._id }).select("username email created_at").limit(10).sort({ created_at: -1 })
  return res.json(user)
})
route.get("/low-stock", adminMiddleware, async (req, res) => {
  const stock = await Stock.find({ quantity: { $lt: 5 } })
    .populate({ path: "product_id", select: "name price" })
    .populate({ path: "size_id", select: "name" })
  return res.json(stock)
})
route.get("/recent-transaction", adminMiddleware, async (req, res) => {
  const transaction = await Transaction.find({}).select("user_name user_email products created_at ").limit(5).sort({ created_at: -1 })
  return res.json(transaction)
})
route.get("/annual-transaction", adminMiddleware, async (req, res) => {
  const transaction = await Transaction.aggregate([
    {
      $unwind: "$products", // Deconstruct the products array
    },
    {
      $group: {
        _id: {
          month: { $month: "$created_at" }, // Extract month from created_at field
          year: { $year: "$created_at" }, // Extract year from created_at field
          productName: "$products.name", // Group by product name
        },
        totalProductPrice: { $sum: { $multiply: ["$products.price", "$products.quantity"] } }, // Calculate total price for each product
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
  ])
  return res.json(transaction)
})
route.get("/count-transaction", adminMiddleware, async (req, res) => {
  const transactionCount = await Transaction.countDocuments()
  return res.json({ amount: transactionCount })
})
route.get("/count-products", adminMiddleware, async (req, res) => {
  const productCount = await Product.countDocuments()
  return res.json({ amount: productCount })
})
export default route
