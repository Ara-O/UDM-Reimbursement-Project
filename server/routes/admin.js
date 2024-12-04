import { request, Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { z, ZodError } from "zod";
import ReimbursementTicket from "../models/reimbursement.js";
import Faculty from "../models/faculty.js"

const router = Router();

router.get("/retrieve-submitted-requests", verifyToken, async (req, res) => {
    try {
        let results = []

        const requests = await ReimbursementTicket.find({ reimbursementStatus: "Submitted" })

        const reimbursementIds = requests.map(r => r._id);
        const faculties = await Faculty.find({}).select('firstName lastName department workEmail reimbursementTickets');

        for (let request of requests) {
            for (let faculty of faculties) {
                if (!faculty.reimbursementTickets) {
                    console.log("broke because undefined")
                    break
                }
                if (faculty.reimbursementTickets.includes(request._id))
                    results.push(
                        {
                            request, faculty
                        }
                    )
            }
        }

        console.log(results)
        res.status(200).send(results);
    } catch (err) {
        console.log(err)
        res.send(err)
    }

})

export default router;
