import jwt from "jsonwebtoken";
import logger from "../logger.js";
import z from "zod";

const config = process.env;

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

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
