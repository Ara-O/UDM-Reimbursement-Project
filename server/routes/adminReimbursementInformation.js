import logger from "../logger.js";
import { Router } from "express";
import { verifyAdminToken } from "../middleware/auth.js";
import Faculty from "../models/faculty.js";
import dotenv from "dotenv";
import { z, ZodError } from "zod";
import AdditionalReimbursementMessages from "../models/reimbursementMessages.js";
import ReimbursementTicket from "../models/reimbursement.js";
dotenv.config();

const router = Router();

router.post("/deny-reimbursement", verifyAdminToken, async (req, res) => {
  try {
    const denial_message = req.body.denialMessage;
    const ticket = req.body.reimbursementTicket;

    ticket.reimbursementStatus = "Denied";

    // First update the reimbursement request's status
    let resp = await ReimbursementTicket.findByIdAndUpdate(ticket._id, ticket);

    if (resp === null) {
      logger.error(`Reimbursement Ticket ID could not be found`, {
        api: "/admin/deny-reimbursement",
      });

      return res.status(400).send({
        message: "There was an error denying this reimbursement request.",
      });
    }

    // This just clears it if there is an already existing message
    await AdditionalReimbursementMessages.deleteMany({
      reimbursementID: ticket._id,
    });

    // Store the denial message in the additional messages table so the user can retrieve it
    const message = new AdditionalReimbursementMessages({
      message: denial_message,
      messageType: "DENIAL",
      reimbursementID: ticket._id,
    });

    await message.save();

    return res
      .status(200)
      .send({ message: "Reimbursement request denied successfully" });
  } catch (err) {
    logger.error(err, {
      api: "/admin/deny-reimbursement",
    });

    return res.status(400).send({
      message:
        "There was an error denying this reimbursement request. Please try again later",
    });
  }
});

export default router;
