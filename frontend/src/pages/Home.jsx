import { Link } from "react-router-dom";

const features = [
  {
    title: "Notes summarizer",
    text: "Paste a chapter or lecture notes and get short bullet-point revision notes in simple language.",
    to: "/summarize",
    cta: "Summarize notes",
  },
  {
    title: "AI quiz generator",
    text: "Turn the same notes into 5, 10 or 15 multiple-choice questions, each with an explanation.",
    to: "/quiz",
    cta: "Generate a quiz",
  },
  {
    title: "Instant scoring",
    text: "Answer the quiz, submit, and see your score with the correct answer for every question.",
    to: "/quiz",
    cta: "Try a quiz",
  },
  {
    title: "Saved notes",
    text: "Keep your original notes and summaries together so you can revise before exams.",
    to: "/saved",
    cta: "Open saved notes",
  },
];

const steps = [
  { n: "1", title: "Paste your notes", text: "Copy text from your slides, PDF or notebook into the editor." },
  { n: "2", title: "Let the AI work", text: "Gemini reads only your notes and writes the summary or the quiz." },
  { n: "3", title: "Revise and save", text: "Review the output, take the quiz and save what you want to keep." },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-brand-50 via-white to-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="mb-4 inline-block rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
              For B.Tech and college students
            </p>
            <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Study Smarter <span className="text-brand-600">with AI</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              StudyMate AI turns long, messy notes into short revision summaries and practice quizzes.
              Everything is generated from your own material, so you revise what your syllabus
              actually covers.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/summarize"
                className="rounded-xl bg-brand-600 px-6 py-3 text-center font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
              >
                Summarize Notes
              </Link>
              <Link
                to="/quiz"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-center font-semibold text-slate-800 transition-colors hover:border-brand-500 hover:text-brand-700"
              >
                Generate Quiz
              </Link>
            </div>
          </div>

          {/* Static illustration of the kind of output you get (not live AI output) */}
          <div className="relative">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-brand-900/5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Example of what you get
              </p>
              <h2 className="mt-3 font-serif text-lg font-bold text-slate-900">Revision summary</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-brand-500" />A process is a program in execution with its own memory space.</li>
                <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-brand-500" />Threads inside one process share code and data but have separate stacks.</li>
                <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-brand-500" />A context switch saves one process state and loads another.</li>
              </ul>
              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Q. What do threads of one process share?</p>
                <div className="mt-3 grid gap-2 text-sm">
                  <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-600">Their own stacks</span>
                  <span className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 font-medium text-emerald-800">Code and data sections</span>
                  <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-600">Program counters</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-serif text-3xl font-bold text-slate-900">Everything you need to revise</h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          Four focused tools, one workflow. No sign-up needed for this first version.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Link
              key={f.title}
              to={f.to}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5"
            >
              <h3 className="text-lg font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{f.text}</p>
              <span className="mt-4 text-sm font-semibold text-brand-600 group-hover:text-brand-800">
                {f.cta} &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-serif text-3xl font-bold text-slate-900">How it works</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="flex gap-4">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {s.n}
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 rounded-2xl bg-brand-900 px-6 py-8 text-center sm:px-10">
            <h3 className="font-serif text-2xl font-bold text-white">Ready for your next exam?</h3>
            <p className="mx-auto mt-2 max-w-xl text-brand-200">
              Paste today&apos;s notes and have a summary and a practice quiz in under a minute.
            </p>
            <Link
              to="/summarize"
              className="mt-5 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-brand-800 transition-colors hover:bg-brand-50"
            >
              Get started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
