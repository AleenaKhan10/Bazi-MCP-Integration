/* ===========================================
   App.jsx — Root Component + Router Setup
   ===========================================
   
   This is the top-level component that:
   1. Wraps everything in QuizProvider (shared state)
   2. Sets up React Router with 4 routes
   
   ROUTES:
   /         → LandingPage  (form)
   /loading  → LoadingPage  (progress bar + API call)
   /reading  → ReadingPage  (Day Master reading)
   /closing  → ClosingPage  (CTA + report generation)
   
   NOTE: Each page has guards that redirect to "/"
   if required data is missing (e.g., user directly
   navigates to /reading without filling the form).
*/

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QuizProvider } from './context/QuizContext'
import LandingPage from './pages/LandingPage'
import LoadingPage from './pages/LoadingPage'
import ReadingPage from './pages/ReadingPage'
import ClosingPage from './pages/ClosingPage'

export default function App() {
  return (
    // QuizProvider wraps everything →
    // all pages can access shared state via useQuiz()
    <QuizProvider>
      <BrowserRouter>
        <Routes>
          {/* Step 1: Landing (Form) */}
          <Route path="/" element={<LandingPage />} />

          {/* Step 2: Loading (Progress + API) */}
          <Route path="/loading" element={<LoadingPage />} />

          {/* Step 3: Reading (Day Master) */}
          <Route path="/reading" element={<ReadingPage />} />

          {/* Step 4: Closing (CTA + Report) */}
          <Route path="/closing" element={<ClosingPage />} />

          {/* Fallback: redirect unknown routes to landing */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </QuizProvider>
  )
}
