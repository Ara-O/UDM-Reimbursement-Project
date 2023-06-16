import jwt from "jsonwebtoken";
const config = process.env;

export const verifyToken = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res
      .status(403)
      .send({ message: "A token is required for authentication" });
  }

  try {
    const decodedUserInformation = await jwt.verify(token, config.JWT_SECRET);
    // console.log("decoded token", decodedUserInformation);
    req.user = decodedUserInformation;
  } catch (err) {
    console.error(err.message);
    return res.status(401).send({ message: "Invalid Token" });
  }
  return next();
};
