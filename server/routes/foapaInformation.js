const router = Router();
import Faculty from "../models/faculty.js";
import logger from "../logger.js";
import z, { ZodError } from "zod";
import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";

// For retrieving a list of all the user's FOAPAs: GET /retrieve-foapa-details
router.get("/retrieve-foapa-details", verifyToken, async (req, res) => {
  try {
    const useridSchema = z.string();

    // Verify the user id retrieved from the verifyToken middleware is of the proper format
    const userID = useridSchema.parse(req.user.userId);

    // Find the faculty's data but select only the foapaDetails array in the faculty's object
    let facultyData = await Faculty.findById(userID).select("foapaDetails ");

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
    // Use zod to verify that the the user has a valid id format from the verifyToken middleware
    const useridSchema = z.string();

    const userId = useridSchema.parse(req.user.userId);

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
      account: z.string().length(4).trim().optional(),
      program: z.string().length(4).trim().optional(),
      activity: z.string().trim().optional(),
      isUDMPU: z.boolean().optional(),
    });

    const foapa = foapaSchema.parse(req.body.foapaDetails);

    //Replace the placeholders with the empty value - mainly for use by the
    //default created FOAPAs where the user does not yet have an entered ACCT or PROG, but can if
    //they know it

    if (foapa.account === "XXXX") {
      foapa.account = "";
    }

    if (foapa.program === "XXXX") {
      foapa.program = "";
    }

    // Push the new foapa to the faculty's data
    faculty.foapaDetails.push(foapa);

    await faculty.save();

    logger.info(`${userId} successfully added a new FOAPA`, {
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
    req.body.foapaDetail.createdAt =
      faculty.foapaDetails[foapa_to_edit_index].createdAt;
    req.body.foapaDetail.updatedAt = new Date();

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

// router.post("/mark-claim-as-accepted", verifyToken, async(req, res)=>{

// });

export default router;
