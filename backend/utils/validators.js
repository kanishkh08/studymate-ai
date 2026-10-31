import AppError from "./AppError.js";

// Limits are kept in one place so the frontend and backend stay in sync.
export const MIN_NOTES_CHARS = 30;
export const MAX_NOTES_CHARS = 20000;
export const MAX_SUMMARY_CHARS = 10000;
export const MAX_TITLE_CHARS = 120;
export const ALLOWED_QUESTION_COUNTS = [5, 10, 15];

/**
 * Validates a text field coming from the request body.
 * Returns the trimmed string or throws an AppError with a helpful message.
 */
export function validateText(value, { field, min = 1, max, required = true }) {
  if (value === undefined || value === null || value === "") {
    if (required) throw new AppError(400, `${field} is required.`);
    return "";
  }
  if (typeof value !== "string") {
    throw new AppError(400, `${field} must be text.`);
  }
  const text = value.trim();
  if (required && text.length < min) {
    throw new AppError(
      400,
      min === 1
        ? `${field} cannot be empty.`
        : `${field} is too short. Please enter at least ${min} characters.`
    );
  }
  if (text.length > max) {
    throw new AppError(
      413,
      `${field} is too long (${text.length} characters). The limit is ${max}.`
    );
  }
  return text;
}

// Notes sent to the AI must have enough content to be worth summarising.
export function validateNotesForAi(value) {
  return validateText(value, {
    field: "Note text",
    min: MIN_NOTES_CHARS,
    max: MAX_NOTES_CHARS,
  });
}

// The quiz size must be exactly one of 5, 10 or 15.
export function validateQuestionCount(value) {
  const count = Number(value);
  if (!ALLOWED_QUESTION_COUNTS.includes(count)) {
    throw new AppError(
      400,
      `numQuestions must be one of: ${ALLOWED_QUESTION_COUNTS.join(", ")}.`
    );
  }
  return count;
}
