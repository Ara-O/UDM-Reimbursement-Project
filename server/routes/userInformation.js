import { Router } from "express";
// import { transporter } from "../app.js";
import sgMail from "@sendgrid/mail";
import Faculty from "../models/faculty.js";
import {
  encryptPassword,
  decryptPassword,
} from "../utils/authenticatePassword.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { verifyToken } from "../middleware/auth.js";
import { Auth } from "../models/auth.js";
import { ZodError, z } from "zod";
import logger from "../logger.js";
dotenv.config();

const router = Router();

//Retrieve account infoemation - GET /api/retrieve-account-information
router.get("/retrieve-account-information", verifyToken, async (req, res) => {
  try {
    let facultyInfo = await Faculty.findById(req.user.userId);

    // If the user does not exist
    if (facultyInfo === null) {
      return res.status(404).send({
        message:
          "There was an error retrieving your account information. Please try again later.",
      });
    } else {
      return res.status(200).send(facultyInfo);
    }
  } catch (error) {
    logger.info("There was an error retrieving account information", {
      api: "/api/retrieve-account-information",
    });

    logger.error(error, {
      api: "/api/retrieve-account-information",
    });

    return res.status(400).send({
      message:
        "There was an error retrieving your acount information. Please try again later.",
    });
  }
});

router.post("/updateAccountInfo", verifyToken, async (req, res) => {
  console.log(req.body);

  req.body.accountInformation.employmentNumber =
    "T" + req.body.accountInformation.employmentNumber;
  try {
    let facultyInfo = await Faculty.findByIdAndUpdate(
      req.user.userId,
      req.body.accountInformation
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

router.post("/forgotPassword", async (req, res) => {
  const WEBSITE_URL = process.env.WEBSITE_URL;
  try {
    const email = req.body.workEmail.trim() + "@udmercy.edu";

    let userData = await Faculty.findOne({
      workEmail: email,
    }).select("workEmail");

    if (userData === null) {
      logger.error(`User account not found for ${email}`, {
        api: "/api/forgotPassword",
      });

      return res
        .status(404)
        .send({ message: "A user with that email address was not found." });
    }

    logger.info(`${userData.workEmail} forgot their password`, {
      api: "/api/forgotPassword",
    });

    jwt.sign(
      { workEmail: userData.workEmail },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
      async (err, token) => {
        if (err) {
          return res
            .status(400)
            .send({ message: "There has been an error, please try again" });
        }

        token = token.replaceAll(".", "$");

        // send mail with defined transport object
        let resp = await sgMail.send({
          from: "UDM Reimbursement Team<oladipea@udmercy.edu>",
          to: [
            String(req.body.workEmail).trim().toLowerCase() + "@udmercy.edu",
          ],
          subject: "Password Reset Instructions",
          html: `<h4 style='font-weight: 400'>Hello!</h4> <h4 style='font-weight: 400' >We received a request to reset your password. To proceed
              with the password reset, please follow the instructions below</h4><h4 style='font-weight: 400'>Click on the following link to access the password reset page: </h4> <a href='${WEBSITE_URL}/forgot-password/${token}' >Click here</a>
              <br/><br/> <h4 style='font-weight: 400'>Best Regards</h4>`,
        });

        logger.info(`Forgot password email sent successfully to ${email}`, {
          api: "/api/forgotPassword",
        });

        return res.status(200).send({ message: "Sent email" });
      }
    );
  } catch (err) {
    console.log(err);
  }
});

router.post("/verifyUserSignupToken", async (req, res) => {
  console.log(req.body);
  let reversedToken = req.body.token.replaceAll("$", ".");

  jwt.verify(reversedToken, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      // console.log(err);
      return res.status(400).send({
        message:
          "There was an error verifying your token. Please try to sign up again",
      });
    }

    res.status(200).send({ userSignupData: decoded.userData });
  });
});

router.post("/resetPassword", async (req, res) => {
  console.log(req.body);
  //parsing the token
  try {
    let token = req.body.token.replaceAll("$", ".");
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
      if (!err) {
        let encryptedPassword = await encryptPassword(req.body.newPassword);
        const result = await Faculty.findOneAndUpdate(
          { workEmail: userData.workEmail },
          { password: encryptedPassword }
        );
        res.status(200).send({ message: "Password reset successfully" });
      } else {
        console.error(err);
        throw err;
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/changePassword", verifyToken, async (req, res) => {
  try {
    let facultyInfo = await Faculty.findById(req.user.userId);
    if (facultyInfo) {
      let passwordMatches = await decryptPassword(
        req.body.currentPassword,
        facultyInfo.password
      );

      if (passwordMatches) {
        facultyInfo.password = await encryptPassword(req.body.newPassword);
        await facultyInfo.save();
        res.status(200).send({ message: "Password updated successfully" });
      } else {
        res.status(404).send({ message: "Current password is incorrect" });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(404).send({ message: "There has been an error" });
  }
});

router.get("/get-department-numbers", (req, res) => {
  const departments = {
    "Dean's Office": "0301",
    Biology: "0302",
    Math: "0303",
    Physics: "0304",
    "Chemistry and Biochemistry": "0305",
    "Pre-Health": "0306",
    "Civil Engineering": "0307",
    "Electrical Engineering": "0308",
    "Mechanical Engineering": "0309",
    Computing: "0313",
    "Professional Engineering": "0318",
    "Computer Science": "0320",
  };

  if (!req.body.department) {
    return res.status(200).send(departments);
  }

  return res.status(200).send(departments[req.body.department]);
});

export default router;
