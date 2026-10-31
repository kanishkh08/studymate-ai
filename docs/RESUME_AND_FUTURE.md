# Resume description and future improvements

## Short project description (for your resume)

**StudyMate AI: Smart Notes & Quiz Generator** | React, Vite, Tailwind CSS, Node.js, Express, MongoDB Atlas, Gemini API

- Built a full-stack web app that turns pasted study notes into bullet-point revision summaries and multiple-choice quizzes using Google's Gemini API.
- Designed a REST API (Express, Mongoose) with input validation, request-size limits, rate limiting, CORS restrictions and centralised error handling.
- Used schema-constrained JSON output for quiz generation and added server-side validation and one automatic retry, so malformed AI responses never crash the app.
- Created a responsive React interface with loading, empty, success and error states, an interactive quiz with scoring and explanations, and a saved-notes library backed by MongoDB.
- Kept all secrets in environment variables and structured the app for separate frontend (Vercel) and backend (Render) hosting.

> After you actually deploy it, change the last bullet to "Deployed the frontend on Vercel and the backend on Render" and add your live link.

### One-line version

Full-stack Generative AI study assistant (React, Express, MongoDB, Gemini) that summarises notes and generates validated MCQ quizzes.

### Interview talking points

- Why the API key lives only on the backend, and what could happen if it were in React code.
- How structured output plus backend validation protects against unreliable LLM responses.
- Why the notes are wrapped in `<notes>` tags and the model is told to treat them as data (prompt-injection defence).
- How rate limiting and size limits protect cost and availability.
- Trade-offs: no authentication in v1 means saved notes are shared by everyone using the same database.

## Future improvements

1. **User accounts**: add sign-up and login (JWT or Clerk/Auth0) so each student sees only their own notes. This is the most important next step.
2. **Upload PDFs and slides**: extract text from PDF/PPTX files and summarise them.
3. **Save quizzes and track scores**: store quiz attempts, show progress over time, and highlight weak topics.
4. **Flashcards and spaced repetition**: generate flashcards from notes and schedule reviews.
5. **Streaming responses**: show the summary as it is generated for a faster-feeling UI.
6. **Export**: download summaries or quizzes as PDF or Markdown.
7. **Difficulty levels and question types**: easy/medium/hard, true/false, fill in the blanks.
8. **Dark mode and accessibility audit**.
9. **Automated tests**: Vitest/React Testing Library for the UI, Jest or Node test runner with Supertest for the API.
10. **Observability**: structured logging and basic usage analytics.
