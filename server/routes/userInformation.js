import { Router } from "express";
import bcrypt from "bcrypt";
import Faculty from "../models/faculty.js";
import {
  encryptPassword,
  decryptPassword,
} from "../utils/authenticatePassword.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import formatFoapaDetails from "../utils/formatFoapaDetails.js";
import { verifyToken } from "../middleware/auth.js";
import sgMail from "@sendgrid/mail";
dotenv.config();

const router = Router();

// Registering user - POST /api/register
router.post("/register", async (req, res) => {
  const userData = req.body;

  //Formatting the user's foapa information
  userData.foapaDetails = formatFoapaDetails(userData.userFoapas);
  console.log(userData.foapaDetails);

  //Formatting email input
  if (!userData.workEmail.includes("@udmercy.edu")) {
    userData.workEmail += "@udmercy.edu";
  }

  userData.workEmail = userData.workEmail.toLowerCase();
  userData.employmentNumber = "T" + userData.employmentNumber;

  try {
    let encryptedPassword = await encryptPassword(userData.password);
    userData.password = encryptedPassword;

    const faculty = new Faculty(userData);

    let existingUser = await Faculty.findOne({
      employmentNumber: userData.employmentNumber,
    });

    if (existingUser) {
      console.log("User already exists");
      res.status(409).send({ message: "User already exists" });
    } else {
      await faculty.save();

      //Creates a token thatll be used to authenticate the user for later api calls
      jwt.sign(
        { employmentNumber: userData.employmentNumber },
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
        },
        (err, token) => {
          res.status(200).send({ message: "Registration successful!", token });
        }
      );
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

// Retrieve user information - GET /api/retrieveUserInformationSummary
router.get("/retrieveUserInformationSummary", verifyToken, async (req, res) => {
  try {
    let facultyInfo = await Faculty.findOne(
      {
        employmentNumber: req.user.employmentNumber,
      },
      {
        // All to stop the _id from showing, might remove/refactor later ;-;
        _id: 0,
        city: 0,
        foapaDetails: 0,
        mailingAddress: 0,
        password: 0,
        reimbursementTickets: 0,
        state: 0,
        postalCode: 0,
        country: 0,
        department: 0,
      }
    );
    if (facultyInfo === null) {
      res.status(404).send({
        message: "Unable to retrieve account information",
      });
    } else {
      res.status(200).send(facultyInfo);
    }
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: error.message });
  }
});

router.get("/retrieveAccountInformation", verifyToken, async (req, res) => {
  try {
    let facultyInfo = await Faculty.findOne({
      employmentNumber: req.user.employmentNumber,
    });

    if (facultyInfo === null) {
      res.status(404).send({
        message: "Unable to retrieve faculty information.",
      });
    } else {
      console.log(facultyInfo);
      res.status(200).send(facultyInfo);
    }
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: error.message });
  }
});

router.post("/updateAccountInfo", verifyToken, async (req, res) => {
  const {
    firstName,
    lastName,
    workEmail,
    phoneNumber,
    mailingAddress,
    department,
    zipCode,
    city,
    state,
    country,
  } = req.body;

  try {
    let facultyInfo = await Faculty.updateOne(
      { employmentNumber: req.user.employmentNumber },
      {
        firstName,
        lastName,
        workEmail,
        phoneNumber,
        mailingAddress,
        department,
        zipCode,
        city,
        state,
        country,
      }
    );

    if (facultyInfo === null) {
      res.status(404).send({
        message: "Unable to modify account information.",
      });
    } else {
      console.log("updated table");
      res.status(200).send({ message: "Account updated successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: error.message });
  }
});

router.post("/verifyEmploymentNumber", async (req, res) => {
  try {
    let facultyFound = await Faculty.findOne({
      employmentNumber: "T" + req.body.employmentNumber,
    });
    console.log(facultyFound);
    if (facultyFound !== null) {
      res.status(400).send({
        message:
          "An employee with the inputted employment number already exists",
      });
    } else {
      res.status(200).send();
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err.message });
  }
});

router.post("/forgotPassword", async (req, res) => {
  try {
    console.log(req.body);
    let userData = await Faculty.findOne({ workEmail: req.body.workEmail });
    if (userData === null) {
      console.log("null");
    } else {
      console.log(userData);
      jwt.sign(
        { workEmail: userData.workEmail },
        process.env.JWT_SECRET,
        { expiresIn: "15m" },
        async (err, token) => {
          if (err) {
            res
              .status(400)
              .send({ message: "There has been an error, please try again" });
          } else {
            console.log("here token", token);
            token = token.replaceAll(".", "$");

            const msg = {
              to: req.body.workEmail, // Change to your recipient
              from: "oladipoeyiara@gmail.com", // Change to your verified sender
              subject: "Password Reset Instructions",
              html: `<h4 style='font-weight: 400'>Hello!</h4> <h4 style='font-weight: 400' >We received a request to reset your password. To proceed
           with the password reset, please follow the instructions below</h4><h4 style='font-weight: 400'>Click on the following link to access the password reset page: </h4> <a href='https://udm-reimbursement-project.vercel.app/forgot-password/${token}' >Click here</a>
           <br/><br/> <h4 style='font-weight: 400'>Best Regards</h4>`,
            };
            let resp = await sgMail.send(msg);
            res.status(200).send({ message: "Sent email" });
          }
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/resetPassword", async (req, res) => {
  console.log(req.body);
  //parsing the token
  try {
    let token = req.body.token.replaceAll("$", ".");
    console.log(token);
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
      if (!err) {
        let encryptedPassword = await encryptPassword(req.body.newPassword);
        const result = await Faculty.findOneAndUpdate(
          { workEmail: userData.workEmail },
          { password: encryptedPassword }
        );
        console.log(result);
        res.status(200).send({ message: "Password reset successfully" });
      } else {
        throw err;
      }
    });
  } catch (err) {
    console.log(err);
  }
});
export default router;
