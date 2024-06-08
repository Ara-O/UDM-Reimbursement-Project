import { Router } from "express";
import Foapa from "../models/foapa.js";
import logger from "../logger.js";
import Faculty from "../models/faculty.js";
import {
  encryptPassword,
  decryptPassword,
} from "../utils/authenticatePassword.js";
import jwt from "jsonwebtoken";
import { ZodError, z } from "zod";

const router = Router();

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
    workEmail: z.string().trim(),
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
    password: z.string().min(8),
    postalCode: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    foapaDetails: z.array().optional(),
  });

  const userData = schema.parse(req.body);

  userData.workEmail += "@udmercy.edu";
  userData.employmentNumber = "T" + userData.employmentNumber;

  logger.info(`An account is being created for ${userData.workEmail}`, {
    api: "/api/register",
  });

  try {
    let encryptedPassword = await encryptPassword(userData.password);
    userData.password = encryptedPassword;

    let existingUser = await Faculty.findOne({
      employmentNumber: userData.employmentNumber,
    });

    if (existingUser) {
      return res.status(409).send({ message: "Error: User already exists" });
    }

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
        message:
          "There was an error with one of your inputs. Please revise them and try again.",
      });
    }

    return res.status(500).send({
      message:
        "There was an error creating your account. Please try again later",
    });
  }
});

//Verifying the user's information - POST /api/verify-signup-basic-information
router.post("/verify-signup-basic-information", async (req, res) => {
  try {
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

    const employmentNumber = "T" + data.employmentNumber;
    const workEmail = data.workEmail + "@udmercy.edu";

    let facultyFound = await Faculty.findOne({
      employmentNumber,
    });

    logger.info(
      `Verifying signup information for ${workEmail} - ${employmentNumber}`,
      {
        api: "/api/verify-signup-basic-information",
      }
    );

    if (facultyFound !== null) {
      return res.status(409).send({
        message:
          "An employee with the inputted employment number already exists",
      });
    }

    let facultyWithSameEmail = await Faculty.findOne({
      workEmail,
    });

    if (facultyWithSameEmail) {
      return res.status(409).send({
        message: "An employee with the inputted email address already exists",
      });
    } else {
      return res.status(200).send({ message: "Signup information valid!" });
    }
  } catch (err) {
    logger.error(err, {
      api: "/api/verify-signup-basic-information",
    });

    if (err instanceof ZodError) {
      return res.status(400).send({
        message:
          "There was an issue with one or more of your inputs. Please revise them and try again.",
      });
    }

    res
      .status(500)
      .send({ message: "An unexpected error occured. Please try again later" });
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
        message:
          "Credentials not found. Please check that your email and password are correct.",
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
