/* ===========================================
   Reading Page — Full Day Master Detail Reading
   ===========================================
   
   This page shows the FULL personalized Day Master
   reading after the user clicks "REVEAL MY DAYMASTER
   READING" on the Intro page.
   
   ROUTE: /reading
   PREV: /intro (Intro Reading Page)
   NEXT: /closing (CTA + Report)
   
   Content comes from dayMasterReadings.js (long-form)
   and dayMasters.js (element styling + metadata).
*/

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'
import DAY_MASTERS from '../data/dayMasters'
import DAY_MASTER_READINGS from '../data/dayMasterReadings'

// Map element names to CSS classes
const ELEMENT_STYLES = {
  Wood: { pill: 'element-pill-wood', text: 'text-wood', glow: 'rgba(34, 197, 94, 0.15)' },
  Fire: { pill: 'element-pill-fire', text: 'text-fire', glow: 'rgba(239, 68, 68, 0.15)' },
  Earth: { pill: 'element-pill-earth', text: 'text-earth', glow: 'rgba(217, 119, 6, 0.15)' },
  Metal: { pill: 'element-pill-metal', text: 'text-metal', glow: 'rgba(234, 179, 8, 0.15)' },
  Water: { pill: 'element-pill-water', text: 'text-water', glow: 'rgba(59, 130, 246, 0.15)' },
}

