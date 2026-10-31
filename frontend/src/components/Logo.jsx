// Simple book mark + wordmark. Pure SVG, so it stays sharp at any size.
export default function Logo({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#4338ca" />
        <path
          d="M8 22.5V10.2c0-.5.4-.9.9-.8 2.7.4 5.1 1.4 7.1 3.2 2-1.8 4.4-2.8 7.1-3.2.5-.1.9.3.9.8v12.3c0 .5-.4.8-.9.8-2.6.3-4.9 1.2-7.1 2.8-2.2-1.6-4.5-2.5-7.1-2.8-.5 0-.9-.3-.9-.8z"
          fill="#fff"
        />
        <path d="M16 13.4v11.5" stroke="#4338ca" strokeWidth="1.6" />
      </svg>
      <span className="font-serif text-xl font-bold tracking-tight text-slate-900">
        StudyMate<span className="text-brand-600"> AI</span>
      </span>
    </span>
  );
}
