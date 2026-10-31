// All communication with the backend lives in this file.
// Components never call fetch() directly; they use the functions exported here.

// In development this is empty and Vite proxies /api to http://localhost:5000.
// In production set VITE_API_URL to your deployed backend URL.
const BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

// AI calls can take a while, so we allow up to 90 seconds before giving up.
const TIMEOUT_MS = 90000;

async function request(path, { method = "GET", body } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response;
  try {
    response = await fetch(`${BASE_URL}/api${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("The request took too long. Please try again.");
    }
    throw new Error(
      "Cannot reach the server. Check your internet connection and make sure the backend is running."
    );
  } finally {
    clearTimeout(timer);
  }

  // The backend always answers with JSON, but we guard against HTML error pages.
  let data = null;
  try {
    data = await response.json();
  } catch {
    // ignore: handled below
  }

  if (!response.ok) {
    throw new Error(data?.error || `Request failed (status ${response.status}).`);
  }
  if (data === null) {
    throw new Error("The server sent an unexpected response.");
  }
  return data;
}

// --- AI ---------------------------------------------------------------------
export const summarizeNotes = (notes) =>
  request("/ai/summarize", { method: "POST", body: { notes } });

export const generateQuiz = (notes, numQuestions) =>
  request("/ai/quiz", { method: "POST", body: { notes, numQuestions } });

// --- Saved notes ------------------------------------------------------------
export const saveNote = ({ title, originalNotes, summary }) =>
  request("/notes", { method: "POST", body: { title, originalNotes, summary } });

export const fetchNotes = () => request("/notes");

export const deleteNote = (id) => request(`/notes/${id}`, { method: "DELETE" });

// --- Study planner ----------------------------------------------------------
export const createPlan = (payload) => request("/plans", { method: "POST", body: payload });

export const fetchPlans = () => request("/plans");

export const setTaskDone = (planId, taskId, done) =>
  request(`/plans/${planId}/tasks/${taskId}`, { method: "PATCH", body: { done } });

export const deletePlan = (id) => request(`/plans/${id}`, { method: "DELETE" });
