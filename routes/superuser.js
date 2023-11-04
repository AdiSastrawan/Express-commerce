import express from "express"
import { User } from "../models/User.js"
import { Role } from "../models/Role.js"
import bcrypt from "bcrypt"
import superUserMiddleware from "../middleware/superuserMiddleware.js"

const route = express.Router()

route.get("/list-admin", superUserMiddleware, async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const displayPage = parseInt(req.query.display) || 5
  const admin = await Role.findOne({ name: "admin" })
  const query = req.query.search ? { name: { $regex: req.query.search.toString(), $options: "i" }, role_id: admin._id } : { role_id: admin._id }
  try {
    const user = await User.find({ role_id: admin._id })
      .select(" username email created_at verified_at ")
      .limit(displayPage)
      .skip(displayPage * (page - 1))
    User.countDocuments(query).then((count) => {
      return res.json({ data: user, displayPage: displayPage, prev: page - 1 < 1 ? null : page - 1, next: count - parseInt(displayPage * page) >= 0 ? page + 1 : null, totalData: count, current: page })
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: { message: error.message } })
  }
})
route.post("/admin", superUserMiddleware, async (req, res) => {
  const { username, password } = req.body
  const admin = await Role.findOne({ name: "admin" })
  const user = new User({
    username: username,
    password: await bcrypt.hash(password, 10),
    role_id: admin._id,
    email: `${username.toLowerCase()}@losiento.com`,
  })
  try {
    await user.save()
    return res.status(200).json({ message: "User created successfully" })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: { message: error.message } })
  }
})
route.put("/admin/:id", superUserMiddleware, async (req, res) => {
  const { username, password } = req.body
  const user = await User.findById(req.params.id)
  console.log(req.body)
  user.username = username
  if (password) {
    user.password = await bcrypt.hash(password, 10)
  }
  try {
    await user.save()
    return res.status(200).json({ message: "User edit successfully" })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: { message: error.message } })
  }
})
route.get("/admin/:id", superUserMiddleware, async (req, res) => {
  const { id } = req.params

  const user = await User.findById(id)
  if (user) {
    return res.status(200).json(user)
  } else {
    return res.status(404).json({ error: { message: "User not found" } })
  }
})
route.delete("/admin/:id", superUserMiddleware, async (req, res) => {
  const { id } = req.params

  const user = await User.findById(id)
  if (user) {
    await user.deleteOne()
    return res.status(204).json({ error: { message: "User deleted" } })
  } else {
    return res.status(404).json({ error: { message: "User not found" } })
  }
})

export default route
