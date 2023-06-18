import express from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import connectToDB from "./db.js";
import auth from "./routes/auth.js";
import userInformationRouter from "./routes/userInformation.js";
import foapaInformationRouter from "./routes/foapaInformation.js";
import reimbursementInformation from "./routes/reimbursementInformation.js";
import pdfInformation from "./routes/pdfInformation.js";
import geographyInformation from "./routes/geographyInformation.js";
import sgMail from "@sendgrid/mail";
import nodemailer from "nodemailer";
dotenv.config();
sgMail.setApiKey(process.env.UDM_EMAIL_KEY);
const port = process.env.PORT || 8080;

const app = express();

// create reusable transporter object using the default SMTP transport
export const transporter = nodemailer.createTransport({
  host: process.env.SEND_GRID_HOST,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "apikey", // generated ethereal user
    pass: process.env.SEND_GRID_KEY, // generated ethereal password
  },
});

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(port, () => {
  connectToDB();

  console.log("Server started on port 8080");
});

app.use("/api", userInformationRouter);
app.use("/api", foapaInformationRouter);
app.use("/api", reimbursementInformation);
app.use("/api", pdfInformation);
app.use("/api", geographyInformation);
app.use("/api", auth);
