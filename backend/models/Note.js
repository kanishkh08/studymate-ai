import mongoose from "mongoose";
import {
  MAX_NOTES_CHARS,
  MAX_SUMMARY_CHARS,
  MAX_TITLE_CHARS,
} from "../utils/validators.js";

// A saved note = the student's original text + (optionally) the AI summary.
const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: [MAX_TITLE_CHARS, `Title can be at most ${MAX_TITLE_CHARS} characters.`],
      default: "Untitled note",
    },
    originalNotes: {
      type: String,
      required: [true, "Original notes are required."],
      trim: true,
      maxlength: [MAX_NOTES_CHARS, `Notes can be at most ${MAX_NOTES_CHARS} characters.`],
    },
    summary: {
      type: String,
      trim: true,
      maxlength: [MAX_SUMMARY_CHARS, `Summary can be at most ${MAX_SUMMARY_CHARS} characters.`],
      default: "",
    },
  },
  {
    // Adds createdAt and updatedAt automatically.
    timestamps: true,
  }
);

export default mongoose.model("Note", noteSchema);
