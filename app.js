import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import mysql from "mysql";
import {
  facultyTable,
  foapaTable,
  possessesTable,
  activityTable,
  reimbursementTable,
  containsTable,
} from "./queries.js";
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static("dist"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Start the server
app.listen(8080, () => {
  console.log("Server started on port 8080");
});

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "password",
  database: "reimbursement_db",
});

connection.connect(function (err) {
  if (err) throw err;
});

//Creating all the necessary tables
connection.query(facultyTable, (err) => {
  if (err) console.log(err);
});

connection.query(foapaTable, (err) => {
  if (err) console.log(err);
});

connection.query(possessesTable, (err) => {
  if (err) console.log(err);
});

connection.query(activityTable, (err) => {
  if (err) console.log(err);
});

connection.query(reimbursementTable, (err) => {
  if (err) console.log(err);
});

connection.query(containsTable, (err) => {
  if (err) console.log(err);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.post("/api/register", (req, res) => {
  const {
    employmentNumber,
    firstName,
    lastName,
    workEmail,
    phoneNumber,
    password,
    mailingAddress,
    department,
    zipCode,
    city,
    state,
    foapaNumber,
  } = req.body;

  connection.query(
    "INSERT INTO Faculty VALUES(?,?,?,?,?,?,?,?,?,?,?)",
    [
      employmentNumber,
      firstName,
      lastName,
      workEmail,
      phoneNumber,
      password,
      mailingAddress,
      department,
      zipCode,
      city,
      state,
    ],
    (err) => {
      if (err) {
        console.log(err);
        if (err.code === "ER_DUP_ENTRY") {
          res.status(409).json({ message: "User already exists" });
        }
      } else {
        res.status(201).json({ message: "User created successfully" });
      }
    }
  );
  connection.query(
    "INSERT INTO foapa VALUES(?,?)",
    [
      "employmentNumber",
      foapaNumber
    ],
    (err) => {
      if (err) {
        console.log(err);
        if (err.code === "ER_DUP_ENTRY") {
          res.status(409).json({ message: "Foapa already exists" });
        }
      }
    }
  );
  connection.query(
    "INSERT INTO possesses VALUES(?,?)",
    [
      employmentNumber,
      foapaNumber
    ]
  );
});

app.get("/close", () => {
  connection.end();
});

process
  .on("unhandledRejection", (reason, p) => {
    console.error(reason, "Unhandled Rejection at Promise", p);
  })
  .on("uncaughtException", (err) => {
    console.error(err, "Uncaught Exception thrown");
    process.exit(1);
  });
