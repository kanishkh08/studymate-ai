import mongoose from "mongoose";

// One study task inside a plan, e.g. "Read Process Scheduling and make notes" on 2026-10-25.
const taskSchema = new mongoose.Schema({
  date: { type: String, required: true }, // "YYYY-MM-DD"
  title: { type: String, required: true, trim: true, maxlength: 160 },
  minutes: { type: Number, required: true, min: 5, max: 720 },
  done: { type: Boolean, default: false },
});

// A study plan for ONE exam/subject, with all its tasks.
const planSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true, trim: true, maxlength: 80 },
    examDate: { type: String, required: true }, // "YYYY-MM-DD"
    startDate: { type: String, required: true }, // "YYYY-MM-DD"
    hoursPerDay: { type: Number, required: true, min: 1, max: 12 },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    topics: { type: String, trim: true, maxlength: 3000, default: "" },
    tasks: [taskSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Plan", planSchema);
