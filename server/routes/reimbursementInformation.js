import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import Faculty from "../models/faculty.js";
import logger from "../logger.js";
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

//GET /api/retrieve-ticket-information
router.get("/retrieve-ticket-information", verifyToken, async (req, res) => {
  try {
    const reimbursementId = req.query.reimbursementId;
    let ticketInfo = await ReimbursementTicket.findById(reimbursementId);
    res.status(200).send(ticketInfo);
  } catch (err) {
    logger.error(err, {
      api: "/api/retrieve-ticket-information",
    });
    res.status(400).send({ message: err.message });
  }
});

//POST /api/update-reimbursement
router.post("/update-reimbursement", verifyToken, async (req, res) => {
  const reimbursementTicket = req.body.reimbursementTicket;
  try {
    await ReimbursementTicket.findByIdAndUpdate(
      reimbursementTicket._id,
      reimbursementTicket
    );

    res.status(200).send({ message: "Reimbursement updated successfully!" });
  } catch (err) {
    logger.error(err, {
      api: "/api/update-reimbursement",
    });

    res.status(500).send({
      message:
        "An unexpected error occured when updating this reimbursement's claim. Please try again later.",
    });
  }
});

//POST /api/delete-reimbursement
router.post("/delete-reimbursement", verifyToken, async (req, res) => {
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

router.post("/save-as-template", verifyToken, async (req, res) => {
  try {
    if (req.body._id) {
      delete req.body._id;
    }

    if (req?.body?.activities) {
      req.body.activities.forEach((actv) => {
        delete actv._id;
      });
    }

    if (req?.body?.guestInformation) {
      req.body.guestInformation.forEach((guest) => {
        delete guest._id;
      });
    }

    let user = await Faculty.findByIdAndUpdate(req.user.userId, {
      $push: {
        reimbursementTemplates: req.body,
      },
    });

    return res
      .status(200)
      .send({ message: "Reimbursement claim saved as template successfully" });
  } catch (err) {
    logger.error(
      "An unexpected error has occured when saving a ticket as a template",
      {
        api: "/api/save-as-template",
      }
    );

    logger.error(err, {
      api: "/api/save-as-template",
    });
    return res.status(500).send({
      message: "An unexpected error has occured. Please try again later",
    });
  }
});

router.post("/dont-know-foapa", verifyToken, async (req, res) => {
  console.log(req.body.knowFoapaBool);

  if (!req.body.knowFoapaBool) {
    try {
      let reimbursementId = req.query.reimbursementId;
      let ticketInfo = await ReimbursementTicket.findById(reimbursementId);

      console.log(ticketInfo);

      //ticketInfo.knowFoapa = req.body.knowFoapaBool;

      //ticketInfo.save();
    } catch (err) {
      console.log(err);
      res.status(400).send({ message: err.message });
    }
  }
});

export default router;
