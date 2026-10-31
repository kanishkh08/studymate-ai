import mongoose from "mongoose";
import Plan from "../models/Plan.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { validateText } from "../utils/validators.js";
import { parseISODate, diffDays, addDays, todayUTC } from "../utils/dates.js";
import { generateStudyPlan } from "../services/geminiService.js";

const MAX_PLAN_DAYS = 60;
const DIFFICULTIES = ["easy", "medium", "hard"];

function requireDate(value, field) {
  if (!parseISODate(value)) {
    throw new AppError(400, `${field} must be a valid date in YYYY-MM-DD format.`);
  }
  return value;
}

// POST /api/plans
// body: { subject, examDate, startDate, hoursPerDay, difficulty, topics? }
// startDate is the student's LOCAL today (sent by the browser, so time zones never break it).
export const createPlan = asyncHandler(async (req, res) => {
  const body = req.body || {};

  const subject = validateText(body.subject, { field: "Subject", min: 2, max: 80 });
  const topics = validateText(body.topics, { field: "Topics", max: 3000, required: false });

  const examDate = requireDate(body.examDate, "Exam date");
  const startDate = requireDate(body.startDate, "Start date");

  // The client's "today" must be close to the server's date (rules out wrong or fake dates).
  if (Math.abs(diffDays(todayUTC(), startDate)) > 2) {
    throw new AppError(400, "Your device date looks wrong. Please check your clock and try again.");
  }

  const hoursPerDay = Number(body.hoursPerDay);
  if (!Number.isInteger(hoursPerDay) || hoursPerDay < 1 || hoursPerDay > 12) {
    throw new AppError(400, "Study hours per day must be a whole number from 1 to 12.");
  }

  const difficulty = body.difficulty || "medium";
  if (!DIFFICULTIES.includes(difficulty)) {
    throw new AppError(400, `Difficulty must be one of: ${DIFFICULTIES.join(", ")}.`);
  }

  // Study days = every day from today up to (but not including) the exam day.
  const totalDays = diffDays(startDate, examDate);
  if (totalDays < 1) {
    throw new AppError(400, "The exam date must be after today.");
  }
  if (totalDays > MAX_PLAN_DAYS) {
    throw new AppError(400, `Please pick an exam date within ${MAX_PLAN_DAYS} days from today.`);
  }

  const items = await generateStudyPlan({ subject, topics, difficulty, hoursPerDay, totalDays });

  const tasks = items.map((t) => ({
    date: addDays(startDate, t.day - 1),
    title: t.title,
    minutes: t.minutes,
    done: false,
  }));

  const plan = await Plan.create({ subject, examDate, startDate, hoursPerDay, difficulty, topics, tasks });
  res.status(201).json({ plan });
});

// GET /api/plans  -> newest first
export const getPlans = asyncHandler(async (req, res) => {
  const plans = await Plan.find().sort({ createdAt: -1 }).limit(50);
  res.json({ plans });
});

// PATCH /api/plans/:id/tasks/:taskId   body: { done: true | false }
export const setTaskDone = asyncHandler(async (req, res) => {
  const { id, taskId } = req.params;
  if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(taskId)) {
    throw new AppError(400, "Invalid plan or task ID.");
  }
  if (typeof req.body?.done !== "boolean") {
    throw new AppError(400, "done must be true or false.");
  }

  const plan = await Plan.findOneAndUpdate(
    { _id: id, "tasks._id": taskId },
    { $set: { "tasks.$.done": req.body.done } },
    { new: true }
  );
  if (!plan) throw new AppError(404, "Plan or task not found.");

  res.json({ plan });
});

// DELETE /api/plans/:id
export const deletePlan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) throw new AppError(400, "Invalid plan ID.");

  const deleted = await Plan.findByIdAndDelete(id);
  if (!deleted) throw new AppError(404, "Plan not found. It may already be deleted.");

  res.json({ message: "Plan deleted.", id });
});
