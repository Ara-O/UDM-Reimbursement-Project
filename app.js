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

  // Insert into faculty
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

function updateAccountInfo(req, res) {
  console.log("Teehee Ethan Employment Numba: " + req.body.employmentNumber);

  connection.query(
    `UPDATE Faculty 
    SET 
        fName = ?,
        lName = ?,
        workEmail = ?,
        department = ?,
        streetAddress = ?,
        phoneNumber = ?,
        password = ?,
        zipCode = ?,
        city = ?,
        state = ?
    WHERE
        employmentNumber = ?;
    `,
    [
      req.body.fName,
      req.body.lName,
      req.body.workEmail,
      req.body.department,
      req.body.streetAddress,
      req.body.phoneNumber,
      req.body.password,
      req.body.zipCode,
      req.body.city,
      req.body.state,
      req.body.employmentNumber,
    ],
    (err) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ message: "Error updating account information!" });
      } else {
        console.log("success");
        res.status(200).json({ message: "success!" });
      }
    }
  );
}

function retrieveFoapaNumbers(req, res) {
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
}

function retrieveUserInformation(req, res) {
  const employmentNumber = req.query.employmentNumber;
  connection.query(
    "SELECT fName as firstName, lName as lastName, workEmail, phoneNumber, employmentNumber FROM faculty WHERE employmentNumber = ?",
    [employmentNumber],
    (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Error retrieving user information" });
      } else {
        console.log("user info rows " + rows);
        res.json(rows);
      }
    }
  );
}

function retrieveAccountInfo(req, res) {
  const employmentNumber = req.query.employmentNumber;
  connection.query(
    "SELECT * FROM FACULTY WHERE employmentNumber = ?",
    [employmentNumber],
    (err, rows) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ message: "Error retrieving account information" });
      } else {
        console.log("user info rows " + rows);
        res.json(rows);
      }
    }
  );
}

function addReimbursement(req, res) {
  const {
    reimbursementId,
    employmentNumber,
    eventName,
    totalAmount,
    reimbursementStatus,
    reimbursementDate,
    allActivities,
  } = req.body.reimbursementData;

  let promises = [];

  promises.push(
    new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO reimbursementticket VALUES(?,?,?,?,?,?)",
        [
          reimbursementId,
          employmentNumber,
          eventName,
          totalAmount,
          reimbursementStatus,
          reimbursementDate,
        ],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    })
  );
  allActivities.forEach((activity) => {
    const insertQuery = `INSERT INTO activity VALUES (?,?,?,?,?,?)`;
    const values = [
      activity.activityId,
      activity.foapaNumber,
      activity.activityName,
      activity.activityReceipt,
      "2002-03-02",
      activity.amount,
    ];

    promises.push(
      new Promise((resolve, reject) => {
        connection.query(insertQuery, values, function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      })
    );

    promises.push(
      new Promise((resolve, reject) => {
        connection.query(
          "INSERT INTO contains VALUES(?, ?)",
          [reimbursementId, activity.activityId],
          function (err) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      })
    );
  });

  Promise.all(promises)
    .then(() => {
      res.status(200).send("Data inserted successfully");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
}

function addFoapaNumber(req, res) {
  const employmentNumber = req.body.empNo;
  const foapaNumber = req.body.foapaNumber;

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

//Deleting the foapa
function deleteFoapaNumber(req, res) {
  const employmentNumber = req.body.empNo2;
  const foapaNumber = req.body.foapaNumber2;
  console.log(employmentNumber + "+" + foapaNumber);

  connection.query(
    "DELETE FROM possesses WHERE employmentNumber = ? AND foapaNumber = ?",
    [employmentNumber, foapaNumber],
    (err) => {
      if (err) {
        console.log("the error is" + err);
      }
    }
  );

  connection.query(
    "Delete from foapa where foapaNumber = ?",
    [foapaNumber],
    (err) => {
      res.status(200).send("success");
      connection.commit();
    }
  );
}

//APIs

app.get("/api/retrieveFoapaNumbers", retrieveFoapaNumbers);
app.get("/api/retrieveUserInformation", retrieveUserInformation);
app.get("/api/retrieveAccountInfo", retrieveAccountInfo);
app.post("/api/register", registerUser);
app.post("/api/updateAccountInfo", updateAccountInfo);
app.post("/api/addReimbursement", addReimbursement);
app.post("/api/addFoapaNumber", addFoapaNumber);
app.post("/api/deleteFoapaNumber", deleteFoapaNumber);

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
