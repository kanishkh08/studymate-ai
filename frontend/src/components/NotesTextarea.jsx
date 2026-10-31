import { MAX_NOTES_CHARS, MIN_NOTES_CHARS } from "../constants.js";

// Large text area with a live character counter, shared by the Summarizer and Quiz pages.
export default function NotesTextarea({ value, onChange, disabled, onClear }) {
  const length = value.length;
  const tooLong = length > MAX_NOTES_CHARS;
  const tooShort = length > 0 && value.trim().length < MIN_NOTES_CHARS;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor="notes" className="text-sm font-semibold text-slate-800">
          Your study notes
        </label>
        {length > 0 && onClear && (
          <button
            type="button"
            onClick={onClear}
            disabled={disabled}
            className="text-xs font-medium text-slate-500 hover:text-red-600 disabled:opacity-50"
          >
            Clear
          </button>
        )}
      </div>

      <textarea
        id="notes"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={12}
        placeholder="Paste a chapter, lecture notes or any study material here..."
        className={`block w-full resize-y rounded-xl border bg-white px-4 py-3 text-[15px] leading-relaxed text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-50 ${
          tooLong
            ? "border-red-300 focus:ring-red-200"
            : "border-slate-300 focus:border-brand-500 focus:ring-brand-200"
        }`}
      />

      <div className="mt-2 flex items-center justify-between text-xs">
        <span className={tooShort ? "text-amber-700" : "text-slate-500"}>
          {tooShort
            ? `Add a bit more: at least ${MIN_NOTES_CHARS} characters are needed.`
            : "Tip: longer, well-structured notes give better results."}
        </span>
        <span className={tooLong ? "font-semibold text-red-600" : "text-slate-500"}>
          {length.toLocaleString()} / {MAX_NOTES_CHARS.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
