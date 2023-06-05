import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import updateFoapaDetails from "../utils/updateFoapaDetails.js";
import Faculty from "../models/faculty.js";
const router = Router();

router.post("/addReimbursement", verifyToken, async (req, res) => {
  const {
    reimbursementId,
    eventName,
    totalAmount,
    reimbursementStatus,
    reimbursementDate,
    activities,
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
      activities,
    });

    //Update foapa details
    await userInfo.save();

    // await updateFoapaDetails(req.user.employmentNumber);
    //Save
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
    let sortBy = req.query.sortBy;
    console.log("sortby", sortBy);

    let reimbursements = await Faculty.findOne({
      employmentNumber: req.user.employmentNumber,
    }).select("reimbursementTickets");

    if (sortBy === "Cost Ascending") {
      reimbursements.reimbursementTickets =
        reimbursements.reimbursementTickets.sort((a, b) => {
          return a.totalAmount - b.totalAmount;
        });
    }

    if (sortBy === "Cost Descending") {
      reimbursements.reimbursementTickets =
        reimbursements.reimbursementTickets.sort((a, b) => {
          return b.totalAmount - a.totalAmount;
        });
    }

    if (sortBy === "Date") {
      reimbursements.reimbursementTickets =
        reimbursements.reimbursementTickets.sort((a, b) => {
          return b.reimbursementDate - b.reimbursementDate;
        });
    }
    console.log(reimbursements);

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
      activities,
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
          "reimbursementTickets.$.activities": activities,
          "reimbursementTickets.$.eventName": eventName,
          "reimbursementTickets.$.totalAmount": totalAmount,
          "reimbursementTickets.$.reimbursementDate": reimbursementDate,
        },
      },
      { new: true }
    );

    // await updateFoapaDetails(req.user.employmentNumber);

    console.log("up", result);

    res.status(200).send({ message: "Reimbursement updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: err.message });
  }
});

router.post("/deleteReimbursement", verifyToken, async (req, res) => {
  const reimbursementId = req.body.id;
  // console.log(reimbursementId)

  try {
    let userInfo = await Faculty.findOne({
      employmentNumber: req.user.employmentNumber,
    });

    await userInfo.reimbursementTickets.pull({
      reimbursementId,
    });

    await userInfo.save();
    console.log(userInfo);

    res
      .status(200)
      .send({ message: "Reimbursement ticket deleted successfully" });
  } catch (err) {
    // console.log(err)
    res.status(400).send({ message: err.message });
  }
});

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
