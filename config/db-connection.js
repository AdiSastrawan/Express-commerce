import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();
const db_connection = mysql.createConnection({
  host: process.env.DB_URL ? process.env.DB_URL : "localhost",
  user: process.env.NODE_ENV == "DEV" ? "root" : "root",
  password: "",
  database: "commerce",
});

db_connection.connect((err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Connected to the database");
  }
});

export default db_connection;
