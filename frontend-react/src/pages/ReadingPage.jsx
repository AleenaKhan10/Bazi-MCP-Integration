/* ===========================================
   Reading Page — Premium Mystical Design
   =========================================== */

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'
import DAY_MASTERS from '../data/dayMasters'

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

  if (!baziResult) return null

  // Get Day Master character from BaZi result
  const dayMasterChar = baziResult['日主'] || '庚'
  const master = DAY_MASTERS[dayMasterChar] || DAY_MASTERS['庚']
  const elemStyle = ELEMENT_STYLES[master.element] || ELEMENT_STYLES.Metal

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">

        {/* ====== Header ====== */}
        <div className="text-center mb-10 animate-fade-in-up">
          <p className="text-accent-gold text-xs tracking-[0.25em] uppercase font-mystical mb-3">
            ✦ YOUR LIFE ENERGY CHART IS READY ✦
          </p>
          <h1 className="text-3xl md:text-4xl font-mystical font-bold text-text-primary">
            {formData.firstName}, Your Day Master is...
          </h1>
        </div>

        {/* ====== Day Master Card ====== */}
        <div
          className="glass-card p-8 text-center mb-8 animate-fade-in-up-delay-1 glow-gold-strong"
          style={{ background: `linear-gradient(135deg, ${elemStyle.glow}, rgba(15, 22, 41, 0.95))` }}
        >
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

        {/* ====== Personality Section ====== */}
        <div className="glass-card-inner p-6 mb-6 animate-fade-in-up-delay-2">
          <h3 className="text-lg font-mystical text-accent-gold mb-4 flex items-center gap-2">
            <span>✦</span> What This Means For You
          </h3>
          <p className="text-text-muted leading-relaxed text-[15px] mb-5">
            {master.description}
          </p>

          <p className="text-sm font-medium text-text-primary mb-3">Your Core Traits:</p>
          <div className="flex flex-wrap gap-2">
            {master.traits.map((trait) => (
              <span key={trait} className="trait-tag">{trait}</span>
            ))}
          </div>
        </div>

        {/* ====== Four Pillars Summary ====== */}
        {baziResult && (
          <div className="glass-card-inner p-6 mb-6 animate-fade-in-up-delay-3">
            <h3 className="text-lg font-mystical text-accent-gold mb-4 flex items-center gap-2">
              <span>☰</span> Your Four Pillars
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '八字 (BaZi)', value: baziResult['八字'] },
                { label: '生肖 (Zodiac)', value: baziResult['生肖'] },
                { label: '日主 (Day Master)', value: dayMasterChar },
                { label: '阳历 (Solar Date)', value: baziResult['阳历'] },
              ].map((item) => (
                <div key={item.label} className="bg-bg-primary/50 rounded-xl p-3 border border-border">
                  <span className="text-text-dim text-xs block mb-1">{item.label}</span>
                  <span className="text-text-primary font-mono text-sm">{item.value || 'N/A'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====== Teaser / Hook ====== */}
        <div className="glass-card p-6 text-center mb-8 border-accent-gold/20" style={{ animation: 'borderPulse 3s ease-in-out infinite' }}>
          <p className="text-text-muted text-sm italic mb-2">
            But there's something you need to know...
          </p>
          <p className="text-text-primary font-medium">
            The <span className={elemStyle.text}>{master.attackingElement}</span> element is creating friction in your chart, and it may be holding you back from your true potential.
          </p>
        </div>

        {/* ====== CTA Button ====== */}
        <div className="text-center">
          <button
            onClick={() => navigate('/closing')}
            className="btn-mystical text-base tracking-wider"
          >
            ✦ DIVE DEEPER INTO MY READING
          </button>
          <p className="text-xs text-text-dim mt-3">
            Discover the adjustments to harmonize your life energy
          </p>
        </div>

        {/* Bottom decoration */}
        <div className="text-center mt-10 opacity-20">
          <span className="text-accent-gold text-xs tracking-[0.3em] font-mystical">
            ☰ 命理分析 ☰
          </span>
        </div>
      </div>
    </div>
  )
}
