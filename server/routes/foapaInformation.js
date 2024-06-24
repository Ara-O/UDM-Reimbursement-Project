import { Router } from "express";
const router = Router();
import Foapa from "../models/foapa.js";
import Faculty from "../models/faculty.js";
import { verifyToken } from "../middleware/auth.js";
import { z } from "zod";
import logger from "../logger.js";

router.post("/update-foapa-details", verifyToken, async (req, res) => {
  try {
    await Faculty.findByIdAndUpdate(req.user.userId, {
      foapaDetails: req.body.foapaDetails,
    });

    res.status(200).send({ message: "FOAPA details updated successfully" });
  } catch (err) {
    logger.error("There was an error updating the user's FOAPA details", {
      api: "/api/update-foapa-details",
    });
    logger.error(err, {
      api: "/api/update-foapa-details",
    });
    res.status(500).send({
      message:
        "An unexpected error occured when saving your FOAPA details. Please try again later.",
    });
  }
});

router.post("/add-foapa-details", verifyToken, async (req, res) => {
  try {
    let faculty = await Faculty.findById(req.user.userId);

    if (faculty === null) {
      throw new Error("Faculty not found");
    }

    faculty.foapaDetails.push(req.body.foapaDetails);

    await faculty.save();

    res.status(200).send({ message: "FOAPA details added successfully" });
  } catch (err) {
    logger.error("There was an error updating the user's FOAPA details", {
      api: "/api/add-foapa-details",
    });
    logger.error(err, {
      api: "/api/add-foapa-details",
    });
    res.status(500).send({
      message:
        "An unexpected error occured when saving your FOAPA details. Please try again later.",
    });
  }
});

router.post("/edit-foapa-detail", verifyToken, async (req, res) => {
  try {
    let faculty = await Faculty.findById(req.user.userId);

    if (faculty === null) {
      throw new Error("Faculty not found");
    }

    if (req.body.id === "") {
      throw new Error("Invalid FOAPA ID");
    }

    let foapa_to_edit_index = faculty.foapaDetails.findIndex(
      (foapa) => foapa._id.toHexString() === req.body.id
    );

    if (foapa_to_edit_index === -1) {
      throw new Error("FOAPA doesn't found");
    }

    faculty.foapaDetails[foapa_to_edit_index] = req.body.foapaDetail;

    // faculty.foapaDetails.find;
    await faculty.save();

    res.status(200).send({ message: "FOAPA details updated successfully" });
  } catch (err) {
    logger.error("There was an error updating the user's FOAPA details", {
      api: "/api/add-foapa-details",
    });
    logger.error(err, {
      api: "/api/add-foapa-details",
    });
    res.status(500).send({
      message:
        "An unexpected error occured when saving your FOAPA details. Please try again later.",
    });
  }
});

router.get("/retrieve-foapa-details", verifyToken, async (req, res) => {
  try {
    let foapaDetails = await Faculty.findById(req.user.userId).select(
      "foapaDetails "
    );

    if (foapaDetails === null) {
      return res.status(404).send({
        message:
          "There was an error fetching your FOAPA details. Please try again later.",
      });
    }

    res.status(200).send(foapaDetails.foapaDetails);
  } catch (err) {
    logger.error("There was an error fetching your FOAPA details", {
      api: "/api/retrieve-foapa-details",
    });

    logger.error(error, {
      api: "/api/retrieve-foapa-details",
    });

    return res.status(400).send({
      message:
        "There was an error fetching your FOAPA details. Please try again later.",
    });
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
