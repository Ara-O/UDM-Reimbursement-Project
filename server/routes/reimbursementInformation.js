import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import Faculty from "../models/faculty.js";
import ReimbursementTicket from "../models/reimbursement.js";
const router = Router();

//GET /api/retrieveReimbursements
router.get("/retrieveReimbursements", verifyToken, async (req, res) => {
  try {
    let reimbursements = await Faculty.findById(req.user.userId)
      .populate("reimbursementTickets")
      .select("reimbursementTickets");
    res.status(200).send(reimbursements.reimbursementTickets);
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: err.message });
  }
});

// POST /api/addReimbursement
router.post("/addReimbursement", verifyToken, async (req, res) => {
  try {
    let userInfo = await Faculty.findById(req.user.userId);

    let reimbursementTicket = new ReimbursementTicket(
      req.body.reimbursementTicket
    );

    await reimbursementTicket.save();
    userInfo.reimbursementTickets.push(reimbursementTicket);
    userInfo.save();

    res
      .status(200)
      .send({ message: "Reimbursement ticket added successfully" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

//GET /api/retrieveTicketInformation
router.get("/retrieveTicketInformation", verifyToken, async (req, res) => {
  try {
    const reimbursementId = req.query.reimbursementId;
    let ticketInfo = await ReimbursementTicket.findById(reimbursementId);
    res.status(200).send(ticketInfo);
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: err.message });
  }
});

//POST /api/updateReimbursement
router.post("/updateReimbursement", verifyToken, async (req, res) => {
  const reimbursementTicket = req.body.reimbursementTicket;
  try {
    await ReimbursementTicket.findByIdAndUpdate(
      reimbursementTicket._id,
      reimbursementTicket
    );

    res.status(200).send({ message: "Reimbursement updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: err.message });
  }
});

//POST /api/deleteReimbursement
router.post("/deleteReimbursement", verifyToken, async (req, res) => {
  const reimbursementId = req.body.id;
  console.log("rem id", reimbursementId);
  try {
    let faculty = await Faculty.findById(req.user.userId);
    faculty.reimbursementTickets.pull(reimbursementId);
    await ReimbursementTicket.findByIdAndDelete(reimbursementId);
    await faculty.save();

    res
      .status(200)
      .send({ message: "Reimbursement ticket deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err.message });
  }
});

//CHANGE
router.post("/editActivity", verifyToken, async (req, res) => {
  const activityId = req.body.id;
  // console.log(activityId)

  try {
    let userInfo = await Faculty.findOne({
      activityId: req.user.activityId,
    });

    await userInfo.activities.pull({
      activityId,
    });

    await userInfo.save();
    console.log(userInfo);

    res.status(200).send({ message: "Activity updated successfully" });
  } catch (err) {
    // console.log(err)
    res.status(400).send({ message: err.message });
  }
});

router.get("/retrieveActivity", verifyToken, async (req, res) => {
  try {
    const activityId = req.query.activityId;
    let activityInfo = await Faculty.findOne({
      activityId: req.user.activityId,
      "activities.activityId": activityId,
    });
    console.log(activityInfo);
    res.status(200).send(activityInfo.activities[0]);
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: err.message });
  }
});

export default router;
