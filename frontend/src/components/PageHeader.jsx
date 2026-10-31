// Consistent title block at the top of the Summarizer, Quiz and Saved Notes pages.
export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-600">
          {eyebrow}
        </p>
      )}
      <h1 className="font-serif text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h1>
      {subtitle && <p className="mt-3 max-w-2xl text-slate-600">{subtitle}</p>}
    </div>
  );
}
