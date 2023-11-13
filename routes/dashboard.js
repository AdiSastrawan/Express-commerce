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
  const transaction = await Transaction.aggregate([
    { $unwind: "$products" },
    {
      $group: {
        _id: "$_id", // You need to group by the transaction ID or any other unique identifier
        total_price: {
          $sum: {
            $multiply: ["$products.price", "$products.quantity"],
          },
        },
        data: { $first: "$$ROOT" }, // Preserve other fields in the document
      },
    },
    { $limit: 5 },
    {
      $sort: { "data.created_at": -1 }, // Assuming there's a createdAt field for the transaction
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ["$data", { total_price: "$total_price" }],
        },
      },
    },
  ])
  return res.json(transaction)
})
route.get("/annual-transaction", adminMiddleware, async (req, res) => {
  const currentYear = new Date().getFullYear()
  const transaction = await Transaction.aggregate([
    {
      $match: {
        created_at: {
          $gte: new Date(currentYear, 0, 1), // Start of the current year
          $lt: new Date(currentYear + 1, 0, 1), // Start of the next year
        },
      },
    },
    {
      $unwind: "$products", // Deconstruct the products array
    },
    {
      $group: {
        _id: {
          month: { $month: "$created_at" }, // Extract month from created_at field
          year: { $year: "$created_at" }, // Extract year from created_at field
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
route.get("/count-costumer", adminMiddleware, async (req, res) => {
  const costumer = await Role.findOne({ name: "costumer" })
  const user = await User.count({ role_id: costumer._id })
  return res.json({ amount: user })
})
route.get("/count-admin", adminMiddleware, async (req, res) => {
  const admin = await Role.findOne({ name: "admin" })
  const user = await User.count({ role_id: admin._id })
  return res.json({ amount: user })
})
export default route
