import express from "express"
import bcrypt from "bcrypt"
import { User } from "../models/User.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import generateToken from "../utils/generateToken.js"
import authToken from "../middleware/authToken.js"
import { Role } from "../models/Role.js"
import { OTPVerification } from "../models/OTPVerification.js"
import sendEmail from "../utils/sendEmail.js"
import verification from "../template/email/verification.js"
import validation from "../middleware/validation.js"
import { validationRegister } from "../utils/validation.js"
import { PasswordReset } from "../models/PasswordReset.js"

dotenv.config()
const route = express.Router()
route.post("/token", async (req, res) => {
  const refreshToken = req.cookies.jwt
  if (refreshToken == null) return res.status(401).json({ message: "Not authenticated" })
  const user = await User.findOne({ refresh_token: refreshToken })
  if (!user) {
    return res.status(400).json({ message: "Invalid Token" })
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, payload) => {
    if (!err) {
      const accessToken = generateToken({ id: payload.id, name: payload.name, email: payload.email, role: payload.role, verified: payload.verified })
      return res.json({ accessToken: accessToken })
    } else {
      return res.sendStatus(403)
    }
  })
})
route.post("/login", async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ $or: [{ username: username }, { email: username }] }).populate({ path: "role_id", select: "name" })
  if (!user) {
    return res.status(400).json({ error: { message: "Username or Password Incorrect" } })
  }
  bcrypt.compare(password, user.password).then((match) => {
    if (!match) {
      return res.status(400).json({ error: { message: "Username or Password Incorrect" } })
    } else {
      const payload = {
        id: user._id,
        name: user.username,
        email: user.email,
        role: user.role_id.name,
        verified: user.verified,
      }
      const accessToken = generateToken(payload)
      const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN)
      user.refresh_token = refresh_token
      user.save().then((u) => {
        res.cookie("jwt", refresh_token, { httpOnly: true, secure: true, sameSite: "None", maxAge: 24 * 60 * 60 * 1000 })
        res.json({ accessToken })
      })
    }
  })
})
route.post("/reset-password", async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (user == null) {
    return res.status(400).json({ error: { value: "email", message: "Email does not exist" } })
  }
  const match = await bcrypt.compare(req.body.password, user.password)
  if (match) {
    return res.status(400).json({ error: { value: "password", message: "Password is the same as the current password" } })
  }

  const hashedPass = await bcrypt.hash(req.body.password, 10)
  let code = Math.floor(Math.random() * 8999) + 1000
  const passReset = new PasswordReset({
    user_id: user._id,
    code: code,
    new_password: hashedPass,
    expired_at: Date.now() + 300000,
  })
  await passReset.save()
  sendEmail(req.body.email, verification(code), "Verify Password Reset")
  return res.status(200).json({ message: "verification has sent" })
})
route.post("/verify-reset-password", async (req, res) => {
  const { otp } = req.body
  const passRes = await PasswordReset.findOne({ code: otp })
  if (!passRes) {
    return res.status(400).json({ message: "Invalid Token" })
  }
  if (passRes.expired_at > Date.now()) {
    try {
      const user = await User.findByIdAndUpdate(passRes.user_id, { password: passRes.new_password, refresh_token: null })
      await passRes.deleteOne()
      res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true })
      return res.status(200).json({ message: "Succesfully update password" })
    } catch (error) {
      return res.json({ error: { message: error.message } })
    }
  }
  return res.status(400).json({ message: "Token Expired" })
})
route.post("/register", validation(validationRegister), async (req, res) => {
  const { username, email, password, confirm_password } = req.body
  if (password != confirm_password) {
    return res.status(400).send({ error: { message: "Confirm password is not the same" } })
  }

  const findEmail = await User.findOne({ email: email })
  if (findEmail) {
    return res.status(400).json({ error: { message: "Email already existed" } })
  }
  const role = await Role.findOne({ name: "costumer" })
  if (role == null) {
    res.json({ error: { message: "Role does not exist" } })
    return 0
  }
  bcrypt.hash(password, 10).then((hash) => {
    const user = new User({
      username: username,
      email: email,
      password: hash,
      role_id: role._id,
      // refresh_token: jwt.sign({ name: username, email: email }, process.env.REFRESH_TOKEN),
    })
    let code = Math.floor(Math.random() * 8999) + 1000
    sendEmail(email, verification(code), "Verify your email")

    const otp = new OTPVerification({
      user_id: user._id,
      code: code,
      expired_at: Date.now() + 300000,
    })
    otp.save().then(() => {
      console.log("has been created")
    })

    user
      .save()
      .then((data) => {
        const payload = {
          id: data._id,
          name: username,
          email: email,
          role: role.name,
          verified: data.verified,
        }
        User.findByIdAndUpdate(data._id, { refreshToken: jwt.sign(payload, process.env.REFRESH_TOKEN) }).then(() => {
          const accessToken = generateToken(payload)
          res.cookie("jwt", user.refresh_token, { secure: true, httpOnly: true, sameSite: "None", maxAge: 86400000 })
          return res.json({ accessToken, message: "Verify your account" })
        })
      })
      .catch((error) => {
        res.send({ message: "Error: " + error.message })
      })
  })
})
route.post("/resendOTP", authToken, async (req, res) => {
  const verifications = await OTPVerification.findOne({ user_id: req.user.id })
  let code = Math.floor(Math.random() * 8999) + 1000
  sendEmail(req.user.email, verification(code), "Verify your email")

  verifications.code = code
  verifications.expired_at = Date.now() + 300000
  verifications
    .save()
    .then(() => {
      console.log("has been updated")
      return res.status(200).json({ message: "Code has been resend" })
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message })
    })
})
route.post("/reset-password-resendOTP", async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  const verifications = await PasswordReset.findOne({ user_id: user._id })
  let code = Math.floor(Math.random() * 8999) + 1000
  sendEmail(req.body.email, verification(code), "Verify Password Reset")

  verifications.code = code
  verifications.expired_at = Date.now() + 300000
  verifications
    .save()
    .then(() => {
      console.log("has been updated")
      return res.status(200).json({ message: "Code has been resend" })
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message })
    })
})

