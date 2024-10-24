import logger from "../logger.js";
import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import Faculty from "../models/faculty.js";
import dotenv from "dotenv";
import { z, ZodError } from "zod";

dotenv.config();

const router = Router();

// Retrieve user information - GET /api/retrieve-dashboard-data
router.get("/retrieve-dashboard-data", verifyToken, async (req, res) => {
  try {
    // Retrieve the user id from verifyToken middleware and verify with zod
    const useridSchema = z.string();

    useridSchema.parse(req.user.userId);

    let facultyInfo = await Faculty.findById(req.user.userId).populate(
      "reimbursementTickets"
    );

    // If a faculty was not found based on the userId in their cookies, then prompt the
    // user to log in again - 403 error code makes users have to log in again on frontend
    if (facultyInfo === null) {
      return res.status(403).send({
        message: "Unable to retrieve account information. Please log in again.",
      });
    }

    return res.status(200).send(facultyInfo);
  } catch (err) {
    logger.error("There was an error retrieving the user's dashboard data", {
      api: "/api/retrieve-dashboard-data",
    });

    logger.error(err, {
      api: "/api/retrieve-dashboard-data",
    });

    if (err instanceof ZodError) {
      //This only triggers when there is an issue with the user ID
      return res.status(403).send({
        message:
          "There was an error verifying your account. Please log in again.",
      });
    }

    return res.status(500).send({
      message: "There was an error verifying your account. Please log in again",
    });
  }
});

export default router;
