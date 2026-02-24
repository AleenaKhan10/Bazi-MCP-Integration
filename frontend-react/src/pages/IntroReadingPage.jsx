/* ===========================================
   Intro Reading Page — Personalized Day Master Intro
   ===========================================
   
   This page appears AFTER the Loading Page and BEFORE
   the detailed Reading Page. It builds anticipation
   with personalized storytelling about the user's
   Day Master.
   
   ROUTE: /intro
   NEXT: /reading (via "REVEAL MY DAYMASTER READING" button)
   
   Uses %NAME% and %DAYMASTER% placeholders replaced
   with real user data from QuizContext.
*/

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'
import DAY_MASTERS from '../data/dayMasters'

export default function IntroReadingPage() {
  const navigate = useNavigate()
  const { formData, baziResult } = useQuiz()

  // Guard
  useEffect(() => {
    if (!formData.firstName || !baziResult) {
      navigate('/')
    }
  }, [formData.firstName, baziResult, navigate])

  if (!baziResult) return null

  const dayMasterChar = baziResult['日主'] || '庚'
  const master = DAY_MASTERS[dayMasterChar] || DAY_MASTERS['庚']
  const userName = formData.firstName
  const dayMasterName = `${master.polarity} ${master.element}`

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">

        {/* ====== SECTION 1: Welcome Header ====== */}
        <div className="text-center mb-10 animate-fade-in-up">
          <p className="text-accent-gold text-xs tracking-[0.25em] uppercase font-mystical mb-4">
            ✦ YOUR LIFE ENERGY CHART READING ✦
          </p>
          <h1 className="text-2xl md:text-3xl font-mystical font-bold text-text-primary leading-snug mb-2">
            Welcome To Your Life Energy Chart Reading {userName}.
          </h1>
          <h2 className="text-xl md:text-2xl font-mystical font-bold text-gold-gradient leading-snug">
            The First Aspect We'll Explore Is Your Day Master,
            <br />
            Because It Reveals So Much About The Power Within You...
          </h2>
        </div>

        {/* ====== SECTION 2: Day Master Intro ====== */}
        <div className="glass-card-inner p-6 md:p-8 mb-0 animate-fade-in-up-delay-1 intro-reading-content">
          <p>
            That's because your <span className="text-accent-gold font-semibold">{dayMasterName}</span> Day Master has unique qualities that can completely shift the way that you tap into the resources around you...
          </p>
          <p>Unlike traditional personality readings, or even intelligence tests...</p>
          <p>
            Your Day Master offers you the key to a holistic and grounded system that can help you to see not just <em>how intelligent, lucky, or downright 'gifted'</em> you are...
          </p>
          <p><em>But also show you how you can make these gifts 'work together'.</em></p>
          <p>
            Just a tiny shift in your <span className="text-accent-gold font-semibold">{dayMasterName}</span> Day Master produces wildly different results, and this is why each person's fate is so unique... <em>and worth understanding like yours...</em>
          </p>
          <p>
            And your reading today {userName}, has been tested, refined, and sharpened for thousands of years...
          </p>

          {/* Centered emphasis */}
          <div className="text-center my-8">
            <p className="text-accent-gold italic font-mystical text-lg leading-relaxed">
              It may just be the final key that you need to
              <br />unlock a new world of potential,
              <br />harmony and alignment with your goals...
            </p>
          </div>

          <p>
            In just a moment, I'll go into how your <span className="text-accent-gold font-semibold">{dayMasterName}</span> Day Master has shaped the trajectory of your life... leading to this very moment today, and the patterns that will show you the future paths that lie ahead of you...
          </p>
          <p>
            This is because your <strong className="text-text-primary">Day Master</strong> essentially shows you how 'energy' is transformed in your chart...
          </p>
          <p>It is the 'core engine' of your personality.</p>
        </div>

        {/* ====== SECTION 3: Core Engine + Frequencies ====== */}
        <div className="glass-card-inner p-6 md:p-8 mb-6 animate-fade-in-up-delay-2 intro-reading-content">
          <p>It shows you how you create.</p>
          <p>It shows you how you make a real impact in the world.</p>
          <p>
            It shows you the <strong className="text-text-primary"><em>frequencies</em></strong> that you put out into the universe, <strong className="text-text-primary"><em>how</em></strong> others <strong>see</strong> you – and the reasons why they would prize you, and see you as a <strong className="text-text-primary"><em>valuable, indispensable</em></strong> individual...
          </p>

          <div className="text-center my-8">
            <p className="text-text-muted leading-relaxed">
              And through extracting these crucial insights
              <br />about your energetic essence
              <br />from your <span className="text-accent-gold">{dayMasterName}</span> Day Master...
            </p>
            <p className="text-text-primary font-semibold mt-4 leading-relaxed">
              The simple adjustments that can completely <strong>alter</strong>
              <br />the trajectory of your life... <strong>will be revealed to you.</strong>
            </p>
          </div>

          <p>
            You see, your <span className="text-accent-gold font-semibold">{dayMasterName}</span> Day Master operates like a gravitational field around your life.
          </p>
          <p><strong className="text-text-primary"><em>Let me prove it to you.</em></strong></p>
          <p>
            Whether you believe in this kind of thing or not, you've probably noticed certain patterns that keep repeating in your experiences...
          </p>
          <ul className="intro-reading-list">
            <li>The same types of people who show up in your life over and over again...</li>
            <li>The same kinds of opportunities that seem to find you, almost like they're magnetically drawn to something about you...</li>
            <li>Even the same types of challenges that keep appearing, as if the universe is trying to teach you something specific.</li>
          </ul>
          <p>Think of it like this...</p>
        </div>

        {/* ====== SECTION 4: Gravitational Field ====== */}
        <div className="glass-card-inner p-6 md:p-8 mb-6 animate-fade-in-up-delay-3 intro-reading-content">
          <p>Just as planets have gravitational fields that attract certain objects while repelling others...</p>
          <p>
            Your <span className="text-accent-gold font-semibold">{dayMasterName}</span> Day Master creates an invisible force field that draws specific experiences, people, and situations into your orbit.
          </p>
          <p>
            It's the alchemical core of who you are – the central <strong className="text-text-primary"><em><u>pivot point</u></em></strong> that transforms everything that enters your life into either fuel for your growth or resistance that strengthens your authentic nature.
          </p>
          <p>
            This is the source of <strong className="text-text-primary"><em>your personal magic</em></strong> – giving even the most skeptical individuals breakthroughs that seem 'miraculous' and unexplainable by conventional science...
          </p>
          <ul className="intro-reading-list">
            <li>Those moments when everything just "clicked" without you understanding why...</li>
            <li>Those times when the perfect person appeared exactly when you needed them...</li>
            <li>Those opportunities that felt like they were custom-designed for your specific talents...</li>
          </ul>
          <p>
            That's your Day Master's <strong className="text-text-primary"><em>gravitational field</em></strong> pulling experiences toward you that match your energetic frequency.
          </p>
        </div>

        {/* ====== SECTION 5: Now That's Just the Beginning ====== */}
        <div className="glass-card-inner p-6 md:p-8 mb-6 intro-reading-content">
          <h3 className="text-xl md:text-2xl font-mystical font-bold text-text-primary text-center mb-6">
            Now that's just the beginning, {userName}
          </h3>
          <p>
            Once you understand how your gravitational field works – how your <span className="text-accent-gold font-semibold">{dayMasterName}</span> attracts, transforms, and expresses energy – you can consciously work with it instead of just being at the 'whims' to the energies that the world gives you.
          </p>
          <p>When you use the power of your Day Master...</p>
          <ul className="intro-reading-list">
            <li>You can position yourself in the flow of experiences that strengthen your core essence...</li>
            <li>You can recognize and avoid the patterns that drain your vital force...</li>
            <li>You can amplify the frequencies that draw your ideal opportunities and relationships...</li>
          </ul>
          <p>
            It's like finally getting the <strong className="text-text-primary"><em>user manual</em></strong> for the <strong className="text-text-primary"><em>mysterious force</em></strong> that's been shaping your entire life.
          </p>
          <p>
            This is the seed of your soul's expression. And when you learn to plant it in the right soil, water it with the right energy, and give it the right conditions to flourish...
          </p>
          <p>
            That's when your life stops feeling like a series of random events and starts feeling like a magnificent unfolding of your deepest potential...
          </p>
        </div>

        {/* ====== SECTION 6: Ancient Masters ====== */}
        <div className="glass-card-inner p-6 md:p-8 mb-6 intro-reading-content">
          <div className="text-center mb-6">
            <h3 className="text-xl md:text-2xl font-mystical font-bold text-text-primary leading-snug">
              What the Ancient Masters discovered
              <br />
              <span className="text-gold-gradient">will give you chills that tingle down your spine, {userName}...</span>
            </h3>
          </div>

          <p className="italic text-text-muted">
            For over 2,000 years, Chinese emperors used your exact <span className="text-accent-gold">{dayMasterName}</span> Day Master pattern to make decisions that determined the fate of millions...
          </p>
          <p className="italic text-text-muted">
            The Imperial Astronomical Bureau identified that every person born carries one of ten "Heavenly Stems" that govern how they naturally transform energy into action.
          </p>
          <p>
            <strong className="text-accent-gold italic">Your {dayMasterName} is that governing force.</strong>
          </p>
          <p>
            Tang Dynasty General Li Jing conquered half of Asia by systematically placing officers according to their Day Master elements. Military records show he achieved a <strong className="text-text-primary"><u>94% success rate</u></strong> in campaigns where Day Master compatibility was calculated versus <strong className="text-text-primary"><u>23% when it was ignored.</u></strong>
          </p>
          <p>
            This is why it's normal for individuals who use their Day Masters to be able to make leaps and bounds in their personal lives and careers... doubling their monthly income by <strong className="text-text-primary"><em>making simple adjustments</em></strong> that bring them closer to what's in their true destiny, because the day master goes beyond just your "birth month" unlike traditional astrology.
          </p>
          <p>
            In 960 CE, Xu Ziping, while studying thousands of imperial court records, found out that your Day Master doesn't just describe your personality – it creates a "gravitational field" that literally draws specific types of experiences toward you through a <strong>stem</strong> that connects you to the rest of the world.
          </p>
        </div>

        {/* ====== SECTION 7: Xu Ziping's Discovery ====== */}
        <div className="glass-card-inner p-6 md:p-8 mb-6 intro-reading-content">
          <p>
            But Xu Ziping noticed something the imperial court records revealed: people with identical birth years often had completely different fates.
          </p>
          <p>
            Court astrologers relied on the crude "Year Branch" system – essentially judging everyone born in the Year of the Rat by rat behavior, everyone born in the Year of the Tiger by tiger nature.
          </p>
          <p>
            It was like trying to understand a person's entire life by knowing only <strong className="text-text-primary"><em>what year they were born.</em></strong>
          </p>
          <p>Some Rat-year individuals became wealthy merchants, others died in poverty. Some Tiger-year people became great generals, others never left their villages.</p>
          <p>The missing piece was the Day Master – your individual cosmic fingerprint.</p>

          <div className="text-center my-8">
            <p className="text-accent-gold font-mystical font-bold text-lg">
              The genius of Xu Ziping's system was recognizing
              <br />the "roots, seeds, and fruits" principle...
            </p>
          </div>

          <p>
            Your Day Master is the seed (your essential nature), your other pillars are the roots (your foundation and support system), and your life experiences are the fruits that naturally grow when everything aligns.
          </p>
          <p>
            This is why people who understand their Day Master can seemingly "attract" the right opportunities, as they're simply aligning with their natural gravitational field, like a river finding the easiest path to the sea...
          </p>
          <p>Conversations flow naturally toward topics that fascinate you...</p>
          <p>You find yourself in the right place at the right time, seemingly by accident...</p>
          <p>
            People offer you opportunities that perfectly match your hidden talents. Projects that would exhaust others energize you instead...
          </p>
        </div>

        {/* ====== SECTION 8: Swimming Upstream + CTA ====== */}
        <div className="glass-card p-8 text-center mb-8 glow-gold-strong intro-reading-content">
          <div className="mb-8">
            <p className="text-text-muted italic text-lg leading-relaxed mb-6">
              It's like discovering you've been
              <br />swimming upstream your entire life,
              <br />then finally turning around...
            </p>
            <p className="text-text-primary leading-relaxed">
              And now, let's explore the powerful flow of energy
              <br />moving through your <span className="text-accent-gold font-semibold">{dayMasterName}</span> Day Master in breathtaking detail...
            </p>
          </div>

          {/* ====== REVEAL Button ====== */}
          <button
            onClick={() => navigate('/reading')}
            className="btn-mystical text-base tracking-wider"
          >
            ✦ REVEAL MY DAYMASTER READING
          </button>
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
