import { Router } from "express";
import mongoose from "mongoose";
import Faculty from "../models/faculty.js";
import Foapa from "../models/foapa.js";
import {
  encryptPassword,
  decryptPassword,
} from "../utils/authenticatePassword.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

// function storeUserFoapaNumber(employmentNumber, userFoapas) {
//   return new Promise((resolve, reject) => {
//     if (userFoapas.length !== 0) {
//       userFoapas.forEach((userFoapa) => {
//         let concatFoapa =
//           userFoapa.fNumber +
//           "-" +
//           userFoapa.oNumber +
//           "-" +
//           userFoapa.aNumber +
//           "-" +
//           userFoapa.pNumber +
//           "-" +
//           userFoapa.a2Number;

//         console.log("concat foapa", concatFoapa, userFoapa);

//         connection.query(
//           "INSERT IGNORE INTO FOAPA VALUES(?,?)",
//           [userFoapa.foapaName, concatFoapa],
//           (err) => {
//             if (err) {
//               if (err.code === "ER_NO_SUCH_TABLE") {
//                 reject("A FOAPA table does not exist");
//               } else {
//                 reject(
//                   "There has been an error inserting data into the FOAPA table"
//                 );
//               }
//               console.log(err);
//               return;
//             } else {
//               console.log("foapa success");
//             }
//           }
//         );

//         connection.query(
//           "INSERT INTO Possesses VALUES(?,?)",
//           [employmentNumber, concatFoapa],
//           (err) => {
//             if (err) {
//               reject(err);
//               return;
//             } else {
//               console.log("possesses success");
//               resolve();
//             }
//           }
//         );
//       });
//     } else {
//       resolve();
//     }
//   });
// }

// Registering user - POST /api/register
router.post("/register", async (req, res) => {
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

  //Formatting the user's foapa information
  let foapaDetails = [];
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

    foapaDetails.push({
      foapaName: userFoapa.foapaName,
      foapaNumber: concatFoapa,
    });
  });

  try {
    let encryptedPassword = await encryptPassword(password);

    const faculty = new Faculty({
      employmentNumber,
      firstName,
      lastName,
      workEmail: workEmail.toLowerCase(),
      phoneNumber,
      password: encryptedPassword,
      mailingAddress,
      department,
      zipCode,
      city,
      state,
      country,
      foapaDetails,
    });

    let existingUser = await Faculty.findOne({ employmentNumber });

    if (existingUser) {
      console.log("User already exists");
      res.status(409).send({ message: "User already exists" });
    } else {
      await faculty.save();
      let token = await jwt.sign({ employmentNumber }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      console.log("token", token);
      res.status(200).send({ message: "Registration successful!", token });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
    console.error(error.message);
  }
});

router.post("/login", async (req, res) => {
  const { workEmail, password } = req.body;
  try {
    let facultyInfo = await Faculty.findOne({
      workEmail: workEmail.toLowerCase(),
    }).select("workEmail password employmentNumber");

    if (facultyInfo === null) {
      res.status(404).send({
        message: "Credentials not found. Please check your email and password",
      });
    } else {
      let passwordMatches = await decryptPassword(
        password,
        facultyInfo.password
      );
      if (passwordMatches) {
        let token = await jwt.sign(
          { employmentNumber: facultyInfo.employmentNumber },
          process.env.JWT_SECRET,
          {
            expiresIn: "30d",
          }
        );

        console.log("token", token);
        res.status(200).send({ message: "Login successful", token });
      } else {
        res.status(403).send({ message: "Password does not match" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: error.message });
  }
});

// Logging in user - GET /api/retrieveUserInformation
router.get("/retrieveUserInformation", async (req, res) => {
  console.log(req.query);
  const {
    employmentNumber,
    firstName,
    lastName,
    workEmail,
    phoneNumber,
    mailingAddress,
    userFoapas,
  } = req.body;

  try {
    let facultyInfo = await Faculty.findOne(
      { workEmail },
      { firstName },
      { lastName },
      { phoneNumber },
      { mailingAddress },
      { employmentNumber }
    );
    let foapaInfo = await Foapa.findOne({ userFoapas });

    if (facultyInfo === null) {
      res.status(404).send({
        message:
          "Unable to retrieve faculty info. Please check the credentials.",
      });
    } else {
      console.log(facultyInfo);
    }

    if (foapaInfo === null) {
      res.status(404).send({
        message: "Unable to retrieve foapa info. Please check the credentials.",
      });
    } else {
      console.log(foapaInfo);
    }
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: error.message });
  }

  //const employmentNumber = req.query.employmentNumber;
  // connection.query(
  //   "SELECT fName as firstName, lName as lastName, workEmail, phoneNumber, employmentNumber FROM Faculty WHERE employmentNumber = ?",
  //   [employmentNumber],
  //   (err, rows) => {
  //     if (err) {
  //       console.log(err);
  //       res.status(401).json({ message: "Error retrieving user information" });
  //     } else {
  //       console.log("user info rows " + rows);
  //       res.json(rows);
  //     }
});

router.get("/retrieveAccountInfo", async (req, res) => {
  const {
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
  } = req.body;

  try {
    let facultyInfo = await Faculty.findOne(
      { firstName },
      { lastName },
      { workEmail },
      { phoneNumber },
      { password },
      { mailingAddress },
      { department },
      { zipCode },
      { city },
      { state },
      { country }
    );

    if (facultyInfo === null) {
      res.status(404).send({
        message:
          "Unable to retrieve faculty info. Please check the credentials.",
      });
    } else {
      console.log(facultyInfo);
    }
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: error.message });
  }
  //   const employmentNumber = req.query.employmentNumber;
  //   connection.query(
  //     "SELECT * FROM Faculty WHERE employmentNumber = ?",
  //     [employmentNumber],
  //     (err, rows) => {
  //       if (err) {
  //         console.log(err);
  //         res
  //           .status(500)
  //           .json({ message: "Error retrieving account information" });
  //       } else {
  //         console.log("user info rows " + rows);
  //         res.json(rows);
  //       }
  //     }
  //   );
});

router.post("/updateAccountInfo", async (req, res) => {
  const {
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
  } = req.body;

  try {
    let facultyInfo = await Faculty.updateOne(
      { firstName },
      { lastName },
      { workEmail },
      { phoneNumber },
      { password },
      { mailingAddress },
      { department },
      { zipCode },
      { city },
      { state },
      { country }
    );

    if (facultyInfo === null) {
      res.status(404).send({
        message: "Unable to modify account info. Please check the credentials.",
      });
    } else {
      console.log(facultyInfo);
    }
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: error.message });
  }
  //   connection.query(
  //     updateAccount,
  //     [
  //       req.body.fName,
  //       req.body.lName,
  //       req.body.workEmail,
  //       req.body.department,
  //       req.body.streetAddress,
  //       req.body.phoneNumber,
  //       req.body.password,
  //       req.body.zipCode,
  //       req.body.city,
  //       req.body.state,
  //       req.body.country,
  //       req.body.employmentNumber,
  //     ],
  //     (err) => {
  //       if (err) {
  //         console.log(err);
  //         res
  //           .status(500)
  //           .json({ message: "Error updating account information!" });
  //       } else {
  //         console.log("success");
  //         res.status(200).json({ message: "success!" });
  //       }
  //     }
  //   );
});
export default router;
