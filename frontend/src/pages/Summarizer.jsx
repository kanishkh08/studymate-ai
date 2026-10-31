import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNotes } from "../context/NotesContext.jsx";
import { summarizeNotes, saveNote } from "../services/api.js";
import { MAX_NOTES_CHARS, MAX_TITLE_CHARS, MIN_NOTES_CHARS } from "../constants.js";
import PageHeader from "../components/PageHeader.jsx";
import NotesTextarea from "../components/NotesTextarea.jsx";
import SummaryView, { summaryToLines } from "../components/SummaryView.jsx";
import Alert from "../components/Alert.jsx";
import Spinner from "../components/Spinner.jsx";

// Copies text to the clipboard. Falls back to an old technique if the modern API is blocked.
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(el);
      return ok;
    } catch {
      return false;
    }
  }
}

export default function Summarizer() {
  const { notes, setNotes, summary, setSummary } = useNotes();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null); // { type, text }

  const trimmedLength = notes.trim().length;
  const canSubmit = trimmedLength >= MIN_NOTES_CHARS && notes.length <= MAX_NOTES_CHARS && !loading;

  async function handleGenerate() {
    setError("");
    setSaveMessage(null);
    setCopied(false);
    setLoading(true);
    try {
      const data = await summarizeNotes(notes.trim());
      if (!data.summary) throw new Error("The server did not return a summary.");
      setSummary(data.summary);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    const plain = summaryToLines(summary)
      .map((line) => `- ${line.replace(/\*\*/g, "")}`)
      .join("\n");
    const ok = await copyToClipboard(plain);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      setError("Could not copy automatically. Select the text and copy it manually.");
    }
  }

  async function handleSave() {
    setSaveMessage(null);
    setSaving(true);
    try {
      await saveNote({ title: title.trim(), originalNotes: notes.trim(), summary });
      setSaveMessage({ type: "success", text: "Saved! You can find it under Saved Notes." });
      setTitle("");
    } catch (err) {
      setSaveMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  }

  function handleClear() {
    setNotes("");
    setSummary("");
    setError("");
    setSaveMessage(null);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Notes summarizer"
        title="Turn long notes into quick revision points"
        subtitle="Paste your notes below. The AI rewrites them as short bullet points in simple language."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Input column */}
        <section className="space-y-4">
          <NotesTextarea value={notes} onChange={setNotes} disabled={loading} onClear={handleClear} />

          <button
            type="button"
            onClick={handleGenerate}
            disabled={!canSubmit}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
          >
            {loading ? (
              <>
                <Spinner className="h-5 w-5" /> Generating summary...
              </>
            ) : (
              "Generate Summary"
            )}
          </button>

          <Alert type="error">{error}</Alert>
        </section>

        {/* Output column */}
        <section aria-live="polite">
          <div className="min-h-[18rem] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-serif text-xl font-bold text-slate-900">Summary</h2>
              {summary && !loading && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-brand-500 hover:text-brand-700"
                >
                  {copied ? "Copied!" : "Copy summary"}
                </button>
              )}
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
                <Spinner className="h-8 w-8 text-brand-600" />
                <p className="text-sm">Reading your notes...</p>
              </div>
            )}

            {!loading && !summary && (
              <div className="py-14 text-center text-sm text-slate-500">
                <p className="font-medium text-slate-700">No summary yet</p>
                <p className="mt-1">Paste your notes and press &quot;Generate Summary&quot;.</p>
              </div>
            )}

            {!loading && summary && (
              <>
                <SummaryView summary={summary} />

                <div className="mt-6 border-t border-slate-100 pt-5">
                  <label htmlFor="note-title" className="text-sm font-semibold text-slate-800">
                    Save this note
                  </label>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                    <input
                      id="note-title"
                      type="text"
                      value={title}
                      maxLength={MAX_TITLE_CHARS}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Title (optional), e.g. OS - Process Scheduling"
                      className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                    />
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:opacity-60"
                    >
                      {saving ? <Spinner className="h-4 w-4" /> : null}
                      {saving ? "Saving..." : "Save note"}
                    </button>
                  </div>
                  {saveMessage && (
                    <Alert type={saveMessage.type} className="mt-3">
                      {saveMessage.text}
                      {saveMessage.type === "success" && (
                        <>
                          {" "}
                          <Link to="/saved" className="font-semibold underline">
                            View saved notes
                          </Link>
                        </>
                      )}
                    </Alert>
                  )}

                  <button
                    type="button"
                    onClick={() => navigate("/quiz")}
                    className="mt-4 text-sm font-semibold text-brand-600 hover:text-brand-800"
                  >
                    Make a quiz from these notes &rarr;
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
