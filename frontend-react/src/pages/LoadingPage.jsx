/* ===========================================
   Loading Page — Mystical Celestial Design
   =========================================== */

import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'
import { getBaziOnly } from '../api/client'
import MysticalLoader from '../components/MysticalLoader'

const LOADING_MESSAGES = [
  "Aligning the cosmic energies...",
  "Mapping the Four Pillars of Destiny 四柱命理...",
  "Extracting your Day Master element...",
  "Consulting the ancient wisdom of BaZi...",
  "Calculating Heavenly Stems interactions...",
  "Balancing Yin and Yang forces...",
  "Determining the strength of your Chart..."
]

export default function LoadingPage() {
  const navigate = useNavigate()
  const { formData, setBaziResult } = useQuiz()
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState(null)
  const apiCalled = useRef(false)

  // Guard: redirect if no form data
  useEffect(() => {
    if (!formData.firstName) {
      navigate('/')
    }
  }, [formData.firstName, navigate])

  useEffect(() => {
    if (apiCalled.current || !formData.firstName) return
    apiCalled.current = true

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
        
        {/* ====== Title ====== */}
        <h2 className="text-2xl font-mystical font-bold text-gold-gradient mb-8 animate-fade-in-up-delay-1">
          Preparing Your Reading...
        </h2>

        {/* ====== Mystical Loader ====== */}
        <MysticalLoader 
            messages={LOADING_MESSAGES} 
            duration={25} // 25 seconds for Day Master calc
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
