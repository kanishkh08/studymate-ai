import asyncHandler from "../utils/asyncHandler.js";
import { validateNotesForAi, validateQuestionCount } from "../utils/validators.js";
import { summarizeNotes, generateQuiz } from "../services/geminiService.js";

// POST /api/ai/summarize   body: { notes: "..." }
export const summarize = asyncHandler(async (req, res) => {
  const notes = validateNotesForAi(req.body?.notes);
  const summary = await summarizeNotes(notes);
  res.json({ summary });
});

// POST /api/ai/quiz   body: { notes: "...", numQuestions: 5 | 10 | 15 }
export const quiz = asyncHandler(async (req, res) => {
  const notes = validateNotesForAi(req.body?.notes);
  const numQuestions = validateQuestionCount(req.body?.numQuestions);
  const result = await generateQuiz(notes, numQuestions);
  // result = { questions: [...], warning?: "..." }
  res.json(result);
});
