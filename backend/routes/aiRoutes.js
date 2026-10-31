import { Router } from "express";
import { summarize, quiz } from "../controllers/aiController.js";

const router = Router();

router.post("/summarize", summarize); // POST /api/ai/summarize
router.post("/quiz", quiz); // POST /api/ai/quiz

export default router;
