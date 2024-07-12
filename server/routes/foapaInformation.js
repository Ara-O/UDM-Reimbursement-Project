import { Router } from "express";
const router = Router();
import Faculty from "../models/faculty.js";
import { verifyToken } from "../middleware/auth.js";
import { z } from "zod";
import logger from "../logger.js";

function formatUserFoapa(foapa) {
  return `${foapa.fund}-${foapa.organization || "XXXX"}-${foapa.account}-${
    foapa.program || "XXXX"
  }-${foapa.activity || "XXXX"}`;
}

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

    logger.info(`${req.user.userId} is adding a FOAPA`, {
      api: "/add-foapa-details",
    });

    if (faculty === null) {
      throw new Error("Faculty not found");
    }

    faculty.foapaDetails.push(...req.body.foapaDetails);

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

    //Finds the faculty FOAPA that matches the foapa the user wants to edit
    let foapa_to_edit_index = faculty.foapaDetails.findIndex(
      (foapa) => foapa._id.toHexString() === req.body.id
    );

    if (foapa_to_edit_index === -1) {
      throw new Error("FOAPA doesn't found");
    }

    //Makes sure the newly edited foapa has the same _id as its previous value
    req.body.foapaDetail._id = faculty.foapaDetails[foapa_to_edit_index]._id;

    faculty.foapaDetails[foapa_to_edit_index] = req.body.foapaDetail;

    // faculty.foapaDetails.find;
    await faculty.save();

    res.status(200).send({ message: "FOAPA details updated successfully" });
  } catch (err) {
    logger.error("There was an error updating the user's FOAPA details", {
      api: "/api/edit-foapa-detail",
    });
    logger.error(err, {
      api: "/api/edit-foapa-detail",
    });
    res.status(500).send({
      message:
        "An unexpected error occured when saving your FOAPA details. Please try again later.",
    });
  }
});

router.get("/retrieve-foapa-detail", verifyToken, async (req, res) => {
  try {
    let facultyId = req.user.userId;

    let faculty = await Faculty.findById(facultyId).populate(
      "reimbursementTickets"
    );

    let index = faculty.foapaDetails.findIndex(
      (foapa) => foapa._id.toHexString() === req.query.foapa_id
    );

    if (index === -1)
      throw new Error("There was an error finding this FOAPA's information");

    let dataToSend = {
      foapa_information: faculty.foapaDetails[index],
      claims_used: [],
    };

    //Find FOAPA history
    //Looping through all the faculty's reimbursement tickets
    for (let i = 0; i < faculty.reimbursementTickets.length; i++) {
      //Get the foapa details from the ticket
      const foapasUsedInThisClaim =
        faculty.reimbursementTickets[i].foapaDetails;

      //Loop through all the foapas used in the claim
      for (let j = 0; j < foapasUsedInThisClaim.length; j++) {
        //The foapa matches the foapa we want to check
        console.log(
          foapasUsedInThisClaim[j].foapa_id.toHexString(),
          "-",
          req.query.foapa_id
        );
        if (
          foapasUsedInThisClaim[j].foapa_id.toHexString() === req.query.foapa_id
        ) {
          dataToSend.claims_used.push(faculty.reimbursementTickets[i]);
        }
      }
    }

    return res.status(200).send(dataToSend);
  } catch (err) {
    logger.error(err, {
      api: "/retrieve-foapa-detail",
    });
    return res.status(500).send({
      message:
        err?.message ||
        "An unexpected error occured when retrieving this FOAPA detail",
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
    const faculty = await Faculty.findById(req.user.userId);

    if (faculty === null) throw new Error("Faculty not found");

    faculty.foapaDetails.pull(foapaId);
    faculty.save();
    res.status(200).send({ message: "Foapa deleted successfully" });
  } catch (err) {
    logger.error(err, {
      api: "/api/deleteFoapaDetail",
    });

    return res.status(400).send({
      message:
        err?.message ||
        "An unexpected error occured when deleting your FOAPA detail",
    });
  }
});

router.get("/check-foapa-usage", verifyToken, async (req, res) => {
  try {
    const foapaId = req.query.foapa_id;

    logger.info("Checking Foapa ID - " + foapaId, {
      api: "/api/check-foapa-usage",
    });

    const faculty = await Faculty.findById(req.user.userId).populate(
      "reimbursementTickets"
    );

    let index = faculty.foapaDetails.findIndex(
      (foapa) => foapa._id.toHexString() === foapaId
    );

    if (index === -1)
      throw new Error("There was an error finding this FOAPA's information");

    let foapaToCheck = faculty.foapaDetails[index];

    let reimbursementClashes = [];

    //Looping through all the faculty's reimbursement tickets
    for (let i = 0; i < faculty.reimbursementTickets.length; i++) {
      //Check to make sure the ticket is still in progress
      if (
        faculty.reimbursementTickets[i].reimbursementStatus !== "In Progress"
      ) {
        continue;
      }

      //Get the foapa details from the ticket
      const foapasUsedInThisClaim =
        faculty.reimbursementTickets[i].foapaDetails;

      //Loop through all the foapas used in the claim
      for (let j = 0; j < foapasUsedInThisClaim.length; j++) {
        //The foapa matches the foapa we want to check

        console.log(
          foapasUsedInThisClaim[j].foapa_id,
          "--",
          foapaToCheck._id.toHexString()
        );
        if (
          foapasUsedInThisClaim[j].foapa_id.toHexString() ===
          foapaToCheck._id.toHexString()
        ) {
          // If the foapa we are checking matches with the foapa number used in this reimbursement
          //and isnt already added
          reimbursementClashes.push(faculty.reimbursementTickets[i]);
        }
      }
    }

    let clashes = reimbursementClashes.map((claim) => claim.reimbursementName);

    console.log("clashes", clashes);

    //Removing duplicates
    clashes = [...new Set(clashes)];

    return res.status(200).send(clashes);
  } catch (err) {
    logger.error(err, {
      api: "/api/check-foapa-usage",
    });

    return res
      .status(400)
      .send({ message: err.message || "An unexpected error occured" });
  }
});

router.get("/retrieveFoapaInformation", verifyToken, async (req, res) => {});

router.post("/mark-claim-as-submitted", verifyToken, async (req, res) => {
  try {
    console.log("THIS IS MARKED AS SUBMITTED");
      let faculty = await Faculty.findById(req.user.userId);
      let reimbursementFoapa = req.body.reimbursementData.foapaDetails;
      let facultyFoapa = faculty.foapaDetails;
      
      reimbursementFoapa.forEach((rfoapa) => {
        facultyFoapa.forEach((ffoapa) =>{
          if(rfoapa.foapa_id == ffoapa._id.toHexString())
            ffoapa.availableAmount -= rfoapa.cost;
        });
      });
      
      faculty.save();
    } catch (err) {
    console.error(err);
    res.status(400).send({ message: err.message });
  }
});

// router.post("/mark-claim-as-accepted", verifyToken, async(req, res)=>{

// });

export default router;
