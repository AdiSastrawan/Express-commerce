import dotenv from "dotenv"
import { google } from "googleapis"

dotenv.config()

const code = "4/0AfJohXlqVCoTgOqEMPB6zIoEkho_UBDcUF2f4k4sT_tHbAcPTlUzYC6H3zRYu31z-l_cJg"
const oauth2Client = new google.auth.OAuth2(process.env.OAUTH_CLIENTID, process.env.OAUTH_CLIENT_SECRET, process.env.GMAIL_OAUTH_REDIRECT_URL)

const getToken = async () => {
  const { tokens } = await oauth2Client.getToken(code)
  console.info(tokens)
}
getToken()
