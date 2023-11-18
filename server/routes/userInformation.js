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
dotenv.config();

const router = Router();

// Retrieve user information - GET /api/retrieveUserInformationSummary
router.get("/retrieveUserInformationSummary", verifyToken, async (req, res) => {
  try {
    let facultyInfo = await Faculty.findById(req.user.userId);
    if (facultyInfo === null) {
      res.status(404).send({
        message: "Unable to retrieve account information",
      });
    } else {
      console.log(facultyInfo)
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

router.post("/sendConfirmationEmail", async (req, res) => {
  try {
    let userData = req.body.userSignupData;
    // jwt.sign({ userData }, process.env.JWT_SECRET, async (err, token) => {

    let userAuthString = generateRandomStringId(6)

    let resp = await transporter.sendMail({
      from: '"UDM Reimbursement Team" <udm-reimbursement-system@em2297.araoladipo.dev>',
      to: userData.workEmail.trim() + "@udmercy.edu",
      subject: "Welcome to the UDM Reimbursement System!",
      html:
        `
          <div style="background: white">
          <h3 style="font-weight: 500">Verify your Account</h3>
          <h4 style="font-weight: 300">Hello,</h4>
          <h4 style="font-weight: 300">Thanks for signing up for the University of Detroit Mercy Reimbursement System!</h4>
          <h4 style="font-weight: 300">You can verify your account using this key</h4>
          <h3 style="font-weight: 500">${userAuthString}</h3>
        </div>
        `
    });

    console.log(resp);

    //Store key in database along with email and emp number

    const auth = new Auth({
      workEmail: userData.workEmail.trim() + "@udmercy.edu",
      employmentNumber: "T" + userData.employmentNumber.trim(),
      authString: userAuthString
    })

    await auth.save()

    res.status(200).send({
      message: "Email sent successfully!",
    });
    // });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
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

router.post("/verifyCode", async (req, res) => {
  console.log(req.body)

  let authInfo = await Auth.findOne({
    workEmail: req.body.workEmail.trim() + "@udmercy.edu",
    employmentNumber: "T" + req.body.employmentNumber,
  })

  if (authInfo === null) {
    res.status(500).send("There was an error")
    return
  }

  console.log(authInfo)

  if (authInfo?.authString === req.body.userCode.trim()) {
    res.status(200).send("Code verified")
    return
  } else {
    res.status(404).send("Incorrect code")
    return
  }
})

export default router;
