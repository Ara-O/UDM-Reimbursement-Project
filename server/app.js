import express from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import connectToDB from "./db.js";
import auth from "./routes/auth.js";
import dashboardRouter from "./routes/dashboard.js";
import userInformationRouter from "./routes/userInformation.js";
import foapaInformationRouter from "./routes/foapaInformation.js";
import reimbursementInformation from "./routes/reimbursementInformation.js";
import pdfInformation from "./routes/pdfInformation.js";
import geographyInformation from "./routes/geographyInformation.js";
import admin from "./routes/admin.js";
import sgMail from "@sendgrid/mail";
import nodemailer from "nodemailer";
import logger from "./logger.js";
import adminReimbursementInformation from "./routes/adminReimbursementInformation.js";

dotenv.config();
sgMail.setApiKey(process.env.UDM_EMAIL_KEY);

const port = process.env.PORT || 8080;

const app = express();

// export const transporter = nodemailer.createTransport({
//   host: process.env.SEND_GRID_HOST,
//   port: 465,
//   secure: true,
//   auth: {
//     user: "apikey",
//     pass: process.env.SEND_GRID_KEY,
//   },
// });

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(port, () => {
  connectToDB();

  logger.info("Server started on port 8080", {
    api: "server",
  });
});

// FACULTY
app.use("/api", userInformationRouter);
app.use("/api", foapaInformationRouter);
app.use("/api", dashboardRouter);
app.use("/api", reimbursementInformation);
app.use("/api", pdfInformation);
app.use("/api", geographyInformation);
app.use("/api", auth);
app.use("/api", admin);

// ADMIN
app.use("/admin", adminReimbursementInformation);

// HEALTH
app.use("/health", (req, res) => {
  res.status(200).send("App is running!");
});
