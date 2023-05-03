import mysql from "mysql2";
import {
  facultyTable,
  foapaTable,
  possessesTable,
  activityTable,
  reimbursementTable,
  containsTable,
} from "./queries.js";

//Related to connections with mysql database

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   port: 3306,
//   password: "password",
//   database: "reimbursement_db",
// });
const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect(function (err) {
  if (err) {
    console.log(err);
    throw err;
  } else {
    console.log("successful connection");
  }
});

connection.on("error", function (err) {
  console.log("[mysql error]", err.code);
});
//Creating all the necessary tables
export function createTables() {
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
}

export default connection;
