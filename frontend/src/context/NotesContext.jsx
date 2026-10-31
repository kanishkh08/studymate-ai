import { createContext, useContext, useEffect, useState } from "react";

// Shares the student's notes and the latest summary between pages, so text pasted on the
// Summarizer page is already there on the Quiz page. It is kept in sessionStorage so a
// page refresh does not lose it (storage can be blocked, hence the try/catch).

const NotesContext = createContext(null);

function readStored(key) {
  try {
    return sessionStorage.getItem(key) || "";
  } catch {
    return "";
  }
}

function writeStored(key, value) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // storage unavailable: the app still works, it just won't survive a refresh
  }
}

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState(() => readStored("studymate:notes"));
  const [summary, setSummary] = useState(() => readStored("studymate:summary"));

  useEffect(() => {
    writeStored("studymate:notes", notes);
  }, [notes]);
  useEffect(() => {
    writeStored("studymate:summary", summary);
  }, [summary]);

  return (
    <NotesContext.Provider value={{ notes, setNotes, summary, setSummary }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be used inside <NotesProvider>");
  return ctx;
}
