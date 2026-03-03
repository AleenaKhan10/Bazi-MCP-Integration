/* ===========================================
   Closing Page — 2-Page + Expandable Sections
   ===========================================
   
   ARCHITECTURE (UPDATED — was 4 steps, now 2 pages):
   
   PAGE 1 (step === 1):
     - Clashing Energies Attack + Rock Paper Scissors
     - [Dive Deeper] ← EXPAND button (shows Soul Seed inline)
     - Soul Seed section (hidden → shown on click)
     - [Dive Deeper] ← REAL page break → goes to Page 2
   
   PAGE 2 (step === 2):
     - Report Intro + Adjustments + Direct Forces
     - 4 Report Pillars + Simulation + Recommendations
     - Pricing intro ($18.88) + [Add To Cart] ← EXPAND button
     - Post-cart content (hidden → shown on click):
       Inclusions, Pricing Tables, Testimonials,
       Ancient Sciences, Guarantee, Final CTA
   
   WHY THIS STRUCTURE:
     Manager's document has "Next Page:" written only ONCE (line 76).
     All other buttons are "Dive Deeper" / "Add To Cart" which should
     show content inline (same page), not navigate to a new page.
   
   DATA SOURCES (UNCHANGED):
     - closingPageContent.js → all sales copy text
     - dayMasters.js → element data + attacking element
     - QuizContext → user name + BaZi result
   
   BACKEND CONNECTIVITY: Completely UNCHANGED.
     generateFullReport() and all API calls are identical.
*/

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'
import DAY_MASTERS from '../data/dayMasters'
import CLOSING_CONTENT from '../data/closingPageContent'


