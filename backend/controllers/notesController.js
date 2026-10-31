import mongoose from "mongoose";
import Note from "../models/Note.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  validateText,
  MAX_NOTES_CHARS,
  MAX_SUMMARY_CHARS,
  MAX_TITLE_CHARS,
} from "../utils/validators.js";

// POST /api/notes  -> save a note (and optionally its summary)
export const createNote = asyncHandler(async (req, res) => {
  const body = req.body || {};

  const originalNotes = validateText(body.originalNotes, {
    field: "Original note text",
    max: MAX_NOTES_CHARS,
  });
  const summary = validateText(body.summary, {
    field: "Summary",
    max: MAX_SUMMARY_CHARS,
    required: false,
  });
  let title = validateText(body.title, {
    field: "Title",
    max: MAX_TITLE_CHARS,
    required: false,
  });

  // No title given? Use the first line of the notes.
  if (!title) {
    const firstLine = originalNotes.split("\n")[0].trim();
    title = firstLine.length > 60 ? `${firstLine.slice(0, 57)}...` : firstLine;
  }

  const note = await Note.create({ title, originalNotes, summary });
  res.status(201).json({ note });
});

// GET /api/notes  -> list saved notes, newest first
export const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 }).limit(100);
  res.json({ notes });
});

// DELETE /api/notes/:id  -> delete one note
export const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new AppError(400, "Invalid note ID.");
  }

  const deleted = await Note.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError(404, "Note not found. It may already be deleted.");
  }

  res.json({ message: "Note deleted.", id });
});
