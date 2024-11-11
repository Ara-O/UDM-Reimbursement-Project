const router = Router();
import Faculty from "../models/faculty.js";
import logger from "../logger.js";
import AccountNumbers from "../models/accountNumbers.js";
import z, { ZodError } from "zod";
import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import FoapaRegistry from "../models/foapaRegistry.js";

// For retrieving a list of all the user's FOAPAs: GET /retrieve-foapa-details
router.get("/retrieve-foapa-details", verifyToken, async (req, res) => {
  try {
    //Store user ID variable from the verifyToken middleware into the userId variable
    const userId = req.user.userId;

    // Find the faculty's data but select only the foapaDetails array in the faculty's object
    let facultyData = await Faculty.findById(userId).select("foapaDetails ");

    // If no data for the faculty was found - no FOAPA means an empty array, but no data should indicate an error
    if (facultyData === null) {
      return res.status(404).send({
        message:
          "There was an error fetching your FOAPA details. Please try again later.",
      });
    }

    const foapaDetails = facultyData.foapaDetails;

    return res.status(200).send(foapaDetails);
  } catch (error) {
    logger.error(`There was an error fetching a user's FOAPA details`, {
      api: "/api/retrieve-foapa-details",
    });

    logger.error(error, {
      api: "/api/retrieve-foapa-details",
    });

    return res.status(500).send({
      message:
        "There was an error fetching your FOAPA details. Please try again later.",
    });
  }
});

// POST /add-foapa-details
router.post("/add-foapa-details", verifyToken, async (req, res) => {
  try {
    //Store user ID variable from the verifyToken middleware into the userId variable
    const userId = req.user.userId;

    let faculty = await Faculty.findById(userId);

    // Different approach to handling errors, directly go to the catch statement instead of
    // returning the HTTP code with the error status code here
    if (faculty === null) {
      throw new Error("Faculty not found");
    }

    // Parse FOAPA data the user wants to add
    const foapaSchema = z.object({
      foapaName: z.string().trim(),
      description: z.string().trim(),
      fund: z.string().length(6).trim(),
      organization: z.string().trim().optional(),
      // account: z.string().length(4).trim().optional(),
      account: z.string(),
      program: z.string().trim().optional(),
      activity: z.string().trim().optional(),
      isUDMPU: z.boolean().optional(),
    });

    const foapa = foapaSchema.parse(req.body.foapaDetails);

    // Push the new foapa to the faculty's data
    faculty.foapaDetails.push(foapa);

    await faculty.save();

    logger.info(`User ${userId} successfully added a new FOAPA`, {
      api: "/add-foapa-details",
    });

    return res
      .status(200)
      .send({ message: "FOAPA details added successfully" });
  } catch (err) {
    logger.error("There was an error updating the user's FOAPA details", {
      api: "/api/add-foapa-details",
    });

    logger.error(err, {
      api: "/api/add-foapa-details",
    });

    if (err instanceof ZodError) {
      return res.status(400).send({
        message:
          "There was an error with one of your inputs. Please revise and try again.",
      });
    }

    return res.status(500).send({
      message:
        "An unexpected error occured when adding this FOAPA. Please try again later.",
    });
  }
});

//POST /edit-foapa-detail
router.post("/edit-foapa-detail", verifyToken, async (req, res) => {
  try {
    //Store user ID variable from the verifyToken middleware into the userId variable
    const userId = req.user.userId;

    let faculty = await Faculty.findById(userId);

    if (faculty === null) {
      throw new Error("Faculty not found");
    }

    const requestSchema = z.object({
      id: z.string(),
      foapaDetail: z.object({
        foapaName: z.string().trim(),
        description: z.string().trim(),
        fund: z.string().length(6).trim(),
        organization: z.string().trim().optional(),
        // account: z.string().length(4).trim().optional(),
        account: z.string().optional(),
        program: z.string().length(4).trim().optional(),
        activity: z.string().trim().optional(),
        isUDMPU: z.boolean().optional(),
      }),
    });

    // Verify the input coming from the front end, if it is valid, store in the requestData variable
    const requestData = requestSchema.parse(req.body);

    //Finds the faculty FOAPA that matches the foapa the user wants to edit
    let foapa_to_edit_index = faculty.foapaDetails.findIndex(
      (foapa) => foapa._id.toHexString() === requestData.id
    );

    //If there is no foapa in the faculty's data that matches the foapa id the user wants to edit
    if (foapa_to_edit_index === -1) {
      throw new Error("FOAPA was not found");
    }

    //Makes sure the newly edited foapa has the same _id as its previous value
    requestData.foapaDetail._id = faculty.foapaDetails[foapa_to_edit_index]._id;

    //Makes sure the created date also matches
    requestData.foapaDetail.createdAt =
      faculty.foapaDetails[foapa_to_edit_index].createdAt;

    requestData.foapaDetail.updatedAt = new Date();

    // Updates the faculty's foapa data
    faculty.foapaDetails[foapa_to_edit_index] = requestData.foapaDetail;

    await faculty.save();

    logger.info(`User ${userId} successfully edited FOAPA ${requestData.id}`, {
      api: "/api/edit-foapa-detail",
    });

    res.status(200).send({ message: "FOAPA detail updated successfully" });
  } catch (err) {
    logger.error("There was an error editing the user's FOAPA details", {
      api: "/api/edit-foapa-detail",
    });

    logger.error(err, {
      api: "/api/edit-foapa-detail",
    });

    if (err instanceof ZodError) {
      return res.status(400).send({
        message:
          "There was an error with one of your inputs. Please revise your inputs and try again.",
      });
    }

    return res.status(500).send({
      message:
        "An unexpected error occured when saving your FOAPA details. Please try again later.",
    });
  }
});

