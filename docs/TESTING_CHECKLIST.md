# StudyMate AI: Testing Checklist

Run through this list after setting up the project (see the README). Tick each box as you go.
Use the files in `sample-notes/` as test input.

## 0. Setup

- [ ] `backend/.env` exists and has real `MONGODB_URI` and `GEMINI_API_KEY` values
- [ ] Backend terminal shows `[db] Connected to MongoDB` and `StudyMate API running on http://localhost:5000`
- [ ] Opening http://localhost:5000/api/health shows `"database":"connected"` and `"aiConfigured":true`
- [ ] Frontend opens at http://localhost:5173 without errors in the browser console (F12)

## 1. Home page

- [ ] Heading "Study Smarter with AI" is visible
- [ ] "Summarize Notes" opens the Summarizer page
- [ ] "Generate Quiz" opens the Quiz page
- [ ] The four feature cards link to the right pages
- [ ] Navbar highlights the current page

## 2. Summarizer

- [ ] Pasting `operating-systems.txt` and pressing **Generate Summary** shows a spinner, then bullet points
- [ ] Bullets are in simple language and match the notes (no invented facts)
- [ ] **Copy summary** changes to "Copied!" and pasting elsewhere gives the bullets
- [ ] Typing fewer than 30 characters keeps the button disabled and shows a hint
- [ ] The character counter turns red above 20,000 characters and the button is disabled
- [ ] Stop the backend and press Generate: a friendly "Cannot reach the server" message appears (no crash)
- [ ] Hinglish sample (case 3) returns a summary in the same language
- [ ] Prompt-injection sample (case 4) is summarised normally, with no poem

## 3. Quiz

- [ ] Notes from the Summarizer page are already filled in on the Quiz page
- [ ] Choosing 5 / 10 / 15 highlights the selected button
- [ ] **Generate Quiz** shows a loading state, then the questions
- [ ] Every question has exactly 4 options
- [ ] **Submit quiz** stays disabled until every question is answered
- [ ] After submitting: the score, a percentage, the correct answer in green, wrong choices in red, and an explanation for every question
- [ ] **Retake this quiz** clears the answers; **New quiz** goes back to the setup screen
- [ ] Very short notes (case 2) with 15 questions show a yellow warning that fewer questions were made

## 4. Saved Notes

- [ ] On the Summarizer page, **Save note** (with a title) shows a green success message
- [ ] Saving without a title uses the first line of the notes as the title
- [ ] The note appears on the **Saved Notes** page, newest first
- [ ] **View** shows both the summary and the original notes; **Hide** collapses it
- [ ] **Delete** asks for confirmation, then removes the note from the list
- [ ] With no notes, the empty state with a "Summarize notes" button appears
- [ ] Check the data in MongoDB Atlas > Browse Collections > `notes`

## 5. Error handling and security

- [ ] http://localhost:5000/api/nope returns `{"error":"Route not found..."}` with status 404
- [ ] Invalid note id: `DELETE /api/notes/abc` returns 400
- [ ] A request body over 200 KB returns 413 (no crash)
- [ ] A wrong `GEMINI_API_KEY` shows "The AI service rejected the API key" (the key itself is never shown)
- [ ] `git status` does **not** list `backend/.env`
- [ ] Searching the frontend build (`frontend/dist`) for your API key finds nothing

## 6. Responsive design

Open browser DevTools (F12) > device toolbar and check these widths:

- [ ] 375 px (phone): navbar becomes a menu button, columns stack, nothing scrolls sideways
- [ ] 768 px (tablet): layout is readable, buttons are easy to tap
- [ ] 1280 px (desktop): Summarizer shows input and output side by side

## 7. Test the API without the frontend (Thunder Client / curl)

```bash
curl -X POST http://localhost:5000/api/ai/summarize \
  -H "Content-Type: application/json" \
  -d '{"notes":"A process is a program in execution. Threads share memory inside a process."}'

curl -X POST http://localhost:5000/api/ai/quiz \
  -H "Content-Type: application/json" \
  -d '{"notes":"A process is a program in execution. Threads share memory inside a process.","numQuestions":5}'

curl http://localhost:5000/api/notes
```
