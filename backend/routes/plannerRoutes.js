import { Router } from "express";
import requireDb from "../middleware/requireDb.js";
import {
  createPlan,
  getPlans,
  setTaskDone,
  deletePlan,
} from "../controllers/plannerController.js";

const router = Router();

// Plans live in MongoDB, so the database must be connected.
router.use(requireDb);

router.post("/", createPlan); // POST   /api/plans                      create a plan with AI
router.get("/", getPlans); // GET    /api/plans                      list plans
router.patch("/:id/tasks/:taskId", setTaskDone); // PATCH /api/plans/:id/tasks/:taskId  tick / untick
router.delete("/:id", deletePlan); // DELETE /api/plans/:id                  delete a plan

export default router;
