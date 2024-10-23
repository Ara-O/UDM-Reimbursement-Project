import { Router } from "express";
import logger from "../logger.js";
import Faculty from "../models/faculty.js";
import { Auth } from "../models/auth.js";
import { transporter } from "../app.js";
import { getOrgNumber } from "../utils/getDepartmentORGNumber.js";
import {
  encryptPassword,
  decryptPassword,
} from "../utils/authenticatePassword.js";
import { generateRandomStringId } from "../utils/generateRandomString.js";

import jwt from "jsonwebtoken";
import { ZodError } from "zod";
import z from "zod";

const router = Router();

//Verifying the user's information - POST /api/verify-signup-basic-information
router.post("/verify-signup-basic-information", async (req, res) => {
  try {
    // Define input schema - expected data from frontend
    const schema = z
      .object({
        employmentNumber: z.string().trim().length(8),
        workEmail: z
          .string()
          .trim()
          .regex(/^[a-zA-Z0-9-]+$/)
          .toLowerCase(),
      })
      .required();

    const data = schema.parse(req.body);

    // Add the necessary pre-frormating to email and employment number
    const formattedEmploymentNumber = "T" + data.employmentNumber;
    const formattedWorkEmail = data.workEmail + "@udmercy.edu";

    logger.info(
      `Verifying signup information for ${formattedWorkEmail} - ${formattedEmploymentNumber}`,
      {
        api: "/api/verify-signup-basic-information",
      }
    );

    // Find an account that either has the same employment number or work email
    let faculty = await Faculty.findOne({
      $or: [
        { employmentNumber: formattedEmploymentNumber },
        { workEmail: formattedWorkEmail },
      ],
    });

    // If a faculty exists, that means the faculty variable will not be null, hence throw an error
    if (faculty !== null) {
      logger.warn(
        `An employee with the inputted employment number or email address already exists`,
        {
          api: "/api/verify-signup-basic-information",
        }
      );

      return res.status(409).send({
        message:
          "An account associated with this information already exists. Please log in or reset your password if needed.",
      });
    }

    return res.status(200).send({ message: "Signup information valid!" });
  } catch (err) {
    logger.error(err, {
      api: "/api/verify-signup-basic-information",
    });

    // If there was an issue with the formatting - Zod threw the error
    if (err instanceof ZodError) {
      return res.status(400).send({
        message:
          "There was an issue with one or more of your inputs. Please revise them and try again.",
      });
    }

    return res
      .status(500)
      .send({ message: "An unexpected error occured. Please try again later" });
  }
});

