import { Router } from "express";
import Foapa from "../models/foapa.js";
import Faculty from "../models/faculty.js";
import {
  encryptPassword,
  decryptPassword,
} from "../utils/authenticatePassword.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import formatFoapaDetails from "../utils/formatFoapaDetails.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

// Registering user - POST /api/register
router.post("/register", async (req, res) => {
  const userData = req.body;
  console.log(userData);

  if (!userData.workEmail.includes("@udmercy.edu")) {
    userData.workEmail += "@udmercy.edu";
  }

  userData.workEmail = userData.workEmail.toLowerCase();
  userData.employmentNumber = "T" + userData.employmentNumber;

  try {
    let encryptedPassword = await encryptPassword(userData.password);
    userData.password = encryptedPassword;

    const faculty = new Faculty(userData);
    console.log("faculty", faculty);
    let existingUser = await Faculty.findOne({
      employmentNumber: userData.employmentNumber,
    });

    if (existingUser) {
      console.log("User already exists");
      res.status(409).send({ message: "User already exists" });
    } else {
      userData.foapaList.forEach((foapa) => {
        const foapaDetail = new Foapa(foapa);
        faculty.foapaDetails.push(foapaDetail);
        foapaDetail.save();
      });

      console.log(faculty);
      await faculty.save();

      //Creates a token thatll be used to authenticate the user for later api calls
      jwt.sign(
        { employmentNumber: userData.employmentNumber },
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

export default router;
