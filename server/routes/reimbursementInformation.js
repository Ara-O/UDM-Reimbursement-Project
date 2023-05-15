import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import Faculty from "../models/faculty.js";
const router = Router();

router.post("/addReimbursement", verifyToken, async (req, res) => {
  const {
    reimbursementId,
    eventName,
    totalAmount,
    reimbursementStatus,
    reimbursementDate,
    allActivities,
  } = req.body;
  try {
    let userInfo = await Faculty.findOne({
      employmentNumber: req.user.employmentNumber,
    });

    await userInfo.reimbursementTickets.push({
      eventName,
      reimbursementId,
      totalAmount,
      reimbursementStatus,
      reimbursementDate,
      activities: allActivities,
    });
    await userInfo.save();
    res
      .status(200)
      .send({ message: "Reimbursement ticket added successfully" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

//GET /api/retrieveReimbursements
router.get("/retrieveReimbursements", verifyToken, async (req, res) => {
  try {
    let reimbursements = await Faculty.findOne({
      employmentNumber: req.user.employmentNumber,
    }).select("reimbursementTickets");

    res.status(200).send(reimbursements.reimbursementTickets);
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: err.message });
  }
});

router.get("/retrieveTicketInformation", verifyToken, async (req, res) => {
  try {
    const reimbursementId = req.query.reimbursementId;
    let ticketInfo = await Faculty.findOne(
      {
        employmentNumber: req.user.employmentNumber,
        "reimbursementTickets.reimbursementId": reimbursementId,
      },
      { "reimbursementTickets.$": 1 }
    );
    res.status(200).send(ticketInfo.reimbursementTickets[0]);
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: err.message });
  }
});

router.post("/updateReimbursement", verifyToken, async (req, res) => {
  //REFACTOR
  try {
    const {
      reimbursementId,
      allActivities,
      eventName,
      totalAmount,
      reimbursementDate,
    } = req.body;

    const result = await Faculty.findOneAndUpdate(
      {
        employmentNumber: req.user.employmentNumber,
        reimbursementTickets: { $elemMatch: { reimbursementId } },
      },
      {
        $set: {
          "reimbursementTickets.$.activities": allActivities,
          "reimbursementTickets.$.eventName": eventName,
          "reimbursementTickets.$.totalAmount": totalAmount,
          "reimbursementTickets.$.reimbursementDate": reimbursementDate,
        },
      },
      { new: true }
    );

    console.log("up", result);

    res.status(200).send({ message: "Reimbursement updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: err.message });
  }
});
export default router;
