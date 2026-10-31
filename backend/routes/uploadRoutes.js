import { Router } from "express";
import multer from "multer";
import { PDFParse } from "pdf-parse";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { MAX_NOTES_CHARS } from "../utils/validators.js";

const router = Router();

// Keep the file in memory (no saving to disk). Max 5 MB, one file.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
});

// POST /api/upload/pdf   form-data: file=<pdf>
router.post(
  "/pdf",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new AppError(400, "Please choose a PDF file.");

    const isPdf =
      req.file.mimetype === "application/pdf" || req.file.originalname.toLowerCase().endsWith(".pdf");
    if (!isPdf) throw new AppError(400, "Only PDF files are supported.");

    let text = "";
    const parser = new PDFParse({ data: new Uint8Array(req.file.buffer) });
    try {
      const result = await parser.getText();
      text = (result.text || "").replace(/\s+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
    } catch {
      throw new AppError(400, "Could not read this PDF. It may be damaged or password protected.");
    } finally {
      await parser.destroy().catch(() => {});
    }

    if (text.length < 30) {
      throw new AppError(
        422,
        "No text found in this PDF. It may be a scanned image. Try a PDF with selectable text."
      );
    }

    let truncated = false;
    if (text.length > MAX_NOTES_CHARS) {
      text = text.slice(0, MAX_NOTES_CHARS);
      truncated = true;
    }

    res.json({ text, truncated });
  })
);

export default router;