/* ===========================================
   Landing Page — Immersive Full-Screen Design
   No cards/boxes — form on cosmic background
   Floating Chinese chars, bold headlines, 
   vibrant CTA, benefits section below
   =========================================== */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'
import FormInput from '../components/FormInput'
import DOBPicker from '../components/DOBPicker'
import CountryCityPicker from '../components/CountryCityPicker'

// Dictionary of common email domain typos to catch before submission
const COMMON_EMAIL_TYPOS = {
  'gnail.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yhoo.com': 'yahoo.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'iclud.com': 'icloud.com',
  'icloud.co': 'icloud.com'
}

/* ---- Floating Chinese Characters ---- */
const floatingChars = [
  { char: '命', size: 80, top: '8%', left: '5%', delay: '0s' },
  { char: '運', size: 60, top: '15%', right: '8%', delay: '2s' },
  { char: '八', size: 95, top: '30%', left: '3%', delay: '4s', gold: true },
  { char: '字', size: 70, top: '55%', right: '4%', delay: '6s' },
  { char: '陰', size: 50, top: '70%', left: '8%', delay: '8s' },
  { char: '陽', size: 55, top: '78%', right: '10%', delay: '3s', gold: true },
  { char: '木', size: 45, top: '25%', right: '15%', delay: '5s' },
  { char: '火', size: 40, top: '45%', left: '6%', delay: '7s' },
  { char: '金', size: 48, top: '88%', left: '15%', delay: '1s', gold: true },
  { char: '水', size: 42, top: '60%', right: '6%', delay: '9s' },
  { char: '土', size: 38, top: '40%', right: '2%', delay: '4s' },
  { char: '龍', size: 65, top: '5%', left: '18%', delay: '7s', gold: true },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { formData, setFormData } = useQuiz()
  const [errors, setErrors] = useState({})

  useEffect(() => {
    document.title = "Get Your FREE BaZi Reading!"
  }, [])

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  // When country changes → clear BOTH state AND city (cascade reset)
  const handleCountryChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      country: e.target.value,
      state: '',   // Clear state when country changes
      city: '',    // Clear city when country changes
    }))
    if (errors.country) {
      setErrors((prev) => ({ ...prev, country: null }))
    }
  }

  // When state changes → clear city only
  const handleStateChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      state: e.target.value,
      city: '',    // Clear city when state changes
    }))
    if (errors.state) {
      setErrors((prev) => ({ ...prev, state: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'Name must be at least 2 characters'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    } else {
      const parts = formData.email.trim().split('@')
      if (parts.length === 2) {
        const domain = parts[1].toLowerCase()
        if (COMMON_EMAIL_TYPOS[domain]) {
          const expected = COMMON_EMAIL_TYPOS[domain]
          newErrors.email = `Did you mean ${parts[0]}@${expected}? Please correct.`
        }
      }
    }
    if (!formData.gender) newErrors.gender = 'Please select your gender'
    if (!formData.birthMonth) newErrors.month = 'Required'
    if (!formData.birthDay) newErrors.day = 'Required'
    if (!formData.birthYear) newErrors.year = 'Required'
    if (!formData.birthTime) newErrors.birthTime = 'Birth time is required'
    if (!formData.country) newErrors.country = 'Please select your birth country'
    if (!formData.city) newErrors.city = 'Please select your birth city'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) {
      const firstError = document.querySelector('.text-error')
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }
    navigate('/loading')
  }

  return (
    <>
      {/* ====== HERO SECTION — Full screen ====== */}
      <div className="landing-hero">

        {/* Floating Chinese Characters */}
        <div className="floating-chars" aria-hidden="true">
          {floatingChars.map((fc, i) => (
            <span
              key={i}
              className={`floating-char ${fc.gold ? 'gold' : ''}`}
              style={{
                fontSize: `${fc.size}px`,
                top: fc.top,
                left: fc.left,
                right: fc.right,
                animationDelay: fc.delay,
              }}
            >
              {fc.char}
            </span>
          ))}
        </div>

        {/* Headline glow */}
        <div className="headline-glow" aria-hidden="true" />

        {/* ====== CONTENT — Headline + Form ====== */}
        <div className="landing-content">


          {/* Bold Headline */}
          <h1
            className="font-mystical text-gold-gradient animate-fade-in-up"
            style={{
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '16px',
            }}
          >
            Unlock Your "Life Energy" Signature And It's Invisible Imprint On The World
          </h1>

          {/* Subtitle — bigger font, bold+italic key words */}
          <p className="landing-subtitle animate-fade-in-up-delay-1" style={{ fontSize: 'clamp(16px, 2.5vw, 22px)' }}>
            And discover simple <strong>"Energy Adjustments"</strong> that can <strong><em>Shift</em></strong> you
            to a <strong><em>Lifeline</em></strong> of prosperity & abundance in just 5 minutes a day
          </p>

          {/* Ornamental divider */}
          <div className="ornament-divider mx-auto mt-4 mb-6 max-w-[250px] animate-fade-in-up-delay-1">
            <span>✦</span>
          </div>

          {/* ====== FORM — Open layout on background ====== */}
          <form onSubmit={handleSubmit} noValidate className="landing-form animate-fade-in-up-delay-2">

            {/* Row 1: Name + Email */}
            <div className="form-row-2col" style={{ marginBottom: '28px' }}>
              <div>
                <span className="form-label">Your First Name ✦</span>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange('firstName')}
                  placeholder="John"
                  className={`input-mystical ${errors.firstName ? 'input-error' : ''}`}
                />
                {errors.firstName && <p className="text-xs text-error mt-1">⚠ {errors.firstName}</p>}
              </div>
              <div>
                <span className="form-label">Email Address ✦</span>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  placeholder="johndoe@example.com"
                  className={`input-mystical ${errors.email ? 'input-error' : ''}`}
                />
                {errors.email 
                  ? <p className="text-xs text-error mt-1">⚠ {errors.email}</p>
                  : <p className="text-xs text-text-dim mt-1" style={{ opacity: 0.5 }}>Your report will be delivered here</p>
                }
              </div>
            </div>

            {/* Row 2: Gender + Birth Time */}
            <div className="form-row-2col" style={{ marginBottom: '28px' }}>
              <div>
                <span className="form-label">Gender ✦</span>
                <div className="flex gap-3 mt-1">
                  {['male', 'female'].map((g) => (
                    <label
                      key={g}
                      className={`
                        flex-1 flex items-center justify-center gap-2
                        px-3 py-3.5 rounded-lg cursor-pointer
                        transition-all duration-300 border
                        ${formData.gender === g
                          ? 'border-accent-purple/60 bg-accent-purple/10 text-white shadow-[0_0_20px_rgba(139,92,246,0.15)]'
                          : 'border-white/8 bg-white/3 text-text-muted hover:border-accent-purple/30 hover:bg-accent-purple/5'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={formData.gender === g}
                        onChange={handleChange('gender')}
                        className="sr-only"
                      />
                      <span className="text-lg">{g === 'male' ? '♂' : '♀'}</span>
                      <span className="capitalize font-medium text-sm">{g}</span>
                    </label>
                  ))}
                </div>
                {errors.gender && <p className="text-xs text-error mt-1">⚠ {errors.gender}</p>}
              </div>

              <div>
                <span className="form-label">Birth Time ✦</span>
                <input
                  type="time"
                  id="birthTime"
                  value={formData.birthTime}
                  onChange={handleChange('birthTime')}
                  className={`input-mystical ${errors.birthTime ? 'input-error' : ''}`}
                />
                {errors.birthTime 
                  ? <p className="text-xs text-error mt-1">⚠ {errors.birthTime}</p>
                  : <p className="text-xs text-text-dim mt-1" style={{ opacity: 0.5 }}>24-hour format (e.g., 14:30)</p>
                }
              </div>
            </div>

            {/* Row 3: Date of Birth */}
            <div style={{ marginBottom: '28px' }}>
              <DOBPicker
                month={formData.birthMonth}
                day={formData.birthDay}
                year={formData.birthYear}
                onMonthChange={handleChange('birthMonth')}
                onDayChange={handleChange('birthDay')}
                onYearChange={handleChange('birthYear')}
                errors={{
                  month: errors.month,
                  day: errors.day,
                  year: errors.year,
                }}
              />
            </div>

            {/* Row 4: Country + City */}
            <div style={{ marginBottom: '36px' }}>
              <CountryCityPicker
                country={formData.country}
                state={formData.state}
                city={formData.city}
                onCountryChange={handleCountryChange}
                onStateChange={handleStateChange}
                onCityChange={handleChange('city')}
                errors={{
                  country: errors.country,
                  state: errors.state,
                  city: errors.city,
                }}
              />
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              className="btn-mystical w-full"
            >
              ✦ Begin Your Free “Life Energy Chart Reading” Now
            </button>

            {/* Trust badge */}
            <p className="text-center mt-4" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
              🔒 Your information is 100% secure and will never be shared
            </p>
          </form>
        </div>
      </div>
    </>
  )
}
