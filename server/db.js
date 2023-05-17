import * as dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export default function connectToDB() {
  // mongoose
  //   .connect("mongodb://127.0.0.1:27017/reimbursement_db", {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //   })
  //   .then(() => {
  //     console.log("Connection successful");
  //   })
  //   .catch((err) => {
  //     console.error("Error", err);
  //   });
  mongoose
    .connect(
      `mongodb+srv://admin:${process.env.MONGO_DATABASE_URL}@cluster0.dvz7pba.mongodb.net/?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => {
      console.log("Connection successful");
    })
    .catch((err) => {
      console.error("Error", err);
    });
}
