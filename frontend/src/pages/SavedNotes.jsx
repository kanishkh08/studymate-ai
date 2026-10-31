import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchNotes, deleteNote } from "../services/api.js";
import PageHeader from "../components/PageHeader.jsx";
import SummaryView from "../components/SummaryView.jsx";
import Alert from "../components/Alert.jsx";
import Spinner from "../components/Spinner.jsx";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return "";
  }
}

export default function SavedNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [openId, setOpenId] = useState(null); // which note is expanded
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchNotes();
      setNotes(Array.isArray(data.notes) ? data.notes : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(note) {
    if (!window.confirm(`Delete "${note.title}"? This cannot be undone.`)) return;
    setDeletingId(note._id);
    setError("");
    setMessage("");
    try {
      await deleteNote(note._id);
      setNotes((prev) => prev.filter((n) => n._id !== note._id));
      if (openId === note._id) setOpenId(null);
      setMessage("Note deleted.");
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Saved notes"
        title="Your revision library"
        subtitle="Notes and summaries you saved. Open one to read it again, or delete what you no longer need."
      />

      <Alert type="success" className="mb-4">{message}</Alert>

      {loading && (
        <div className="flex items-center justify-center gap-3 py-20 text-slate-500">
          <Spinner className="h-6 w-6 text-brand-600" />
          <span>Loading your notes...</span>
        </div>
      )}

      {!loading && error && (
        <div className="space-y-3">
          <Alert type="error">{error}</Alert>
          <button
            type="button"
            onClick={load}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand-500 hover:text-brand-700"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && notes.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <h2 className="font-serif text-xl font-bold text-slate-900">No saved notes yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
            Generate a summary and press &quot;Save note&quot; to keep it here for later revision.
          </p>
          <Link
            to="/summarize"
            className="mt-5 inline-block rounded-xl bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700"
          >
            Summarize notes
          </Link>
        </div>
      )}

      {!loading && notes.length > 0 && (
        <ul className="space-y-4">
          {notes.map((note) => {
            const open = openId === note._id;
            return (
              <li key={note._id} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold text-slate-900">{note.title}</h2>
                    <p className="mt-0.5 text-xs text-slate-500">{formatDate(note.createdAt)}</p>
                    {!open && (
                      <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                        {note.originalNotes}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-none gap-2">
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : note._id)}
                      aria-expanded={open}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-brand-500 hover:text-brand-700"
                    >
                      {open ? "Hide" : "View"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(note)}
                      disabled={deletingId === note._id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                    >
                      {deletingId === note._id && <Spinner className="h-3.5 w-3.5" />}
                      Delete
                    </button>
                  </div>
                </div>

                {open && (
                  <div className="grid gap-6 border-t border-slate-100 p-5 md:grid-cols-2">
                    <div>
                      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
                        Summary
                      </h3>
                      {note.summary ? (
                        <SummaryView summary={note.summary} />
                      ) : (
                        <p className="text-sm text-slate-500">No summary was saved with this note.</p>
                      )}
                    </div>
                    <div>
                      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
                        Original notes
                      </h3>
                      <p className="max-h-72 overflow-y-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                        {note.originalNotes}
                      </p>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
