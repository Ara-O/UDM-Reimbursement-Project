import { Router } from "express";
import Foapa from "../models/foapa.js";
import Faculty from "../models/faculty.js";
import {
  encryptPassword,
  decryptPassword,
} from "../utils/authenticatePassword.js";
import jwt from "jsonwebtoken";


const router = Router();

// Registering user - POST /api/register
router.post("/register", async (req, res) => {
  const userData = req.body;

  if (!userData.workEmail.includes("@udmercy.edu")) {
    userData.workEmail += "@udmercy.edu";
  }
  userData.workEmail = userData.workEmail.toLowerCase();
  userData.employmentNumber = "T" + userData.employmentNumber;

  try {
    let encryptedPassword = await encryptPassword(userData.password);
    userData.password = encryptedPassword;
    console.log(userData);

    let existingUser = await Faculty.findOne({
      employmentNumber: userData.employmentNumber,
    });

    if (existingUser) {
      res.status(409).send({ message: "Error: User already exists" });
    } else {
      let faculty = new Faculty(userData);
      let savedFaculty = await faculty.save();
      //Creates a token thatll be used to authenticate the user for later api calls
      jwt.sign(
        { userId: savedFaculty._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
        },
        (err, token) => {
          if (!err) {
            return res
              .status(201)
              .send({ message: "Registration successful!", token });
          }
          console.log(err);
        }
      );
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
    console.error(error.message);
  }
});

//Verifying the user's information - POST /api/verifySignupBasicInformation
router.post("/verifySignupBasicInformation", async (req, res) => {
  try {
    let facultyFound = await Faculty.findOne({
      employmentNumber: "T" + req.body.employmentNumber,
    });

    if (facultyFound !== null) {
      return res.status(409).send({
        message:
          "An employee with the inputted employment number already exists",
      });
    } else {
      let facultyWithSameEmail = await Faculty.findOne({
        workEmail: req.body.workEmail + "@udmercy.edu",
      });

      if (facultyWithSameEmail) {
        return res.status(409).send({
          message: "An employee with the inputted email address already exists",
        });
      } else {
        return res.status(200).send();
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err.message });
  }
});

//Logging the user in - POST /api/login
router.post("/login", async (req, res) => {
  const { workEmail, password } = req.body;
  try {
    let facultyInfo = await Faculty.findOne({
      workEmail: workEmail.toLowerCase() + "@udmercy.edu",
    }).select("workEmail password employmentNumber");

    if (facultyInfo === null) {
      res.status(404).send({
        message: "Credentials not found. Please check that your email and password are correct.",
      });
    } else {
      let passwordMatches = await decryptPassword(
        password,
        facultyInfo.password
      );
      if (passwordMatches) {
        jwt.sign(
          { userId: facultyInfo._id },
          process.env.JWT_SECRET,
          {
            expiresIn: "30d",
          },
          (err, token) => {
            if (!err) {
              res.status(200).send({ message: "Login successful", token });
            }
          }
        );
      } else {
        res
          .status(403)
          .send({ message: "Incorrect Password. Please try again" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: error.message });
  }
});

export default router;
