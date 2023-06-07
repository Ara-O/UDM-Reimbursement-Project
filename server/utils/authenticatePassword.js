import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;
export async function encryptPassword(password) {
  let encryptedPassowrd = await bcrypt.hash(password, SALT_ROUNDS);
  return encryptedPassowrd;
}


export async function decryptPassword(password, encryptedPassword) {
  let passwordMatches = await bcrypt.compare(password, encryptedPassword);

  if (passwordMatches) {
    console.log("Password matches");
    return true;
  } else {
    console.log("Password does not match");
    return false;
  }
}
