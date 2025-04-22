import { request, Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { retrieveDate } from "../utils/retrieveDate.js";
import Faculty from "../models/faculty.js";
import logger from "../logger.js";
import z, { ZodError } from "zod";
import createPdfDefinition from "../pdfGenerator.js";
import ReimbursementTicket from "../models/reimbursement.js";
import Pdfmake from "pdfmake";
import AdditionalReimbursementMessages from "../models/reimbursementMessages.js";
import DepartmentChairRegistry from "../models/departmentChairRegistry.js";
import sgMail from "@sendgrid/mail";
import https from "https";

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
          fund: z.string(),
          organization: z.string(),
          account: z.string(),
          program: z.string(),
          activity: z.string(),
          foapaName: z.string(),
          isUDMPU: z.boolean(),
          cost: z.string().optional(),
          description: z.string(),
          createdAt: z.any(),
          updatedAt: z.any(),
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

// Add a reimbursement request: POST /api/add-reimbursement
router.post("/add-reimbursement", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userInfo = await Faculty.findById(userId);

    const requestData = reimbursementRequestSchema.parse(req.body);
    const reimbursement = requestData.reimbursementTicket;

    // console.log(requestData.reimbursementTicket.request_history);

    reimbursement.request_history = [];

    reimbursement.request_history.push({
      date_of_message: `${retrieveDate("MM/DD/YYYY")}`,
      request_message: "The Request Was Saved",
    });

    // console.log(requestData.reimbursementTicket.request_history);

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

    let sum = 0;

    reimbursementTicket.activities.forEach((activity) => {
      sum += Number(activity.cost);
    });

    reimbursementTicket.totalCost = sum;
    reimbursementTicket.reimbursementDate = new Date().toISOString();

    console.log(reimbursementTicket);
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

// Delete reimbursement: POST /api/archive-reimbursement
router.post("/archive-reimbursement", verifyToken, async (req, res) => {
  try {
    const requestSchema = z.string();

    const userId = req.user.userId;

    // Parse the reimbursement id
    const reimbursementId = requestSchema.parse(req.body.id);

    let faculty = await Faculty.findById(userId);

    // Remove the reimbursement ID from the faculty's reimbursement list
    faculty.reimbursementTickets.pull(reimbursementId);

    faculty.archivedReimbursementTickets.push(reimbursementId);

    // Delete the reimbursement from the reimbursement table
    // await ReimbursementTicket.findByIdAndDelete(reimbursementId);

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
    const today = new Date();
    const formattedDate = `${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(today.getDate()).padStart(2, "0")}/${today.getFullYear()}`;

    request.request_history = [
      {
        date_of_message: formattedDate,
        request_message:
          "This request was created as a duplicate of another request",
      },
    ];
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
    newRequest.request_review_log = [];

    const duplicatedRequest = new ReimbursementTicket(newRequest);

    const duplicatedRequestRes = await duplicatedRequest.save();

    faculty.reimbursementTickets.push(duplicatedRequestRes._id);

    let fac = await faculty.save();

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

//Edit a reimbursement claim: POST /api/submit-reimbursement
router.post("/submit-request", verifyToken, async (req, res) => {
  try {
    // Validate the user's reimbursement data
    const requestData = reimbursementRequestSchema.parse(req.body);
    const facultyId = req.user.userId;

    const faculty = await Faculty.findById(facultyId);
    const reimbursementTicket = requestData.reimbursementTicket;

    reimbursementTicket.reimbursementStatus = "Submitted";
    reimbursementTicket.has_been_forwarded_for_approval = false;
    reimbursementTicket.approval_status = "";

    const today = new Date();
    const formattedDate = `${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(today.getDate()).padStart(2, "0")}/${today.getFullYear()}`;

    reimbursementTicket.request_history.unshift({
      date_of_message: formattedDate,
      request_message: `The Request Was Submitted`,
    });

    let resp = await ReimbursementTicket.findByIdAndUpdate(
      reimbursementTicket._id,
      reimbursementTicket
    );

    // If the reimbursement request's id could not be found
    if (resp === null) {
      return res.status(400).send({
        message: "Please save this request before marking it as submited.",
      });
    }

    // Email Jim

    let receipts = reimbursementTicket.reimbursementReceipts || [];

    const base64Receipts = await Promise.all(
      receipts.map((receipt) => fetchImageBase64(receipt.url))
    );

    const content = createPdfDefinition(
      reimbursementTicket,
      faculty,
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

    generatePdf(docDefinition, function (base64String) {
      logger.info("PDF was generated successfully", {
        api: "/api/submit-request",
      });

      base64String = base64String.slice(28);

      sgMail
        .send({
          from: "UDM Reimbursement Team<oladipea@udmercy.edu>",
          to:
            faculty.workEmail !== String("adairja@udmercy.edu").toLowerCase()
              ? ["adairja@udmercy.edu", faculty.workEmail]
              : ["adairja@udmercy.edu"],
          subject: `${faculty.firstName} ${faculty.lastName} - ${reimbursementTicket.reimbursementName}`,
          html: `
          <div style="border: solid 1px #efefef; padding: 20px 0px;">
          <div style="background: white;padding: 5% 10%; box-sizing: border-box;">
          <img src="https://ik.imagekit.io/x3m2gjklk/site-logo.png" alt="UDM Reimbursement Logo" style="width: 100px"/>
          <h3 style="font-weight: 500; margin: 20px 0; margin-top: 35px">
            ${faculty.firstName} has submitted a reimbursement request.
          </h3>
          <h5 style="font-weight: 500; margin: 20px 0; margin-top: 35px">Note: This email was sent on the behalf of: ${faculty.workEmail}</h5>
          </div>
          </div>
          `,
          attachments: [
            {
              content: base64String,
              filename: `${faculty.firstName}_${faculty.lastName}_Reimbursement_Claim_${formattedDate}.pdf`,
              encoding: "base64",
              type: "application/pdf",
            },
          ],
        })
        .then(() => {
          logger.info("Email successfully sent", {
            api: "/api/submit-request",
          });

          logger.info(
            `User ${req.user.userId} has successfully submitted reimbursement ${reimbursementTicket._id}`,
            {
              api: "/api/update-reimbursement",
            }
          );

          return res.status(200).send({ message: "Request successfully sent" });
        })
        .catch((err) => {
          logger.error("There was an error in sending the email", {
            api: "/api/submit-request",
          });

          return res.status(500).send({
            message:
              "There was an unexpected error sending this email. Please try again later",
          });
        });
    });

    // return res.status(400).send({ message: "An unexpected error occured!" });
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

router.post("/check-reimbursement-approval-status", async (req, res) => {
  try {
    logger.info(`Reimbursement status is being checked for: ${req.body.id}`, {
      api: "/api/check-reimbursement-approval-status",
    });

    const reimbursementId = req.body.id;
    const facultyEmail = req.body.faculty_email;

    let reimbursement = await ReimbursementTicket.findById(reimbursementId);

    if (!reimbursement?.request_review_log) {
      return res.status(404).send({
        message:
          "This reimbursement request no longer needs your approval. You can close out of this page",
      });
    }

    const faculty_in_review_log = reimbursement.request_review_log.find(
      (reviewer) => reviewer.email === facultyEmail
    );

    if (faculty_in_review_log === undefined) {
      return res.status(404).send({
        message:
          "This reimbursement request no longer needs your approval. You can close out of this page",
      });
    }

    if (faculty_in_review_log.review_status !== "Pending") {
      // return res.status(404).send({
      //   message: "You have already reviewed this request.",
      // });
    }

    logger.info(
      `${facultyEmail} is viewing the request for approval and is in the list of approvers`,
      {
        api: "/api/check-reimbursement-approval-status",
      }
    );

    return res.status(200).send({ needs_approval: true });
  } catch (err) {
    logger.error(err, {
      api: "/api/check-reimbursement-approval-status",
    });
    return res.status(500).send({
      message: "An unexpected error occured.",
    });
  }
});

router.post("/review-reimbursement-request", async (req, res) => {
  try {
    logger.info(
      `Reimbursement ${req.body.reimbursement_id} is being reviewed by ${req.body.name}`,
      {
        api: "/api/check-reimbursement-approval-status",
      }
    );

    let reimbursement = await ReimbursementTicket.findById(
      req.body.reimbursement_id
    );

    let idx = reimbursement.request_review_log.findIndex(
      (reviewer) => reviewer.email === req.body.email
    );

    if (idx === -1) {
      return res.status(404).send({
        message: "You are no longer needed to approve this request. Thank you!",
      });
    }

    reimbursement.request_review_log[idx].review_message = req.body.message;
    reimbursement.request_review_log[idx].review_status = req.body.status;
    reimbursement.request_review_log[idx].signature =
      req.body.name || "No signature given";

    reimbursement.request_history.unshift({
      date_of_message: `${retrieveDate("MM/DD/YYYY")}`,
      request_message: `The Request Was ${req.body.status} by ${req.body.name}`,
    });

    await reimbursement.save();
    return res.status(200).send({ message: "This request has been approved" });
  } catch (err) {
    logger.error(err, {
      api: "/api/check-reimbursement-approval-status",
    });
    return res.status(500).send({
      message: "An unexpected error occured.",
    });
  }
});

export default router;
