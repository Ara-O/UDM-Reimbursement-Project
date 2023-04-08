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

connection.connect();

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
  connection.query(
    "INSERT INTO Faculty VALUES(?,?,?,?,?,?,?,?,?,?,?)",
    [
      req.body.employmentNumber,
      req.body.firstName,
      req.body.lastName,
      req.body.workEmail,
      req.body.phoneNumber,
      req.body.password,
      req.body.mailingAddress,
      req.body.department,
      req.body.zipCode,
      req.body.city,
      req.body.state,
    ],
    (err) => {
      console.log(err.code);
      if (err.code === "ER_DUP_ENTRY") {
        res.status(400).json({ message: "User already exists" });
      }

      connection.end();
    }
  );

  // res.send("hello api post :) + ", JSON.stringify(data));
});

app.get("/close", () => {
  connection.end();
});
