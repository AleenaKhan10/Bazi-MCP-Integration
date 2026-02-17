/* ===========================================
   Closing Page — Premium Mystical Design
   =========================================== */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'
import { generateFullReport } from '../api/client'
import DAY_MASTERS from '../data/dayMasters'

const ELEMENT_STYLES = {
  Wood: { text: 'text-wood', pill: 'element-pill-wood' },
  Fire: { text: 'text-fire', pill: 'element-pill-fire' },
  Earth: { text: 'text-earth', pill: 'element-pill-earth' },
  Metal: { text: 'text-metal', pill: 'element-pill-metal' },
  Water: { text: 'text-water', pill: 'element-pill-water' },
}

export default function ClosingPage() {
  const navigate = useNavigate()
  const { formData, baziResult } = useQuiz()
  const [revealStep, setRevealStep] = useState(1)
  const [generating, setGenerating] = useState(false)
  const [reportResult, setReportResult] = useState(null)
  const [error, setError] = useState(null)

  // Guard
  if (!formData.firstName || !baziResult) {
    navigate('/')
    return null
  }

  const dayMasterChar = baziResult['日主'] || '庚'
  const master = DAY_MASTERS[dayMasterChar] || DAY_MASTERS['庚']
  const elemStyle = ELEMENT_STYLES[master.element] || ELEMENT_STYLES.Metal
  const attackStyle = ELEMENT_STYLES[master.attackedBy] || ELEMENT_STYLES.Fire

  const handleReveal = () => {
    setRevealStep((prev) => Math.min(prev + 1, 3))
  }

  const handleGenerateReport = async () => {
    setGenerating(true)
    setError(null)
    try {
      const result = await generateFullReport({
        name: formData.firstName,
        email: formData.email,
        gender: formData.gender,
        birthDate: `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`,
        birthTime: formData.birthTime,
        birthPlace: `${formData.city}, ${formData.country}`,
      })
      setReportResult(result)
    } catch (err) {
      setError(err.message || 'Failed to generate report')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">

        {/* ====== Header ====== */}
        <div className="text-center mb-10 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-mystical font-bold text-gold-gradient mb-3">
            The Hidden Challenge in Your Chart
          </h1>
          <p className="text-text-muted text-sm">
            Understanding the elemental forces at play
          </p>
          <div className="ornament-divider max-w-xs mx-auto mt-4">
            <span>⚡</span>
          </div>
        </div>

        {/* ====== Segment 1: Destructive Cycle ====== */}
        <div className="glass-card-inner p-6 mb-6 animate-fade-in-up-delay-1">
          <h3 className="text-lg font-mystical text-accent-gold mb-4 flex items-center gap-2">
            <span>⚡</span> The Destructive Cycle
          </h3>
          <p className="text-text-muted leading-relaxed text-[15px] mb-4">
            In BaZi, every element has a natural enemy — an element that disrupts its energy. This is called the <span className="text-accent-gold underline underline-offset-4 decoration-accent-gold/30">Destructive Cycle (相剋)</span>.
          </p>

          {/* Element clash visualization */}
          <div className="bg-bg-primary/50 rounded-xl p-5 border border-border text-center">
            <p className="text-text-primary font-medium mb-1">
              Your <span className={elemStyle.text}>{master.element}</span> element is being attacked by{' '}
              <span className={attackStyle.text}>{master.attackedBy}</span>
            </p>
            <p className="text-text-dim text-xs">
              {master.element} → attacks {master.attackingElement} | {master.attackedBy} → attacks {master.element}
            </p>
          </div>
        </div>

        {/* ====== Segment 2: What This Means (revealed on click) ====== */}
        {revealStep >= 2 && (
          <div className="glass-card-inner p-6 mb-6 animate-fade-in-scale">
            <h3 className="text-lg font-mystical text-accent-gold mb-4 flex items-center gap-2">
              <span>🔍</span> What This Means For {formData.firstName}
            </h3>
            <p className="text-text-muted leading-relaxed text-[15px] mb-4">
              When the <span className={attackStyle.text}>{master.attackedBy}</span> element is too strong in your chart, it can manifest as:
            </p>
            <ul className="space-y-2.5">
              {[
                'Blocked opportunities and stagnant career growth',
                'Relationship friction and miscommunication',
                'Financial instability or unexpected losses',
                'Persistent fatigue and health concerns',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-text-muted text-[15px]">
                  <span className="text-accent-gold mt-0.5 text-xs">✦</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ====== Segment 3: The Adjustments (revealed on 2nd click) ====== */}
        {revealStep >= 3 && (
          <div className="glass-card-inner p-6 mb-6 animate-fade-in-scale">
            <h3 className="text-lg font-mystical text-accent-gold mb-4 flex items-center gap-2">
              <span>✨</span> The Adjustments
            </h3>
            <p className="text-text-muted leading-relaxed text-[15px] mb-5">
              The good news is that BaZi provides <span className="text-accent-gold underline underline-offset-4 decoration-accent-gold/30">specific adjustments</span> you can make to harmonize these opposing forces. These include:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {['Feng Shui Placement', 'Career Direction', 'Color Therapy', 'Timing Strategy'].map((adj) => (
                <div key={adj} className="bg-bg-primary/50 rounded-xl p-4 border border-border text-center">
                  <span className="text-text-primary text-sm font-medium">{adj}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====== Reveal CTA ====== */}
        {revealStep < 3 && (
          <div className="text-center mb-8">
            <button onClick={handleReveal} className="btn-reveal text-sm">
              ✨ Dive Deeper Into My Reading & Tell Me More About The Adjustments!
            </button>
          </div>
        )}

        {/* ====== Generate Report Section ====== */}
        {revealStep >= 3 && (
          <div className="glass-card p-7 text-center glow-gold animate-fade-in-scale">
            <h3 className="text-xl font-mystical font-bold text-gold-gradient mb-3">
              Get Your Complete 13-Section BaZi Report
            </h3>
            <p className="text-text-muted text-sm mb-6 max-w-md mx-auto">
              Including life path simulations, luck cycles, career guidance, wealth strategies, health zones, and feng shui recommendations.
            </p>

            {/* Generate Button or Result */}
            {!reportResult ? (
              <button
                onClick={handleGenerateReport}
                disabled={generating}
                className={`btn-mystical text-base tracking-wider ${generating ? 'opacity-60 cursor-wait' : ''}`}
              >
                {generating ? (
                  <>
                    <span className="animate-spin inline-block mr-2">☯</span>
                    Generating Report...
                  </>
                ) : (
                  '✦ GENERATE MY FULL DESTINY REPORT'
                )}
              </button>
            ) : (
              <div className="space-y-4 animate-fade-in-scale">
                {/* Success message */}
                <div className="bg-success/10 border border-success/20 rounded-xl p-4">
                  <p className="text-success font-medium">✅ Report Generated!</p>
                </div>

                {/* Download links */}
                <div className="flex justify-center gap-3">
                  {reportResult.html_url && (
                    <a
                      href={reportResult.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-accent-teal/10 border border-accent-teal/20 text-accent-teal text-sm font-medium hover:bg-accent-teal/20 transition-all"
                    >
                      📄 View HTML
                    </a>
                  )}
                  {reportResult.pdf_url && (
                    <a
                      href={reportResult.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-sm font-medium hover:bg-accent-gold/20 transition-all"
                    >
                      📥 Download PDF
                    </a>
                  )}
                </div>

                {/* Email confirmation */}
                {reportResult.email_sent && (
                  <p className="text-text-dim text-xs">
                    ✉️ Report also sent to {formData.email}
                  </p>
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-4 bg-error/10 border border-error/20 rounded-xl p-4">
                <p className="text-error text-sm">{error}</p>
                <button
                  onClick={handleGenerateReport}
                  className="text-accent-gold text-xs mt-2 underline cursor-pointer"
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bottom decoration */}
        <div className="text-center mt-10 opacity-20">
          <span className="text-accent-gold text-xs tracking-[0.3em] font-mystical">
            ☰ 調整 · ADJUSTMENTS ☰
          </span>
        </div>
      </div>
    </div>
  )
}
