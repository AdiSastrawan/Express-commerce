import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const db_connection = async () => {
  mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.once("open", () => console.log("Connected to MongoDB"));
  db.on("error", (err) => console.error(err));
};

export default db_connection;
