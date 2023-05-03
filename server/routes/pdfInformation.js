import { Router } from "express";
const router = Router();
import connection from "../db.js";
import createPdfDefinition from "../pdfGenerator.js";
import Pdfmake from "pdfmake";

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
  console.log(req.query);
  const docDefinition = {
    content: createPdfDefinition(
      req.query.reimbursementData,
      req.query.userInfo
    ),
    defaultStyle: {
      fontSize: 10,
      bold: true,
    },

    pageMargins: [20, 30, 0, 0],
  };
  generatePdf(
    docDefinition,
    function (base64String) {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=product.pdf");
      res.send(base64String);
    },
    function (error) {
      res.send("ERROR:" + error);
    }
  );
});

router.get("/storeActivityImages", (req, res) => {});
export default router;
