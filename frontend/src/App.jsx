import { useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { NotesProvider } from "./context/NotesContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Summarizer from "./pages/Summarizer.jsx";
import Quiz from "./pages/Quiz.jsx";
import SavedNotes from "./pages/SavedNotes.jsx";

// Scroll to the top whenever the page changes.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-serif text-4xl font-bold">Page not found</h1>
      <p className="mt-3 text-slate-600">The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-xl bg-brand-600 px-5 py-2.5 font-medium text-white hover:bg-brand-700"
      >
        Back to home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <NotesProvider>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/summarize" element={<Summarizer />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/saved" element={<SavedNotes />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </NotesProvider>
  );
}
