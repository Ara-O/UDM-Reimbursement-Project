import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import mysql from "mysql";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static("dist"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.post("/api/register", (req, res) => {
  let data = req.body;
  res.send("hello api post :) + ", JSON.stringify(data));
});
// Start the server
app.listen(8080, () => {
  console.log("Server started on port 8080");
});

// NOTES
//in order to run the backend server, run node app.js
//in the terminal
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "1234",
  database: "reimbursement_db"
});

connection.connect();

connection.query("CREATE TABLE IF NOT EXISTS Faculty (\n employmentNumber int NOT NULL,\n"
+ "fName varchar(45) NOT NULL,\n"
+ "lName varchar(45) NOT NULL,\n"
+ "workEmail varchar(45) NOT NULL,\n"
+ "phoneNumber varchar(45) NOT NULL,\n"
+ "password varchar(45) NOT NULL,\n"
+ "mailingAddress varchar(45) NOT NULL,\n"
+ "department varchar(45) NOT NULL,\n"
+ "zipCode int NOT NULL,\n"
+ "city varchar(45) NOT NULL,\n"
+ "state varchar(2) NOT NULL,\n"
+ "PRIMARY KEY (employmentNumber));", (err, rows, fields) => {
  if (err) console.log(err);
});

connection.query("CREATE TABLE IF NOT EXISTS FOAPA (\n foapaName varchar(45) NOT NULL,\n"
+ "foapaNumber int NOT NULL,\n"
+ "PRIMARY KEY (foapaNumber));", (err, rows, fields) => {
  if (err) console.log(err);
});

connection.query("CREATE TABLE IF NOT EXISTS Possesses (\n employmentNumber int NOT NULL,\n"
+ "foapaNumber int NOT NULL,\n"
+ "PRIMARY KEY (employmentNumber, foapaNumber),\n"
+ "FOREIGN KEY (employmentNumber) REFERENCES Faculty(employmentNumber),\n"
+ "FOREIGN KEY (foapaNumber) REFERENCES FOAPA(foapaNumber));", (err, rows, fields) => {
  if (err) console.log(err);
});

connection.query("CREATE TABLE IF NOT EXISTS Activity (\n activityId int NOT NULL,\n"
+ "foapaNumber int NOT NULL,\n"
+ "activityName varchar(45) NOT NULL,\n"
+ "activityReceipt varchar(45) NOT NULL,\n"
+ "activityDate date NOT NULL,\n"
+ "amount float NOT NULL,\n"
+ "PRIMARY KEY (activityId),\n"
+ "FOREIGN KEY (foapaNumber) REFERENCES FOAPA(foapaNumber));", (err, rows, fields) => {
  if (err) console.log(err);
});

connection.query("CREATE TABLE IF NOT EXISTS ReimbursementTicket (\n reimbursementId int NOT NULL,\n"
+ "employmentNumber int NOT NULL,\n"
+ "eventName varchar(45) NOT NULL,\n"
+ "totalAmount float NOT NULL,\n"
+ "reimbursementStatus bool NOT NULL,\n"
+ "reimbursementDate date NOT NULL,\n"
+ "PRIMARY KEY (reimbursementId),\n"
+ "FOREIGN KEY (employmentNumber) REFERENCES Faculty(employmentNumber));", (err, rows, fields) => {
  if (err) console.log(err);
});

connection.query("CREATE TABLE IF NOT EXISTS Contains (\n reimbursementId int NOT NULL,\n"
+ "activityId int NOT NULL,\n"
+ "PRIMARY KEY (reimbursementId, activityId),\n"
+ "FOREIGN KEY (reimbursementId) REFERENCES ReimbursementTicket(reimbursementId),\n"
+ "FOREIGN KEY (activityId) REFERENCES Activity(activityId));", (err, rows, fields) => {
  if (err) console.log(err);
});

connection.end();
