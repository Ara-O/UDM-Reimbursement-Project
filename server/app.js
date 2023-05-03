import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import userInformationRouter from "./routes/userInformation.js";
import foapaInformationRouter from "./routes/foapaInformation.js";
import reimbursementInformation from "./routes/reimbursementInformation.js";
import pdfInformation from "./routes/pdfInformation.js";
import { createTables } from "./db.js";
import multer from "multer";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static("dist"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

createTables();

app.listen(8080, () => {
  console.log("Server started on port 8080");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

let upload = multer({ storage: storage });
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));

app.post(
  "/profile-upload-multiple",
  upload.array("receipt-images", 12),
  function (req, res, next) {
    // req.files is array of `profile-files` files
    // req.body will contain the text fields, if there were any
    console.log(JSON.stringify(req.file));
    let response = "";
    for (let i = 0; i < req.files.length; i++) {
      response += `${req.files[i].path}XxXxXx`;
    }

    return res.send(response);
  }
);

app.use("/api", userInformationRouter);
app.use("/api", foapaInformationRouter);
app.use("/api", reimbursementInformation);
app.use("/api", pdfInformation);
