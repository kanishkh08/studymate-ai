import { useState } from "react";
import { useNotes } from "../context/NotesContext.jsx";
import { generateFlashcards } from "../services/api.js";
import { MAX_NOTES_CHARS, MIN_NOTES_CHARS, QUESTION_COUNTS } from "../constants.js";
import PageHeader from "../components/PageHeader.jsx";
import NotesTextarea from "../components/NotesTextarea.jsx";
import Alert from "../components/Alert.jsx";
import Spinner from "../components/Spinner.jsx";

export default function Flashcards() {
  const { notes, setNotes } = useNotes();

  const [count, setCount] = useState(5);
  const [hinglish, setHinglish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const canGenerate =
    notes.trim().length >= MIN_NOTES_CHARS && notes.length <= MAX_NOTES_CHARS && !loading;

  async function handleGenerate() {
    setError("");
    setWarning("");
    setLoading(true);
    try {
      const data = await generateFlashcards(notes.trim(), count, hinglish);
      if (!Array.isArray(data.cards) || data.cards.length === 0) {
        throw new Error("The server did not return any flashcards. Please try again.");
      }
      setCards(data.cards);
      setIndex(0);
      setFlipped(false);
      setWarning(data.warning || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function goTo(i) {
    setIndex(i);
    setFlipped(false);
  }

  function handleReset() {
    setCards([]);
    setIndex(0);
    setFlipped(false);
    setWarning("");
    setError("");
  }

  // ------------------------------ SETUP ------------------------------------
  if (cards.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <PageHeader
          eyebrow="AI Flashcards"
          title="Revise with flashcards"
          subtitle="Paste your notes and the AI turns them into flip cards. Try to recall the answer first, then flip."
        />

        <div className="space-y-6">
          <NotesTextarea value={notes} onChange={setNotes} disabled={loading} onClear={() => setNotes("")} />

          <fieldset disabled={loading}>
            <legend className="text-sm font-semibold text-slate-800">Number of cards</legend>
            <div className="mt-2 inline-flex rounded-xl border border-slate-300 bg-white p-1">
              {QUESTION_COUNTS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCount(n)}
                  aria-pressed={count === n}
                  className={`rounded-lg px-5 py-2 text-sm font-semibold transition-colors ${
                    count === n ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={hinglish}
              onChange={(e) => setHinglish(e.target.checked)}
              disabled={loading}
              className="h-4 w-4 rounded border-slate-300"
            />
            Hinglish mein samjhao
          </label>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
          >
            {loading ? (
              <>
                <Spinner className="h-5 w-5" /> Creating flashcards...
              </>
            ) : (
              "Generate Flashcards"
            )}
          </button>

          <Alert type="error">{error}</Alert>
        </div>
      </div>
    );
  }

  // ------------------------------ STUDY ------------------------------------
  const card = cards[index];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Flashcards"
        title={`Card ${index + 1} of ${cards.length}`}
        subtitle="Click the card to flip it."
      />

      <Alert type="warning" className="mb-6">{warning}</Alert>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className={`flex min-h-[18rem] w-full flex-col items-center justify-center rounded-2xl border p-8 text-center shadow-sm transition-colors ${
          flipped ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white hover:border-brand-300"
        }`}
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {flipped ? "Answer" : "Question"}
        </span>
        <span className="mt-4 text-xl font-semibold leading-snug text-slate-900">
          {flipped ? card.back : card.front}
        </span>
        <span className="mt-6 text-xs text-slate-400">Click to {flipped ? "see question" : "see answer"}</span>
      </button>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-800 hover:border-brand-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          &larr; Previous
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          disabled={index === cards.length - 1}
          className="rounded-xl bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Next &rarr;
        </button>
      </div>

      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={handleReset}
          className="text-sm font-semibold text-brand-600 hover:text-brand-800"
        >
          New flashcards
        </button>
      </div>
    </div>
  );
}