import { request, Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { retrieveDate } from "../utils/retrieveDate.js";
import Faculty from "../models/faculty.js";
import logger from "../logger.js";
import z, { ZodError } from "zod";
import ReimbursementTicket from "../models/reimbursement.js";
import AdditionalReimbursementMessages from "../models/reimbursementMessages.js";
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
    request_history: z
      .array(
        z
          .object({
            date_of_message: z.string(),
            request_message: z.string(),
          })
          .optional()
      )
      .optional(),
  }),
});

// Add a reimbursement request: POST /api/add-reimbursement
router.post("/add-reimbursement", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userInfo = await Faculty.findById(userId);

    console.log(req.body);

    const requestData = reimbursementRequestSchema.parse(req.body);
    const reimbursement = requestData.reimbursementTicket;

    console.log(requestData.reimbursementTicket.request_history);

    reimbursement.request_history.push({
      date_of_message: `${retrieveDate("MM/DD/YYYY")}`,
      request_message: "The Request Was Saved",
    });

    console.log(requestData.reimbursementTicket.request_history);

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
    console.log(req.body);
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
    let resp = await ReimbursementTicket.findByIdAndUpdate(
      reimbursementTicket._id,
      reimbursementTicket
    );

    if (resp === null) {
      return res.status(400).send({
        message: "Please save this request before marking it as submited.",
      });
    }

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

router.post("/duplicate-request", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const schema = z.string();

    //Fetch the faculty's data
    const faculty = await Faculty.findById(userId);

    if (faculty === null) {
      throw new Error(
        "User information not found. Please reload and try again."
      );
    }

    const requestToDuplicateID = schema.parse(req.body.id);
    const request = await ReimbursementTicket.findById(requestToDuplicateID);

    if (request === null) {
      throw new Error(
        "An error occured when fetching this request. Please reload and try again"
      );
    }

    const newRequest = Object.assign({}, request.toObject());

    // Update the request's name and make it new (this generates new _ids)
    newRequest.reimbursementName = "Copy of " + newRequest.reimbursementName;
    if (newRequest._id) {
      delete newRequest._id;
    }

    if (newRequest.activities) {
      newRequest.activities.forEach((actv) => {
        delete actv._id;
      });
    }

    if (newRequest.foapaDetails) {
      newRequest.foapaDetails.forEach((foapa) => {
        delete foapa._id;
      });
    }

    if (newRequest.guestInformation) {
      newRequest.guestInformation.forEach((guest) => {
        delete guest._id;
      });
    }

    if (newRequest.reimbursementReceipts) {
      newRequest.reimbursementReceipts.forEach((receipt) => {
        delete receipt._id;
      });
    }

    newRequest.reimbursementStatus = "In Progress";

    const duplicatedRequest = new ReimbursementTicket(newRequest);

    const duplicatedRequestRes = await duplicatedRequest.save();

    faculty.reimbursementTickets.push(duplicatedRequestRes._id);

    let fac = await faculty.save();
    console.log(fac.reimbursementTickets);

    logger.log(
      "info",
      `${userId} has successfully duplicated a reimbursement request`,
      {
        api: "/api/duplicate-request",
      }
    );

    return res.status(200).send({ message: "Request duplicated successfully" });
  } catch (err) {
    logger.log("error", err, {
      api: "/api/duplicate-request",
    });

    return res.status(500).send({
      error:
        "There was an error duplicating this request. Please try again later",
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

// This fetches the admin's message for a reimbursement request. Essentially
// when the admin denies a request, it stores the denial message in a table assoicated with the
// reimbursement request id. Then when the faculty wants to retrieve the message, this api gets called that
// fetches the message based on the same request id
router.get("/fetch-request-admin-message", verifyToken, async (req, res) => {
  try {
    const requestId = req.query.id;

    const message = await AdditionalReimbursementMessages.findOne({
      reimbursementID: requestId,
    });

    return res.status(200).send({ message: message.message });
  } catch (err) {
    logger.error(err, {
      api: "/api/fetch-request-admin-message",
    });
    return res.status(400).send({
      message: "An unexpected error occured when fetching admin messages",
    });
  }
});

export default router;
