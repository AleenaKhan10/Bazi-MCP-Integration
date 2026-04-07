/* ===========================================
   Loading Page — Dynamic User Data Messages
   =========================================== 
   
   Changes from video feedback:
   - Dynamic rotating text with actual user data
   - Sequential message cycling (not random)
   - Crystal ball GIF placeholder (user will provide final)
   - Removed "cosmic alignment" + "consulting stars" (done in MysticalLoader)
   - 3x thicker progress bar (done in CSS)
   
   BACKEND CONNECTIVITY: Unchanged. getBaziOnly() call identical.
*/

import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'
import { getBaziOnly } from '../api/client'
import MysticalLoader from '../components/MysticalLoader'

// Month names for formatting
const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function LoadingPage() {
  const navigate = useNavigate()
  const { formData, setBaziResult } = useQuiz()
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState(null)
  const apiCalled = useRef(false)

  useEffect(() => {
    document.title = "Analyzing Your Chart..."
  }, [])

  // --- Build dynamic loading messages from user's form data ---
  const firstName = formData.firstName || 'Your'
  const monthNum = parseInt(formData.birthMonth) || 1
  const monthName = MONTH_NAMES[monthNum] || 'January'
  const day = formData.birthDay || '1'
  const year = formData.birthYear || '1990'
  const time = formData.birthTime || '12:00'
  const country = formData.country || ''
  const state = formData.state || ''
  const city = formData.city || ''

  // Build location string for message iii
  const locationParts = [country, state, city].filter(Boolean)
  const locationString = locationParts.join(', ')

  // The 4 exact messages from the video/document:
  // i)  Calculating %FIRSTNAME%'s "Life Energy Chart"...
  // ii) Born on %MONTH-DAY-YEAR% at %BIRTH TIMING%...
  // iii)Born in %BIRTH COUNTRY%, %BIRTH STATE%, %BIRTH CITY%...
  // iv) Finalizing last few details...
  const LOADING_MESSAGES = [
    `Calculating ${firstName}'s "Life Energy Chart"...`,
    `Born on ${monthName} ${day}, ${year} at ${time}...`,
    `Born in ${locationString}...`,
    `Finalizing last few details...`,
  ]

  // Guard: redirect if no form data
  useEffect(() => {
    if (!formData.firstName) {
      navigate('/')
    }
  }, [formData.firstName, navigate])

  useEffect(() => {
    if (apiCalled.current || !formData.firstName) return
    apiCalled.current = true

    // API call (UNCHANGED from before)
    getBaziOnly({
      name: formData.firstName,
      gender: formData.gender,
      birthDate: `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`,
      birthTime: formData.birthTime,
      // Location string — include state if available for better geocoding
      location: (formData.city && formData.country) 
        ? formData.state
          ? `${formData.city}, ${formData.state}, ${formData.country}`
          : `${formData.city}, ${formData.country}`
        : 'Unknown Location',
    })
      .then((result) => {
        if (result.success && result.bazi_data) {
          setBaziResult(result.bazi_data)
        } else {
          throw new Error('Invalid data received')
        }

        setIsComplete(true) // Triggers 100% in loader
        setTimeout(() => navigate('/intro'), 1500)
      })
      .catch((err) => {
        setError(err.message)
        // Fallback: still navigate with mock if needed
        setBaziResult({ '日主': '庚', '八字': 'N/A' })
        setIsComplete(true)
        setTimeout(() => navigate('/intro'), 1500)
      })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        
        {/* ====== Loading Animation GIF ====== */}
        <div className="mb-8 flex justify-center animate-fade-in-up">
          <img 
            src="/loading_page.png" 
            alt="Loading Animation" 
            className="w-36 h-36 object-contain"
            style={{ animation: 'rotateSlow 4s linear infinite' }}
          />
        </div>

        {/* ====== Title ====== */}
        <h2 className="text-2xl font-mystical font-bold text-gold-gradient mb-8 animate-fade-in-up-delay-1">
          Preparing Your Reading...
        </h2>

        {/* ====== Mystical Loader ====== */}
        <MysticalLoader 
            messages={LOADING_MESSAGES} 
            duration={25}
            progress={isComplete ? 100 : undefined} 
        />

        {/* ====== Error ====== */}
        {error && (
          <div className="mt-4 glass-card-inner p-3">
            <p className="text-xs text-accent-gold">
              ✦ Using cached wisdom — your reading continues...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
