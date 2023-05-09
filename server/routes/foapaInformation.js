import { Router } from "express";
const router = Router();
import connection from "../db.js";

router.post("/addFoapaNumber", (req, res) => {
  console.log("add foapa number route called");
  const employmentNumber = req.body.empNo;
  const foapaNumber = req.body.foapaNumber;

  //   TODO: Update with foapa name

  connection.query(
    "INSERT IGNORE INTO FOAPA VALUES(?,?)",
    [foapaNumber, foapaNumber],
    (err, rows) => {
      if (err) {
        res.status(401).send({ message: "Error inserting Foapa" });
      } else {
        connection.query(
          "INSERT INTO Possesses VALUES(?,?)",
          [employmentNumber, foapaNumber],
          (err) => {
            if (err) {
              res.status(401).send({ message: "Error inserting Foapa" });
            } else {
              res.status(200).send("Success!");
            }
          }
        );
      }
    }
  );
});

router.get("/retrieveFoapaNumbers", (req, res) => {
  const employmentNumber = req.query.employmentNumber;
  connection.query(
    "SELECT * FROM Possesses WHERE employmentNumber = ?",
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

router.get("/retrieveFoapaNumbers2", (req, res) => {
  const employmentNumber = req.query.employmentNumber;
  connection.query(
    "SELECT foa.foapaName, foa.foapaNumber" +
    " FROM FOAPA foa JOIN Possesses pos ON foa.foapaNumber = pos.foapaNumber"+
    " WHERE pos.employmentNumber = ?",
    [employmentNumber],
    (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Error retrieving data" });
      } else {
        console.log("This" + rows);
        res.json(rows);
      }
    }
  );
});

router.post("/deleteFoapaNumber", (req, res) => {
  const employmentNumber = req.body.empNo2;
  const foapaNumber = req.body.foapaNumber2;
  console.log(employmentNumber + "+" + foapaNumber);

  connection.query(
    "DELETE FROM Possesses WHERE employmentNumber = ? AND foapaNumber = ?",
    [employmentNumber, foapaNumber],
    (err) => {
      if (err) {
        res.status(404).send("Error deleting foapa number!");
        console.log("the error is" + err);
      } else {
        res.status(200).send("Success!");
      }
    }
  );
});

export default router;
