import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import connectToDB from "./db.js";
import userInformationRouter from "./routes/userInformation.js";
import foapaInformationRouter from "./routes/foapaInformation.js";
import reimbursementInformation from "./routes/reimbursementInformation.js";
import pdfInformation from "./routes/pdfInformation.js";
import geographyInformation from "./routes/geographyInformation.js";
import sgMail from "@sendgrid/mail";
dotenv.config();
sgMail.setApiKey(process.env.UDM_EMAIL_KEY);
const port = process.env.PORT || 8080;

const app = express();

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
