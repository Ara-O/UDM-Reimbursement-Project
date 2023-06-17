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

      pageMargins: [20, 30, 0, 0],
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
export default router;
