import jwt from "jsonwebtoken";
import logger from "../logger.js";
import z from "zod";
import Faculty from "../models/faculty.js";

const config = process.env;

export const verifyToken = async (req, res, next) => {
  try {
    // Get the authorization header from request headers
    let token = req.headers.authorization;

    // If it does not exist, send an error
    if (!token) {
      return res.status(403).send({
        message:
          "There was an error verifying your account. Please log in again.",
      });
    }

    const decodedUserInformation = await jwt.verify(token, config.JWT_SECRET);

    // Store the decoded information into the req.user object - most APIs will use the req.user.userId property from here
    req.user = decodedUserInformation;

    // Verify that the req.user object has the userId property
    const useridSchema = z.string();

    // If the userId does not exist, an error will be thrown that will be caught by the catch block
    useridSchema.parse(req.user.userId);

    return next();
  } catch (err) {
    logger.error("There was an error verifying a user's information", {
      api: "/verify-token middleware",
    });

    logger.error(err, {
      api: "verify-token middleware",
    });

    return res.status(403).send({
      message:
        "There was an error verifying your account. Please log in again.",
    });
  }
};

export const verifyAdminToken = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(403).send({
        message:
          "There was an error verifying your account. Please log in again.",
      });
    }

    const decodedUserInformation = await jwt.verify(token, config.JWT_SECRET);

    req.user = decodedUserInformation;

    const faculty = await Faculty.findById(req.user.userId);

    if (faculty === null) {
      return res.status(404).send({
        message:
          "There was an error verifying your account. Please log in again.",
      });
    }

    if (faculty.role !== "ADMIN") {
      return res.status(404).send({
        message: "This functionality is reserved for admins.",
      });
    }

    const useridSchema = z.string();

    useridSchema.parse(req.user.userId);

    return next();
  } catch (err) {
    logger.error("There was an error verifying a user's information", {
      api: "/verify-token middleware",
    });

    logger.error(err, {
      api: "verify-token middleware",
    });

    return res.status(403).send({
      message:
        "There was an error verifying your account. Please log in again.",
    });
  }
};