router.post("/delete-foapa-detail", verifyToken, async (req, res) => {
  try {
    let userId = req.user.userId;
    const requestSchema = z.string();

    let foapaId = requestSchema.parse(req.body.foapa_id);

    let faculty = await Faculty.findById(userId);

    // Save all the faculty's FOAPAs that don't have the same id as the ID to be deleted
    faculty.foapaDetails = faculty.foapaDetails.filter(
      (foapa) => foapa._id.toHexString() !== foapaId
    );

    logger.log("info", `User ${userId} deleted FOAPA ${foapaId} succesfully`, {
      api: "/api/delete-foapa-detail",
    });

    await faculty.save();

    return res
      .status(200)
      .send({ message: "FOAPA details updated successfully" });
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

// Retrieves a FOAPA's information
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

router.get("/retrieve-foapa-registry", verifyToken, async (req, res) => {
  try {
    const foapa_registry = await FoapaRegistry.find();

    if (foapa_registry.length === 0) {
      return res
        .status(400)
        .send({ message: "FOAPA registry could not be found" });
    }

    return res.status(200).send(foapa_registry[0]);
  } catch (err) {
    return res.status(500).send({
      message: "An unexpected error occured when retrieving the FOAPA regisery",
    });
  }
});

// Receive ACCT numbers
router.get("/retrieve-ACCT-values", verifyToken, async (req, res) => {
  try {
    const results = await AccountNumbers.find();

    if (results.length === 0) {
      return res.status(404).send({ message: "No ACCT numbers were found." });
    }

    const ACCTNumbers = results[0].accountNumbers;

    res.status(200).send(ACCTNumbers);
  } catch (err) {
    logger.error(err, {
      api: "/api/retrieve-ACCT-values",
    });

    if (err instanceof ZodError) {
      return res.status(400).send({
        message:
          "An error occured when retrieving the Account Numbers...Please try again later. If the issue persists, contact support.",
      });
    }

    return res.status(500).send({
      message:
        "An unexpected error has occured. Please try again later. If this issue persists, please contact support.",
    });
  }
});

// Checks the clashes when the user wants to delete or edit a FOAPA: POST /check-foapa-usage
router.get("/check-foapa-usage", verifyToken, async (req, res) => {
  try {
    const foapaId = req.query.foapa_id;
    const userId = req.user.userId;

    const faculty = await Faculty.findById(userId).populate(
      "reimbursementTickets"
    );

    // Find the FOAPA we want to check's index in the facultys FOAPA array
    let index = faculty.foapaDetails.findIndex(
      (foapa) => foapa._id.toHexString() === foapaId
    );

    // If the FOAPA was not found in the faculty's FOAPA list
    if (index === -1) {
      throw new Error("There was an error finding this FOAPA's information");
    }

    let foapaToCheck = faculty.foapaDetails[index];

    // Stores all the reimbursement requests that the FOAPA is being used for
    let reimbursementClashes = [];

    //Looping through all the faculty's reimbursement tickets
    for (let i = 0; i < faculty.reimbursementTickets.length; i++) {
      //Skip submitted tickets as they no longer matter
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

    //Removing duplicates
    clashes = [...new Set(clashes)];

    return res.status(200).send(clashes);
  } catch (err) {
    logger.error(err, {
      api: "/api/check-foapa-usage",
    });

    return res.status(500).send({
      message:
        "An unexpected error occured when verifying this FOAPA's usage. Please try again later.",
    });
  }
});

router.post("/mark-claim-as-submitted", verifyToken, async (req, res) => {
  try {
    console.log("THIS IS MARKED AS SUBMITTED");
    let faculty = await Faculty.findById(req.user.userId);
    let reimbursementFoapa = req.body.reimbursementData.foapaDetails;
    let facultyFoapa = faculty.foapaDetails;

    // reimbursementFoapa.forEach((rfoapa) => {
    //   facultyFoapa.forEach((ffoapa) => {
    //     if (rfoapa.foapa_id == ffoapa._id.toHexString())
    //       ffoapa.availableAmount -= rfoapa.cost;
    //   });
    // });

    faculty.save();
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: err.message });
  }
});

export default router;
