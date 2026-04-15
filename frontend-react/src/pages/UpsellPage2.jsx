import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import DAY_MASTERS from '../data/dayMasters';

export default function UpsellPage2() {
  const navigate = useNavigate();
  const { formData, baziResult } = useQuiz();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = "Private Invitation To A 1-1 Consultation With A Feng Shui Master"
  }, []);

  const dayMasterChar = baziResult?.['日主'] || '庚';
  const master = DAY_MASTERS[dayMasterChar] || DAY_MASTERS['庚'];
  const userName = formData?.firstName || 'Friend';
  const dayMasterName = `${master.polarity} ${master.element}`;
  const attackingName = master.attackedBy;

  // --- Dynamic Text Replacer (just in case it's needed) --- 
  const r = (text) => {
    return text.replace(/%FIRSTNAME%/g, userName)
               .replace(/%NAME%/g, userName)
               .replace(/%DAY MASTER%/g, dayMasterName)
               .replace(/%DAY MASTER ATTACKING%/g, attackingName);
  };

  const handleUpgrade = () => {
    window.location.href = 'https://track.chimanifestation.com/bazi-oto2';
  };

  const handleDecline = () => {
    window.location.href = 'https://www.chimanifestation.com/bazi-summary';
  };

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto animate-fade-in-up">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-6 px-4 md:px-8">
          <h1 className="closing-section-heading mb-8">
            WAIT! Your Chart Just Revealed Something Critical
          </h1>
          <h2 className="closing-subheading">
            Before you leave this page, there's something urgent Master Dom needs to tell you about what he saw in your BaZi...
          </h2>
        </div>

        {/* INTRO + MASTER DOM IMAGE */}
        <div className="closing-flow-section px-6 md:px-8 pt-2 pb-6 md:pb-8 mb-2">
          <div className="flex flex-col-reverse md:flex-row gap-6 items-stretch mb-6">
            <div className="flex-1 closing-paragraph">
              <p>
                <strong className="text-accent-gold">{userName}</strong>, you just took the first step toward unlocking the abundance that's been hidden in your chart for years.
              </p>
              <p>But I need to be brutally honest with you right now.</p>
              <p><strong className="text-text-primary">The digital report you just received is only showing you HALF the picture.</strong></p>
              <p>And that's not because we're holding anything back from you.</p>
              <p>It's because there are things buried in your chart – <strong className="text-text-primary">nuances, clashing energies, hidden opportunities</strong> – that no algorithm can see.</p>
              <p>Things that require Master Dom's eyes. His training. His 20+ years of experience studying charts from generations of feng shui masters.</p>
              <p>Let me show you what I mean…</p>
            </div>
            <div className="w-full md:w-1/2 flex-shrink-0">
               <img src="/upsell2-page-images/29.png" alt="Master Dom" className="w-full aspect-square md:aspect-auto md:h-full object-cover rounded-xl shadow-lg" />
            </div>
          </div>
        </div>

        {/* 3 THINGS SECTION */}
        <div className="text-center mb-4 px-4 md:px-8 mt-4">
          <h2 className="closing-subheading px-8 md:px-16">
            The 3 Things Your Digital Report CAN'T Tell You (That Are Costing You Money Right Now)
          </h2>
        </div>

        <div className="closing-flow-section p-6 md:p-8 mb-6">
          
          {/* #1 */}
          <div className="mb-12">
            <h3 className="closing-subheading mb-6">
              #1: The Exact Money Windows
            </h3>
            <div className="closing-paragraph">
              <p>Your report shows you which elements are weak and which are strong.</p>
              <p>But it can't tell you WHEN the wealth energy opens up in your chart... or how long that window stays open.</p>
              <p>Now what's great about the report is that it shows you what you can look forward to on a month to month basis…</p>
              <p>But what Master Dom is really great at telling you…is the <strong className="text-text-primary">exact LUCKY days</strong> that you're most likely to have a breakthrough.</p>
              <p><strong className="text-text-primary">Master Dom can look at your chart and tell you:</strong></p>
              <p className="italic font-bold text-text-primary opacity-90 pl-4 py-2 my-2 border-l-4 border-accent-gold">
                "Your Wealth Palace activates in 23 days. You have exactly 47 days to make a major financial move – ask for the raise, launch the business, make the investment. After that, the window closes for 11 months."
              </p>
              <p>This is how lottery winners happen, {userName}.</p>
              <p>People think it's random luck. It's not.</p>
              <p>Master Dom has worked with THREE clients who hit major lottery wins ($50K, $180K, and $1.1M) after he told them their exact luck timing windows.</p>
              <p>They bought tickets during their <strong className="text-text-primary">Windfall Wealth Days</strong>.</p>
              <p>Not because Master Dom told them the numbers. Because he told them WHEN their chart was magnetically aligned to attract sudden money.</p>
              <p>That level of precision? You can't get that from a PDF. That's 40+ years of reading charts and watching patterns play out in real time.</p>
            </div>
          </div>

          {/* #2 */}
          <div className="mb-12">
            <h3 className="closing-subheading mb-6">
              #2: The Hidden Money Blocks
            </h3>
            <div className="closing-paragraph">
              <p>Sometimes your chart LOOKS like it should be generating wealth.</p>
              <p>You've got strong Wood. Your Wealth Star is in a decent position. Everything checks out on paper.</p>
              <p>But the money still isn't flowing.</p>
              <p>Why?</p>
              <p>Master Dom examines the relationship between your Day Pillar, your Wealth Palace, and your current luck cycle... and he spots what's actually blocking the money.</p>
              <p>Maybe it's a "secret enemy" energy sitting in your career sector that's repelling opportunities.</p>
              <p>Maybe it's an ancestral money blockage passed down through your family line that gets activated every time you're about to break through.</p>
              <p>Maybe it's a clash between your personal energy and the DIRECTION your money is trying to come from (which is why you keep getting "close" but deals fall through at the last second).</p>
              <p>These blind spots are costing you thousands – maybe hundreds of thousands – in lost income.</p>
              <p>And the worst part? You're working harder than ever, doing all the "right" things, but the money just... doesn't stick.</p>
              <p>Master Dom finds the blockage. Then he tells you exactly how to dissolve it.</p>
            </div>
          </div>

          {/* #3 */}
          <div className="mb-12">
            <h3 className="closing-subheading mb-6">
              #3: Specific, Personalised Wealth Remedies That ACCELERATE Money Flow
            </h3>
            <div className="closing-paragraph">
              <p>Your report gave you the <strong className="italic">foundations</strong> to this very next step.</p>
              <p>But here's what most people don't understand, {userName}...</p>
              <p>Master Dom doesn't give you cookie-cutter solutions ripped from a feng shui book.</p>
              <p>He looks at YOUR chart. YOUR home. YOUR current financial situation.</p>
              <p>Then he gives you the <strong className="text-text-primary">accelerated remedy protocol</strong> that's designed specifically for your energy blueprint.</p>
              <p>Sometimes it's as simple as moving your bed 3 feet to the left and changing which direction you sleep.</p>
              <p>One client did exactly that – moved his bed, faced it northeast instead of south – and within 6 weeks he closed a $340,000 deal that had been stalled for 9 months.</p>
              <p>Another client was told to remove a specific painting from above her desk (it was activating a loss energy in her chart). She took it down on a Tuesday. By Friday, a former client called out of nowhere and sent her a $28,000 payment she'd written off as a loss two years prior.</p>
              <p>These aren't coincidences, {userName}.</p>
              <p><strong className="text-text-primary">This is what happens when you align your environment with your chart's natural wealth magnetism.</strong></p>
              <p>Master Dom has orchestrated dozens of these "complete home turnarounds" where people's finances flip within 30-90 days just by making precise adjustments based on their BaZi.</p>
              <p>New job offers. Unexpected bonuses. Debt forgiveness. Sudden windfalls. Back payments. Deals that were dead suddenly come back to life.</p>
              <p>That's the power of working with someone who doesn't just READ your chart...</p>
              <p><strong className="text-text-primary">He shows you how to ACTIVATE the wealth that's already encoded in it.</strong></p>
            </div>
          </div>
        </div>

        {/* STORY SECTION */}
        <div className="text-center mb-2 px-4 md:px-8">
          <h2 className="closing-subheading px-8 md:px-16">
            Here's What Happened When Sarah Ignored This Step
          </h2>
        </div>

        <div className="closing-flow-section p-6 md:p-8 mb-6">
          <div className="flex justify-center mb-6">
            <img src="/upsell2-page-images/30.png" alt="Sarah Story" className="rounded-xl shadow-lg w-full" />
          </div>

          <div className="closing-paragraph">
            <p>Sarah bought the digital report last year.</p>
            <p>She was going through a rough patch. Her marriage was falling apart. Her business was hemorrhaging cash. She felt like she was drowning.</p>
            <p>The report confirmed what she suspected – massive Fire deficiency, Metal attacking her Relationship Palace, and a "death particle" sitting on her Wealth luck.</p>
            <p>She read it. She felt validated. Then she closed the tab and went back to her life.</p>
            <p>Three months later, nothing had changed.</p>
            <p>Her husband filed for divorce.</p>
            <p>She had to shut down her business.</p>
            <p>She lost $80,000 in savings trying to "fix" things with therapists, business coaches, and a shady feng shui consultant who told her to buy $4,000 worth of crystals that did absolutely nothing.</p>
            <p>Then she came back to us, desperate, and finally booked a session with Master Dom.</p>
            <p><em className="italic font-bold text-text-primary">Within the first 10 minutes, he saw what the report missed.</em></p>

            <div className="flex justify-center my-8">
              <img src="/upsell2-page-images/31.png" alt="Finding the clash" className="rounded-xl shadow-lg w-full" />
            </div>

            <p>There was a hidden clash between her Day Master and her spouse's chart. A clash that had been there since the day they met, but got ACTIVATED in 2024 when a specific luck pillar kicked in.</p>
            <p>And what happened was that during the call I asked one question that changed everything.</p>
            <p><em className="italic font-bold text-accent-gold text-xl tracking-wide">"What's your husband's bazi chart?"</em></p>
            <p>She gave him the details, and soon, he found the missing piece that was breaking apart their marriage, and it was discovered right in their home!</p>
            <p>No amount of couples therapy was going to fix that. It was energetic.</p>
            <p>Master Dom gave her three specific adjustments to make in her home. Told her the exact date to sign the divorce papers (to minimize financial loss), and showed her when her Wealth luck would open back up so she could rebuild.</p>
            <p>Within 6 months, Sarah had a new business generating $30K/month, a new relationship, and she told me she felt like she'd been "released from prison."</p>
            <p>All because she didn't stop at the digital report.</p>
          </div>
        </div>

        {/* OFFER PITCH */}
        <div className="text-center mb-2 px-4 md:px-8 mt-8">
          <h2 className="closing-subheading px-8 md:px-16">
            So Here's What I'm Offering You Right Now
          </h2>
        </div>

        <div className="closing-flow-section px-6 md:px-8 pt-2 pb-6 md:pb-8 mb-6">
          <div className="closing-paragraph">
            <p>Normally, a private session with Master Dom books out 6-8 weeks in advance.</p>
            <p>His hourly rate for consultations is $397.</p>
            <p>But because you just showed us how committed you are in transforming your life by purchasing the Life Energy Attunement Report…</p>
            <p>And because I know how critical the next 90 days are for your chart specifically...</p>
            <p><strong className="text-text-primary">I've worked closely with him to open up a limited number of "Emergency Chart Analysis" sessions, at just $197 (50% Off) for Chi Manifestation members.</strong></p>
            <p>These are 45-minute deep-dive, 1-1 private Zoom calls with Master Dom where he will:</p>
          </div>
            
          <ul className="closing-bullet-list mt-8 space-y-4">
            <li>
              <span className="text-accent-gold mr-5 mt-1 flex-shrink-0">●</span>
              <span><strong className="text-text-primary">Go line-by-line through your BaZi chart</strong> and explain the nuances the digital report couldn't capture</span>
            </li>
            <li>
              <span className="text-accent-gold mr-5 mt-1 flex-shrink-0">●</span>
              <span><strong className="text-text-primary">Identify the hidden money blocks, clashing energies, and wealth repellents</strong> that are sabotaging your income, relationships, and opportunities right now</span>
            </li>
            <li>
              <span className="text-accent-gold mr-5 mt-1 flex-shrink-0">●</span>
              <span><strong className="text-text-primary">Tell you the exact timing windows</strong> when your Wealth Palace activates (so you know precisely when to make your financial moves and when to hold back)</span>
            </li>
            <li>
              <span className="text-accent-gold mr-5 mt-1 flex-shrink-0">●</span>
              <span><strong className="text-text-primary">Give you personalized wealth acceleration remedies</strong> that are specific to YOUR chart, YOUR home, and YOUR goals (not generic one-size-fits-all advice that could actually make things worse)</span>
            </li>
            <li>
              <span className="text-accent-gold mr-5 mt-1 flex-shrink-0">●</span>
              <span><strong className="text-text-primary">Answer your most pressing questions</strong> – the ones keeping you up at 3 AM wondering if you're making the right decision about your career, your relationship, your next move</span>
            </li>
          </ul>

          <div className="closing-paragraph mt-4">
            <p>This is your chance to sit across from a generational feng shui master and get the clarity you've been searching for.</p>
            <p>No more guessing.</p>
            <p>No more "trying things" and hoping they work.</p>
            <p>You'll leave this session with a crystal-clear action plan and the confidence that you're finally moving in the right direction.</p>
          </div>
        </div>

        {/* INCLUSIONS SECTION */}
        <div className="closing-flow-section p-6 md:p-8 mb-6">
          <h2 className="closing-subheading text-center mb-6 px-4 md:px-8">
            Here's Everything You're Getting
          </h2>
          <div className="closing-paragraph">
            <p className="text-white">When you say YES to this Emergency Chart Analysis session, here's what happens:</p>
          </div>
          
          <div className="space-y-4 mt-6">
            <div className="inclusion-card">
              <div className="inclusion-card-icon">
                <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
              </div>
              <div className="inclusion-card-text">
                <strong className="text-text-primary">45-Minute Private Zoom Session with Master Dom</strong> <span className="text-text-muted text-sm">(Value: $397)</span>
                <p className="mt-1 text-[15px] opacity-90">You'll receive a calendar link on the next page to book your session, preferably within the next 7-14 days. Master Dom will have your chart pulled up on screen and will walk you through everything you need to know.</p>
              </div>
            </div>

            <div className="inclusion-card">
              <div className="inclusion-card-icon">
                <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
              </div>
              <div className="inclusion-card-text">
                <strong className="text-text-primary">Personalized Wealth Acceleration Action Plan</strong> <span className="text-text-muted text-sm">(Value: $197)</span>
                <p className="mt-1 text-[15px] opacity-90">You'll get a written summary of the specific remedies Master Dom recommends for your chart, including what to do, when to do it, and why it works.</p>
              </div>
            </div>

            <div className="inclusion-card">
              <div className="inclusion-card-icon">
                <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
              </div>
              <div className="inclusion-card-text">
                <strong className="text-text-primary">Lifetime Access to the Session Recording</strong> <span className="text-text-muted text-sm">(Value: $97)</span>
                <p className="mt-1 text-[15px] opacity-90">You'll get a video recording of your session so you can revisit it anytime. These sessions are packed with information, and you'll catch new insights every time you watch.</p>
              </div>
            </div>

            <div className="inclusion-card">
              <div className="inclusion-card-icon">
                <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
              </div>
              <div className="inclusion-card-text">
                <strong className="text-text-primary">Priority Email Support for 30 Days</strong> <span className="text-text-muted text-sm">(Value: $147)</span>
                <p className="mt-1 text-[15px] opacity-90">After your session, if questions come up as you implement the remedies, you'll have direct email access to Master Dom's for 30 days.</p>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-white/10 space-y-4 mb-12">
            <p className="text-lg font-bold">Total Value: $838</p>
            <p className="text-xl font-bold">Your Price Today: Just $197</p>
            <p className="text-[15px] opacity-90">Simply click on the “Upgrade My Order” button Below to get started.</p>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-bold tracking-wider mb-4">PRIVATE CLIENT</h3>
            <div className="flex items-center justify-center gap-3 mb-6 text-3xl font-bold">
              <span className="line-through opacity-70">$397</span>
              <span className="text-red-500">$197</span>
            </div>
            <h4 className="text-xl mb-2">1-1 BaZi Consultation with Master Dom</h4>
          </div>
        </div>

        {/* CTA 1 */}
        <div className="text-center mb-10">
          <button 
            onClick={handleUpgrade} 
            className="w-[90%] md:w-[80%] max-w-[700px] mx-auto rounded-lg px-6 py-5 whitespace-normal flex flex-col items-center justify-center gap-1 transition-all border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            style={{ background: 'linear-gradient(to right, #cf4bf7, #a45afe)' }}
          >
            <span className="font-bold text-xl tracking-widest text-white uppercase">UPGRADE MY ORDER →</span>
            <span className="text-sm font-medium text-white/90 uppercase tracking-widest mt-1">1-1 BAZI CONSULTATION WITH MASTER DOM: ONLY $197 TODAY</span>
          </button>
          
          <div className="mt-8 flex justify-center">
            <div className="flex flex-col md:flex-row md:flex-wrap justify-center gap-x-8 gap-y-3 text-[15px] opacity-90 max-w-xl text-center md:text-left text-white">
              <span><span className="text-[#facc15] font-bold mr-2">✓</span>45-Minute Private Zoom Session with Master Dom ($397 value)</span>
              <span className="mt-1"><span className="text-[#facc15] font-bold mr-2">✓</span>Personalized Wealth Acceleration Action Plan ($197 value)</span>
              <span className="md:w-full md:text-center mt-1"><span className="text-[#facc15] font-bold mr-2">✓</span>Lifetime Access to the Session Recording ($97 value)</span>
              <span className="md:w-full md:text-center mt-1"><span className="text-[#facc15] font-bold mr-2">✓</span>Priority Email Support for 30 Days ($147 value)</span>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-16">
          <button 
            onClick={handleDecline} 
            className="text-sm text-text-muted hover:text-white underline underline-offset-4 opacity-70 transition-opacity hover:opacity-100"
          >
            No thanks, I'll figure out my chart on my own.
          </button>
        </div>

        {/* URGENCY SECTION */}
        <div className="text-center mb-2 px-4 md:px-8 mt-6">
          <h2 className="closing-subheading px-8 md:px-16">
            Why This Is Only Available Right Now
          </h2>
        </div>

        <div className="closing-flow-section px-6 md:px-8 pt-2 pb-6 md:pb-8 mb-6">
          <div className="closing-paragraph">
            <p>Here's the catch, <strong className="text-accent-gold">{userName}</strong>.</p>
            <p><strong className="text-text-primary">This offer only exists on this page.</strong></p>
            <p>Once you leave, it's gone.</p>
            <p>Not because I'm trying to pressure you. But because Master Dom's calendar is extremely limited, and I can only guarantee you a spot if you claim it <strong className="text-text-primary uppercase tracking-wide">Right Now</strong> while your chart is fresh in his mind.</p>
            <p>If you click away and come back later, you'll have to join the regular waitlist, and pay the original price of $397. And by the time your session rolls around, the energy window we need to address might have already closed.</p>
            <p>I don't want that to happen to you.</p>
            <p>You've already invested in your chart. You've already taken the first step.</p>
            <p><strong className="text-accent-gold">Don't stop halfway.</strong></p>
          </div>
        </div>

        {/* CAN I FIGURE OUT ON MY OWN */}
        <div className="text-center mb-2 px-4 md:px-8 mt-4">
          <h2 className="closing-subheading px-8 md:px-16">
            "But Can't I Just Figure This Out On My Own?"
          </h2>
        </div>

        <div className="closing-flow-section px-6 md:px-8 pt-2 pb-6 md:pb-8 mb-6">
          <div className="closing-paragraph">
            <p>Of course you can.</p>
            <p>You can spend the next six months Googling "BaZi remedies" and watching YouTube videos from people who learned feng shui from a weekend course.</p>
            <p>You can buy random crystals and move furniture around your house, hoping something sticks.</p>
            <p>You can keep doing what you've been doing and hope things magically improve.</p>
            <p>Or...</p>
            <p><strong className="text-text-primary">You can spend 45 minutes with someone who's been doing this for the last 20 years.</strong></p>
            <p>Someone who learned this system from his father, who learned it from HIS grandfather, going back three generations of authentic Chinese metaphysics masters.</p>
            <p>Someone who's read charts for CEOs, celebrities, and people just like you who were at a crossroads and needed real answers.</p>
            <p>The choice is yours.</p>
            <p>But I can tell you from experience though…that the people who get the BEST results are the ones who don't stop at the report.</p>
            <p>They go deeper. They ask the hard questions. They get the interpretation.</p>
            <p>And their lives change.</p>
          </div>

          {/* TESTIMONIALS */}
          <div className="my-8 space-y-6">
            
            <div className="testimonial-card">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start p-2">
                <div className="flex-shrink-0">
                  <img 
                    src="/upsell2-page-images/32.png"
                    alt="Brett H."
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                    <p className="text-text-primary font-bold text-[15px]">Brett H., Phoenix, AZ</p>
                    <p className="text-accent-gold text-xs tracking-tighter mt-1">★★★★★</p>
                  </div>
                  <p className="font-bold text-text-primary text-[15px] mb-2">"The $340K Deal That Came Out of Nowhere"</p>
                  <p className="text-text-muted leading-relaxed text-[15px]">
                    "I'd been chasing this contract for 9 months. NINE MONTHS. Every time I thought we were close, something would fall through. My partner thought I was cursed. Then I had my session with Master Dom. He looked at my chart and said 'You have a Metal clash attacking your Wealth Palace. It's creating a repelling energy every time money tries to come in.' He told me to move my desk, change which direction I faced during negotiations, and wait until a specific date to make my final pitch. I thought it sounded insane, but I was desperate. I made the changes on a Monday. That Friday, the client called and said yes to a $340,000 contract. My partner's jaw hit the floor. This wasn't luck. This was precision."
                  </p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start p-2">
                <div className="flex-shrink-0">
                  <img 
                    src="/upsell2-page-images/33.png"
                    alt="Kristen W."
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                    <p className="text-text-primary font-bold text-[15px]">Kristen W., Minneapolis, MN</p>
                    <p className="text-accent-gold text-xs tracking-tighter mt-1">★★★★★</p>
                  </div>
                  <p className="font-bold text-text-primary text-[15px] mb-2">"The Raise I'd Been Asking For... For 3 Years"</p>
                  <p className="text-text-muted leading-relaxed text-[15px]">
                    "I'd been asking for a promotion for THREE YEARS. My boss kept saying 'not yet' or 'we'll see next quarter.' I was about to quit. Then Master Dom looked at my chart during our session and said 'Your Wealth Palace activates in 11 days. That's your window. Ask on that day, not before, not after.' I marked it on my calendar. On that exact day, I walked into my boss's office and asked for a $20K raise. He said yes on the spot. No hesitation. No 'let me think about it.' Just yes. I don't know how Master Dom knew, but he KNEW."
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* DECISION SECTION */}
        <div className="text-center mb-2 px-4 md:px-8 mt-4">
          <h2 className="closing-subheading px-8 md:px-16">
            Last Thing Before You Decide
          </h2>
        </div>

        <div className="closing-flow-section px-6 md:px-8 pt-2 pb-6 md:pb-8 mb-6">
          <div className="closing-paragraph">
            <p>I want you to imagine something for me, <strong className="text-accent-gold">{userName}</strong>.</p>
            <p>Imagine it's 90 days from now.</p>
            <p>You're waking up and instead of that heavy, anxious feeling in your chest... you feel light. Clear. Certain.</p>
            <p>The decision you were agonizing over? You made it. And it was the right call.</p>
            <p>The money that was stuck? It's flowing again.</p>
            <p>The relationship that was draining you? Either it's healed or you've moved on – and either way, you're at peace.</p>
            <p>You look back at this moment – this page – and you think:</p>
            <p className="italic font-bold text-text-primary opacity-90 border-l-4 border-accent-gold pl-4 py-2 my-6">
              "Thank God I didn't click away. That session with Master Dom was the turning point."
            </p>
            <p>That's what's on the other side of this decision.</p>
            <p>Not hype. Not woo-woo nonsense.</p>
            <p><strong className="text-text-primary">Just clarity, certainty, and a plan that actually works.</strong></p>
          </div>
            
          <h3 className="closing-subheading text-center mt-12 mb-6 px-8 md:px-16">Your Next Step Is Simple</h3>
          <div className="closing-paragraph">
            <p className="text-center">Click the button below to add the Emergency Chart Analysis session to your order for just $197.</p>
            <p className="text-center">You'll be redirected to the next page immediately with a calendar link to book your session.</p>
          </div>

          {/* THIRD TESTIMONIAL */}
          <div className="testimonial-card my-8">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start p-2">
              <div className="flex-shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop&crop=face"
                  alt="Greg Hutchinson"
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                  <p className="text-text-primary font-bold text-[15px]">Greg Hutchinson, Reno, NV</p>
                  <p className="text-accent-gold text-xs tracking-tighter mt-1">★★★★★</p>
                </div>
                <p className="font-bold text-text-primary text-[15px] mb-2">"I Won $180,000 Because Master Dom Told Me When My Luck Window Opened"</p>
                <p className="text-text-muted leading-relaxed text-[15px]">
                  "I'm not a gambler. Never bought lottery tickets in my life. But during my session, Master Dom said 'You have a 9-day Windfall Wealth Window opening next month. If you want to test it, buy a ticket on day 3 and day 7.' I thought he was nuts, but I bought two tickets on those exact days. On day 7, I won $180,000. My hands were shaking when I saw the numbers. My wife thought I was having a heart attack. This wasn't random. Master Dom SAW something in my chart that I couldn't see in the digital report."
                </p>
              </div>
            </div>
          </div>

          <div className="closing-paragraph">
            <p className="text-center">
              And within 7-14 days, you'll be sitting face-to-face (virtually) with Master Dom, getting the answers you've been searching for.
            </p>
            <p className="text-center"><strong className="text-text-primary">This offer disappears the second you leave this page.</strong></p>
            <p className="text-center">
              Don't let fear or hesitation steal your breakthrough.
            </p>
          </div>
        </div>

        {/* FINAL CTA */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold tracking-wider mb-4">PRIVATE CLIENT</h3>
          <div className="flex items-center justify-center gap-3 mb-6 text-3xl font-bold">
            <span className="line-through opacity-70">$397</span>
            <span className="text-red-500">$197</span>
          </div>
          <h4 className="text-xl mb-6">1-1 BaZi Consultation with Master Dom</h4>

          <button 
            onClick={handleUpgrade} 
            className="w-[90%] md:w-[80%] max-w-[700px] mx-auto rounded-lg px-6 py-5 whitespace-normal flex flex-col items-center justify-center gap-1 transition-all border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            style={{ background: 'linear-gradient(to right, #cf4bf7, #a45afe)' }}
          >
            <span className="font-bold text-xl tracking-widest text-white uppercase">UPGRADE MY ORDER →</span>
            <span className="text-sm font-medium text-white/90 uppercase tracking-widest mt-1">1-1 BAZI CONSULTATION WITH MASTER DOM: ONLY $197 TODAY</span>
          </button>

          <div className="mt-8 flex justify-center">
            <div className="flex flex-col md:flex-row md:flex-wrap justify-center gap-x-8 gap-y-3 text-[15px] opacity-90 max-w-xl text-center md:text-left text-white">
              <span><span className="text-[#facc15] font-bold mr-2">✓</span>45-Minute Private Zoom Session with Master Dom ($397 value)</span>
              <span className="mt-1"><span className="text-[#facc15] font-bold mr-2">✓</span>Personalized Wealth Acceleration Action Plan ($197 value)</span>
              <span className="md:w-full md:text-center mt-1"><span className="text-[#facc15] font-bold mr-2">✓</span>Lifetime Access to the Session Recording ($97 value)</span>
              <span className="md:w-full md:text-center mt-1"><span className="text-[#facc15] font-bold mr-2">✓</span>Priority Email Support for 30 Days ($147 value)</span>
            </div>
          </div>
          
          <button 
            onClick={handleDecline}
            className="mt-6 text-sm text-text-muted hover:text-white underline underline-offset-4 opacity-70 transition-opacity hover:opacity-100"
          >
            No thanks, I'll figure out my chart on my own.
          </button>
        </div>

      </div>
    </div>
  );
}
