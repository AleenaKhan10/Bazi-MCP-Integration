/* ===========================================
   Closing Page — 4-Step Sales Funnel
   ===========================================
   
   ARCHITECTURE:
   Single /closing route with internal step state (1-4).
   Each step shows a section of content with a CTA 
   button to advance to the next step.
   
   STEP 1: Clashing Energies Attack (Fear/Urgency)
   STEP 2: Soul Seed + Report Pitch (Solution)
   STEP 3: 4 Report Pillars (Value Stack)
   STEP 4: Pricing + Testimonials + Guarantee (Close)
   
   DATA SOURCES:
   - closingPageContent.js → all sales copy text
   - dayMasters.js → element data + attacking element
   - QuizContext → user name + BaZi result
   
   PLACEHOLDERS: {name}, {dayMaster}, {attacking}
   are replaced at render time using the replacePlaceholders() helper.

   STRIPE: handleAddToCart() is prepared for future
   Stripe integration. Currently shows a placeholder.
*/

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'
import { generateFullReport } from '../api/client'
import DAY_MASTERS from '../data/dayMasters'
import CLOSING_CONTENT from '../data/closingPageContent'
import MysticalLoader from '../components/MysticalLoader'

const REPORT_MESSAGES = [
  "Initiating Quantum BaZi Analysis...",
  "Calculating 10-Year Luck Cycles (大运)...",
  "Analyzing Wealth Vaults & Hidden Potentials...",
  "Checking for Void Stars (空亡)...",
  "Consulting the I-Ching for Strategic Guidance...",
  "Generating Life Path Simulations...",
  "Balancing Five Elements Algorithm...",
  "Extracting Golden Wisdom from Ancient Texts...",
  "Polishing Report Headings & Formatting...",
  "Finalizing Your Destiny Blueprint..."
]

