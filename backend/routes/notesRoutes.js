import { Router } from "express";
import requireDb from "../middleware/requireDb.js";
import { createNote, getNotes, deleteNote } from "../controllers/notesController.js";

const router = Router();

// Every notes route needs the database to be connected.
router.use(requireDb);

router.post("/", createNote); // POST   /api/notes
router.get("/", getNotes); // GET    /api/notes
router.delete("/:id", deleteNote); // DELETE /api/notes/:id

export default router;
