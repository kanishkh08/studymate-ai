import { Link } from "react-router-dom";
import Logo from "./Logo.jsx";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo />
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Paste your notes, get a clean revision summary and a practice quiz. Built with React,
            Express, MongoDB and Gemini.
          </p>
        </div>
        <div className="flex gap-5 text-sm text-slate-600">
          <Link to="/summarize" className="hover:text-brand-700">Summarizer</Link>
          <Link to="/quiz" className="hover:text-brand-700">Quiz</Link>
          <Link to="/saved" className="hover:text-brand-700">Saved Notes</Link>
        </div>
      </div>
      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        AI can make mistakes. Always check important facts against your textbook.
      </div>
    </footer>
  );
}
