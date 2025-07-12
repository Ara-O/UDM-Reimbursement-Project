import { Router } from "express";
const router = Router();
import https from "https";
import createPdfDefinition from "../pdfGenerator.js";
import Pdfmake from "pdfmake";
import multer from "multer";
import ImageKit from "imagekit";
import Tesseract from "tesseract.js";
import z, { ZodError } from "zod";
import ReimbursementTicket from "../models/reimbursement.js";
import fs from "fs";
import { verifyToken } from "../middleware/auth.js";
import logger from "../logger.js";
import { generateRandomStringId } from "../utils/generateRandomString.js";
const upload = multer({ dest: "uploads/" });
import Faculty from "../models/faculty.js";
import PdfPrinter from "pdfmake";
import { getSmptTransport } from "../utils/mailer.js";

let imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC,
  privateKey: process.env.IMAGE_KIT_PRIVATE,
  urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT,
});
let pageCount = 0;

function generateRandomId() {
  const chars = "1234567890";
  let result = "";
  for (let i = 0; i < 9; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

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

router.post(
  "/upload-pdf",
  verifyToken,
  upload.single("receipt"),
  async (req, res) => {
    try {
      if (req?.file === null) return;

      const file = req.file;

      const buffer = fs.readFileSync(file.path);

      const upload = await imagekit.upload({
        file: buffer,
        fileName: `receipt-${generateRandomId()}.pdf`,
        isPrivateFile: false,
      });

      // console.log("Image url", imageLinks);
      return res.status(200).send({ url: upload.url, id: upload.fileId });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send({ message: "An unexpected error has occured" });
    }
  }
);

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
    foapaDetails: z.any(),
  }),
});

// This function takes an image URL, uses the http library to fetch the
// image and turn it into its base64 representation, then returns it
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

