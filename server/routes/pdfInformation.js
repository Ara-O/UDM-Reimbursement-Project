import { Router } from "express";
const router = Router();
import https from "https";
import createPdfDefinition from "../pdfGenerator.js";
import Pdfmake from "pdfmake";
import multer from "multer";
import ImageKit from "imagekit";
import ReimbursementTicket from "../models/reimbursement.js";
import fs from "fs";
import { verifyToken } from "../middleware/auth.js";
import { request } from "http";
import { transporter } from "../app.js";
import logger from "../logger.js";
const upload = multer({ dest: "uploads/" });

let imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC,
  privateKey: process.env.IMAGE_KIT_PRIVATE,
  urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT,
});

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
    console.log(err);
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

router.get("/generatePdf", verifyToken, (req, res) => {
  // console.log(req.query);
  let receipts = req.query.reimbursementData.reimbursementReceipts || [];
  let promises = [];
  receipts.forEach((receipt) => {
    promises.push(
      new Promise((resolve, reject) => {
        https.get(receipt.url, (response) => {
          let imageData = [];

          response.on("data", (chunk) => {
            imageData.push(chunk);
          });

          response.on("end", () => {
            imageData = Buffer.concat(imageData);
            const base64Image = imageData.toString("base64");
            let fullImageUrl = "data:image/png;base64," + base64Image;
            resolve(fullImageUrl);
          });
        });
      })
    );
  });

  Promise.all(promises).then((response) => {
    let images = {};
    let allImageIds = [];
    response.forEach((imageData) => {
      let randomId = generateRandomId();
      images[randomId] = imageData;
      allImageIds.push(randomId);
    });
    const docDefinition = {
      content: createPdfDefinition(
        req.query.reimbursementData,
        req.query.userInfo,
        allImageIds
      ),
      defaultStyle: {
        fontSize: 10,
        bold: true,
      },
      images: images,

      pageMargins: [17, 15, 0, 0],
    };
    generatePdf(
      docDefinition,
      function (base64String) {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=product.pdf"
        );
        res.send(base64String);
      },
      function (error) {
        console.log(error);
        res.send("ERROR:" + error);
      }
    );
  });
});

router.post("/storeReceiptImages", upload.array("receipt"), (req, res) => {
  console.log(req.files);

  const buffers = req.files.map((file) => {
    return fs.readFileSync(file.path);
  });

  const promises = [];
  buffers.forEach((buffer) => {
    promises.push(
      imagekit.upload({
        file: buffer, // It accepts remote URL, base_64 string or file buffer
        fileName: "receipt", // required
        isPrivateFile: false,
      })
    );
  });

  Promise.all(promises)
    .then((imagesData) => {
      // console.log(imagesData);
      let imageLinks = imagesData.map((image) => {
        return { url: image.url, id: image.fileId };
      });
      // console.log("Image url", imageLinks);
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
    console.log(req.body);
    let receipts = req.body.reimbursementData.reimbursementReceipts || [];
    let promises = [];
    receipts.forEach((receipt) => {
      promises.push(
        new Promise((resolve, reject) => {
          https.get(receipt.url, (response) => {
            let imageData = [];

            response.on("data", (chunk) => {
              imageData.push(chunk);
            });

            response.on("end", () => {
              imageData = Buffer.concat(imageData);
              const base64Image = imageData.toString("base64");
              let fullImageUrl = "data:image/png;base64," + base64Image;
              resolve(fullImageUrl);
            });
          });
        })
      );
    });

    Promise.all(promises).then((response) => {
      let images = {};
      let allImageIds = [];
      response.forEach((imageData) => {
        let randomId = generateRandomId();
        images[randomId] = imageData;
        allImageIds.push(randomId);
      });

      const docDefinition = {
        content: createPdfDefinition(
          req.body.reimbursementData,
          req.body.userInfo,
          allImageIds
        ),
        defaultStyle: {
          fontSize: 10,
          bold: true,
        },
        images: images,

        pageMargins: [17, 15, 0, 0],
      };

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const day = String(currentDate.getDate()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`;

      generatePdf(
        docDefinition,
        function (base64String) {
          console.log("pdf done");
          console.log(base64String.slice(0, 28));
          base64String = base64String.slice(28);
          transporter
            .sendMail({
              from: '"UDM Reimbursement Team" <udm-reimbursement-team@em2297.araoladipo.dev>',
              to: req.body.recipient,
              subject: `${req.body.userInfo.firstName} ${req.body.userInfo.lastName} - ${req.body.subject}`,
              html: `
      <div style="border: solid 1px #efefef; padding: 20px 0px;">
      <div style="background: white;padding: 5% 10%; box-sizing: border-box;">
      <img src="https://ik.imagekit.io/x3m2gjklk/site-logo.png" alt="UDM Reimbursement Logo" style="width: 100px"/>
      <h3 style="font-weight: 500; margin: 20px 0; margin-top: 35px">${req.body.message}</h3>
      </div>
      </div>
      `,
              attachments: [
                {
                  filename: `${req.body.userInfo.firstName}_${req.body.userInfo.lastName}_Reimbursement_Claim_${formattedDate}.pdf`,
                  content: base64String,
                  encoding: "base64",
                  contentType: "application/pdf",
                },
              ],
            })
            .then(() => {
              res.status(200).send({ message: "Email successfully sent" });
              console.log("email should e sent");
            })
            .catch((err) => {
              console.log(err);
            });
        },
        function (error) {
          console.log(error);
          res.send("ERROR:" + error);
        }
      );
    });
  } catch (err) {
    logger.error(err, {
      api: "/send-reimbursement-email",
    });
  }
});
export default router;
