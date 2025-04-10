import logger from "../logger.js";
import { Router } from "express";
import { verifyAdminToken } from "../middleware/auth.js";
import Faculty from "../models/faculty.js";
import dotenv from "dotenv";
import createPdfDefinition from "../pdfGenerator.js";
import { z, ZodError } from "zod";
import AdditionalReimbursementMessages from "../models/reimbursementMessages.js";
import ReimbursementTicket from "../models/reimbursement.js";
import { retrieveDate } from "../utils/retrieveDate.js";
import sgMail from "@sendgrid/mail";
import DepartmentChairRegistry from "../models/departmentChairRegistry.js";
import https from "https";
import Pdfmake from "pdfmake";
import FacultyTagsList from "../models/facultyTagsList.js";

dotenv.config();

const router = Router();

router.post("/approve-reimbursement", verifyAdminToken, async (req, res) => {
  try {
    const ticket = req.body.reimbursementTicket;
    const faculty = req.body.facultyID;
    const approvalMessage = req.body.approvalMessage;

    ticket.reimbursementStatus = "Approved";

    let request_message = "The Request Was Approved. ";

    if (approvalMessage.length !== 0) {
      request_message += "The admin added this feedback: " + approvalMessage;
    }

    ticket.request_history.unshift({
      date_of_message: `${retrieveDate("MM/DD/YYYY")}`,
      request_message: request_message,
    });

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
    ticket.request_history.unshift({
      date_of_message: `${retrieveDate("MM/DD/YYYY")}`,
      request_message: `The Request Was Denied: ${denial_message}`,
    });

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

router.post(
  "/approve-request-with-edits",
  verifyAdminToken,
  async (req, res) => {
    // TODO: Add validation
    const ticket = req.body.reimbursement_data;
    const faculty_id = req.body.faculty_id;

    const faculty = await Faculty.findById(faculty_id);

    ticket.reimbursementStatus = "Approved*";

    ticket.request_history.unshift({
      date_of_message: `${retrieveDate("MM/DD/YYYY")}`,
      request_message: `The Request Was Approved with the Following Edits: ${req.body.edit_notes}`,
    });

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

    let facultyInfo = await Faculty.findById(faculty);

    if (facultyInfo === null) {
      return res.status(400).send({
        message:
          "This faculty does not exist/their information could not be found. Please verify with the faculty",
      });
    }

    await sgMail.send({
      from: "UDM Reimbursement Team<oladipea@udmercy.edu>",
      to: faculty.workEmail,
      subject: `Reimbursement Request Approved With Edits - ${ticket.reimbursementName}`,
      html: `
      <div style="border: solid 1px #efefef; padding: 20px 0px;">
      <div style="background: white;padding: 5% 10%; box-sizing: border-box;">
      <img src="https://ik.imagekit.io/x3m2gjklk/site-logo.png" alt="UDM Reimbursement Logo" style="width: 100px"/>
      <h3 style="font-weight: 500; margin: 20px 0; margin-top: 35px">Congratulations! Your reimbursement request - <b>${ticket.reimbursementName}</b> - was approved with the following edits:</h3>
      <h3 style="font-weight: 500; margin: 20px 0; margin-top: 35px"><b>${req.body.edit_notes}</b></h3>
      <h5 style="font-weight: 500; margin: 20px 0; margin-top: 35px">Note: This email was sent on the behalf of: ${facultyInfo.firstName} ${facultyInfo.lastName}
            </h5>
      </div>
      </div>
      `,
    });

    logger.info(`${ticket._id} was approved with edits`, {
      api: "/api/approve-reimburseemnt",
    });

    return res.status(200).send({
      message: "Reimbursement claim was approved w/ edits sucessfully",
    });
  }
);

router.post("/save-request-with-edits", verifyAdminToken, async (req, res) => {
  const ticket = req.body.reimbursement_data;
  const faculty_id = req.body.faculty_id;

  ticket.reimbursementStatus = "Submitted";

  ticket.request_history.unshift({
    date_of_message: `${retrieveDate("MM/DD/YYYY")}`,
    request_message: `The Request Was Updated By the Admin with the Following Edits: ${req.body.edit_notes}`,
  });

  let resp = await ReimbursementTicket.findByIdAndUpdate(ticket._id, ticket);

  if (resp === null) {
    logger.error(`Reimbursement Ticket ID could not be found`, {
      api: "/admin/deny-reimbursement",
    });

    return res.status(400).send({
      message: "There was an error denying this reimbursement request.",
    });
  }

  logger.info(`${ticket._id} was saved with edits`, {
    api: "/api/approve-reimburseemnt",
  });

  return res.status(200).send({
    message: "Reimbursement claim was saved with the edits sucessfully",
  });
});

router.post("/update_department_code", verifyAdminToken, async (req, res) => {
  try {
    console.log(req.body);
    const registry = await DepartmentChairRegistry.findOneAndUpdate(
      {
        department_code: req.body.department_code,
      },
      { chair_email: req.body.chair_email }
    );

    console.log(registry);
    res.status(200).send({ message: "Department code updated successfully" });
  } catch (err) {
    console.log(err);
  }
});

router.get("/retrieve-all-faculty", verifyAdminToken, async (req, res) => {
  try {
    const faculties = await Faculty.find({}).select(
      "_id firstName lastName department workEmail role tag"
    );

    res.status(200).send(faculties);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

router.get("/retrieve-faculty-by-tag", verifyAdminToken, async (req, res) => {
  try {
    console.log(req.body.tag);
    const faculties = await Faculty.find({ tag: req.query.tag }).select(
      "_id firstName lastName workEmail tag"
    );

    console.log("FACULTIES FROM TAG", faculties);
    res.status(200).send(faculties);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

router.get("/retrieve-faculty-tags", verifyAdminToken, async (req, res) => {
  try {
    const tags = await FacultyTagsList.find({});

    res.status(200).send(tags);
  } catch (err) {
    console.log("Retrieving Faculty Tags Error: ", err);
    res.send(err);
  }
});

router.post("/save-role-and-tag", verifyAdminToken, async (req, res) => {
  try {
    // Update Faculty role and tag
    const updatedFaculty = await Faculty.findOneAndUpdate(
      { _id: req.body.id },
      { role: req.body.role, tag: req.body.tag },
      { new: true } // Ensures that the updated document is returned
    );

    if (!updatedFaculty) {
      return res.status(404).json({ message: "Faculty not found." });
    }

    // Check if the tag exists in the FacultyTagsList collection
    const tagExists = await FacultyTagsList.findOne({ tag: req.body.tag });

    if (!tagExists) {
      // If the tag doesn't exist, create a new one
      const newTag = await FacultyTagsList.create({ tag: req.body.tag });

      // Respond with the created tag
      return res
        .status(201)
        .json({ message: "Role and Tag updated successfully.", tag: newTag });
    }

    return res
      .status(200)
      .send({ message: "Role and Tag updated successfuly" });
  } catch (err) {
    console.log(err);
    // Handle any errors
    return res
      .status(500)
      .json({ message: "An error occurred while updating the role and tag." });
  }
});

function generatePdf(docDefinition, callback) {
  try {
    let fonts = {
      Roboto: {
        normal: "./fonts/Arial-Light.ttf",
        bold: "./fonts/Arial-Bold.ttf",
        italics: "./fonts/Arial-Bold-Italics.ttf",
        bolditalics: "./fonts/Arial-Bold-Italics.ttf",
      },
    };

    let pdfmake = new Pdfmake(fonts);

    let pdfDoc = pdfmake.createPdfKitDocument(docDefinition, {});
    let chunks = [];
    let result;

    pdfDoc.on("data", (chunk) => {
      chunks.push(chunk);
    });

    pdfDoc.on("end", () => {
      result = Buffer.concat(chunks);
      callback("data:application/pdf;base64," + result.toString("base64"));
    });

    pdfDoc.end();
  } catch (err) {
    logger.error("There was an error in the generatePdf function", {
      api: "generatePdf",
    });
    throw err;
  }
}

router.post("/delete-faculty", verifyAdminToken, async (req, res) => {
  try {
    const deletedFaculty = await Faculty.findOneAndDelete({
      _id: req.body.id,
    });
    res.send(200);
    console.log("Deleted", deletedFaculty);
  } catch (err) {
    console.log(err);
  }
});

router.get(
  "/fetch_department_code_mappings",
  verifyAdminToken,
  async (req, res) => {
    try {
      const registry = await DepartmentChairRegistry.find();

      res.status(200).send({ registry: registry });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send({ message: "An unexpected error has occured" });
    }
  }
);

function fetchImageBase64(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let imageData = [];

      response.on("data", (chunk) => {
        imageData.push(chunk);
      });

      response.on("end", () => {
        const base64Image = Buffer.concat(imageData).toString("base64");
        resolve(`data:image/png;base64,${base64Image}`);
      });

      response.on("error", (err) => reject(err));
    });
  });
}

router.post("/forward-request", verifyAdminToken, async (req, res) => {
  try {
    let receipts = req.body.reimbursementData.reimbursementReceipts || [];

    const facultyInfo = await Faculty.findById(req.body.faculty._id);

    if (facultyInfo === null) {
      throw new Error("Faculty account could not be retrieved");
    }

    const reimbursementData = req.body.reimbursementData;

    if (reimbursementData?.request_review_log) {
      for (let i = 0; i < reimbursementData.request_review_log.length; i++) {
        const reviewer = reimbursementData.request_review_log[i];
        console.log(reviewer);
        if (reviewer.email === req.body.to) {
          logger.log(
            "error",
            "Admin tried to forward request to faculty that is already part of the review list",
            {
              api: "/api/forward-request",
            }
          );

          return res.status(409).send({
            message: "This reviewer has already been sent this request",
          });
        }
      }
    }
    // TODO: Check if faculty is not already in the list

    const base64Receipts = await Promise.all(
      receipts.map((receipt) => fetchImageBase64(receipt.url))
    );

    const content = createPdfDefinition(
      req.body.reimbursementData,
      facultyInfo,
      base64Receipts
    );

    const docDefinition = {
      content: content,
      pageMargins: [17, 15, 0, 0],
      defaultStyle: {
        fontSize: 10,
        bold: true,
      },
    };

    generatePdf(docDefinition, async function (base64String) {
      logger.info("PDF was generated successfully", {
        api: "generatePDF_function",
      });

      base64String = base64String.slice(28);

      await sgMail.send({
        from: "UDM Reimbursement Team<oladipea@udmercy.edu>",
        to: req.body.to,
        subject: `[IMPORTANT] Reimbursement Request Approval Needed`,
        html: `
      <div style="border: solid 1px #efefef; padding: 20px 0px;">
      <div style="background: white;padding: 5% 10%; box-sizing: border-box;">
      <img src="https://ik.imagekit.io/x3m2gjklk/site-logo.png" alt="UDM Reimbursement Logo" style="width: 100px"/>
      <h3 style="font-weight: 500; margin: 20px 0; margin-top: 35px; line-height: 33px; font-size: 16px">You are receiving this email either because you are a department chair in charge of 
      approving requests approved for faculty members, or a necessary party. The reimbursement request necessary for approval has been attached to this email. 
      Please look through the attached PDF and click the link below to either approve or deny this reimbursement request.
      </h3>
      <a href="http://localhost:5173/review-request/${req.body.reimbursementData._id}?email=${req.body.to}">Review Request Here</a>
      </div>
      </div>
      `,
        attachments: [
          {
            content: base64String,
            filename: `${req.body.faculty.firstName}_${
              req.body.faculty.lastName
            }_${req.body.reimbursementData.reimbursementName}_${retrieveDate(
              "MM_DD_YYYY"
            )}_Reimbursement_Claim.pdf`,
            encoding: "base64",
            type: "application/pdf",
          },
        ],
      });

      const reimbursement_being_updated = await ReimbursementTicket.findById(
        req.body.reimbursementData._id
      );

      // Update the reimbursement information to show that it has been forwarded for approval
      // and update the request history

      reimbursement_being_updated.request_review_log.push({
        email: req.body.to,
        review_status: "Pending",
        review_message: "",
      });

      reimbursement_being_updated.request_history.unshift({
        date_of_message: `${retrieveDate("MM/DD/YYYY")}`,
        request_message: `This request was forwarded to ${req.body.to} for approval`,
      });

      await reimbursement_being_updated.save();

      logger.info("Reimbursement request has been forwarded and updated", {
        api: "/admin/forward-request",
      });
    });

    return res
      .status(200)
      .send({ message: "Reimbursement request was forwarded successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "An error had occured" });
  }
});

router.get(
  "/retrieve-faculty-foapa-details",
  verifyAdminToken,
  async (req, res) => {
    try {
      const faculty = await Faculty.findById(req.query.id);

      if (faculty === null) {
        return res
          .status(500)
          .send({ message: "There was an error finding this faculty" });
      }

      return res.status(200).send({ foapa: faculty.foapaDetails });
    } catch (err) {
      console.log(err);
      return res.status(400).send({ message: "There was an error" });
    }
  }
);

router.post("/withdraw-review-request", verifyAdminToken, async (req, res) => {
  try {
    const reimbursement_request = await ReimbursementTicket.findById(
      req.body.reimbursement_id
    );

    if (reimbursement_request === null) {
      logger.error(`Reimbursement Ticket ID could not be found`, {
        api: "/admin/withdraw-review-reqest",
      });

      return res.status(400).send({
        message: "There was an error withdrawing this reviewer's request.",
      });
    }

    const result = await ReimbursementTicket.updateOne(
      { _id: req.body.reimbursement_id },
      {
        $pull: {
          request_review_log: { email: req.body.reviewer_email },
        },
      }
    );

    if (result.modifiedCount > 0) {
      logger.log(
        "error",
        `Successfully removed reviewer ${req.body.reviewer_email} from the review log - ${req.body.reimbursement_id}.`,
        {
          api: "/admin/withdraw-review-request",
        }
      );

      return res.status(200).send({ message: "Successfully removed reviewer" });
    } else {
      logger.log(
        "info",
        `Reviewer ${req.body.reviewer_email} could not be found - ${req.body.reimbursement_id}.`,
        {
          api: "/admin/withdraw-review-request",
        }
      );

      return res.status(404).send({ message: "Reviewer could not be found" });
    }
  } catch (err) {
    logger.error(err, {
      api: "/admin/withdraw-review-request",
    });
    return res.status(404).send({ message: "An unexpected error occured" });
  }
});
export default router;
