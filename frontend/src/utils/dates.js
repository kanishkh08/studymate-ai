// Date helpers for the planner. Dates are plain "YYYY-MM-DD" strings in the student's
// LOCAL time zone, which keeps "today" correct wherever the student is.

const pad = (n) => String(n).padStart(2, "0");

// Date -> "YYYY-MM-DD" using local time (toISOString would shift to UTC).
export function toISO(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// "YYYY-MM-DD" -> Date at local midnight.
export function fromISO(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export const todayISO = () => toISO(new Date());

export function addDaysISO(str, n) {
  const date = fromISO(str);
  date.setDate(date.getDate() + n);
  return toISO(date);
}

// Whole days from today until the given date (negative if it is in the past).
export function daysUntil(str) {
  return Math.round((fromISO(str) - fromISO(todayISO())) / 86400000);
}

export function formatDay(str) {
  return fromISO(str).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatMinutes(min) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}
