import { Router } from "express";
const router = Router();
import Foapa from "../models/foapa.js";
import Faculty from "../models/faculty.js";
import { verifyToken } from "../middleware/auth.js";

router.post("/updateFoapaDetails", verifyToken, async (req, res) => {
  try {
    await Faculty.findByIdAndUpdate(req.user.userId, {
      foapaDetails: req.body.foapaDetails,
    });
    res.status(200).send({ message: "FOAPA details updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err.message });
  }
});

router.get("/retrieveFoapaDetails", verifyToken, async (req, res) => {
  try {
    let foapaDetails = await Faculty.findById(req.user.userId).select(
      "foapaDetails "
    );

    res.status(200).send(foapaDetails.foapaDetails);
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: err.message });
  }
});

router.post("/deleteFoapaDetail", verifyToken, async (req, res) => {
  const foapaId = req.body.foapa._id;

  try {
    await Foapa.findByIdAndRemove(foapaId);
    const faculty = await Faculty.findById(req.user.userId);
    faculty.foapaDetails.pull(foapaId);
    faculty.save();
    res.status(200).send({ message: "Foapa deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: err.message });
  }
});

export default router;
