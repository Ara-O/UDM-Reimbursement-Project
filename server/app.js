import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import connectToDB from "./db.js";
import userInformationRouter from "./routes/userInformation.js";
import foapaInformationRouter from "./routes/foapaInformation.js";
import reimbursementInformation from "./routes/reimbursementInformation.js";
import pdfInformation from "./routes/pdfInformation.js";
dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static("dist"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(8080, () => {
  connectToDB();
  console.log("Server started on port 8080");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.use("/api", userInformationRouter);
app.use("/api", foapaInformationRouter);
app.use("/api", reimbursementInformation);
app.use("/api", pdfInformation);
