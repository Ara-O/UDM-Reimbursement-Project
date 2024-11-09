import { request, Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import Faculty from "../models/faculty.js";
import logger from "../logger.js";
import z, { ZodError } from "zod";
import ReimbursementTicket from "../models/reimbursement.js";
const router = Router();

const reimbursementRequestSchema = z.object({
  reimbursementTicket: z.object({
    _id: z.string().optional(),
    __v: z.number().optional(),
    reimbursementName: z.string(),
    totalCost: z.number(),
    reimbursementReason: z.string(),
    reimbursementStatus: z.string(),
    reimbursementDate: z.string(),
    activities: z.array(
      z
        .object({
          name: z.string(),
          cost: z.union([z.number(), z.string()]),
          date: z.string(),
          id: z.string(),
          additionalInformation: z.string().optional(),
        })
        .optional()
    ),
    reimbursementReceipts: z.array(
      z
        .object({
          _id: z.string().optional(),
          id: z.string(),
          name: z.string(),
          url: z.string(),
        })
        .optional()
    ),
    destination: z.string(),
    paymentRetrievalMethod: z.string(),
    UDMPUVoucher: z.boolean(),
    knowFoapa: z.boolean(),
    guestInformation: z.array(
      z
        .object({
          _id: z.string().optional(),
          employeeFirstName: z.string(),
          employeeLastName: z.string(),
          guestAssociation: z.string(),
          guestFirstName: z.string(),
          guestLastName: z.string(),
        })
        .optional()
    ),
    foapaDetails: z.array(
      z
        .object({
          _id: z.string().optional(),
          cost: z.union([z.number(), z.string()]),
          foapa_id: z.string(),
        })
        .optional()
    ),
  }),
});

// Add a reimbursement request: POST /api/add-reimbursement
router.post("/add-reimbursement", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userInfo = await Faculty.findById(userId);

    const requestData = reimbursementRequestSchema.parse(req.body);
    const reimbursement = requestData.reimbursementTicket;

    let reimbursementTicket = new ReimbursementTicket(reimbursement);

    //Stores the reimbursement request in the reimbursements database
    await reimbursementTicket.save();

    //Add the reimbursement request ID to the faculty's reimbursement tickets list
    userInfo.reimbursementTickets.push(reimbursementTicket);

    await userInfo.save();

    return res
      .status(200)
      .send({ message: "Reimbursement ticket added successfully" });
  } catch (err) {
    logger.error("There was an error adding a reimbursement", {
      api: "/api/add-reimbursement",
    });

    logger.error(err, {
      api: "/api/add-reimbursement",
    });

    if (err instanceof ZodError) {
      logger.error(err, {
        api: "/api/add-reimbursement",
      });

      return res
        .status(400)
        .send({ message: "There was an error with one of your inputs" });
    }

    return res.status(500).send({
      message:
        "There was an error saving this reimbursement claim. Please try again later.",
    });
  }
});

//When the user clicks modify reimbursement, this fetches the ticket info: GET /api/retrieve-ticket-information
router.get("/retrieve-ticket-information", verifyToken, async (req, res) => {
  try {
    const requestSchema = z.string();

    const reimbursementId = requestSchema.parse(req.query.reimbursementId);

    let ticketInfo = await ReimbursementTicket.findById(reimbursementId);

    res.status(200).send(ticketInfo);
  } catch (err) {
    logger.error(err, {
      api: "/api/retrieve-ticket-information",
    });

    if (err instanceof ZodError) {
      return res.status(400).send({
        message:
          "An error occured when retrieving this reimbursement request. Please try again later.",
      });
    }

    return res.status(500).send({
      message: "An unexpected error has occured. Please try again later",
    });
  }
});

//Edit a reimbursement claim: POST /api/update-reimbursement
router.post("/update-reimbursement", verifyToken, async (req, res) => {
  try {
    // Validate the user's reimbursement data
    const requestData = reimbursementRequestSchema.parse(req.body);

    const reimbursementTicket = requestData.reimbursementTicket;

    // Look for the reimbursement with the same id and update it with the user
    // inputted updated reimbursement request
    await ReimbursementTicket.findByIdAndUpdate(
      reimbursementTicket._id,
      reimbursementTicket
    );

    logger.info(
      `User ${req.user.userId} has successfully updated reimbursement ${reimbursementTicket._id}`,
      {
        api: "/api/update-reimbursement",
      }
    );

    return res
      .status(200)
      .send({ message: "Reimbursement updated successfully!" });
  } catch (err) {
    logger.error(err, {
      api: "/api/update-reimbursement",
    });

    return res.status(500).send({
      message:
        "An unexpected error occured when updating this reimbursement's claim. Please try again later.",
    });
  }
});

// Delete reimbursement: POST /api/delete-reimbursement
router.post("/delete-reimbursement", verifyToken, async (req, res) => {
  try {
    const requestSchema = z.string();

    const userId = req.user.userId;

    // Parse the reimbursement id
    const reimbursementId = requestSchema.parse(req.body.id);

    let faculty = await Faculty.findById(userId);

    // Remove the reimbursement ID from the faculty's reimbursement list
    faculty.reimbursementTickets.pull(reimbursementId);

    // Delete the reimbursement from the reimbursement table
    await ReimbursementTicket.findByIdAndDelete(reimbursementId);

    await faculty.save();

    logger.info(
      `User ${userId} has successfully deleted reimbursement ${reimbursementId}`,
      {
        api: "/api/delete-reimbursement",
      }
    );

    return res
      .status(200)
      .send({ message: "Reimbursement ticket deleted successfully" });
  } catch (err) {
    logger.error(err, {
      api: "/api/delete-reimbursement",
    });

    return res.status(500).send({
      message:
        "An unexpected error occured when deleting this reimbursement. Please try again later.",
    });
  }
});

// Save a reimbursement claim as a template: POST /save-as-template
router.post("/save-as-template", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const requestData = reimbursementRequestSchema.parse(req.body);

    const reimbursementTicket = requestData.reimbursementTicket;

    // Removes all the _id fields so the template can have a new ID
    if (reimbursementTicket._id) {
      delete reimbursementTicket._id;
    }

    if (reimbursementTicket.activities) {
      reimbursementTicket.activities.forEach((actv) => {
        delete actv._id;
      });
    }

    if (reimbursementTicket.foapaDetails) {
      reimbursementTicket.foapaDetails.forEach((foapa) => {
        delete foapa._id;
      });
    }

    if (reimbursementTicket.guestInformation) {
      reimbursementTicket.guestInformation.forEach((guest) => {
        delete guest._id;
      });
    }

    if (reimbursementTicket.reimbursementReceipts) {
      reimbursementTicket.reimbursementReceipts.forEach((receipt) => {
        delete receipt._id;
      });
    }

    await Faculty.findByIdAndUpdate(userId, {
      $push: {
        reimbursementTemplates: reimbursementTicket,
      },
    });

    logger.info(
      `User ${userId} has successfully saved a reimbursement request as a template`,
      {
        api: "/api/save-as-template",
      }
    );

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
