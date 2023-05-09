import { Router } from "express";
const router = Router();
import connection from "../db.js";

router.post("/addFoapaNumber", (req, res) => {
  console.log(req.body);
  let error = false;

  let employmentNumber = req.body.employmentNumber;
  req.body.foapaData.forEach((foapa) => {
    let concatFoapa =
      foapa.fNumber +
      "-" +
      foapa.oNumber +
      "-" +
      foapa.aNumber +
      "-" +
      foapa.pNumber +
      "-" +
      foapa.a2Number;
    connection.query(
      "INSERT IGNORE INTO FOAPA VALUES(?,?)",
      [foapa.foapaName, concatFoapa],
      (err, rows) => {
        if (err) {
          error = true;
        } else {
          connection.query(
            "INSERT IGNORE INTO Possesses VALUES(?,?)",
            [employmentNumber, concatFoapa],
            (err) => {
              if (err) {
                error = true;
              }
            }
          );
        }
      }
    );
  });

  if (error === false) {
    res.status(200).send({ message: "FOAPA numbers successfully added" });
  } else {
    res.status(401).send({ message: "Error inserting Foapa" });
  }
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
      " FROM FOAPA foa JOIN Possesses pos ON foa.foapaNumber = pos.foapaNumber" +
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
