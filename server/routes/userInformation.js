import { Router } from "express";
const router = Router();
import { updateAccount } from "../queries.js";
import connection from "../db.js";

function storeUserFoapaNumber(employmentNumber, userFoapas) {
  return new Promise((resolve, reject) => {
    if (userFoapas.length !== 0) {
      userFoapas.forEach((userFoapa) => {
        let concatFoapa =
          userFoapa.fNumber +
          "-" +
          userFoapa.oNumber +
          "-" +
          userFoapa.aNumber +
          "-" +
          userFoapa.pNumber +
          "-" +
          userFoapa.a2Number;

        console.log("concat foapa", concatFoapa, userFoapa);

        connection.query(
          "INSERT IGNORE INTO FOAPA VALUES(?,?)",
          [userFoapa.foapaName, concatFoapa],
          (err) => {
            if (err) {
              if (err.code === "ER_NO_SUCH_TABLE") {
                reject("A FOAPA table does not exist");
              } else {
                reject(
                  "There has been an error inserting data into the FOAPA table"
                );
              }
              console.log(err);
              return;
            } else {
              console.log("foapa success");
            }
          }
        );

        connection.query(
          "INSERT INTO Possesses VALUES(?,?)",
          [employmentNumber, concatFoapa],
          (err) => {
            if (err) {
              reject(err);
              return;
            } else {
              console.log("possesses success");
              resolve();
            }
          }
        );
      });
    } else {
      resolve();
    }
  });
}

// Registering user - POST /api/register
router.post("/register", (req, res) => {
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
    country,
    userFoapas,
  } = req.body;

  const facultyInsertion = new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO Faculty VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
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
        country,
      ],
      (err) => {
        if (err) {
          console.log(err.code);
          if (err.code === "ER_DUP_ENTRY") {
            reject("Another user already exists");
          } else if (err.code === "ER_DATA_TOO_LONG") {
            reject(
              "A field exceeds the maximum length. Check to make sure the state field has only two 2 letters"
            );
          } else {
            reject("There has been an error, please revise your data");
          }
        } else {
          resolve("Success");
          console.log("no error");
        }
      }
    );
  });

  facultyInsertion
    .then(() => {
      console.log("Faculty table inserted successfully");
      storeUserFoapaNumber(employmentNumber, userFoapas)
        .then(() => {
          res.status(200).send({ message: "Successful registration!" });
        })
        .catch((err) => {
          res.status(400).send({ message: err });
        });
    })
    .catch((err) => {
      res.status(400).send({ message: err });
    });
});

router.post("/login", (req, res) => {
  const { workEmail, password } = req.body;
  console.log(workEmail);
  connection.query(
    "SELECT password, employmentNumber FROM Faculty WHERE workEmail = ?",
    [workEmail],
    (err, rows) => {
      if (rows.length === 0) {
        res.status(401).send({
          message:
            "Login unsuccessful; No email/Password combination was found",
        });
      } else {
        let dbPassword = rows[0].password;
        if (dbPassword === password) {
          res.status(200).send({
            message: "Login successful",
            employmentNumber: rows[0].employmentNumber,
          });
        } else {
          res.status(401).send({
            message:
              "Login unsuccessful; No email/Password combination was found",
          });
        }
      }
      if (err) {
        console.log(err);
      }
    }
  );
});

//Logging in user - POST /api/retrieveUserInformation
router.get("/retrieveUserInformation", (req, res) => {
  const employmentNumber = req.query.employmentNumber;
  connection.query(
    "SELECT fName as firstName, lName as lastName, workEmail, phoneNumber, employmentNumber FROM Faculty WHERE employmentNumber = ?",
    [employmentNumber],
    (err, rows) => {
      if (err) {
        console.log(err);
        res.status(401).json({ message: "Error retrieving user information" });
      } else {
        console.log("user info rows " + rows);
        res.json(rows);
      }
    }
  );
});

router.get("/retrieveAccountInfo", (req, res) => {
  const employmentNumber = req.query.employmentNumber;
  connection.query(
    "SELECT * FROM Faculty WHERE employmentNumber = ?",
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
});

router.post("/updateAccountInfo", (req, res) => {
  connection.query(
    updateAccount,
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
      req.body.country,
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
});
export default router;
