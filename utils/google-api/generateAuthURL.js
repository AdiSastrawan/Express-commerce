import dotenv from "dotenv"
import { google } from "googleapis"
dotenv.config()
const oauth2Client = new google.auth.OAuth2(process.env.OAUTH_CLIENTID, process.env.OAUTH_CLIENT_SECRET, process.env.GMAIL_OAUTH_REDIRECT_URL)
const GMAIL_SCOPES = ["https://mail.google.com/", "https://www.googleapis.com/auth/gmail.modify", "https://www.googleapis.com/auth/gmail.compose", "https://www.googleapis.com/auth/gmail.send"]

const url = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: GMAIL_SCOPES,
})

console.info(`authUrl: ${url}`)
