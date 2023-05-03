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
var dir = "/uploads";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));

app.post(
  "/upload-activity-receipts",
  upload.array("receipt-images", 12),
  function (req, res, next) {
    console.log(JSON.stringify(req.file));
    let response = "";
    for (let i = 0; i < req.files.length; i++) {
      //XxXxXx is the delimeter cause i cant be bothered to think of sth better
      response += `${req.files[i].path}XxXxXx`;
    }

    return res.send(response);
  }
);

app.use("/api", userInformationRouter);
app.use("/api", foapaInformationRouter);
app.use("/api", reimbursementInformation);
app.use("/api", pdfInformation);
