import { Router } from "express";
import { transporter } from "../app.js";
import AccountNumbers from "../models/accountNumbers.js";
import Faculty from "../models/faculty.js";
import {
  encryptPassword,
  decryptPassword,
} from "../utils/authenticatePassword.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import formatFoapaDetails from "../utils/formatFoapaDetails.js";
import { verifyToken } from "../middleware/auth.js";
dotenv.config();

const router = Router();

router.post("/login", async (req, res) => {
  const { workEmail, password } = req.body;
  try {
    let facultyInfo = await Faculty.findOne({
      workEmail: workEmail.toLowerCase() + "@udmercy.edu",
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
        jwt.sign(
          { employmentNumber: facultyInfo.employmentNumber },
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
    postalCode,
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
        postalCode,
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

router.post("/forgotPassword", async (req, res) => {
  try {
    console.log(req.body);
    let userData = await Faculty.findOne({
      workEmail: req.body.workEmail.trim() + "@udmercy.edu",
    }).select("workEmail");

    if (userData === null) {
      console.log("null");
      res
        .status(404)
        .send({ message: "A user with that email address was not found." });
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

            // send mail with defined transport object
            let resp = await transporter.sendMail({
              from: '"UDM Reimbursement Team" <ara@araoladipo.dev>',
              to: req.body.workEmail.trim() + "@udmercy.edu",
              subject: "Password Reset Instructions",
              html: `<h4 style='font-weight: 400'>Hello!</h4> <h4 style='font-weight: 400' >We received a request to reset your password. To proceed
              with the password reset, please follow the instructions below</h4><h4 style='font-weight: 400'>Click on the following link to access the password reset page: </h4> <a href='https://udm-reimbursement-project.vercel.app/forgot-password/${token}' >Click here</a>
              <br/><br/> <h4 style='font-weight: 400'>Best Regards</h4>`,
            });

            console.log(resp);

            res.status(200).send({ message: "Sent email" });
          }
        }
      );
    }
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

router.post("/sendConfirmationEmail", async (req, res) => {
  try {
    let userData = req.body.userSignupData;
    jwt.sign({ userData }, process.env.JWT_SECRET, async (err, token) => {
      if (err) throw err;

      let sanitizedToken = token.replaceAll(".", "$");
      let resp = await transporter.sendMail({
        from: '"UDM Reimbursement Team" <ara@araoladipo.dev>',
        to: userData.workEmail.trim() + "@udmercy.edu",
        // to: "oladipea@udmercy.edu",
        subject: "Welcome to the UDM Reimbursement System!",
        html: `<a href="https://udm-reimbursement-project.vercel.app/complete-verification/${sanitizedToken}" target="_blank">Create account</a>`,
      });

      console.log(resp);

      res.status(200).send({
        message: "Email sent successfully!",
      });
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
  //   function generateRandomPassword(length) {
  //     const charset =
  //       "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  //     let password = "";

  //     for (let i = 0; i < length; i++) {
  //       const randomIndex = Math.floor(Math.random() * charset.length);
  //       password += charset[randomIndex];
  //     }

  //     return password;
  //   }
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
  console.log(req.body);
  try {
    let facultyInfo = await Faculty.findOne({
      employmentNumber: req.user.employmentNumber,
    });

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

router.get("/retrieveAccountNumbers", async (req, res) => {
  try {
    let allAccountNumbers = await AccountNumbers.find();
    res.status(200).send(allAccountNumbers[0]);
  } catch (err) {
    res.status(400).send({ message: "There has been an error" });
  }
});
export default router;
