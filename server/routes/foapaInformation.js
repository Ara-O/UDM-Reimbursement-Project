import { Router } from "express";
const router = Router();
import Faculty from "../models/faculty.js";
import { verifyToken } from "../middleware/auth.js";
import formatFoapaDetails from "../utils/formatFoapaDetails.js";

router.post("/updateFoapaDetails", verifyToken, async (req, res) => {
  console.log(req.body.foapaData, req.user);

  let foapaDetails = formatFoapaDetails(req.body.foapaData);

  try {
    await Faculty.updateOne(
      { employmentNumber: req.user.employmentNumber },
      { foapaDetails }
    );
    res.status(200).send({ message: "FOAPA details updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err.message });
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
    res.status(400).send({ message: err.message });
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
    res.status(400).send({ message: err.message });
  }
});

export default router;
