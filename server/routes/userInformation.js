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
import { verifyToken } from "../middleware/auth.js";
import { generateRandomStringId } from "../utils/generateRandomString.js";
import { Auth } from "../models/auth.js";
import { ZodError, z } from "zod";
import logger from "../logger.js";
dotenv.config();

const router = Router();

// Retrieve user information - GET /api/retrieveUserInformationSummary
router.get("/retrieveUserInformationSummary", verifyToken, async (req, res) => {
  try {
    let facultyInfo = await Faculty.findById(req.user.userId);
    if (facultyInfo === null) {
      return res.status(404).send({
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

//Retrieve account infoemation - GET /api/retrieveAccountInformation
router.get("/retrieveAccountInformation", verifyToken, async (req, res) => {
  try {
    let facultyInfo = await Faculty.findById(req.user.userId);

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

router.post("/send-confirmation-email", async (req, res) => {
  try {
    const schema = z.object({
      workEmail: z.string().trim().toLowerCase(),
      employmentNumber: z.string().trim().length(8),
    });

    const data = schema.parse(req.body);

    data.workEmail += "@udmercy.edu";
    data.employmentNumber = "T" + data.employmentNumber;

    logger.info(`Sending account verification email to ${data.workEmail}`, {
      api: "/api/send-confirmation-email",
    });

    let userAuthString = generateRandomStringId(6);

    await transporter.sendMail({
      from: '"UDM Reimbursement Team" <udm-reimbursement-team@em2297.araoladipo.dev>',
      to: data.workEmail,
      subject: "Welcome to the UDM Reimbursement System!",
      html: `
      <div style="background: white; width: 100%; box-sizing: border-box; font-family: Georgia, serif;">
      <h2 style="font-weight: 500; margin: 0; padding: 10px 0;">Verify Your Account</h2>
      <div style="background: white; text-align: center; border: 1px solid black; padding: 5% 10%; box-sizing: border-box;">
        <h4 style="font-weight: 300; margin: 10px 0;">Hello,</h4>
        <h4 style="font-weight: 300; margin: 10px 0;">Thanks for signing up for the University of Detroit Mercy Reimbursement System!</h4>
        <h4 style="font-weight: 300; margin: 10px 0;">Please use the verification code below to activate your account:</h4>
        <h3 style="font-weight: 500; text-align: center; margin: 20px 0;">${userAuthString}</h3>
      </div>
      <p style="font-weight: 300; font-size: 10px; color: gray; text-align: center; margin: 10px 0;">
        If you did not sign up for this service, please ignore this email.
      </p>
    </div>
        `,
    });

    logger.info(`Verification email successfully sent to ${data.workEmail}`, {
      api: "/api/send-confirmation-email",
    });

    //Store key in database along with email and emp number
    const auth = new Auth({
      workEmail: data.workEmail,
      employmentNumber: data.employmentNumber,
      authString: userAuthString,
    });

    await auth.save();

    res.status(200).send({
      message: "Email sent successfully!",
    });
  } catch (err) {
    logger.error(err, { api: "/api/send-confirmation-email" });

    if (err instanceof ZodError) {
      return res.status(400).send({
        message:
          "There was an error with one of your inputs. Please revise them and try again.",
      });
    }

    res.status(500).send({
      message:
        "There was an error sending you a verification email. Please try again later.",
    });
  }
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

router.get("/retrieveAccountNumbers", async (req, res) => {
  try {
    let allAccountNumbers = await AccountNumbers.find();
    res.status(200).send(allAccountNumbers[0]);
  } catch (err) {
    res.status(400).send({ message: "There has been an error" });
  }
});

router.post("/verify-code", async (req, res) => {
  try {
    const schema = z.object({
      userCode: z
        .string()
        .trim()
        .length(6, "Verification code must be 6 digits"),
      workEmail: z
        .string({ required_error: "Work email is a required field" })
        .trim()
        .toLowerCase(),
      employmentNumber: z
        .string({ required_error: "Employment number is a required field" })
        .trim()
        .length(8, "Employment number must be 8 digits"),
    });

    const data = schema.parse(req.body);
    data.workEmail += "@udmercy.edu";
    data.employmentNumber = "T" + data.employmentNumber;

    let authInfo = await Auth.findOne({
      workEmail: data.workEmail,
      employmentNumber: data.employmentNumber,
    });

    if (authInfo === null) {
      res.status(404).send({
        message: "Your token has expired. Please restart the signup process.",
      });
      return;
    }

    if (authInfo.authString === data.userCode) {
      return res.status(200).send({ message: "Code verified" });
    } else {
      return res
        .status(404)
        .send({ message: "Incorrect code. Please try again." });
    }
  } catch (err) {
    logger.error(err, { api: "/api/verify-code" });

    if (err instanceof ZodError) {
      return res.status(400).send({
        message:
          "There was an error with one of your inputs. Please revise them and try again.",
      });
    }

    return res.status(500).send({
      message:
        "There was an error verifying your code. Please try again later.",
    });
  }
});

export default router;
