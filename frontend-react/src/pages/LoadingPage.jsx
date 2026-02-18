/* ===========================================
   Loading Page — Mystical Celestial Design
   =========================================== */

import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'
import { getBaziOnly } from '../api/client'

const MONTH_NAMES = {
  1: 'January', 2: 'February', 3: 'March', 4: 'April',
  5: 'May', 6: 'June', 7: 'July', 8: 'August',
  9: 'September', 10: 'October', 11: 'November', 12: 'December',
}

export default function LoadingPage() {
  const navigate = useNavigate()
  const { formData, setBaziResult } = useQuiz()
  const [progress, setProgress] = useState(0)
  const [currentMessage, setCurrentMessage] = useState('')
  const [error, setError] = useState(null)
  const apiCalled = useRef(false)

  // Guard: redirect if no form data
  useEffect(() => {
    if (!formData.firstName) {
      navigate('/')
    }
  }, [formData.firstName, navigate])

  const getMessages = () => {
    const monthName = MONTH_NAMES[parseInt(formData.birthMonth)] || ''
    return [
      { text: `Aligning the cosmic energies for ${formData.firstName}...`, at: 10 },
      { text: `Birth: ${monthName} ${formData.birthDay}, ${formData.birthYear} at ${formData.birthTime}...`, at: 25 },
      { text: `Origin: ${formData.city}, ${formData.country}...`, at: 40 },
      { text: 'Mapping the Four Pillars of Destiny 四柱命理...', at: 55 },
      { text: 'Extracting your Day Master element...', at: 70 },
      { text: 'Consulting the ancient wisdom of BaZi...', at: 85 },
      { text: 'Finalizing your celestial reading...', at: 95 },
    ]
  }

  useEffect(() => {
    if (apiCalled.current || !formData.firstName) return
    apiCalled.current = true

    const messages = getMessages()
    let progressInterval

    // Animate progress
    progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) { clearInterval(progressInterval); return 90 }
        const newProgress = prev + 0.5
        const msg = [...messages].reverse().find((m) => newProgress >= m.at)
        if (msg) setCurrentMessage(msg.text)
        return newProgress
      })
    }, 80)

    // API call
    getBaziOnly({
      name: formData.firstName,
      gender: formData.gender,
      birthDate: `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`,
      birthTime: formData.birthTime,
      location: (formData.city && formData.country) 
        ? `${formData.city}, ${formData.country}` 
        : 'Unknown Location',
    })
      .then((result) => {
        clearInterval(progressInterval)
        
        if (result.success && result.bazi_data) {
          setBaziResult(result.bazi_data)
        } else {
          // Fallback if data is missing
          throw new Error('Invalid data received')
        }

        setProgress(100)
        setCurrentMessage('✦ Your reading is ready!')
        setTimeout(() => navigate('/reading'), 800)
      })
      .catch((err) => {
        clearInterval(progressInterval)
        setError(err.message)
        // Fallback: still navigate with mock
        setBaziResult({ '日主': '庚', '八字': 'N/A' })
        setProgress(100)
        setTimeout(() => navigate('/reading'), 1500)
      })

    return () => clearInterval(progressInterval)
  }, [])

  const clampedProgress = Math.min(100, Math.max(0, progress))

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">

        {/* ====== Animated Symbol ====== */}
        <div className="relative mb-10 animate-fade-in-up">
          {/* Outer rotating ring */}
          <div className="w-28 h-28 mx-auto relative">
            <div className="absolute inset-0 rounded-full border border-accent-gold/20 animate-rotate-slow"></div>
            <div className="absolute inset-2 rounded-full border border-dashed border-accent-gold/10"
                 style={{ animation: 'rotateSlow 20s linear infinite reverse' }}></div>
            
            {/* Center glow */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-accent-gold/15 to-accent-gold/5 flex items-center justify-center glow-gold">
              <span className="chinese-char-small text-accent-gold-light">命</span>
            </div>
          </div>

          {/* Decorative dots */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-gold/40 animate-float"></div>
          </div>
        </div>

        {/* ====== Title ====== */}
        <h2 className="text-2xl font-mystical font-bold text-gold-gradient mb-8 animate-fade-in-up-delay-1">
          Preparing Your Reading...
        </h2>

        {/* ====== Progress Bar ====== */}
        <div className="mb-6 animate-fade-in-up-delay-2">
          <div className="progress-mystical mb-3">
            <div
              className="progress-mystical-fill"
              style={{ width: `${clampedProgress}%` }}
            ></div>
          </div>
          <span className="text-accent-gold font-medium text-sm">{Math.round(clampedProgress)}%</span>
        </div>

        {/* ====== Status Message ====== */}
        <div className="h-12 flex items-center justify-center animate-fade-in-up-delay-3">
          <p className="text-text-muted text-sm leading-relaxed transition-all duration-500">
            {currentMessage || 'Initiating cosmic alignment...'}
          </p>
        </div>

        {/* ====== Error ====== */}
        {error && (
          <div className="mt-4 glass-card-inner p-3">
            <p className="text-xs text-accent-gold">
              ✦ Using cached wisdom — your reading continues...
            </p>
          </div>
        )}

        {/* Bottom decoration */}
        <div className="mt-12 opacity-20">
          <p className="text-xs text-accent-gold tracking-[0.3em] font-mystical">
            四柱命理 · FOUR PILLARS
          </p>
        </div>
      </div>
    </div>
  )
}
