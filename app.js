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

function registerUser(req, res) {
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

  connection.beginTransaction();

  //   // Insert into faculty
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
        res.status(409).send({ message: "User already exists" });
        connection.rollback();
      } else {
        connection.query(
          "SELECT * from foapa WHERE foapaNumber = ?",
          [foapaNumber],
          (err, rows) => {
            if (err) {
              res.status(409).send({ message: "FOAPA already exists" });
              connection.rollback();
            }

            if (rows.length <= 0) {
              connection.query("INSERT INTO foapa VALUES(?,?)", [
                employmentNumber,
                foapaNumber,
              ]);
            }

            connection.query(
              "INSERT INTO possesses VALUES(?,?)",
              [employmentNumber, foapaNumber],
              (err) => {
                res.status(200).send("success");
                connection.commit();
              }
            );
          }
        );
      }
    }
  );
}

app.get("/api/retrieveFoapaNumbers", (req) => {
  const employmentNumber = req.query.employmentNumber;
  console.log("this is the employment number " + employmentNumber);
  connection.query(
    "SELECT * FROM possesses WHERE employmentNumber = ?",
    [employmentNumber],
    (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Error retrieving data" });
      } else {
        res.json(rows);
      }
    }
  );
});

app.post("/api/register", registerUser);

app.get("/close", () => {
  connection.end();
});

process
  .on("unhandledRejection", (reason, p) => {
    console.error(reason, "Unhandled Rejection at Promise", p);
  })
  .on("uncaughtException", (err) => {
    console.error(err, "Uncaught Exception thrown");
    connection.end();
    process.exit(1);
  });
