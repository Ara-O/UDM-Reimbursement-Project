import { Router } from "express";
const router = Router();
import Faculty from "../models/faculty.js";
import { verifyToken } from "../middleware/auth.js";

router.post("/updateFoapaDetails", verifyToken, async (req, res) => {
  console.log(req.body.foapaData, req.user);

  let foapaDetails = [];
  req.body.foapaData.forEach((foapa) => {
    let concatFoapa =
      foapa.fNumber +
      "-" +
      foapa.oNumber +
      "-" +
      foapa.aNumber +
      "-" +
      foapa.pNumber +
      "-" +
      foapa.a2Number;

    foapaDetails.push({
      foapaName: foapa.foapaName,
      foapaNumber: concatFoapa,
    });
  });

  try {
    await Faculty.updateOne(
      { employmentNumber: req.user.employmentNumber },
      { foapaDetails }
    );
    res.status(200).send({ message: "FOAPA details updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
});

router.get("/retrieveFoapaDetails", verifyToken, async (req, res) => {
  try {
    let foapaDetails = await Faculty.findOne({
      employmentNumber: req.user.employmentNumber,
    }).select("foapaDetails");
    res.status(200).send(foapaDetails.foapaDetails);
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: error.message });
  }
});

router.post("/deleteFoapaDetail", verifyToken, async (req, res) => {
  console.log(req.body);
  const foapaNumber = req.body.foapaNumber;

  try {
    let userInfo = await Faculty.findOne({
      employmentNumber: req.user.employmentNumber,
    });
    await userInfo.foapaDetails.pull({ foapaNumber });
    await userInfo.save();
    res.status(200).send({ message: "Foapa deleted successfully" });
    console.log(userInfo);
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: error.message });
  }
});

export default router;
