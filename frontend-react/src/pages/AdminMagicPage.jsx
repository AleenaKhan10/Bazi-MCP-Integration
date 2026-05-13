import { useState, useEffect } from 'react'
import DOBPicker from '../components/DOBPicker'
import CountryCityPicker from '../components/CountryCityPicker'

/* ---- Floating Chinese Characters ---- */
const floatingChars = [
  { char: '命', size: 80, top: '8%', left: '5%', delay: '0s' },
  { char: '運', size: 60, top: '15%', right: '8%', delay: '2s' },
  { char: '八', size: 95, top: '30%', left: '3%', delay: '4s', gold: true },
  { char: '字', size: 70, top: '55%', right: '4%', delay: '6s' },
  { char: '陰', size: 50, top: '70%', left: '8%', delay: '8s' },
  { char: '陽', size: 55, top: '78%', right: '10%', delay: '3s', gold: true },
]

export default function AdminMagicPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authForm, setAuthForm] = useState({ email: '', password: '' })
  const [authError, setAuthError] = useState('')

  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    gender: '',
    birthMonth: '',
    birthDay: '',
    birthYear: '',
    birthTime: '',
    country: '',
    state: '',
    city: ''
  })
  
  const [errors, setErrors] = useState({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateError, setGenerateError] = useState('')

  useEffect(() => {
    document.title = "Admin - Magic PDF Generator"
  }, [])

  // --- Auth Handlers ---
  const handleAuthChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value })
  }

  const handleAuthSubmit = (e) => {
    e.preventDefault()
    if (!authForm.email || !authForm.password) {
      setAuthError('Please enter both email and password.')
      return
    }
    // Simple frontend toggle - actual validation happens on the backend during generation
    setIsAuthenticated(true)
  }

  // --- Form Handlers ---
  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }))
  }

  const handleCountryChange = (e) => {
    setFormData((prev) => ({ ...prev, country: e.target.value, state: '', city: '' }))
    if (errors.country) setErrors((prev) => ({ ...prev, country: null }))
  }

  const handleStateChange = (e) => {
    setFormData((prev) => ({ ...prev, state: e.target.value, city: '' }))
    if (errors.state) setErrors((prev) => ({ ...prev, state: null }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'Required'
    if (!formData.gender) newErrors.gender = 'Required'
    if (!formData.birthMonth) newErrors.month = 'Required'
    if (!formData.birthDay) newErrors.day = 'Required'
    if (!formData.birthYear) newErrors.year = 'Required'
    if (!formData.birthTime) newErrors.birthTime = 'Required'
    if (!formData.country) newErrors.country = 'Required'
    if (!formData.city) newErrors.city = 'Required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setIsGenerating(true)
    setGenerateError('')

    // Format date as YYYY-MM-DD
    const pad = (n) => n.toString().padStart(2, '0')
    const birthDateStr = `${formData.birthYear}-${pad(formData.birthMonth)}-${pad(formData.birthDay)}`
    const locationStr = `${formData.city}, ${formData.country}`

    const payload = {
      admin_email: authForm.email,
      admin_password: authForm.password,
      name: formData.firstName,
      email: formData.email || null, // Email is optional for manual generation
      gender: formData.gender,
      birth_date: birthDateStr,
      birth_time: formData.birthTime,
      location: locationStr,
      output_format: 'both'
    }

    try {
      // Assuming backend is proxying /api/
      const response = await fetch('/api/admin/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false)
          setAuthError('Invalid admin credentials. Please try again.')
          throw new Error('Unauthorized')
        }
        const errorData = await response.json()
        throw new Error(errorData.detail?.error || errorData.detail || 'Failed to generate report')
      }

      // Download the PDF Blob
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${formData.firstName}_BaZi_Report.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

    } catch (err) {
      if (err.message !== 'Unauthorized') {
        setGenerateError(err.message)
      }
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="landing-hero min-h-screen">
      {/* Floating Chinese Characters */}
      <div className="floating-chars" aria-hidden="true">
        {floatingChars.map((fc, i) => (
          <span
            key={i}
            className={`floating-char ${fc.gold ? 'gold' : ''}`}
            style={{ fontSize: `${fc.size}px`, top: fc.top, left: fc.left, right: fc.right, animationDelay: fc.delay }}
          >
            {fc.char}
          </span>
        ))}
      </div>

      <div className="headline-glow" aria-hidden="true" />

      <div className="landing-content pt-20 pb-20">
        <h1 className="font-mystical text-gold-gradient animate-fade-in-up text-center mb-4" style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800 }}>
          Admin Magic Portal
        </h1>
        <p className="landing-subtitle text-center mb-8 animate-fade-in-up-delay-1">
          Generate full BaZi reports manually without payment.
        </p>

        {!isAuthenticated ? (
          /* --- AUTH FORM --- */
          <form onSubmit={handleAuthSubmit} className="landing-form animate-fade-in-up-delay-2 mx-auto max-w-md">
            <div className="mb-4">
              <span className="form-label">Admin Email ✦</span>
              <input
                type="text"
                name="email"
                value={authForm.email}
                onChange={handleAuthChange}
                className="input-mystical"
                placeholder="admin@example.com"
              />
            </div>
            <div className="mb-6">
              <span className="form-label">Admin Password ✦</span>
              <input
                type="password"
                name="password"
                value={authForm.password}
                onChange={handleAuthChange}
                className="input-mystical"
                placeholder="••••••••"
              />
            </div>
            {authError && <p className="text-error text-sm mb-4 text-center">{authError}</p>}
            <button type="submit" className="cta-button w-full">
              Enter Portal
            </button>
          </form>
        ) : (
          /* --- GENERATION FORM --- */
          <form onSubmit={handleGenerate} noValidate className="landing-form animate-fade-in-up-delay-2 mx-auto max-w-2xl">
            {/* Row 1: Name + Email */}
            <div className="form-row-2col" style={{ marginBottom: '24px' }}>
              <div>
                <span className="form-label">Client Name ✦</span>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange('firstName')}
                  placeholder="John"
                  className={`input-mystical ${errors.firstName ? 'input-error' : ''}`}
                />
              </div>
              <div>
                <span className="form-label">Email (Optional) ✦</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  placeholder="Only if you want it on record"
                  className="input-mystical"
                />
              </div>
            </div>

            {/* Row 2: Gender + Birth Time */}
            <div className="form-row-2col" style={{ marginBottom: '24px' }}>
              <div>
                <span className="form-label">Gender ✦</span>
                <div className="flex gap-3 mt-1">
                  {['male', 'female'].map((g) => (
                    <label
                      key={g}
                      className={`
                        flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-lg cursor-pointer transition-all border
                        ${formData.gender === g
                          ? 'border-accent-purple/60 bg-accent-purple/10 text-white'
                          : 'border-white/8 bg-white/3 text-text-muted hover:border-accent-purple/30'
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
                      <span className="capitalize font-medium text-sm">{g}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <span className="form-label">Birth Time ✦</span>
                <input
                  type="time"
                  value={formData.birthTime}
                  onChange={handleChange('birthTime')}
                  className={`input-mystical ${errors.birthTime ? 'input-error' : ''}`}
                />
              </div>
            </div>

            {/* Row 3: Date of Birth */}
            <div style={{ marginBottom: '24px' }}>
              <DOBPicker
                month={formData.birthMonth}
                day={formData.birthDay}
                year={formData.birthYear}
                onMonthChange={handleChange('birthMonth')}
                onDayChange={handleChange('birthDay')}
                onYearChange={handleChange('birthYear')}
                errors={{ month: errors.month, day: errors.day, year: errors.year }}
              />
            </div>

            {/* Row 4: Country + City */}
            <div style={{ marginBottom: '32px' }}>
              <CountryCityPicker
                country={formData.country}
                state={formData.state}
                city={formData.city}
                onCountryChange={handleCountryChange}
                onStateChange={handleStateChange}
                onCityChange={handleChange('city')}
                errors={{ country: errors.country, city: errors.city }}
              />
            </div>

            {generateError && (
              <div className="mb-6 p-4 rounded-lg bg-red-900/40 border border-red-500/50 text-center">
                <p className="text-red-200 text-sm">{generateError}</p>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full flex flex-col items-center justify-center rounded-xl border-2 border-[#b48e3e] bg-transparent py-4 px-6 text-[#b48e3e] hover:bg-[#b48e3e]/10 transition-all duration-300"
              disabled={isGenerating}
              style={{ opacity: isGenerating ? 0.7 : 1, cursor: isGenerating ? 'not-allowed' : 'pointer' }}
            >
              <span className="text-xl md:text-2xl font-bold tracking-wide">
                {isGenerating ? 'GENERATING PDF...' : 'DOWNLOAD PDF NOW'}
              </span>
              <span className="text-xs md:text-sm font-medium tracking-widest text-[#b48e3e]/80 mt-1 uppercase">
                {isGenerating ? 'Please wait 30-40 seconds' : 'Direct Download • No Payment Required'}
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
