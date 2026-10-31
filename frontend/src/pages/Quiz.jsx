import { useState } from "react";
import { useNotes } from "../context/NotesContext.jsx";
import { generateQuiz } from "../services/api.js";
import { MAX_NOTES_CHARS, MIN_NOTES_CHARS, QUESTION_COUNTS } from "../constants.js";
import PageHeader from "../components/PageHeader.jsx";
import NotesTextarea from "../components/NotesTextarea.jsx";
import Alert from "../components/Alert.jsx";
import Spinner from "../components/Spinner.jsx";

const LETTERS = ["A", "B", "C", "D"];

// Short message based on the percentage score.
function scoreMessage(percent) {
  if (percent === 100) return "Perfect score. You know this topic well.";
  if (percent >= 80) return "Great work. Just a few points left to polish.";
  if (percent >= 50) return "Good start. Review the explanations below and try again.";
  return "Keep going. Re-read your notes and retake the quiz.";
}

export default function Quiz() {
  const { notes, setNotes } = useNotes();

  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  // phase: "setup" -> "taking" -> "results"
  const [phase, setPhase] = useState("setup");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]); // selected option index per question (or null)

  const canGenerate =
    notes.trim().length >= MIN_NOTES_CHARS && notes.length <= MAX_NOTES_CHARS && !loading;
  const answeredCount = answers.filter((a) => a !== null).length;
  const score = questions.reduce((sum, q, i) => sum + (answers[i] === q.correctIndex ? 1 : 0), 0);

  async function handleGenerate() {
    setError("");
    setWarning("");
    setLoading(true);
    try {
      const data = await generateQuiz(notes.trim(), count);
      if (!Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error("The server did not return any questions. Please try again.");
      }
      setQuestions(data.questions);
      setAnswers(new Array(data.questions.length).fill(null));
      setWarning(data.warning || "");
      setPhase("taking");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function selectAnswer(questionIndex, optionIndex) {
    setAnswers((prev) => prev.map((a, i) => (i === questionIndex ? optionIndex : a)));
  }

  function handleSubmit() {
    setPhase("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleRetake() {
    setAnswers(new Array(questions.length).fill(null));
    setPhase("taking");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleNewQuiz() {
    setPhase("setup");
    setQuestions([]);
    setAnswers([]);
    setWarning("");
    setError("");
  }

  // ------------------------------ SETUP ------------------------------------
  if (phase === "setup") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <PageHeader
          eyebrow="Quiz generator"
          title="Test yourself on your own notes"
          subtitle="The AI writes multiple-choice questions using only the notes you paste here."
        />

        <div className="space-y-6">
          <NotesTextarea value={notes} onChange={setNotes} disabled={loading} onClear={() => setNotes("")} />

          <fieldset disabled={loading}>
            <legend className="text-sm font-semibold text-slate-800">Number of questions</legend>
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

          <button
            type="button"
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
          >
            {loading ? (
              <>
                <Spinner className="h-5 w-5" /> Creating your quiz...
              </>
            ) : (
              "Generate Quiz"
            )}
          </button>

          {loading && (
            <p className="text-sm text-slate-500">
              Writing {count} questions. This usually takes 10 to 30 seconds.
            </p>
          )}
          <Alert type="error">{error}</Alert>
        </div>
      </div>
    );
  }

  // --------------------- TAKING + RESULTS (same list) ----------------------
  const showResults = phase === "results";
  const percent = Math.round((score / questions.length) * 100);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow={showResults ? "Results" : "Quiz in progress"}
        title={showResults ? "Your score" : "Answer the questions"}
        subtitle={
          showResults
            ? undefined
            : `Choose one answer for each question. ${answeredCount} of ${questions.length} answered.`
        }
      />

      <Alert type="warning" className="mb-6">{warning}</Alert>

      {showResults && (
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="font-serif text-5xl font-bold text-brand-700">
            {score}
            <span className="text-2xl text-slate-400"> / {questions.length}</span>
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-500">{percent}% correct</p>
          <p className="mt-3 text-slate-700">{scoreMessage(percent)}</p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleRetake}
              className="rounded-xl bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700"
            >
              Retake this quiz
            </button>
            <button
              type="button"
              onClick={handleNewQuiz}
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-800 hover:border-brand-500 hover:text-brand-700"
            >
              New quiz
            </button>
          </div>
        </div>
      )}

      <ol className="space-y-6">
        {questions.map((q, qi) => {
          const chosen = answers[qi];
          const isCorrect = chosen === q.correctIndex;
          return (
            <li key={qi} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Question {qi + 1} of {questions.length}
              </p>
              <h2 className="mt-1 text-lg font-semibold leading-snug text-slate-900">{q.question}</h2>

              <div className="mt-4 space-y-2.5" role="radiogroup" aria-label={`Question ${qi + 1}`}>
                {q.options.map((option, oi) => {
                  const selected = chosen === oi;
                  const isRightOption = oi === q.correctIndex;

                  let style = "border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/40";
                  if (!showResults && selected) style = "border-brand-500 bg-brand-50";
                  if (showResults && isRightOption) style = "border-emerald-400 bg-emerald-50";
                  if (showResults && selected && !isRightOption) style = "border-red-300 bg-red-50";

                  return (
                    <label
                      key={oi}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-[15px] transition-colors ${style} ${
                        showResults ? "cursor-default" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${qi}`}
                        checked={selected}
                        disabled={showResults}
                        onChange={() => selectAnswer(qi, oi)}
                        className="mt-1 h-4 w-4 accent-brand-600"
                      />
                      <span className="flex-1 text-slate-800">
                        <span className="mr-2 font-semibold text-slate-500">{LETTERS[oi]}.</span>
                        {option}
                      </span>
                      {showResults && isRightOption && (
                        <span className="text-xs font-semibold text-emerald-700">Correct answer</span>
                      )}
                      {showResults && selected && !isRightOption && (
                        <span className="text-xs font-semibold text-red-700">Your answer</span>
                      )}
                    </label>
                  );
                })}
              </div>

              {showResults && (
                <div
                  className={`mt-4 rounded-xl px-4 py-3 text-sm ${
                    isCorrect ? "bg-emerald-50 text-emerald-900" : "bg-slate-50 text-slate-700"
                  }`}
                >
                  <p className="font-semibold">
                    {chosen === null ? "Not answered" : isCorrect ? "Correct" : "Incorrect"}
                  </p>
                  <p className="mt-1 leading-relaxed">{q.explanation}</p>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {!showResults && (
        <div className="sticky bottom-0 mt-8 -mx-4 border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-slate-600">
              {answeredCount} of {questions.length} answered
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleNewQuiz}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={answeredCount < questions.length}
                className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Submit quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
