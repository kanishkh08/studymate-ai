// Tiny date helpers. Dates are handled as plain "YYYY-MM-DD" strings so there are no
// time-zone surprises: the browser sends the student's local date, and we only do
// whole-day arithmetic on it (using UTC internally so daylight saving never matters).

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// "2026-10-25" -> Date (UTC midnight), or null if it is not a real calendar date.
export function parseISODate(str) {
  if (typeof str !== "string" || !DATE_RE.test(str)) return null;
  const [y, m, d] = str.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const valid =
    date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
  return valid ? date : null;
}

// Whole days from date string a to date string b (b - a).
export function diffDays(a, b) {
  return Math.round((parseISODate(b) - parseISODate(a)) / 86400000);
}

// Adds n days to a date string and returns a new date string.
export function addDays(str, n) {
  const date = parseISODate(str);
  date.setUTCDate(date.getUTCDate() + n);
  return date.toISOString().slice(0, 10);
}

// Today's date in UTC as "YYYY-MM-DD" (used only for a sanity check on client dates).
export function todayUTC() {
  return new Date().toISOString().slice(0, 10);
}
