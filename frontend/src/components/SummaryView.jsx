// Renders the AI summary (lines starting with "- ") as a clean bullet list.
// We build React elements ourselves instead of using dangerouslySetInnerHTML, so
// whatever the AI returns can never inject HTML or scripts into the page.

// Turns **bold** markers into <strong> elements.
function renderInline(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
      <strong key={i} className="font-semibold text-slate-900">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function summaryToLines(summary) {
  return summary
    .split("\n")
    .map((line) => line.replace(/^\s*[-*•]\s+/, "").trim())
    .filter(Boolean);
}

export default function SummaryView({ summary }) {
  const lines = summaryToLines(summary);
  return (
    <ul className="space-y-2.5">
      {lines.map((line, i) => (
        <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-slate-700">
          <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-brand-500" aria-hidden="true" />
          <span>{renderInline(line)}</span>
        </li>
      ))}
    </ul>
  );
}
