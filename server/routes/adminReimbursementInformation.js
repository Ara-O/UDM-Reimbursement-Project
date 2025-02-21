import logger from "../logger.js";
import { Router } from "express";
import { verifyAdminToken } from "../middleware/auth.js";
import Faculty from "../models/faculty.js";
import dotenv from "dotenv";
import { z, ZodError } from "zod";
import AdditionalReimbursementMessages from "../models/reimbursementMessages.js";
import ReimbursementTicket from "../models/reimbursement.js";
import { retrieveDate } from "../utils/retrieveDate.js";
import sgMail from "@sendgrid/mail";

dotenv.config();

const router = Router();

router.post("/approve-reimbursement", verifyAdminToken, async (req, res) => {
  try {
    const ticket = req.body.reimbursementTicket;
    const faculty = req.body.facultyID;

    ticket.reimbursementStatus = "Approved";
    ticket.request_history.unshift({ date_of_message: `${retrieveDate("MM/DD/YYYY")}`, request_message: `The Request Was Approved` })

    // First update the reimbursement request's status
    let resp = await ReimbursementTicket.findByIdAndUpdate(ticket._id, ticket);

    if (resp === null) {
      logger.error(`Reimbursement Ticket ID could not be found`, {
        api: "/admin/deny-reimbursement",
      });

      return res.status(400).send({
        message: "There was an error approving this reimbursement request.",
      });
    }

    let facultyInfo = await Faculty.findById(faculty);

    if (facultyInfo === null) {
      return res.status(400).send({
        message:
          "This faculty does not exist/their information could not be found. Please verify with the faculty",
      });
    }

    // Send an email to the professor telling them they were accepted
    // TODO: Probably also send it to an admin
    await sgMail.send({
      from: "UDM Reimbursement Team<oladipea@udmercy.edu>",
      to: facultyInfo.workEmail,
      subject: `Reimbursement Request Approved - ${ticket.reimbursementName}`,
      html: `
      <div style="border: solid 1px #efefef; padding: 20px 0px;">
      <div style="background: white;padding: 5% 10%; box-sizing: border-box;">
      <img src="https://ik.imagekit.io/x3m2gjklk/site-logo.png" alt="UDM Reimbursement Logo" style="width: 100px"/>
      <h3 style="font-weight: 500; margin: 20px 0; margin-top: 35px">Congratulations! Your reimbursement request - <b>${ticket.reimbursementName}</b> - was approved</h3>
      <h5 style="font-weight: 500; margin: 20px 0; margin-top: 35px">Note: This email was sent on the behalf of: ${facultyInfo.firstName} ${facultyInfo.lastName}
            </h5>
      </div>
      </div>
      `,
    });

    logger.info(
      `${facultyInfo.workEmail}'s reimbursement ${ticket._id} was approved`,
      {
        api: "/api/approve-reimburseemnt",
      }
    );

    return res
      .status(200)
      .send({ message: "Reimbursement claim was approved sucessfully" });
  } catch (err) {
    console.log(err);
  }
});

router.post("/deny-reimbursement", verifyAdminToken, async (req, res) => {
  try {
    const denial_message = req.body.denialMessage;
    const ticket = req.body.reimbursementTicket;
    const faculty = req.body.facultyID;

    ticket.reimbursementStatus = "Denied";
    ticket.request_history.unshift({ date_of_message: `${retrieveDate("MM/DD/YYYY")}`, request_message: `The Request Was Denied: ${denial_message}` })

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

    let facultyInfo = await Faculty.findById(faculty);

    if (facultyInfo === null) {
      return res.status(400).send({
        message:
          "This faculty does not exist/their information could not be found. Please verify with the faculty",
      });
    }

    await sgMail.send({
      from: "UDM Reimbursement Team<oladipea@udmercy.edu>",
      to: facultyInfo.workEmail,
      subject: `Reimbursement Request Denied - ${ticket.reimbursementName}`,
      html: `
      <div style="border: solid 1px #efefef; padding: 20px 0px;">
      <div style="background: white;padding: 5% 10%; box-sizing: border-box;">
      <img src="https://ik.imagekit.io/x3m2gjklk/site-logo.png" alt="UDM Reimbursement Logo" style="width: 100px"/>
      <h3 style="font-weight: 500; margin: 20px 0; margin-top: 35px">Your reimbursement request - <b>${ticket.reimbursementName}</b> - was denied</h3>
      <h3 style="font-weight: 500; margin: 20px 0; margin-top: 35px"><b>Reason for denial</b> - ${denial_message}</h3>

      <h5 style="font-weight: 500; margin: 20px 0; margin-top: 35px">Note: This email was sent on the behalf of: ${facultyInfo.firstName} ${facultyInfo.lastName}
            </h5>
      </div>
      </div>
      `,
    });

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

router.get("/retrieve-all-faculty", verifyAdminToken, async (req, res) => {
  let faculties = await Faculty.find()

  console.log("This is this", faculties)

  if (faculties === null) {
    logger.error(`No faculty could be found.`, {
      api: "/admin/retrieve-all-faculty",
    });

    return res.status(400).send({
      message: "There was an error retrieving the faculty information.",
    });
  }

  return res.status(200).send({ faculties: faculties });

})

router.post("/save-roles", verifyAdminToken, async (req, res) => {
  try {
    let faculties = req.body.faculties

    for (let faculty of faculties) {
      let updated = await Faculty.findByIdAndUpdate(faculty.id, faculty.role)

      console.log("updated", updated)
    }

    // let facultyInfo = await Faculty.findByIdAndUpdate(
    //   req.user.id,
    //   req.body.role
    // );

    // if (facultyInfo === null) {
    //   res.status(404).send({
    //     message: "Unable to update role of faculty.",
    //   });
    // } else {
    //   console.log("updated table");
    //   res.status(200).send({ message: "Role updated successfully" });
    // }
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: error.message });
  }
})

export default router;
