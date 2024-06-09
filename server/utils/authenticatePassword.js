import bcrypt from "bcrypt";
import logger from "../logger.js";

const SALT_ROUNDS = 10;
export async function encryptPassword(password) {
  try {
    let encryptedPassowrd = await bcrypt.hash(password, SALT_ROUNDS);
    return encryptedPassowrd;
  } catch (err) {
    logger.error(err, {
      api: "encrypt-password",
    });

    throw err;
  }
}

export async function decryptPassword(password, encryptedPassword) {
  try {
    let passwordMatches = await bcrypt.compare(password, encryptedPassword);
    if (passwordMatches) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    logger.error(err, {
      api: "decrypt-password",
    });

    throw err;
  }
}
