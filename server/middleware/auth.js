import jwt from "jsonwebtoken";
const config = process.env;
import logger from "../logger.js";

export const verifyToken = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(403).send({
      message:
        "There was an error verifying your account. Please log in again.",
    });
  }

  try {
    const decodedUserInformation = await jwt.verify(token, config.JWT_SECRET);

    req.user = decodedUserInformation;
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

  return next();
};