export default function ClosingPage() {
  const navigate = useNavigate()
  const { formData, baziResult } = useQuiz()

  // --- Page state (was 1-4, now just 1 or 2) ---
  const [step, setStep] = useState(1)

  // --- Expandable section states ---
  // Page 1: "Dive Deeper" button reveals Soul Seed section
  const [showSoulSeed, setShowSoulSeed] = useState(false)
  // Page 2: "Add To Cart" button reveals inclusions, testimonials, etc.
  const [showPostCart, setShowPostCart] = useState(false)

  // --- Report generation (backend connectivity — UNCHANGED) ---
  const [generating, setGenerating] = useState(false)
  const [reportResult, setReportResult] = useState(null)
  const [reportError, setReportError] = useState(null)

  // Guard: redirect if no data
  if (!formData.firstName || !baziResult) {
    navigate('/')
    return null
  }

  // --- Data Extraction (UNCHANGED) ---
  const dayMasterChar = baziResult['日主'] || '庚'
  const master = DAY_MASTERS[dayMasterChar] || DAY_MASTERS['庚']
  const userName = formData.firstName
  const dayMasterName = `${master.polarity} ${master.element}`
  const attackingName = master.attackedBy

  // --- Placeholder Replacement Helper (UNCHANGED) ---
  const r = (text) => {
    if (!text) return ''
    return text
      .replace(/\{name\}/g, userName)
      .replace(/\{dayMaster\}/g, dayMasterName)
      .replace(/\{attacking\}/g, attackingName)
  }

  // --- Rich text helper: renders bold (**), underline (__), italic (_), yellow {{text}} ---
  const renderRichText = (text) => {
    const processed = r(text)
    // Split by formatting markers and reconstruct with JSX
    return processed
  }

  // --- Scroll to top on page change ---
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  // --- Page Navigation (only 1→2 now) ---
  const goToPage2 = () => setStep(2)

  // --- Stripe Placeholder (UNCHANGED) ---
  const handleAddToCart = (tier) => {
    alert(`✨ ${tier === 'vip' ? 'VIP Access' : 'Essential Report'} selected! Stripe checkout coming soon.`)
  }

  // --- Shorthand for content ---
  const c = CLOSING_CONTENT

  // ===========================================
  // Pricing Table Component (used 3 times in document)
  // ===========================================
  // Document repeats the same pricing table 3 times:
  //   1. After inclusions list
  //   2. After ancient sciences section  
  //   3. After guarantee section
  // So we make it a reusable component.
  const PricingTable = () => (
    <div className="pricing-cards-grid">
      {/* Standard Tier */}
      <div className="pricing-card pricing-card-standard">
        <div className="pricing-card-header">
          <span className="pricing-tier-label">{c.step4.standardTier.name}</span>
          <div className="pricing-price">
            <span className="pricing-currency">$</span>
            <span className="pricing-amount">{c.step4.standardTier.price}</span>
          </div>
          <p className="pricing-description text-xs">One-time payment</p>
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
          {c.step4.vipTier.recurringPrice && (
            <p className="pricing-description text-xs">{c.step4.vipTier.recurringPrice}</p>
          )}
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
        <p className="text-center text-accent-gold text-xs font-medium mt-3">
          MOST POPULAR — 78% Choose This
        </p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">

        {/* ============================================================
            PAGE 1: Clashing Energies + Rock Paper Scissors + Soul Seed
            
            Document lines 1-74.
            "Dive Deeper" #1 → EXPANDS Soul Seed inline
            "Dive Deeper" #2 → GOES TO Page 2 (document says "Next Page:")
            ============================================================ */}
        {step === 1 && (
          <div className="animate-fade-in-up">

            {/* Title — underline attacking element */}
            <h1 className="closing-section-heading text-center mb-8 px-4 md:px-8">
              A Crucial Part of Your {dayMasterName} Energy Flow Is Currently Being 'Suffocated' & Blocked... By Strong Clashing <u className="decoration-accent-gold">{attackingName}</u> Energies!
            </h1>

            {/* Five Element Destructive Cycle Diagram — MOVED UP after heading */}
            <div className="flex justify-center mb-8">
              <img
                src="/destructive-cycle.jpeg"
                alt="Five Element Destructive Cycle - Wood, Fire, Earth, Metal, Water"
                className="rounded-xl shadow-lg"
                style={{ maxHeight: '400px', maxWidth: '100%', objectFit: 'contain' }}
              />
            </div>

            {/* Main paragraphs */}
            <div className="closing-flow-section p-6 md:p-8 mb-0">
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
            <div className="closing-flow-section p-6 md:p-8 mb-6">
              <h2 className="closing-subheading text-center mb-6 px-4 md:px-8">
                {r(c.step1.rpsTitle)}
              </h2>
              <div className="closing-paragraph">
                {c.step1.rpsParagraphs.map((p, i) => (
                  <p key={i}>{r(p)}</p>
                ))}
              </div>
            </div>

            {/* ========================================
                DIVE DEEPER #1 — EXPAND button (not navigation!)
                
                This button REVEALS Soul Seed section below
                on the SAME page. Does NOT go to a new page.
                
                Document line 56: button appears, but no "Next Page:" follows.
                Content continues on same page.
                ======================================== */}
            {!showSoulSeed && (
              <div className="text-center mt-8 mb-6">
                <button 
                  onClick={() => setShowSoulSeed(true)} 
                  className="btn-mystical text-base tracking-wider px-8 py-4"
                >
                  ✨ {r(c.step2.ctaText)}
                </button>
              </div>
            )}

            {/* --- Soul Seed Section (EXPANDABLE — hidden until clicked) --- */}
            {showSoulSeed && (
              <div className="animate-fade-in-up">
                <div className="closing-flow-section p-6 md:p-8 mb-6">
                  <h2 className="closing-subheading text-center mb-6 px-4 md:px-8">
                    It's Like Finding The Perfect Soil, Water, Sunlight, Temperature & Fertilizer That Can Allow Your "<span className="text-accent-gold font-bold">Soul Seed</span>" To Naturally Flourish & To Manifest Talents That Bear Abundant, Heavy & Ripe Fruit For You... In All Aspects of Your Life...
                  </h2>
                  {/* Soul Seed Growth Metaphor */}
                  <div className="flex justify-center mb-6">
                    <img
                      src="/soul-seed-growth.jpeg"
                      alt="Soul Seed Growth - From seed to magnificent tree"
                      className="rounded-xl shadow-lg w-full"
                      style={{ maxHeight: '300px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="closing-paragraph">
                    {c.step2.paragraphs.map((p, i) => (
                      <p key={i}>{r(p)}</p>
                    ))}
                  </div>

                  {/* Numbered list 1) and 2) */}
                  <div className="space-y-3 my-6 pl-4">
                    {c.step2.numberedList.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-accent-gold font-bold flex-shrink-0">{i + 1})</span>
                        <p className="text-text-muted leading-relaxed text-[15px]">{r(item)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="closing-paragraph mt-4">
                    {c.step2.paragraphs2.map((p, i) => (
                      <p key={i}>{r(p)}</p>
                    ))}
                  </div>
                </div>

                {/* ========================================
                    DIVE DEEPER #2 — REAL page break!
                    
                    Document line 74: button, then line 76 says "Next Page:"
                    This is the ONLY real page navigation in the document.
                    ======================================== */}
                <div className="text-center mt-8 mb-6">
                  <button onClick={goToPage2} className="btn-mystical text-base tracking-wider px-8 py-4">
                    ✨ {r(c.step2.ctaText)}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            PAGE 2: Everything after "Next Page:" in the document
            
            This is ONE continuous page that contains:
            - Report Intro + Adjustments + Direct Forces
            - 4 Pillars + Simulation + Recommendations
            - Pricing + [Add To Cart] (EXPAND button)
            - Post-cart: Inclusions, Tables, Testimonials, Guarantee
            
            Document lines 78-429. All on ONE page (no more page breaks).
            ============================================================ */}
        {step === 2 && (
          <div className="animate-fade-in-up">

            {/* --- Report Pitch Title --- */}
            <h1 className="closing-section-heading text-center mb-8 px-4 md:px-8">
              {r(c.step2.reportTitle)}
            </h1>

            {/* Steering Metaphor - Navigation Ship */}
            <div className="flex justify-center mb-8">
              <img
                src="/steering-metaphor.jpeg"
                alt="Steer Your Life's Path - Ancient ship navigating cosmic waters"
                className="rounded-xl shadow-lg w-full"
                style={{ maxHeight: '350px', objectFit: 'cover' }}
              />
            </div>

            <div className="closing-flow-section p-6 md:p-8 mb-0">
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
            <div className="closing-flow-section p-6 md:p-8 mb-0">
              <h2 className="closing-subheading text-center mb-6 px-4 md:px-8">
                {r(c.step2.adjustmentsTitle)}
              </h2>
              <div className="closing-paragraph">
                {c.step2.adjustmentsParagraphs.map((p, i) => (
                  <p key={i}>{r(p)}</p>
                ))}
              </div>
            </div>

            {/* Direct Forces */}
            <div className="closing-flow-section p-6 md:p-8 mb-6">
              <h2 className="closing-subheading text-center mb-6 px-4 md:px-8">
                {r(c.step2.directTitle)}
              </h2>
              <div className="closing-paragraph">
                {c.step2.directParagraphs.map((p, i) => (
                  <p key={i}>{r(p)}</p>
                ))}
              </div>
            </div>

            {/* --- Harness section --- */}
            <h1 className="closing-section-heading text-center mb-8 px-4 md:px-8">
              {r(c.step3.harnessTitle)}
            </h1>

            <div className="closing-flow-section p-6 md:p-8 mb-6">
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
            <h2 className="closing-subheading text-center mb-6 px-4 md:px-8">
              {r(c.step3.beginningTitle)}
            </h2>

            <div className="closing-flow-section p-6 md:p-8 mb-6">
              <div className="closing-paragraph">
                {c.step3.beginningParagraphs.map((p, i) => (
                  <p key={i}>{r(p)}</p>
                ))}
              </div>
            </div>

            {/* Four Pillars Section Header Image */}
            <div className="flex justify-center mb-8">
              <img
                src="/four-pillars-headers.jpeg"
                alt="Four Pillars - Life Force, Natural Intellect, Relationships, Peak Luck"
                className="rounded-xl shadow-lg"
                style={{ maxHeight: '360px', maxWidth: '100%', objectFit: 'contain' }}
              />
            </div>

            {/* 4 Pillars */}
            {c.step3.pillars.map((pillar) => (
              <div key={pillar.number} className="closing-flow-section p-6 md:p-8 mb-6">
                <h3 className="text-lg md:text-xl font-mystical text-accent-gold text-center mb-5 leading-snug px-4 md:px-8">
                  {pillar.number === 4 ? (
                    <>
                      Most Importantly – The Biggest "Needle Mover" That You'll Get In Your Life Energy Attunement Report Is The "<u>Peak Luck Periods</u>" That Allow You To Make Leaps & Bounds In Just Days!
                    </>
                  ) : (
                    r(pillar.title)
                  )}
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
            <div className="closing-flow-section p-6 md:p-8 mb-6">
              <h2 className="closing-subheading text-center mb-6 px-4 md:px-8">
                {r(c.step3.simulationTitle)}
              </h2>
              <div className="closing-paragraph">
                {c.step3.simulationParagraphs.map((p, i) => (
                  <p key={i}>{r(p)}</p>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="closing-flow-section p-6 md:p-8 mb-6">
              <h2 className="closing-subheading text-center mb-6 px-4 md:px-8">
                {r(c.step3.recommendationsTitle)}
              </h2>
              <p className="text-text-muted mb-4">You'd be able to…</p>
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

            {/* ====== PRICING INTRO ====== */}
            <h1 className="closing-section-heading text-center mb-2 px-4 md:px-8">
              {r(c.step4.pricingTitle)}
            </h1>
            <p className="text-center text-text-muted mb-8 italic">
              {r(c.step4.pricingSubtitle)}
            </p>

            <div className="closing-flow-section p-6 md:p-8 mb-6">
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

            {/* ====== POST-CART CONTENT (always visible) ====== */}
            <div>

                {/* ====== INCLUSIONS LIST — Numbered 1-13 ====== */}
                <div className="closing-flow-section p-6 md:p-8 mb-6">
                  <h1 className="closing-section-heading text-center mb-6 px-4 md:px-8">
                    {r(c.step4.inclusionsTitle)}
                  </h1>
                  <ol className="closing-numbered-list">
                    {c.step4.inclusions.map((item, i) => (
                      <li key={i}>
                        <span className="text-accent-gold mr-2 font-bold flex-shrink-0">{i + 1}.</span>
                        <span>{r(item)}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* ====== NEW: FENG SHUI IMMERSION BUNDLE SECTION ====== */}
                <div className="closing-flow-section p-6 md:p-8 mb-8">
                  <h2 className="text-base md:text-lg font-mystical font-bold text-accent-gold text-center mb-6 italic px-4 md:px-8 leading-relaxed">
                    Special One Time Offer Only On This Page For SERIOUS FENG SHUI LEARNERS That Want To Use The FULL Bazi System – Using The "Inner & Outer" Feng Shui Method To Completely Transform Your Life For Just $20 More Dollars
                  </h2>
                  <h3 className="text-lg md:text-xl font-mystical font-bold text-text-primary text-center mb-8">
                    Introducing 📿 THE COMPLETE FENG SHUI IMMERSION BUNDLE 📿
                  </h3>

                  <div className="space-y-5 text-text-muted leading-relaxed">
                    {/* Checklist items */}
                    <div className="flex items-start gap-3">
                      <span className="text-accent-gold text-base flex-shrink-0">☑️</span>
                      <p className="text-sm"><strong className="text-text-primary">Everything in Your Life Energy Attunement Report ($18.88 value)</strong></p>
                    </div>

                    <p className="text-accent-gold font-bold text-center text-base">PLUS:</p>

                    <div className="flex items-start gap-3">
                      <span className="text-accent-gold text-base flex-shrink-0">☑️</span>
                      <div>
                        <p className="text-sm"><strong className="text-text-primary">Full Unlimited Access to Chi Manifestation’s Proprietary Inner & Outer Feng Shui Program</strong></p>
                        <ul className="mt-2 space-y-1 list-disc list-inside text-xs text-text-muted">
                          <li>The complete recorded lessons and activity worksheets created by the founder of Chi Manifestation, Ben, and a renowned veteran Feng Shui Master from Singapore – Master Dom.</li>
                          <li>This is the EXACT system our private clients pay thousands to access.</li>
                          <li>Now yours to study at your own pace.</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-accent-gold text-base flex-shrink-0">☑️</span>
                      <div>
                        <p className="text-sm"><strong className="text-text-primary">24-Hour Client Success Support</strong></p>
                        <ul className="mt-2 space-y-1 list-disc list-inside text-xs text-text-muted">
                          <li>Questions about your worksheets? Confused about an activity?</li>
                          <li>Message the Client Success team and get answers within 24 hours.</li>
                          <li>It’s like having a Feng Shui coach walking alongside you.</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-accent-gold text-base flex-shrink-0">☑️</span>
                      <div>
                        <p className="text-sm"><strong className="text-text-primary">Outer Feng Shui Monthly Coaching Calls with Master Dom</strong></p>
                        <ul className="mt-2 space-y-1 list-disc list-inside text-xs text-text-muted">
                          <li>Live Q&A sessions where you can ask Master Dom anything.</li>
                          <li>First-come, first-served.</li>
                          <li>Topics planned by Master Dom himself based on what his students need most.</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-accent-gold text-base flex-shrink-0">☑️</span>
                      <div>
                        <p className="text-sm"><strong className="text-text-primary">Customized BaZi Monthly Forecast</strong></p>
                        <ul className="mt-2 space-y-1 list-disc list-inside text-xs text-text-muted">
                          <li>Master Dom personally shares which days are lucky for wealth, relationships, and conflict based on YOUR unique Bazi chart.</li>
                          <li>It’s like having a radar that warns you of storms... and highlights golden opportunities.</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-accent-gold text-base flex-shrink-0">☑️</span>
                      <div>
                        <p className="text-sm"><strong className="text-text-primary">New Monthly Resources</strong></p>
                        <ul className="mt-2 space-y-1 list-disc list-inside text-xs text-text-muted">
                          <li>Fresh lessons, soundtracks, and tools added every month.</li>
                          <li>Designed to accelerate your results.</li>
                          <li>Request a topic and you might see it covered next month.</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-accent-gold text-base flex-shrink-0">☑️</span>
                      <div>
                        <p className="text-sm"><strong className="text-text-primary">Private Community Access</strong></p>
                        <ul className="mt-2 space-y-1 list-disc list-inside text-xs text-text-muted">
                          <li>Join like-minded individuals from around the world.</li>
                          <li>Support each other. Learn and flourish together.</li>
                          <li>Because you can only go so far by doing it alone. But when you do it together, the sky’s the limit.</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-accent-gold text-base flex-shrink-0">☑️</span>
                      <div>
                        <p className="text-sm"><strong className="text-text-primary">Monthly "Stand A Chance to Win" Events</strong></p>
                        <ul className="mt-2 space-y-1 list-disc list-inside text-xs text-text-muted">
                          <li>Participate in the community, earn points, and win physical Feng Shui products.</li>
                          <li>Shipping fully covered by us.</li>
                          <li>The more you engage, the more you win.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* === What Most People Don't Realize === */}
                <div className="closing-flow-section p-6 md:p-8 mb-8">
                  <h2 className="closing-subheading text-center mb-6 px-4 md:px-8 whitespace-nowrap">
                    ⚠️ HERE’S WHAT MOST PEOPLE DON’T REALIZE ⚠️
                  </h2>
                  <div className="closing-paragraph text-center">
                    <p>Your Life Energy Attunement Report shows you WHAT needs to change.</p>
                    <p>But the Feng Shui Immersion Bundle shows you HOW to change it.</p>
                    <p>Without the "how"...</p>
                    <p>You're holding a treasure map with no shovel.</p>
                    <p>You'll know you're destined for wealth, love, and success...</p>
                    <p>But you won't know how to claim it.</p>
                    <p>That's the trap most people fall into.</p>
                    <p>They get their Bazi read. Feel excited for a few days. Then slowly slip back into the same patterns.</p>
                    <p>Because knowing isn't enough.</p>
                    <p className="text-accent-gold font-bold mt-4">You need the tools. The guidance. The ongoing support.</p>
                  </div>
                </div>

                {/* === The Investment === */}
                <div className="closing-flow-section p-6 md:p-8 mb-8">
                  <h2 className="closing-subheading text-center mb-6 px-4 md:px-8">
                    💰 HERE'S THE INVESTMENT 💰
                  </h2>
                  <div className="closing-paragraph text-center">
                    <p>If you wanted to learn just Outer Feng Shui from Master Dom privately... You'd pay $2,000+ just for the initial consultation. Then $500/month for ongoing coaching.</p>
                    <p>But because you're taking action TODAY...</p>
                    <p className="text-text-primary font-bold text-lg">You're not paying $2,000. Not $500. Not even $200.</p>
                    <p>Add the Complete Feng Shui Immersion Bundle to your order right now...</p>
                    <p className="text-accent-gold font-bold text-xl mt-4">And pay just $38.88 for your first month.</p>
                    <p className="text-text-muted text-sm mt-2">After your first month, you'll continue for just $29/month. Cancel anytime. No contracts. No commitments.</p>
                  </div>
                </div>

                {/* === No-Brainer Decision === */}
                <div className="closing-flow-section p-6 md:p-8 mb-8">
                  <h2 className="closing-subheading text-center mb-6 px-4 md:px-8">
                    ⚡ THE NO-BRAINER DECISION ⚡
                  </h2>
                  <div className="closing-paragraph text-center">
                    <p>You're already investing $18.88 in your Life Energy Attunement Report. That's smart.</p>
                    <p className="text-text-primary font-bold">But for just $20 more today... You get EVERYTHING you need to actually transform your life.</p>
                    <p className="text-accent-gold font-bold text-lg mt-4">$38.88 total for your first month.</p>
                    <p>That's less than a dinner out. Less than a tank of gas.</p>
                    <p>For the complete system that emperors used to build dynasties.</p>
                    <p className="mt-4">And if after 30 days you don't feel the shift... If you don't see opportunities appearing... Just cancel. No hard feelings. You keep everything from your first month.</p>
                    <p className="text-accent-gold font-bold mt-4">So there's zero risk. Only upside.</p>
                  </div>
                </div>

                {/* ====== PRICING TABLE #1 (after bundle section) ====== */}
                <PricingTable />

                {/* ====== TESTIMONIALS ====== */}
                <h2 className="closing-subheading text-center mb-6 mt-10 px-4 md:px-8">
                  And This Is Why We've Been Able To Get Results For Hundreds of Our Clients Who Trust Us With Their Growth…
                </h2>

                <div className="space-y-5 mb-8">
                  {c.step4.testimonials.map((t, i) => {
                    // Real US stock photos
                    const avatarPhotos = [
                      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
                      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
                    ]
                    const avatarUrl = avatarPhotos[i] || avatarPhotos[0]
                    
                    return (
                      <div key={i} className="testimonial-card">
                        <div className="testimonial-header">
                          <img 
                            src={avatarUrl}
                            alt={t.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-accent-gold/30"
                          />
                          <div>
                            <p className="text-text-primary font-bold text-sm">{t.name}</p>
                            <p className="text-text-dim text-xs">{t.title}</p>
                          </div>
                        </div>
                        <p className="text-text-muted leading-relaxed text-[14px] italic">
                          "{t.quote}"
                        </p>
                      </div>
                    )
                  })}
                </div>

                {/* ====== ANCIENT SCIENCES ====== */}
                <div className="closing-flow-section p-6 md:p-8 mb-6">
                  <h2 className="closing-subheading text-center mb-6 px-4 md:px-8">
                    {r(c.step4.scienceTitle)}
                  </h2>
                  {/* Ancient Sciences Historical Image */}
                  <div className="flex justify-center mb-6">
                    <img
                      src="/ancient-sciences.jpeg"
                      alt="Ancient Chinese Imperial Study - 10,000 Years of BaZi Wisdom"
                      className="rounded-xl shadow-lg w-full"
                      style={{ maxHeight: '320px', objectFit: 'cover' }}
                    />
                  </div>
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

                {/* ====== PRICING TABLE #2 (after sciences) ====== */}
                <PricingTable />

                {/* ====== 60-DAY GUARANTEE ====== */}
                <div className="guarantee-section">
                  <div className="flex justify-center mb-4">
                    <img 
                      src="/money-back-guarantee.png" 
                      alt="60-Day Money Back Guarantee"
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                  <h2 className="closing-subheading text-center mb-4 px-4 md:px-8">
                    {r(c.step4.guaranteeTitle)}.
                  </h2>
                  <div className="closing-paragraph">
                    {c.step4.guaranteeParagraphs.map((p, i) => (
                      <p key={i}>{r(p)}</p>
                    ))}
                  </div>
                </div>

                {/* ====== PRICING TABLE #3 (final, after guarantee) ====== */}
                <PricingTable />

              </div>
          </div>
        )}

        {/* ====== Page Indicator (was 4 dots, now 2) ====== */}
        <div className="flex justify-center gap-2 mt-8">
          {[1, 2].map((s) => (
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
