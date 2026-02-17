/* ===========================================
   QuizContext — Shared State Across All Pages
   ===========================================
   
   WHY THIS EXISTS:
   The quiz funnel has 4 pages. User fills form on page 1 (Landing),
   but we need that data on page 2 (Loading), page 3 (Reading), 
   and page 4 (Closing). React Context shares state without 
   passing props everywhere.
   
   WHAT IT STORES:
   - formData: all form fields (name, email, DOB, etc.)
   - baziResult: BaZi calculation result from backend
   - dayMaster: the specific Day Master (e.g., "壬" = Yang Water)
   - currentStep: which page we're on (1-4)
   - isLoading: whether backend is processing
   
   HOW TO USE:
   In any component:
     import { useQuiz } from '../context/QuizContext'
     const { formData, setFormData, baziResult } = useQuiz()
*/

import { createContext, useContext, useState } from 'react'

// -------------------------------------------
// 1. Create the Context object
// -------------------------------------------
const QuizContext = createContext(null)

// -------------------------------------------
// 2. Provider Component (wraps the whole app)
// -------------------------------------------
export function QuizProvider({ children }) {
  // Form data from Landing Page
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    gender: '',
    birthMonth: '',
    birthDay: '',
    birthYear: '',
    birthTime: '',
    country: '',
    city: '',
  })

  // BaZi calculation result from backend
  const [baziResult, setBaziResult] = useState(null)

  // Loading state (for Loading Page)
  const [isLoading, setIsLoading] = useState(false)

  // Error state
  const [error, setError] = useState(null)

  // -------------------------------------------
  // Helper: Get formatted birth date (YYYY-MM-DD)
  // Backend expects this format
  // -------------------------------------------
  const getFormattedBirthDate = () => {
    const { birthYear, birthMonth, birthDay } = formData
    if (!birthYear || !birthMonth || !birthDay) return ''
    // Pad month and day with leading zeros: "3" → "03"
    const month = birthMonth.padStart(2, '0')
    const day = birthDay.padStart(2, '0')
    return `${birthYear}-${month}-${day}`
  }

  // -------------------------------------------
  // Helper: Get location string for backend
  // Backend expects "City, Country" format
  // -------------------------------------------
  const getLocationString = () => {
    const { city, country } = formData
    if (!city || !country) return ''
    return `${city}, ${country}`
  }

  // -------------------------------------------
  // Helper: Extract Day Master from BaZi result
  // -------------------------------------------
  const getDayMaster = () => {
    if (!baziResult) return null
    return baziResult['日主'] || null
  }

  // -------------------------------------------
  // Reset everything (for "Generate New Report")
  // -------------------------------------------
  const resetQuiz = () => {
    setFormData({
      firstName: '',
      email: '',
      gender: '',
      birthMonth: '',
      birthDay: '',
      birthYear: '',
      birthTime: '',
      country: '',
      city: '',
    })
    setBaziResult(null)
    setIsLoading(false)
    setError(null)
  }

  // -------------------------------------------
  // Bundle everything into the context value
  // -------------------------------------------
  const value = {
    formData,
    setFormData,
    baziResult,
    setBaziResult,
    isLoading,
    setIsLoading,
    error,
    setError,
    getFormattedBirthDate,
    getLocationString,
    getDayMaster,
    resetQuiz,
  }

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  )
}

// -------------------------------------------
// 3. Custom Hook (easy import everywhere)
// -------------------------------------------
// Usage: const { formData, setFormData } = useQuiz()
export function useQuiz() {
  const context = useContext(QuizContext)
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider')
  }
  return context
}
