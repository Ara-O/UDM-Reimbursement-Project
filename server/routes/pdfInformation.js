import { Router } from "express";
const router = Router();
import https from "https";

import connection from "../db.js";
import createPdfDefinition from "../pdfGenerator.js";
import Pdfmake from "pdfmake";
import multer from "multer";
import ImageKit from "imagekit";
import fs from "fs";
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

router.get("/generatePdf", (req, res) => {
  let allActivities = req.query.reimbursementData.allActivities;
  console.log(allActivities);
  let promises = [];
  allActivities.forEach((activity) => {
    let receipts = [...activity.activityReceipt.split("%%%%%")];
    receipts.pop();
    receipts.forEach((receipt) => {
      console.log(receipt);
      promises.push(
        new Promise((resolve, reject) => {
          https.get(receipt, (response) => {
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

  // https.get(
  //   "https://caganer.com/6845-large_default/homer-simpson.jpg",
  //   (response) => {
  //     let imageData = [];

  //     response.on("data", (chunk) => {
  //       imageData.push(chunk);
  //     });

  //     response.on("end", () => {
  //       imageData = Buffer.concat(imageData);
  //       const base64Image = imageData.toString("base64");
  //       console.log(base64Image); // log the Base64 encoded image data

  //       const docDefinition = {
  //         content: createPdfDefinition(
  //           req.query.reimbursementData,
  //           req.query.userInfo
  //         ),
  //         defaultStyle: {
  //           fontSize: 10,
  //           bold: true,
  //         },
  //         images: {
  //           test: "data:image/png;base64," + base64Image,
  //         },

  //         pageMargins: [20, 30, 0, 0],
  //       };
  //       generatePdf(
  //         docDefinition,
  //         function (base64String) {
  //           res.setHeader("Content-Type", "application/pdf");
  //           res.setHeader(
  //             "Content-Disposition",
  //             "attachment; filename=product.pdf"
  //           );
  //           res.send(base64String);
  //         },
  //         function (error) {
  //           res.send("ERROR:" + error);
  //         }
  //       );
  //     });
  //   }
  // );
});

router.post("/storeActivityImages", upload.array("receipts"), (req, res) => {
  console.log(req.files);

  const buffers = req.files.map((file) => {
    return fs.readFileSync(file.path);
  });

  console.log(buffers);
  const promises = [];
  buffers.forEach((buffer) => {
    promises.push(
      imagekit.upload({
        file: buffer, // It accepts remote URL, base_64 string or file buffer
        fileName: "plswork.jpg", // required
        tags: ["tag1", "tag2"], // optional
        isPrivateFile: false,
      })
    );
  });

  Promise.all(promises)
    .then((imagesData) => {
      let imageUrl = "";
      imagesData.forEach((image) => {
        imageUrl += image.url + "%%%%%";
      });
      console.log("Image url", imageUrl);
      res.status(200).send(imageUrl);
    })
    .catch((err) => {
      console.log(err);
    });
});
export default router;
