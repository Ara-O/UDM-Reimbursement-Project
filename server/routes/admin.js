import { Router } from "express";
import ReimbursementTicket from "../models/reimbursement.js";
import Faculty from "../models/faculty.js";
import { verifyAdminToken } from "../middleware/auth.js";

const router = Router();

// Loops through all submitted tickets and finds the corresponding faculty member it belongs to
router.get(
  "/retrieve-submitted-requests",
  verifyAdminToken,
  async (req, res) => {
    try {
      let results = [];

      const requests = await ReimbursementTicket.find({
        reimbursementStatus: "Submitted",
      });

      const reimbursementIds = requests.map((r) => r._id);
      const faculties = await Faculty.find({}).select(
        "firstName lastName department workEmail reimbursementTickets"
      );

      for (let request of requests) {
        for (let faculty of faculties) {
          if (!faculty.reimbursementTickets) {
            console.log("broke because undefined");
            break;
          }
          if (faculty.reimbursementTickets.includes(request._id))
            results.push({
              request,
              faculty,
            });
        }
      }
      res.status(200).send(results);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }
);

export default router;
