import nodemailer from "nodemailer"
import dotenv from "dotenv"
import invoice from "../template/email/invoice.js"
dotenv.config()
const sendEmail = (email, html, subject = "From losientosupply") => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
  })

  let mailOptions = {
    from: "wilsonlosiento88@gmail.com",
    to: email,
    subject: subject,
    html: html,
  }
  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error " + err)
    } else {
      console.log("Email sent successfully")
    }
  })
}

export default sendEmail