export default function ClosingPage() {
  const navigate = useNavigate()
  const { formData, baziResult } = useQuiz()
  const [step, setStep] = useState(1)
  const [generating, setGenerating] = useState(false)
  const [reportResult, setReportResult] = useState(null)
  const [reportError, setReportError] = useState(null)

  // Guard: redirect if no data
  if (!formData.firstName || !baziResult) {
    navigate('/')
    return null
  }

  // --- Data Extraction ---
  const dayMasterChar = baziResult['日主'] || '庚'
  const master = DAY_MASTERS[dayMasterChar] || DAY_MASTERS['庚']
  const userName = formData.firstName
  const dayMasterName = `${master.polarity} ${master.element}`
  const attackingName = master.attackedBy

  // --- Placeholder Replacement Helper ---
  // Replaces {name}, {dayMaster}, {attacking} in any string
  const r = (text) => {
    if (!text) return ''
    return text
      .replace(/\{name\}/g, userName)
      .replace(/\{dayMaster\}/g, dayMasterName)
      .replace(/\{attacking\}/g, attackingName)
  }

  // --- Scroll to top on step change ---
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  // --- Step Navigation ---
  const goNext = () => setStep((prev) => Math.min(prev + 1, 4))

  // --- Stripe Placeholder ---
  const handleAddToCart = (tier) => {
    // TODO: Integrate Stripe Checkout here
    // tier will be 'standard' or 'vip'
    alert(`✨ ${tier === 'vip' ? 'VIP Experience' : 'Essential Report'} selected! Stripe checkout coming soon.`)
  }

  // --- Shorthand for content ---
  const c = CLOSING_CONTENT

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">

        {/* ============================================================
            STEP 1: Clashing Energies Attack + Rock Paper Scissors
            Purpose: Create urgency — "your energy is under attack!"
            ============================================================ */}
        {step === 1 && (
          <div className="animate-fade-in-up">
            {/* Badge */}
            <div className="text-center mb-4">
              <span className="text-accent-gold text-xs tracking-[0.3em] font-mystical uppercase">
                ✦ Your Life Energy Chart Reading ✦
              </span>
            </div>

            {/* Title */}
            <h1 className="closing-section-heading text-center mb-8">
              {r(c.step1.title)}
            </h1>

            {/* Main paragraphs */}
            <div className="glass-card-inner p-6 md:p-8 mb-6">
              <div className="closing-paragraph">
                {c.step1.paragraphs.map((p, i) => (
                  <p key={i}>{r(p)}</p>
                ))}
              </div>

              {/* Bullet list */}
              <ul className="closing-bullet-list">
                {c.step1.bulletList.map((b, i) => (
                  <li key={i}>
                    <span className="text-accent-gold mr-2">●</span>
                    {r(b)}
                  </li>
                ))}
              </ul>

              {/* More paragraphs */}
              <div className="closing-paragraph mt-6">
                {c.step1.paragraphs2.map((p, i) => (
                  <p key={i}>{r(p)}</p>
                ))}
              </div>
            </div>

            {/* Rock Paper Scissors section */}
            <div className="glass-card-inner p-6 md:p-8 mb-6">
              <h2 className="closing-subheading text-center mb-6">
                {r(c.step1.rpsTitle)}
              </h2>
              <div className="closing-paragraph">
                {c.step1.rpsParagraphs.map((p, i) => (
                  <p key={i}>{r(p)}</p>
                ))}
              </div>
            </div>


            {/* --- Soul Seed Section (Change 7: moved from Step 2 title) --- */}
            <div className="glass-card-inner p-6 md:p-8 mb-6">
              <h2 className="closing-subheading text-center mb-6">
                {r(c.step2.title)}
              </h2>
              <div className="closing-paragraph">
                {c.step2.paragraphs.map((p, i) => (
                  <p key={i}>{r(p)}</p>
                ))}
              </div>

              {/* Numbered list 1) and 2) */}
              <ol className="closing-numbered-list">
                {c.step2.numberedList.map((item, i) => (
                  <li key={i}>{r(item)}</li>
                ))}
              </ol>

              <div className="closing-paragraph mt-4">
                {c.step2.paragraphs2.map((p, i) => (
                  <p key={i}>{r(p)}</p>
                ))}
              </div>
            </div>

            {/* Second CTA */}
            <div className="text-center mt-8 mb-6">
              <button onClick={goNext} className="btn-mystical text-base tracking-wider px-8 py-4">
                ✨ {r(c.step2.ctaText)}
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 2: Soul Seed + Report Introduction
            Purpose: Introduce the report as the solution
            ============================================================ */}
        {step === 2 && (
          <div className="animate-fade-in-up">
            {/* Report Pitch Title (was step2.reportTitle) */}
            <h1 className="closing-section-heading text-center mb-8">
              {r(c.step2.reportTitle)}
            </h1>

            <div className="glass-card-inner p-6 md:p-8 mb-6">
              <p className="text-accent-gold text-center text-lg font-medium mb-6 italic">
                {r(c.step2.reportSubtitle)}
              </p>
              <div className="closing-paragraph">
                {c.step2.reportParagraphs.map((p, i) => (
                  <p key={i}>{r(p)}</p>
                ))}
              </div>
            </div>

            {/* Adjustments */}
            <div className="glass-card-inner p-6 md:p-8 mb-6">
              <h2 className="closing-subheading text-center mb-6">
                {r(c.step2.adjustmentsTitle)}
              </h2>
              <div className="closing-paragraph">
                {c.step2.adjustmentsParagraphs.map((p, i) => (
                  <p key={i}>{r(p)}</p>
                ))}
              </div>
            </div>

            {/* Direct Forces */}
            <div className="glass-card-inner p-6 md:p-8 mb-6">
              <h2 className="closing-subheading text-center mb-6">
                {r(c.step2.directTitle)}
              </h2>
              <div className="closing-paragraph">
                {c.step2.directParagraphs.map((p, i) => (
                  <p key={i}>{r(p)}</p>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-8 mb-6">
              <button onClick={goNext} className="btn-mystical text-base tracking-wider px-8 py-4">
                ✨ {r(c.step2.ctaText)}
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 3: 4 Report Pillars + Software Simulation
            Purpose: Show the value — what the report covers
            ============================================================ */}
        {step === 3 && (
          <div className="animate-fade-in-up">
            {/* Harness Title */}
            <h1 className="closing-section-heading text-center mb-8">
              {r(c.step3.harnessTitle)}
            </h1>

            {/* Harness content */}
            <div className="glass-card-inner p-6 md:p-8 mb-6">
              <div className="closing-paragraph">
                {c.step3.harnessParagraphs.map((p, i) => (
                  <p key={i}>{r(p)}</p>
                ))}
              </div>
              <ul className="closing-bullet-list">
                {c.step3.harnessBullets.map((b, i) => (
                  <li key={i}>
                    <span className="text-accent-gold mr-2">●</span>
                    {r(b)}
                  </li>
                ))}
              </ul>
            </div>

            {/* Beginning of report */}
            <h2 className="closing-subheading text-center mb-6">
              {r(c.step3.beginningTitle)}
            </h2>

            <div className="glass-card-inner p-6 md:p-8 mb-6">
              <div className="closing-paragraph">
                {c.step3.beginningParagraphs.map((p, i) => (
                  <p key={i}>{r(p)}</p>
                ))}
              </div>
            </div>

            {/* 4 Pillars */}
            {c.step3.pillars.map((pillar) => (
              <div key={pillar.number} className="glass-card-inner p-6 md:p-8 mb-6">
                {/* Full-width Google Doc style heading */}
                <h3 className="text-lg md:text-xl font-mystical text-accent-gold text-center mb-5 leading-snug">
                  {r(pillar.title)}
                </h3>
                
                {pillar.intro && (
                  <p className="text-text-muted text-sm italic mb-4">{r(pillar.intro)}</p>
                )}

                <div className="closing-paragraph">
                  {pillar.paragraphs.map((p, i) => (
                    <p key={i}>{r(p)}</p>
                  ))}
                </div>

                {pillar.subtitle && (
                  <p className="text-accent-gold font-medium mt-4 mb-3">{r(pillar.subtitle)}</p>
                )}

                {pillar.bullets && (
                  <ul className="closing-bullet-list">
                    {pillar.bullets.map((b, i) => (
                      <li key={i}>
                        <span className="text-accent-gold mr-2">●</span>
                        {r(b)}
                      </li>
                    ))}
                  </ul>
                )}

                {pillar.closingParagraphs && (
                  <div className="closing-paragraph mt-4">
                    {pillar.closingParagraphs.map((p, i) => (
                      <p key={i}>{r(p)}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Simulation */}
            <div className="glass-card-inner p-6 md:p-8 mb-6">
              <h2 className="closing-subheading text-center mb-6">
                {r(c.step3.simulationTitle)}
              </h2>
              <div className="closing-paragraph">
                {c.step3.simulationParagraphs.map((p, i) => (
                  <p key={i}>{r(p)}</p>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="glass-card-inner p-6 md:p-8 mb-6">
              <h2 className="closing-subheading text-center mb-6">
                {r(c.step3.recommendationsTitle)}
              </h2>
              <p className="text-text-muted mb-4">You'd be able to...</p>
              <ul className="closing-bullet-list">
                {c.step3.recommendationsBullets.map((b, i) => (
                  <li key={i}>
                    <span className="text-accent-gold mr-2">●</span>
                    {r(b)}
                  </li>
                ))}
              </ul>
              <p className="text-text-muted leading-relaxed text-[15px] mt-4">
                {r(c.step3.socialProof)}
              </p>
            </div>

            {/* CTA — Dive Deeper (Change 10: no Add To Cart here) */}
            <div className="text-center mt-8 mb-6">
              <button onClick={goNext} className="btn-mystical text-base tracking-wider px-8 py-4">
                ✨ {r(c.step3.ctaText)}
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 4: Pricing + Inclusions + Testimonials + Guarantee
            Purpose: Close the sale — pricing cards + social proof
            ============================================================ */}
        {step === 4 && (
          <div className="animate-fade-in-up">
            {/* Pricing Intro */}
            <h1 className="closing-section-heading text-center mb-2">
              {r(c.step4.pricingTitle)}
            </h1>
            <p className="text-center text-text-muted mb-8 italic">
              {r(c.step4.pricingSubtitle)}
            </p>

            <div className="glass-card-inner p-6 md:p-8 mb-6">
              <div className="closing-paragraph">
                {c.step4.pricingParagraphs.map((p, i) => (
                  <p key={i}>{r(p)}</p>
                ))}
              </div>

              <blockquote className="border-l-4 border-accent-gold pl-4 my-6 text-accent-gold italic text-lg">
                {r(c.step4.billionaireQuote)}
              </blockquote>

              <div className="closing-paragraph">
                {c.step4.pricingClose.map((p, i) => (
                  <p key={i}>{r(p)}</p>
                ))}
              </div>
            </div>

            {/* ====== PRICING CARDS (Side by side like Box.com) ====== */}
            <div className="pricing-cards-grid">
              {/* Standard Tier */}
              <div className="pricing-card pricing-card-standard">
                <div className="pricing-card-header">
                  <span className="pricing-tier-label">{c.step4.standardTier.name}</span>
                  <div className="pricing-price">
                    <span className="pricing-currency">$</span>
                    <span className="pricing-amount">{c.step4.standardTier.price}</span>
                  </div>
                  <p className="pricing-description">{c.step4.standardTier.description}</p>
                </div>
                <button 
                  onClick={() => handleAddToCart('standard')}
                  className="pricing-btn pricing-btn-standard"
                >
                  {c.step4.standardTier.buttonText}
                </button>
                <ul className="pricing-feature-list">
                  {c.step4.standardTier.features.map((f, i) => (
                    <li key={i}>
                      <span className="pricing-check">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* VIP Tier */}
              <div className="pricing-card pricing-card-vip">
                {c.step4.vipTier.badge && (
                  <div className="pricing-badge">{c.step4.vipTier.badge}</div>
                )}
                <div className="pricing-card-header">
                  <span className="pricing-tier-label">{c.step4.vipTier.name}</span>
                  <div className="pricing-price">
                    <span className="pricing-currency">$</span>
                    <span className="pricing-amount">{c.step4.vipTier.price}</span>
                  </div>
                  <p className="pricing-description">{c.step4.vipTier.description}</p>
                </div>
                <button 
                  onClick={() => handleAddToCart('vip')}
                  className="pricing-btn pricing-btn-vip"
                >
                  {c.step4.vipTier.buttonText}
                </button>
                <ul className="pricing-feature-list">
                  {c.step4.vipTier.features.map((f, i) => (
                    <li key={i}>
                      <span className="pricing-check pricing-check-gold">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Bonuses */}
                <div className="pricing-bonuses">
                  <p className="pricing-bonuses-header">
                    + 3 EXCLUSIVE BONUSES (WORTH ${c.step4.vipTier.bonusTotal})
                  </p>
                  {c.step4.vipTier.bonuses.map((bonus, i) => (
                    <div key={i} className="pricing-bonus-item">
                      <span className="text-accent-gold">🎁</span>
                      <div>
                        <span className="text-text-primary text-sm">{bonus.name}</span>
                        <span className="text-text-dim text-xs ml-2">Value: ${bonus.value}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-center text-text-dim text-xs mt-3">
                  Save $100 · Most people choose this
                </p>
              </div>
            </div>

            {/* ====== INCLUSIONS LIST ====== */}
            <div className="glass-card-inner p-6 md:p-8 mb-6 mt-8">
              <h2 className="closing-subheading text-center mb-6">
                {r(c.step4.inclusionsTitle)}
              </h2>
              <ul className="closing-inclusions-list">
                {c.step4.inclusions.map((item, i) => (
                  <li key={i}>
                    <span className="text-accent-gold mr-2 flex-shrink-0">●</span>
                    <span>{r(item)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ====== TESTIMONIALS ====== */}
            <h2 className="closing-subheading text-center mb-6 mt-10">
              And This Is Why We've Been Able To Get Results For Hundreds of Our Clients Who Trust Us With Their Growth...
            </h2>

            <div className="space-y-5 mb-8">
              {c.step4.testimonials.map((t, i) => (
                <div key={i} className="testimonial-card">
                  <div className="testimonial-header">
                    <div className="testimonial-avatar">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-text-primary font-bold text-sm">{t.name}</p>
                      <p className="text-text-dim text-xs">{t.title}</p>
                    </div>
                  </div>
                  <p className="text-text-muted leading-relaxed text-[14px] italic">
                    "{t.quote}"
                  </p>
                </div>
              ))}
            </div>

            {/* ====== ANCIENT SCIENCES ====== */}
            <div className="glass-card-inner p-6 md:p-8 mb-6">
              <h2 className="closing-subheading text-center mb-6">
                {r(c.step4.scienceTitle)}
              </h2>
              <div className="closing-paragraph">
                {c.step4.scienceParagraphs.map((p, i) => (
                  <p key={i}>{r(p)}</p>
                ))}
              </div>
              <ul className="closing-bullet-list mt-4">
                {c.step4.scienceBullets.map((b, i) => (
                  <li key={i}>
                    <span className="text-accent-gold mr-2">●</span>
                    {r(b)}
                  </li>
                ))}
              </ul>
              <p className="text-text-muted leading-relaxed text-[15px] mt-4 font-medium">
                {r(c.step4.scienceClosing)}
              </p>
            </div>



            {/* ====== 60-DAY GUARANTEE ====== */}
            <div className="guarantee-section">
              <div className="guarantee-badge-icon">🛡️</div>
              <h2 className="closing-subheading text-center mb-4">
                {r(c.step4.guaranteeTitle)}
              </h2>
              <div className="closing-paragraph">
                {c.step4.guaranteeParagraphs.map((p, i) => (
                  <p key={i}>{r(p)}</p>
                ))}
              </div>
            </div>

            {/* Final CTA */}
            <div className="text-center my-10">
              <button 
                onClick={() => handleAddToCart('standard')}
                className="btn-mystical text-lg tracking-wider px-10 py-5"
              >
                🛒 Add To Cart — Get Your Report Now
              </button>
              <p className="text-text-dim text-xs mt-3">
                Secure checkout · 60-day money-back guarantee
              </p>
            </div>

            {/* ====== OR — FREE REPORT PREVIEW (Working Backend) ====== */}
            <div className="text-center my-8">
              <div className="ornament-divider max-w-xs mx-auto mb-4">
                <span>OR</span>
              </div>
              <p className="text-text-muted text-sm mb-4">
                Not ready to purchase yet? Generate a FREE preview of your report!
              </p>
            </div>

            <div className="glass-card p-7 text-center glow-gold animate-fade-in-scale">
              <h3 className="text-xl font-mystical font-bold text-gold-gradient mb-3">
                Get Your Complete 13-Section BaZi Report
              </h3>
              <p className="text-text-muted text-sm mb-6 max-w-md mx-auto">
                Including life path simulations, luck cycles, career guidance, wealth strategies, health zones, and feng shui recommendations.
              </p>

              {generating ? (
                <MysticalLoader 
                  messages={REPORT_MESSAGES} 
                  duration={210}
                />
              ) : !reportResult ? (
                <button
                  onClick={async () => {
                    setGenerating(true)
                    setReportError(null)
                    try {
                      const result = await generateFullReport({
                        name: userName,
                        email: formData.email,
                        gender: formData.gender,
                        birthDate: `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`,
                        birthTime: formData.birthTime,
                        location: (formData.city && formData.country) 
                          ? `${formData.city}, ${formData.country}` 
                          : 'Unknown Location',
                      })
                      setReportResult(result)
                    } catch (err) {
                      setReportError(err.message || 'Failed to generate report')
                    } finally {
                      setGenerating(false)
                    }
                  }}
                  className="btn-mystical text-base tracking-wider transition-all duration-300 transform hover:scale-105"
                >
                  ✦ GENERATE MY FREE REPORT PREVIEW
                </button>
              ) : (
                <div className="space-y-4 animate-fade-in-scale">
                  <div className="bg-success/10 border border-success/20 rounded-xl p-4">
                    <p className="text-success font-medium">✅ Report Generated!</p>
                  </div>
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
                  {reportResult.email_sent && (
                    <p className="text-text-dim text-xs">
                      ✉️ Report also sent to {formData.email}
                    </p>
                  )}
                </div>
              )}

              {reportError && !generating && (
                <div className="mt-4 bg-error/10 border border-error/20 rounded-xl p-4">
                  <p className="text-error text-sm">{reportError}</p>
                  <button
                    onClick={() => { setReportError(null) }}
                    className="text-accent-gold text-xs mt-2 underline cursor-pointer"
                  >
                    Try again
                  </button>
                </div>
              )}
            </div>

            {/* Bottom decoration */}
            <div className="text-center mt-10 opacity-20">
              <span className="text-accent-gold text-xs tracking-[0.3em] font-mystical">
                ☰ 命理 · DESTINY ☰
              </span>
            </div>
          </div>
        )}

        {/* ====== Step Indicator ====== */}
        <div className="flex justify-center gap-2 mt-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                s === step 
                  ? 'bg-accent-gold scale-125' 
                  : s < step 
                    ? 'bg-accent-gold/40' 
                    : 'bg-border'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  )
}
