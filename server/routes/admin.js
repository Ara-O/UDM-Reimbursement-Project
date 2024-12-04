import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { z, ZodError } from "zod";
import ReimbursementTicket from "../models/reimbursement.js";

const router = Router();

router.get("/retrieve-submitted-requests", verifyToken, async (req, res) => {
    try {
        let ticketInfo = await ReimbursementTicket.find({reimbursementStatus: "Submitted"});

        console.log("ticket info:", ticketInfo)

        res.status(200).send(ticketInfo);
    } catch (err) {
        console.log(err)
        res.send(err)
    }

})

export default router;
