import * as dotenv from "dotenv";
import mongoose from "mongoose";
import logger from "./logger.js";

dotenv.config();

export default function connectToDB() {
  mongoose
    .connect(
      `mongodb+srv://admin:${process.env.MONGO_DATABASE_URL}@cluster0.dvz7pba.mongodb.net/?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => {
      logger.info("Connection to MongoDB successful", {
        api: "server",
      });
    })
    .catch((err) => {
      logger.error("Error connecting to MongoDB", {
        api: "server",
      });
      logger.error(err, {
        api: "server",
      });
    });
}