//Send the user the 6-character code to confirm their email - POST /send-confirmation-email
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

    // Generate the random 6-digit code
    let userAuthString = generateRandomStringId(6);

    await transporter.sendMail({
      from: '"UDM Reimbursement Team" <udm-reimbursement-team@em2297.araoladipo.dev>',
      to: data.workEmail,
      subject: "Welcome to the UDM Reimbursement System!",
      html: `
           
<div style="border: solid 1px #efefef; padding: 20px 0px;">
      <div style="background: white;padding: 5% 10%; box-sizing: border-box;">
<img src="https://ik.imagekit.io/x3m2gjklk/site-logo.png" alt="UDM Reimbursement Logo" style="width: 100px"/>
<h3 style="font-weight: 600; margin: 0; padding: 10px 0; ">Verify Your Account</h3>
        <h4 style="font-weight: 300; margin: 10px 0;">Hello,</h4>
        <h4 style="font-weight: 300; margin: 10px 0;">Thanks for signing up for the University of Detroit Mercy Reimbursement System!</h4>
        <h4 style="font-weight: 300; margin: 10px 0;">Please use the verification code below to activate your account:</h4>
        <h3 style="font-weight: 500; margin: 20px 0; margin-top: 35px">${userAuthString}</h3>
      </div>
      <p style="font-weight: 400; font-size: 10px; color: gray; text-align: center; margin: 10px 0;">
        If you did not sign up for this service, please ignore this email.
      </p>
</div>
        `,
    });

    logger.info(`Verification email successfully sent to ${data.workEmail}`, {
      api: "/api/send-confirmation-email",
    });

    //Check for existing codes and remove it
    await Auth.findOneAndDelete({
      workEmail: data.workEmail,
      employmentNumber: data.employmentNumber,
    });

    //Store key in database along with email and employment number
    const authCode = new Auth({
      workEmail: data.workEmail,
      employmentNumber: data.employmentNumber,
      authString: userAuthString,
    });

    await authCode.save();

    return res.status(200).send({
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

// Verify code
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
      return res.status(404).send({
        message: "Your token has expired. Please restart the signup process.",
      });
    }

    if (authInfo.authString === data.userCode) {
      logger.info(`${data.workEmail}'s code was successfully verified`, {
        api: "/api/verify-code",
      });

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

// Registering user - POST /api/register
router.post("/register", async (req, res) => {
  const schema = z.object({
    firstName: z
      .string()
      .trim()
      .regex(/^[a-zA-Z0-9\s-]+$/),
    lastName: z
      .string()
      .trim()
      .regex(/^[a-zA-Z0-9\s-]+$/),
    workEmail: z.string().trim().toLowerCase(),
    employmentNumber: z
      .string()
      .trim()
      .length(8)
      .regex(/^[0-9]+$/),
    department: z.string(),
    mailingAddress: z.string(),
    phoneNumber: z
      .string()
      .length(10)
      .regex(/^[0-9]+$/),
    password: z
      .string()
      .min(8, "Password must contain at least 8 character(s)"),
    postalCode: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    foapaDetails: z.any(),
  });

  try {
    const userData = schema.parse(req.body);

    userData.workEmail += "@udmercy.edu";
    userData.employmentNumber = "T" + userData.employmentNumber;

    logger.info(`An account is being created for ${userData.workEmail}`, {
      api: "/api/register",
    });

    let existingUser = await Faculty.findOne({
      $or: [
        {
          employmentNumber: userData.employmentNumber,
          workEmail: userData.workEmail,
        },
      ],
    });

    if (existingUser) {
      return res.status(409).send({ message: "Error: User already exists" });
    }

    // Hash password
    let encryptedPassword = await encryptPassword(userData.password);
    userData.password = encryptedPassword;

    // Automatically generate 2 user foapas based on the user's department number
    const generalFoapa = {
      foapaName: "General Department Spending",
      description:
        "Default FOAPA: This FOAPA was added by default when your account was created.",
      fund: "111000",
      organization: getOrgNumber(userData.department),
      account: "",
      program: "",
      activity: "",
      isUDMPU: false,
    };

    const UDMPU = {
      foapaName: "UDMPU 11.6 Faculty Development",
      description:
        "Default FOAPA: This FOAPA was added by default when your account was created.",
      fund: "260036",
      organization: getOrgNumber(userData.department),
      account: "",
      program: "",
      isUDMPU: true,
      activity: "",
    };

    userData.foapaDetails.push(generalFoapa, UDMPU);

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
          logger.info(
            `Account successfully created for ${userData.workEmail}`,
            {
              api: "/api/register",
            }
          );
          return res
            .status(201)
            .send({ message: "Registration successful!", token });
        }

        throw new Error(err);
      }
    );
  } catch (error) {
    logger.error(error, {
      api: "/api/register",
    });

    if (error instanceof ZodError) {
      return res.status(400).send({
        message: error.errors[0].message,
      });
    }

    return res.status(500).send({
      message:
        "There was an error creating your account. Please try again later",
    });
  }
});

//Logging the user in - POST /api/login
router.post("/login", async (req, res) => {
  const schema = z.object({
    userInfo: z.object({
      workEmail: z.string().trim().toLowerCase(),
      password: z.string(),
    }),
  });

  try {
    const data = schema.parse(req.body);
    data.userInfo.workEmail += "@udmercy.edu";

    let facultyInfo = await Faculty.findOne({
      workEmail: data.userInfo.workEmail,
    }).select("workEmail password employmentNumber");

    if (facultyInfo === null) {
      logger.warn(
        `${data.userInfo.workEmail} tried accessing their account with invalid credentials `,
        {
          api: "/api/login",
        }
      );

      return res.status(404).send({
        message:
          "Incorrect credentials. Please check that your email and password are correct.",
      });
    } else {
      // Decrypt the user's passsword
      let passwordMatches = await decryptPassword(
        data.userInfo.password,
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
              logger.info(`${data.userInfo.workEmail} successfully signed in`, {
                api: "/api/login",
              });

              return res
                .status(200)
                .send({ message: "Login successful", token: token });
            }

            logger.error("There was an error creating the faculty's token", {
              api: "/api/login",
            });

            return res.status(500).send({
              message:
                "An unexpected error occured when logging you in. Please try again later.",
            });
          }
        );
      } else {
        return res
          .status(403)
          .send({ message: "Incorrect Password. Please try again" });
      }
    }
  } catch (error) {
    logger.error("There was an error logging a user in", {
      api: "/api/login",
    });

    logger.error(error, {
      api: "/api/login",
    });

    if (error instanceof ZodError) {
      return res.status(400).send({
        message:
          "There was an error with one of your inputs. Please revise them and try again.",
      });
    }

    return res
      .status(500)
      .send({ message: "An unexpected error occured. Please try again later" });
  }
});

export default router;