route.post("/verifyOTP", authToken, async (req, res) => {
  const { otp } = req.body
  const verification = await OTPVerification.findOne({ user_id: req.user.id })
  if (verification.expired_at > Date.now()) {
    if (otp != verification.code) {
      return res.status(400).json({ message: "Invalid token" })
    }
    const payload = {
      id: req.user_id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      verified: true,
    }
    User.findByIdAndUpdate(req.user.id, { verified: true, verified_at: Date.now(), refresh_token: jwt.sign(payload, process.env.REFRESH_TOKEN) })
      .then((data) => {
        const accessToken = generateToken(payload)
        res.cookie("jwt", data.refresh_token, { secure: true, httpOnly: true, sameSite: "None", maxAge: 86400000 })
        verification.deleteOne().then(() => {
          console.log("User deleted successfully")
        })
        return res.status(200).json({ message: "User updated successfully", accessToken: accessToken })
      })
      .catch((err) => {
        return res.status(400).json({ message: err.message })
      })
  } else {
    return res.status(400).json({ message: "Code expired" })
  }
})
route.delete("/logout", async (req, res) => {
  console.log(req.cookies)
  const cookies = req.cookies
  if (!cookies?.jwt) {
    return res.status(401).json({ message: "You must be logged in" })
  }
  const user = await User.findOne({ refresh_token: cookies.jwt })
  // return res.send(user);
  if (!user) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true })
    return res.sendStatus(404)
  }
  user.refresh_token = null
  user
    .save()
    .then(() => {
      res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true })
      return res.sendStatus(200)
    })
    .catch((error) => {
      res.sendStatus(400).send({ message: "Error: " + error.message })
    })
})
route.get("/user-login", authToken, async (req, res) => {
  const user = await User.findOne({ refresh_token: req.body.refresh_token })
  res.json({ name: user.username, email: user.email })
})
export default route
