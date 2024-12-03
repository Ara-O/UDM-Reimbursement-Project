import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { z, ZodError } from "zod";

const router = Router();

router.get("/retrieve-dashboard-data", verifyToken, async (req, res) => {
    try {
        
    } catch (err) {

    }
      
})