export default function ReadingPage() {
  const navigate = useNavigate()
  const { formData, baziResult } = useQuiz()

  // Guard
  useEffect(() => {
    if (!formData.firstName || !baziResult) {
      navigate('/')
    }
  }, [formData.firstName, baziResult, navigate])

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (!baziResult) return null

  // Get Day Master data
  const dayMasterChar = baziResult['日主'] || '庚'
  const master = DAY_MASTERS[dayMasterChar] || DAY_MASTERS['庚']
  const reading = DAY_MASTER_READINGS[dayMasterChar] || DAY_MASTER_READINGS['庚']
  const elemStyle = ELEMENT_STYLES[master.element] || ELEMENT_STYLES.Metal

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">

        {/* ====== Header ====== */}
        <div className="text-center mb-4 animate-fade-in-up">
          <p className="text-xl font-mystical font-bold text-white mb-3">Your Day Master is...</p>
          <h1 className="text-3xl md:text-4xl font-mystical font-bold text-text-primary mb-2">
            {reading.name.toUpperCase()}
          </h1>
          <p className="text-text-muted text-lg font-mystical">
            {reading.subtitle}
          </p>
        </div>

        {/* ====== Day Master Card (kept from original) ====== */}
        <div
          className="glass-card p-8 text-center mb-8 animate-fade-in-up-delay-1 glow-gold-strong"
          style={{ background: `linear-gradient(135deg, ${elemStyle.glow}, rgba(15, 22, 41, 0.95))` }}
        >
          {/* Day Master Illustration */}
          <div className="mb-5">
            <img
              src="/day-master-illustration.jpeg"
              alt={`${master.title} - Day Master Illustration`}
              className="rounded-xl mx-auto shadow-lg"
              style={{ maxHeight: '280px', objectFit: 'contain' }}
            />
          </div>

          {/* Chinese character — big and glowing */}
          <div className="mb-4">
            <span className="chinese-char text-text-primary">{master.chinese}</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-mystical font-bold text-gold-gradient mb-2">
            {master.title}
          </h2>
          <p className="text-text-muted text-sm">
            {master.pinyin} • {master.polarity} {master.element}
          </p>

          {/* Ornamental divider */}
          <div className="ornament-divider max-w-xs mx-auto my-6">
            <span>☯</span>
          </div>

          {/* Element badge */}
          <span className={`element-pill ${elemStyle.pill}`}>
            {master.element} Element
          </span>
        </div>

        {/* ====== Intro Text ====== */}
        <div className="glass-card-inner p-6 md:p-8 mb-0 animate-fade-in-up-delay-2 intro-reading-content">
          <p className="text-text-muted leading-relaxed">{reading.intro}</p>
        </div>

        {/* ====== Vital Sources of "Life Energy" ====== */}
        <div className="glass-card-inner p-6 md:p-8 mb-0 animate-fade-in-up-delay-3 intro-reading-content">
          <h3 className="text-2xl font-mystical font-bold text-accent-gold mb-5 flex items-center gap-2">
            <span>✦</span> Your Vital Sources of "Life Energy"
          </h3>
          {reading.vitalSources.map((paragraph, i) => (
            <p key={i} className="text-text-muted leading-relaxed">{paragraph}</p>
          ))}
        </div>

        {/* ====== Aligned Energies ====== */}
        <div className="glass-card-inner p-6 md:p-8 mb-0 intro-reading-content">
          <h3 className="text-2xl font-mystical font-bold text-white mb-5">
            {reading.alignedEnergies[0]}
          </h3>
          {reading.alignedEnergies.slice(1).map((paragraph, i) => (
            <p key={i} className="text-text-muted leading-relaxed">{paragraph}</p>
          ))}
        </div>

        {/* ====== Talents Transition ====== */}
        <div className="glass-card-inner p-6 md:p-8 mb-0 intro-reading-content">
          <h3 className="text-2xl font-mystical font-bold text-text-primary">
            And this is when your talents truly shine...
          </h3>
        </div>

        {/* ====== Work Superpowers ====== */}
        <div className="glass-card-inner p-6 md:p-8 mb-0 intro-reading-content">
          <h3 className="text-2xl font-mystical font-bold text-accent-gold mb-5 flex items-center gap-2">
            <span>⚡</span> Your Work Superpowers
          </h3>
          {reading.workSuperpowers.map((item, i) => (
            <div key={i} className="mb-5 last:mb-0">
              <p className="text-text-primary font-semibold mb-1">{item.title}</p>
              <p className="text-text-muted leading-relaxed text-[15px]">{item.description}</p>
            </div>
          ))}
        </div>

        {/* ====== Relationship Gifts ====== */}
        <div className="glass-card-inner p-6 md:p-8 mb-0 intro-reading-content">
          <h3 className="text-2xl font-mystical font-bold text-accent-gold mb-5 flex items-center gap-2">
            <span>💫</span> Your Relationship Gifts
          </h3>
          {reading.relationshipGifts.map((item, i) => (
            <div key={i} className="mb-5 last:mb-0">
              <p className="text-text-primary font-semibold mb-1">{item.title}</p>
              <p className="text-text-muted leading-relaxed text-[15px]">{item.description}</p>
            </div>
          ))}
        </div>

        {/* ====== Natural Abilities ====== */}
        <div className="glass-card-inner p-6 md:p-8 mb-0 intro-reading-content">
          <h3 className="text-2xl font-mystical font-bold text-accent-gold mb-5 flex items-center gap-2">
            <span>🔮</span> Your Natural Abilities
          </h3>
          {reading.naturalAbilities.map((item, i) => (
            <div key={i} className="mb-5 last:mb-0">
              <p className="text-text-primary font-semibold mb-1">{item.title}</p>
              <p className="text-text-muted leading-relaxed text-[15px]">{item.description}</p>
            </div>
          ))}
        </div>

        {/* ====== Clashing Energies Teaser ====== */}
        <div className="glass-card p-6 text-center mb-8 border-accent-gold/20" style={{ animation: 'borderPulse 3s ease-in-out infinite' }}>
          {/* Clashing Energies Banner */}
          <div className="mb-5">
            <img
              src="/clashing-energies.jpeg"
              alt="Clashing Elemental Energies"
              className="rounded-xl mx-auto shadow-lg w-full"
              style={{ maxHeight: '250px', objectFit: 'cover' }}
            />
          </div>
          <p className="text-text-primary leading-relaxed">
            {reading.clashingTeaser}
          </p>
        </div>

        {/* ====== CTA Button ====== */}
        <div className="text-center">
          <button
            onClick={() => navigate('/closing')}
            className="btn-mystical text-base tracking-wider"
          >
            ✦ DISCOVER WHAT'S ATTACKING YOUR DAY MASTER
          </button>
        </div>

      </div>
    </div>
  )
}