router.post("/generate-pdf", verifyToken, async (req, res) => {
  try {
    // Parse the incoming reimbursement data to make sure its data is properly structured
    const request = reimbursementRequestSchema.parse(req.body);
    const reimbursementRequestData = request.reimbursementTicket;
    const receipts = reimbursementRequestData.reimbursementReceipts;

    // Get the faculty's information to populate the pdf
    // req.user.userId is gotten from the verifyToken middleware
    const facultyInfo = await Faculty.findById(req.user.userId);

    if (facultyInfo === null) {
      throw new Error("Faculty account could not be retrieved");
    }

    // Pass receipts through the fetchImageBase64 function to retrieve the base64 image
    // representation of all the receipts - Using promises as fetching the images is asynchronous
    const base64Receipts = await Promise.all(
      receipts.map((receipt) => fetchImageBase64(receipt.url))
    );

    //Calls the createPdfDefinition function imported from pdfGenerator.js
    const content = createPdfDefinition(
      reimbursementRequestData,
      facultyInfo,
      base64Receipts
    );

    // Define the definition for the PDF
    const docDefinition = {
      content: content,
      pageMargins: [17, 15, 0, 0],
      defaultStyle: {
        fontSize: 10,
        bold: true,
      },
    };

    // Generate the PDF based on the definition, and when it is done, return the pdf to the user
    generatePdf(docDefinition, function (base64String) {
      logger.info("PDF successfully created", {
        api: "/api/generate-pdf",
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=reimbursement_request.pdf"
      );
      res.status(200).send(base64String);
    });
  } catch (err) {
    logger.error("There was an error generating a PDF", {
      api: "/api/generate-pdf",
    });
    ``;

    logger.error(err, {
      api: "/api/generate-pdf",
    });

    if (err instanceof ZodError) {
      return res.status(403).send({
        message:
          "There was an error with this reimbursement. Please try again later.",
      });
    }

    return res.status(400).send({
      message:
        err?.message ||
        "An unexpected error occured when creating your PDF. Please try again later.",
    });
  }
});

// Stores receipt images in imagekit and returns the URL of the image
router.post("/store-receipt-images", upload.array("receipt"), (req, res) => {
  console.log(req.files);

  let type = "image";
  if (req.files[0].mimetype === "image/pdf") {
    type = "pdf";
  }

  const buffers = req.files.map((file) => {
    return fs.readFileSync(file.path);
  });

  const promises = [];

  if (type === "image") {
    buffers.forEach((buffer, i) => {
      promises.push(
        imagekit.upload({
          file: buffer, // It accepts remote URL, base_64 string or file buffer
          fileName: `${i + 1}receipt`, // required
          isPrivateFile: false,
        })
      );
    });
  } else if (type === "pdf") {
    buffers.forEach((buffer, i) => {
      promises.push(
        imagekit.upload({
          file: buffer, // It accepts remote URL, base_64 string or file buffer
          fileName: `pdf_receipt_${i + 1}`, // required
          isPrivateFile: false,
        })
      );
    });
  }

  let pdf_receipt_id = generateRandomStringId(5);

  Promise.all(promises)
    .then((imagesData) => {
      let imageLinks = imagesData.map((image, i) => {
        if (image.url !== null)
          if (type === "image") {
            return {
              url: image.url,
              name: generateRandomStringId(5),
              id: image.fileId,
              type: "image",
            };
          } else {
            return {
              url: image.url,
              id: image.fileId,
              type: "pdf",
              name: pdf_receipt_id,
              index: i + 1,
            };
          }
      });
      res.status(200).send(imageLinks);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/deleteReceiptImage", verifyToken, async (req, res) => {
  try {
    //If user is editing a ticket, delete the image directly from the database
    //and image kits database because if they refresh the page after they delete a receipt
    //in an edited reimbursement and dont save, itll delete from imagekit but not from
    //the database
    if (req.body.reimbursementId) {
      await ReimbursementTicket.findByIdAndUpdate(req.body.reimbursementId, {
        $pull: {
          reimbursementReceipts: {
            id: req.body.receiptId,
          },
        },
      });
    }

    imagekit.deleteFile(req.body.receiptId, function (error, result) {
      if (error) {
        throw error;
      } else {
        // console.log(result);
        res.status(200).send({ message: "Activity deleted successfully" });
      }
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.post("/send-reimbursement-email", verifyToken, async (req, res) => {
  try {
    const smtpTransporter = getSmptTransport();

    let receipts = req.body.reimbursementData.reimbursementReceipts || [];

    const facultyInfo = await Faculty.findById(req.user.userId);

    if (facultyInfo === null) {
      throw new Error("Faculty account could not be retrieved");
    }

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

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(currentDate.getDate()).padStart(2, "0");

    const formattedDate = `${month}-${day}-${year}`;

    generatePdf(docDefinition, function (base64String) {
      logger.info("PDF was generated successfully", {
        api: "generatePDF_function",
      });
      base64String = base64String.slice(28);

      smtpTransporter
        .sendMail({
          from: "UDM Reimbursement Team<noreply@udmreimbursements.com>",
          to:
            req.body.userInfo.workEmail !==
            String(req.body.recipient).toLowerCase()
              ? [req.body.recipient, req.body.userInfo.workEmail]
              : [req.body.recipient],
          subject: `${req.body.userInfo.firstName} ${req.body.userInfo.lastName} - ${req.body.subject}`,
          html: `
      <div style="border: solid 1px #efefef; padding: 20px 0px;">
      <div style="background: white;padding: 5% 10%; box-sizing: border-box;">
      <img src="https://ik.imagekit.io/x3m2gjklk/site-logo.png" alt="UDM Reimbursement Logo" style="width: 100px"/>
      <h3 style="font-weight: 500; margin: 20px 0; margin-top: 35px">${
        req.body.message || ""
      }</h3>
      <h5 style="font-weight: 500; margin: 20px 0; margin-top: 35px">Note: This email was sent on the behalf of: ${
        req.body.userInfo.workEmail
      }</h5>
      </div>
      </div>
      `,
          attachments: [
            {
              content: base64String,
              filename: `${req.body.userInfo.firstName}_${req.body.userInfo.lastName}_Reimbursement_Claim_${formattedDate}.pdf`,
              encoding: "base64",
              type: "application/pdf",
            },
          ],
        })
        .then(() => {
          logger.info("Email successfully sent", {
            api: "generatePDF_function",
          });
          return res.status(200).send({ message: "Email successfully sent" });
        })
        .catch((err) => {
          logger.error(err, {
            api: "generatePDF_function",
          });
          logger.error("There was an error in sending the email", {
            api: "generatePDF_function",
          });

          logger.info(err.response.body, {
            api: "generatePDF_function",
          });

          return res.status(500).send({
            message:
              "There was an unexpected error sending this email. Please try again later",
          });
        });
    });
  } catch (err) {
    console.log(err);
    logger.error(err, {
      api: "/send-reimbursement-email",
    });

    return res.status(500).send({ message: err });
  }
});

router.post("/send-contact-email", verifyToken, async (req, res) => {
  try {
    let facultyInfo = await Faculty.findById(req.user.userId);

    const smtpTransporter = getSmptTransport();

    await smtpTransporter.sendMail({
      from: "UDM Reimbursement Team<noreply@udmreimbursements.com>",
      to: [
        '"The Support Team" <theduckateers@gmail.com>',
        facultyInfo.workEmail,
      ],
      subject: `Contact Us from: ${facultyInfo.firstName} ${facultyInfo.lastName}`,
      html: `
  <div style="border: solid 1px #efefef; padding: 20px 0px;">
  <div style="background: white;padding: 5% 10%; box-sizing: border-box;">
  <img src="https://ik.imagekit.io/x3m2gjklk/site-logo.png" alt="UDM Reimbursement Logo" style="width: 100px"/>
  <h3 style="font-weight: 500; margin: 20px 0; margin-top: 35px">${
    req.body.message || ""
  }</h3>
  <h5 style="font-weight: 500; margin: 20px 0; margin-top: 35px">Note: This email was sent on the behalf of: ${
    facultyInfo.firstName
  } ${facultyInfo.lastName}
        </h5>
  </div>
  </div>
  `,
    });

    logger.info(`${facultyInfo.workEmail} sent a feedback/contact message`, {
      api: "/api/send-contact-email",
    });
    return res.status(200).send({ message: "Email send successfully" });
  } catch (err) {
    logger.error("An error occured when sending an email", {
      api: "/api/send-contact-email",
    });

    logger.error(err.response.body, {
      api: "/api/send-contact-email",
    });

    return res.status(500).send({
      message:
        "An error occured when sending your message. Please try again later",
    });
  }
});

// Extract Text from Receipt - GET /api/extract-text
router.get("/extract-text", verifyToken, (req, res) => {
  Tesseract.recognize(
    "https://ik.imagekit.io/kywjttb4q/1receipt_2fThUIhkzv?updatedAt=1727879197966",
    "eng",
    { logger: (m) => console.log(m) }
  ).then(({ data: { text } }) => {
    res.status(200).send(text.split(/\r?\n/));
  });
});
export default router;
