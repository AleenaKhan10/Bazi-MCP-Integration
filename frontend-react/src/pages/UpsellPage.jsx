import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import DAY_MASTERS from '../data/dayMasters';

export default function UpsellPage() {
  const navigate = useNavigate();
  const { formData, baziResult } = useQuiz();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Guard: redirect if no data
  if (!formData?.firstName || !baziResult) {
    navigate('/');
    return null;
  }

  const dayMasterChar = baziResult['日主'] || '庚';
  const master = DAY_MASTERS[dayMasterChar] || DAY_MASTERS['庚'];
  const userName = formData.firstName;
  const dayMasterName = `${master.polarity} ${master.element}`;
  const attackingName = master.attackedBy;

  // --- Dynamic Text Replacer --- 
  const r = (text) => {
    return text.replace(/%DAY MASTER%/g, dayMasterName)
               .replace(/%DAY MASTER ATTACKING%/g, attackingName);
  };

  const handlePurchase = () => {
    alert("✨ Monk Purification System added to your order! Proceeding to Stripe checkout coming soon.");
    // In a real app, this would add the upsell to cart and proceed to final checkout or one-click buy
  };

  const handleDecline = () => {
    alert("Proceeding to checkout with original order.");
    // In a real app, this would proceed to checkout without adding the upsell
  };

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto animate-fade-in-up">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-8 px-4 md:px-8">
          <h1 className="closing-section-heading mb-12">
            Congratulations On Taking The First Step Toward Unlocking Your True Energetic Potential!
          </h1>
          <h2 className="closing-section-heading">
            Stay On This Page To Discover Your First “Energy Adjustment” That Can Fix The Clashing Energies In Your Chart.
          </h2>
        </div>

        <div className="closing-flow-section p-6 md:p-8 mb-6">
          <div className="closing-paragraph">
            <p>Your Life Energy Attunement Report is being prepared and will arrive in your inbox within the next few minutes. You're about to discover exactly which energies are working for and against you…</p>
            <p>And right now, I want you to get excited for the new chapter of your life that you're about to write.</p>
            <p>Today, you've chosen to step up, and to rise to becoming a better, stronger, more prosperous individual that works towards their goal through harmony and alignment, rather than through struggle.</p>
            <p>This is one of the wisest choices that you've ever made – because you're making full use of the energy that you've been given. This means that every 'ounce' of effort, now will finally yield the truly astounding results that will make your life a holiday.</p>
            <p>You'll see yourself making progress…</p>
            <p>You'll watch yourself grow leaps and bounds…</p>
            <p>You're about to experience something most people never feel in their entire lives.</p>
            <p><strong className="text-text-primary">The sensation of effortless momentum.</strong></p>
            <p>Where your goals stop feeling like pushing a boulder uphill... and start feeling like surfing a wave that's already carrying you exactly where you want to go.</p>
            <p>Right now, at this moment, you've made a choice that will split your life into "before" and "after."</p>
            <p><strong className="text-text-primary">Before</strong>: You were stepping on snakes. Making moves that looked right but sent you sliding backward. Putting in effort that went nowhere. Watching people with half your talent somehow catch breaks you never did.</p>
            <p><strong className="text-text-primary">After</strong>: You're stepping on ladders. The same energy, the same focus, the same work ethic... but now it's <strong className="text-text-primary">compounding</strong> instead of canceling out. Every move forward stays forward. Every door you knock on swings open. Every risk you take lands.</p>
            <p>Not because you suddenly got lucky.</p>
            <p>Because you <strong className="text-text-primary">stopped fighting the current</strong> and started swimming with it.</p>
          </div>
        </div>

        {/* SALMON SALMON METAPHOR */}
        <div className="closing-flow-section p-6 md:p-8 mb-6">
          <h2 className="closing-subheading text-center mb-6 px-4 md:px-8">
            Think about a salmon trying to swim upstream.
          </h2>

          <div className="flex justify-center mb-6">
            {/* <!-- INSERT IMAGE: image-1.png --> */}
          </div>

          <div className="closing-paragraph">
            <p>Exhausting itself. Battling every inch. Using 100% of its energy just to move forward 10%.</p>
            <p>Now imagine that same salmon turning around.</p>
            <p>Suddenly it's moving 10 times faster with 10% of the effort.</p>
            <p><strong className="text-text-primary">Same fish. Same river. Different direction.</strong></p>
            <p>That's what alignment does.</p>
            <p>Your Life Energy Attunement Report shows you which direction the river of your life naturally flows... so you stop wasting years swimming against it.</p>
            <p>And when you finally turn around and let the current carry you?</p>
            <p>You'll achieve in 6 months what used to take you 6 years.</p>
            <p>Not because you're working harder.</p>
            <p>Because you're finally <strong className="text-text-primary">working with your design</strong> instead of against it.</p>
          </div>
        </div>

        {/* TRAJECTORY SECTION */}
        <div className="closing-flow-section p-6 md:p-8 mb-6">
          <h2 className="closing-subheading text-center mb-6 px-4 md:px-8">
            This is why I'm so excited for you to tear through this report.
          </h2>
          
          <div className="closing-paragraph">
            <p>The 5-minute adjustments you're about to discover won't just "improve" your life.</p>
            <p>They'll <strong className="text-text-primary">redirect the entire trajectory.</strong></p>
            <p>Like a rocket that's 1 degree off course... a tiny adjustment now means you land on a completely different planet later.</p>
            <p>Except you're not going to a different planet.</p>
            <p>You're going to <strong className="text-text-primary">your planet</strong>. The one you were supposed to reach all along.</p>
            <p>As you read through the deepest intricacies of your personality... as you discover what makes you <strong className="text-text-primary">you</strong> at the energetic level...</p>
            <p>You're gaining something no one can ever take from you.</p>
            <p><strong className="text-text-primary">Self-knowledge at the molecular level.</strong></p>
            <p>This is what separates the 5% who seem to have life figured out from the 95% still wandering in the dark.</p>
            <p>The people who "just get lucky."<br/>
              The people who "always land on their feet."<br/>
              The people who achieve escape velocity while everyone else stays stuck in the gravity well.</p>
            <p>They're not special.</p>
            <p><strong className="text-text-primary">They just know their design and they operate within it.</strong></p>
            <p>They stopped trying to be someone they're not.</p>
            <p>They stopped taking advice meant for someone with a completely different energetic blueprint.</p>
            <p>They stopped following paths that were never meant for them in the first place.</p>
            <p>And the moment you do what's right for <strong className="text-text-primary">your</strong> design...</p>
            <p>The moment you align your actions with your natural element...</p>
            <p>The moment you start making moves during your peak luck windows instead of your drain periods...</p>
            <p><strong className="text-text-primary">Everything changes.</strong></p>
          </div>
          
          {/* Note: Skiped strikethrough text from lines 99-110 in the reference document. */}

          <div className="closing-paragraph mt-4">
            <p>You're going to feel that shift in your body.</p>
            <p>That sensation when everything suddenly clicks into place.</p>
            <p>When opportunities start appearing out of nowhere.</p>
            <p>When the right people start showing up at the right time.</p>
            <p>When your income jumps without you working more hours.</p>
            <p>When relationships that were stuck for years suddenly resolve themselves.</p>
            <p><strong className="text-text-primary">This isn't magic.</strong></p>
            <p>This is what happens when you stop pouring your life force into the wrong channels and redirect it into the ones designed to carry you forward.</p>
          </div>
        </div>

        {/* 10 YEARS MAPPED OUT */}
        <div className="closing-flow-section p-6 md:p-8 mb-6">
          <h2 className="closing-subheading text-center mb-6 px-4 md:px-8">
            You're about to see the next 10 years of your life mapped out in front of you.
          </h2>

          <div className="flex justify-center mb-6">
             {/* <!-- INSERT IMAGE: image-2.png --> */}
          </div>

          <div className="closing-paragraph">
            <p>The peaks. The valleys. The windows of opportunity so powerful they can change everything in 90 days.</p>
            <p>Most people stumble through these windows blind.</p>
            <p>They're standing in a 6-month period of explosive potential... and they don't even know it.</p>
            <p>So they waste it on the wrong goals, the wrong relationships, the wrong investments.</p>
            <p><strong className="text-text-primary">You won't make that mistake.</strong></p>
            <p>Because you'll have the simulation.</p>
            <p>The preview of where the currents are taking you.</p>
            <p>The map showing exactly when to push hard and when to pull back.</p>
            <p>And when you move in harmony with these natural cycles instead of against them?</p>
            <p>You'll look back 6 months from now and wonder how you ever lived without this knowledge.</p>
            <p>Because the "you" that exists on the other side of this report...</p>
            <p><strong className="text-text-primary">...doesn't recognize the "you" reading these words right now.</strong></p>
            <p>That version is living in a completely different reality.</p>
            <p>One where the universe conspires <strong className="text-text-primary">for</strong> you instead of against you.</p>
            <p>Where your deepest desires aren't desperate wishes... they're <strong className="text-text-primary">inevitable destinations</strong>.</p>
            <p>Where your goals aren't things you "hope" to reach... they're stations you <strong className="text-text-primary">will</strong> arrive at, on schedule, because you know exactly which train to catch.</p>
          </div>
        </div>

        {/* INVISIBLE SABOTAGE */}
        <div className="closing-flow-section p-6 md:p-8 mb-6">
          <h2 className="closing-subheading text-center mb-6 px-4 md:px-8">
            <strong className="text-text-primary">But here's the invisible sabotage that's</strong> <strong className="text-text-primary">happening right under your nose...</strong>
          </h2>

          <div className="closing-paragraph">
            <p>Your Day Master requires a specific type of "fuel" to operate at peak performance.</p>
            <p>It's like a high-performance engine.</p>
            <p>It needs specific fuel to run at full capacity.</p>
            <p>A <strong className="text-text-primary">{r("%DAY MASTER%")}</strong> person like you requires <strong className="text-text-primary">the right</strong> energy to operate at peak. That's your premium fuel. When you get it, everything flows. Opportunities arrive. Money moves toward you. The right people show up at the right time.</p>
            <p>But right now?</p>
            <p><em className="italic text-text-muted">You're getting contaminated fuel instead.</em></p>
            <p>The <strong className="text-text-primary">{r("%DAY MASTER ATTACKING%")}</strong> in your environment are mixing into your energy supply like diesel poured into a gasoline tank.</p>
            <p>And just like that diesel-gasoline mix, this creates a violent chemical reaction that doesn't just stop your engine from running...</p>
            <p>It <strong className="text-text-primary">burns through your reserves faster than you can replenish them.</strong></p>
          </div>
        </div>

        {/* SHA STOP POINTS */}
        <div className="closing-flow-section p-6 md:p-8 mb-6">
          <h2 className="closing-subheading text-center mb-6 px-4 md:px-8">
            This is where it gets dangerous.
          </h2>

          <div className="closing-paragraph">
            <p>When incompatible elements collide in your space, they don't just create a little puff of "bad vibes" that dissipates.</p>
            <p><strong className="text-text-primary">They create permanent contamination zones.</strong></p>
            <p>Feng shui masters call these <strong className="text-text-primary">Sha Stop Points</strong>.</p>
            <p>And the name is brutally accurate.</p>
            <p>Because these aren't just spots with "low energy" or "bad feng shui."</p>
            <p><strong className="text-text-primary">They're energetic sinkholes where forward momentum gets sucked down and trapped.</strong></p>
          </div>

          <h2 className="closing-subheading text-center mt-8 mb-6 px-4 md:px-8">
            Think of them like whirlpools in a river.
          </h2>

          <div className="flex justify-center mb-6">
            {/* <!-- INSERT IMAGE: image-3.png --> */}
          </div>

          <div className="closing-paragraph">
            <p>The water around them flows normally. But if anything gets too close to the whirlpool – a leaf, a branch, a piece of driftwood – it gets pulled into the vortex and held there.</p>
            <p>Spinning in circles. Going nowhere. Stuck.</p>
            <p><strong className="text-text-primary">That's what Sha Stop Points do to opportunities trying to reach you.</strong></p>
            <p>The money that should flow into your bank account? Gets trapped in a Sha Stop Point before it arrives.</p>
            <p>The promotion that should land in your lap? Stops dead three feet from your desk.</p>
            <p>The romantic connection that should blossom? Suffocates the moment it enters your contaminated space.</p>
            <p>Not because these things weren't meant for you.</p>
            <p><strong className="text-text-primary">Because your environment has become a graveyard where good things go to die.</strong></p>
            <p>And here's the nightmare part:</p>
          </div>

          <h2 className="closing-subheading text-center mt-8 mb-6 px-4 md:px-8">
            Sha Stop Points multiply over time.
          </h2>

          <div className="closing-paragraph">
            <p>Every elemental clash creates a new one.</p>
            <p>That new Sha Stop Point generates more death energy, which creates more clashes, which creates more Sha Stop Points.</p>
            <p>It's a compounding spiral.</p>
            <p>Like rust on a car. Starts as a tiny spot. Then it spreads. Then it spreads faster. Within a year, you've got holes in the metal and the entire frame is compromised.</p>
            <p><strong className="text-text-primary">Your space right now has Sha Stop Points you don't even know about.</strong></p>
            <p>Invisible dead zones scattered throughout your home and workspace.</p>
            <p>One might be right where you sleep…which is why you wake up exhausted no matter how long you rest.</p>
            <p>Another might be at your desk …Which is why your best ideas lose their power the moment you try to execute them.</p>
            <p>Another might be in your entryway…which is why opportunities never quite make it through your front door.</p>
          </div>
        </div>

        {/* MEASURABLE EFFECTS */}
        <div className="closing-flow-section p-6 md:p-8 mb-6">
          <h2 className="closing-subheading text-center mb-6 px-4 md:px-8">
            And the effects are measurable.
          </h2>

          <div className="flex flex-col items-center gap-6 mb-6 mt-4">
             {/* <!-- INSERT IMAGE: image-4.png --> */}
             {/* <!-- INSERT IMAGE: image-5.png --> */}
          </div>

          <div className="closing-paragraph">
            <p><strong className="text-text-primary">You feel chronically drained</strong> even though you're "doing all the right things" for your health.</p>
            <p>That's because your life force is being siphoned off by Sha Stop Points the moment your body generates it. Like trying to fill a bathtub with the drain open.</p>
            <p><strong className="text-text-primary">Opportunities seem to avoid you</strong> even when you're just as qualified (or more qualified) than people who get the breaks.</p>
            <p>That's because the death energy radiating from these Sha Stop Points creates an invisible repellent field. Success literally cannot penetrate your space.</p>
            <p><strong className="text-text-primary">Your own home feels suffocating</strong> instead of rejuvenating.</p>
          </div>

          <h2 className="closing-subheading text-center mt-8 mb-6 px-4 md:px-8">
            Imagine your home as a once-thriving garden.
          </h2>

          <div className="closing-paragraph">
            <p>But instead of receiving clean water and sunlight, it's been receiving acid rain and toxic waste. The soil becomes contaminated. The air becomes unbreathable. And anything you try to plant immediately withers and dies.</p>
            <p>Your living space has become a <em className="italic font-bold text-accent-gold">spiritual Chernobyl.</em></p>
            <p>Every corner where clashing elements have fought their violent battles has left behind an invisible "imprint" – a concentrated pocket of death energy that actively repels abundance, love, and success.</p>
            <p>These Sha Stop Points work like reverse magnets for everything you want in life. Instead of attracting opportunities, they create an energetic force field that pushes away:</p>
          </div>

          <ul className="closing-bullet-list mt-4">
            <li><span className="text-accent-gold mr-2">●</span>Financial windfalls that were heading your way</li>
            <li><span className="text-accent-gold mr-2">●</span>Romantic connections that could have blossomed</li>
            <li><span className="text-accent-gold mr-2">●</span>Career breakthroughs that were within reach</li>
            <li><span className="text-accent-gold mr-2">●</span>Health improvements that were starting to manifest</li>
          </ul>
        </div>

        {/* DEATH MULTIPLICATION CYCLE */}
        <div className="closing-flow-section p-6 md:p-8 mb-6">
          <h2 className="closing-subheading text-center mb-6 px-4 md:px-8">
            When elements clash violently, they create the Death Multiplication Cycle.
          </h2>

          <div className="flex justify-center mb-6">
             {/* <!-- INSERT IMAGE: <INSERT IMAGE> --> */}
          </div>

          <div className="closing-paragraph">
            <p>Metal cuts Wood. The splinters contaminate Earth.<br/>
               Contaminated Earth poisons Water.<br/>
               Poisoned Water drowns Wood.<br/>
               Dead Wood can't feed Fire.<br/>
               Without Fire, the entire cycle collapses into an accelerating spiral of decay.</p>
            <p><strong className="text-text-primary">This is why your luck gets worse instead of better.</strong></p>
            <p>Why problems multiply faster than solutions.</p>
            <p>Why you feel trapped in a downward spiral that defies all logic and effort.</p>
            <p>The death energy hasn't just blocked your abundance – it's <strong className="text-text-primary">reversed your natural cycles</strong> and turned them into destruction engines that compound daily.</p>
          </div>

          <h2 className="closing-subheading text-center mt-8 mb-6 px-4 md:px-8">
            And here's the suffocating part:
          </h2>

          <div className="closing-paragraph">
            <p>Every breath you take in this contaminated space is choking off your {r("%DAY MASTER%")}’s natural power.</p>
            <p>Instead of radiating magnetic life force that draws success effortlessly...</p>
            <p><strong className="text-text-primary">You're emitting the energetic signature of decay.</strong></p>
            <p>This is why people unconsciously avoid you.</p>
            <p>Why opportunities slip through your fingers at the last second.</p>
            <p>Why your best ideas lose power the moment you try to execute them.</p>
            <p>Your energetic field has become a beacon for more problems, more struggle, more disappointment.</p>
            <p>And the contamination isn't staying contained.</p>
          </div>

          <h2 className="closing-subheading text-center mt-8 mb-6 px-4 md:px-8">
            Like smoke from a fire, <strong className="text-accent-gold">it spreads to everyone who enters your space.</strong>
          </h2>

          <div className="closing-paragraph">
            <p>Your family. Your closest friends. Your colleagues.</p>
            <p>Anyone who spends time near you starts absorbing these toxic frequencies.</p>
            <p>They don't know why they suddenly feel drained after visiting.</p>
            <p>They can't explain why their own luck seems to dip after being in your home.</p>
            <p><strong className="text-text-primary">But the Sha Qi doesn't care who it infects.</strong></p>
            <p>It just spreads.</p>
          </div>
        </div>

        {/* MONK TECHNOLOGY */}
        <div className="closing-flow-section p-6 md:p-8 mb-6">
          <h2 className="closing-subheading text-center mb-6 px-4 md:px-8">
            However, There's <strong className="text-accent-gold">An 800-Year-Old Monk Technology That Dissolves Sha Stop Points Was Discovered In Ancient Tibet…</strong>
          </h2>

          <div className="flex justify-center mb-6">
             {/* <!-- INSERT IMAGE: image-6.png --> */}
          </div>

          <div className="closing-paragraph">
            <p>The ancient monks who first discovered these death energy contaminations didn't just identify the problem – they engineered the perfect solution.</p>
            <p>They realized that the toxic Sha Qi particles floating through your environment could be "scooped up" and neutralized before they embedded deeper into your walls, your furniture, and your soul.</p>
            <p>In the powerful rituals first created by these enlightened masters, they used a cleansing 'sound' to purify the energy that flows through you and into your home.</p>
            <p>This sacred frequency works without unnaturally manipulating your brainwaves or forcing artificial changes.</p>
            <p>Instead, it helps you reconnect with your soul's true desires and purpose – giving you an extremely clear and empowered experience that not only attracts luck into your life, but also provides an abundant source of inner energy and 'heat' that draws positive opportunities directly to you.</p>
          </div>

          <h2 className="closing-subheading text-center mt-8 mb-6 px-4 md:px-8">
            Here's the breakthrough discovery that changed everything:
          </h2>

          <div className="closing-paragraph">
            <p>What the ancient monks realized was that we're surrounded by a constant current of energy flowing into our spaces every single moment. <strong className="text-text-primary">But just like water flowing down from Antarctica, this energy arrives freezing, contaminated, and toxic.</strong></p>
            <p>If that poisoned energy reaches your home without being purified first, it's going to make everything cold, uncomfortable, and lifeless. But if you have a way to warm, cleanse, and transform that energy before it enters your space, it becomes nourishing, healing, and life-giving.</p>
            <p><strong className="text-text-primary">They'd discovered a ritual that could 'awaken' and purify this energy before it reached you.</strong></p>
            <p>This is why the ancient temples were built far away from society, with monks kept away from the chaotic world through layers upon layers of rooms, walls, and elaborate purification rituals. This sacred architecture helped to warm, purify, and refine the energy that the monks were able to absorb... giving them and their spiritual students a proven way to awaken to their true instincts, powers, and inner purposes.</p>
            <p><strong className="text-text-primary">Now, using a similar technique discovered by these masters, we've created a ritual that removes the spiritual toxins and "suffocating energy" that's been poisoning your home.</strong></p>
            <p><strong className="text-text-primary">Just like setting up a heater that transforms cold, contaminated water into pure, warm, life-giving flow...</strong></p>
            <p><strong className="text-text-primary">These sacred sounds create an energetic purification system that cleanses the invisible currents entering your life.</strong></p>
            <p><strong className="text-text-primary">This ensures that only positive, abundant, healing energy reaches your mind, body, and environment.</strong></p>
            <p>The purifying frequencies literally break apart the molecular structure of Sha Qi particles – dissolving the toxic "exhaust fumes" created by clashing elements and forcing out every last drop of negative energy that might be embedded in your soul.</p>
            <p><strong className="text-text-primary">Think of it as a spiritual air purification system that works 24/7.</strong></p>
            <p>Every time the sacred sounds activate, they send out waves of cleansing energy that:</p>
          </div>

          <ul className="closing-bullet-list mt-8 space-y-4">
            <li><span className="text-accent-gold mr-5 mt-1 flex-shrink-0">●</span><span><strong className="text-text-primary">Dissolve Sha Stop Points:</strong> Breaking apart the concentrated pockets of death energy that have been blocking your abundance</span></li>
            <li><span className="text-accent-gold mr-5 mt-1 flex-shrink-0">●</span><span><strong className="text-text-primary">Neutralize Toxic Imprints:</strong> Erasing the energetic contamination left behind by elemental clashes</span></li>
            <li><span className="text-accent-gold mr-5 mt-1 flex-shrink-0">●</span><span><strong className="text-text-primary">Transform Attacking Elements:</strong> Converting the hostile energies into nourishing fuel for your Day Master</span></li>
            <li><span className="text-accent-gold mr-5 mt-1 flex-shrink-0">●</span><span><strong className="text-text-primary">Restore Natural Flow:</strong> Rebuilding the healthy Production Cycle that draws opportunities to you effortlessly</span></li>
          </ul>

          <div className="closing-paragraph mt-4">
            <p><strong className="text-text-primary">And as this Suffocating Energy finally leaves, it all will begin to finally click for you...</strong></p>
            <p>Everything in your life starts to get smoother. You find that your life is flowing the way it's supposed to. You feel aligned in everything you do – and there's almost nothing that can stop you from getting what you want.</p>
          </div>
          
          {/* Note: Skipped strikethrough text from lines 370-380 */}
        </div>

        {/* ALIGN ENVIRONMENT */}
        <div className="closing-flow-section p-6 md:p-8 mb-6">
          <h2 className="closing-subheading text-center mb-6 px-4 md:px-8">
            Now, the moment that you use your home to support your unique {r("%DAY MASTER%")} nature... and align your environment to charge your soul's natural patterns with the specific elemental nourishment it craves... that's when you can finally express the full magnitude of your gifts without restriction.
          </h2>

          <div className="closing-paragraph">
            <p>Think of it this way: You've just discovered that you're a rare, powerful <strong className="text-text-primary">{r("[%DAY MASTER%]")}</strong> - but you're currently planted in completely toxic soil.</p>
            <p>Your consciousness needs the right environmental foundation to flourish.</p>
            <p>Just like how a mighty oak needs rich, well-drained earth to grow into its full majesty... or how a brilliant fire needs clean oxygen to burn at its brightest... your <strong className="text-text-primary">{r("[%DAY MASTER%]")}</strong> requires an environment that feeds rather than starves its natural energy.</p>
            <p><strong className="text-text-primary">Right now, your home has become contaminated soil that's choking the life out of your elemental gifts.</strong></p>
            <p>Every room where <strong className="text-text-primary">{r("%DAY MASTER ATTACKING%")}</strong> have created Sha Stop Points is like having pockets of acid in the earth around your roots. No matter how powerful your inner nature, it cannot thrive in an environment that's actively working against it.</p>
            <p>But when you transform your home into the perfect "soil" for your <strong className="text-text-primary">{r("[%DAY MASTER%]")}</strong> to flourish...</p>
            <p>When every corner becomes a nourishing sanctuary that feeds your natural patterns...</p>
            <p>When the toxic contamination is neutralized and replaced with pure, supportive energy...</p>
            <p>That's when you'll experience the explosive growth that comes from perfect alignment between your <em>inner</em> gifts and your <em>outer</em> environment.</p>
            <p>Your <strong className="text-text-primary">{r("%DAY MASTER%")}</strong> will finally have the energetic nutrients it needs to:</p>
          </div>

          <ul className="closing-bullet-list mt-4">
            <li><span className="text-accent-gold mr-2">●</span>Generate the magnetic life force that effortlessly attracts opportunities</li>
            <li><span className="text-accent-gold mr-2">●</span>Express your natural talents without energetic interference</li>
            <li><span className="text-accent-gold mr-2">●</span>Create the abundance cycles that multiply your success exponentially</li>
            <li><span className="text-accent-gold mr-2">●</span>Radiate the confident energy that makes others want to support your goals</li>
          </ul>

          <h2 className="closing-subheading text-center mt-8 mb-6 px-4 md:px-8">
            This is why the ancient masters always treated Inner and Outer Feng Shui as one complete system… and that's what we do here at Chi Manifestation too.
          </h2>

          <div className="closing-paragraph">
            <p>They understood that awakening your <strong className="text-text-primary">{r("%DAY MASTER%'s")}</strong> power without protecting its environment is like trying to grow a garden in a hurricane.</p>
            <p>No matter how perfect the seeds, they'll be destroyed by hostile conditions.</p>
            <p>This is why we've created the Purifying Wind Chimes specifically for people who've just discovered their <strong className="text-text-primary">{r("%DAY MASTER%")}</strong> nature.</p>
            <p>Because we know that your investment in inner awareness deserves environmental protection that ensures your gifts can actually flourish in the real world…</p>
          </div>
        </div>

        {/* THE PITCH */}
        <div className="closing-flow-section p-6 md:p-8 mb-6">
          <h2 className="closing-subheading text-center mb-6 px-4 md:px-8 text-accent-gold">
            As a special offer only on this page… you'll be able to get 3 Purifying Wind Chimes for just $79 that comes with a FREE 6-Step Feng Shui Home Energy Improvement Video Course (Worth $198) Recorded in-person by a Vetted Feng Shui Master Based In Singapore, Chinatown.
          </h2>

          <div className="flex justify-center mb-6">
             {/* <!-- INSERT IMAGE: image-7.png --> */}
          </div>
          
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
             {/* <!-- INSERT IMAGE: image-8.png --> */}
             {/* <!-- INSERT IMAGE: image-9.png --> */}
          </div>

          <p className="text-center text-lg mb-8 font-medium">And here's 10 reasons why <strong className="text-accent-gold">this $79 offer</strong> can be extremely powerful for you…</p>

          {/* 10 REASONS LIST - Styled like the 13 inclusions */}
          <div className="space-y-4">
            
            <div className="inclusion-card">
              <div className="inclusion-card-icon"><span className="text-white font-bold text-[17px]">1</span></div>
              <div className="inclusion-card-text">
                <strong className="text-text-primary">Your report revealed your 3 Life Path Simulations</strong> – mapping out obstacles, challenges, and opportunities ahead of you. <strong className="text-text-primary">But without environmental purification, those obstacles become permanent roadblocks.</strong> The Purifying Wind Chimes clear these energetic barriers so your predicted opportunities can actually reach you instead of being repelled by Sha Qi contamination.
              </div>
            </div>

            <div className="inclusion-card">
              <div className="inclusion-card-icon"><span className="text-white font-bold text-[17px]">2</span></div>
              <div className="inclusion-card-text">
                <strong className="text-text-primary">Your 10-year luck cycle analysis showed you exactly when your peak luck periods arrive</strong> – but peak luck energy cannot penetrate a toxic environment. <strong className="text-text-primary">The wind chimes create the purified space necessary for peak luck to flow into your life unobstructed,</strong> ensuring you don't miss these crucial windows because your home is energetically hostile to abundance.
              </div>
            </div>

            <div className="inclusion-card">
              <div className="inclusion-card-icon"><span className="text-white font-bold text-[17px]">3</span></div>
              <div className="inclusion-card-text">
                <strong className="text-text-primary">Your report analyzed the 5 elements that clash with your energetic fingerprint</strong> – identifying which energies drain you and cause bad luck. <strong className="text-text-primary">The purifying frequencies directly neutralize these clashing elements,</strong> transforming attacking energies into supportive ones that nourish rather than starve your Day Master.
              </div>
            </div>

            <div className="inclusion-card">
              <div className="inclusion-card-icon"><span className="text-white font-bold text-[17px]">4</span></div>
              <div className="inclusion-card-text">
                <strong className="text-text-primary">You discovered who's meant to support you and who's secretly undermining you</strong> – but if your environment radiates toxic energy, even your true allies will unconsciously avoid your space. <strong className="text-text-primary">Clean energy makes you magnetic to the right people</strong> while naturally repelling those carrying death particles that could contaminate your success.
              </div>
            </div>
            
            {/* FIRST TESTIMONIAL */}
            <div className="testimonial-card my-6">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start p-2">
                <div className="flex-shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face"
                    alt="Jennifer M."
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                    <p className="text-text-primary font-bold text-[15px]">Jennifer M., Marketing Executive, California</p>
                    <p className="text-gray-900 text-xs tracking-tighter mt-1">★★★★★</p>
                  </div>
                  <p className="text-text-muted leading-relaxed text-[15px]">
                    "I was completely skeptical about the whole 'death energy' concept until I got my BaZi reading and realized I was a Wood Day Master surrounded by Metal attacking elements. My consultant explained how my home office was literally cutting down my natural creativity every day. Within 48 hours of hanging the Purifying Wind Chimes outside my front door, my biggest client called with a project I'd been trying to land for 6 months!"
                  </p>
                </div>
              </div>
            </div>

            <div className="inclusion-card">
              <div className="inclusion-card-icon"><span className="text-white font-bold text-[17px]">5</span></div>
              <div className="inclusion-card-text">
                <strong className="text-text-primary">Your natural intelligence patterns were revealed</strong> – the exact gifts that can increase your income by 25% in the first month. <strong className="text-text-primary">But intelligence requires clear mental energy to express fully.</strong> Purified environments amplify your cognitive abilities while toxic spaces cloud your thinking and decision-making.
              </div>
            </div>

            <div className="inclusion-card">
              <div className="inclusion-card-icon"><span className="text-white font-bold text-[17px]">6</span></div>
              <div className="inclusion-card-text">
                <strong className="text-text-primary">You learned the simple adjustments to charge yourself with right energies and attract guidance from elevated people</strong> – but these adjustments only work in supportive environments. <strong className="text-text-primary">Contaminated spaces neutralize your positive adjustments,</strong> while purified spaces multiply their effectiveness exponentially.
              </div>
            </div>

            <div className="inclusion-card">
              <div className="inclusion-card-icon"><span className="text-white font-bold text-[17px]">7</span></div>
              <div className="inclusion-card-text">
                <strong className="text-text-primary">Your Life Force Analysis showed whether you're energetically drained or stuck in old patterns</strong> – this happens when clashing energies create constant internal warfare. <strong className="text-text-primary">The wind chimes end this energetic civil war,</strong> allowing your Life Force to rebuild and flow freely toward breakthrough opportunities.
              </div>
            </div>

            <div className="inclusion-card">
              <div className="inclusion-card-icon"><span className="text-white font-bold text-[17px]">8</span></div>
              <div className="inclusion-card-text">
                <strong className="text-text-primary">You received wealth cleansing rituals tailored to your specific Day Master</strong> – but performing rituals in contaminated space is like trying to fill a bucket with holes in it. <strong className="text-text-primary">The environmental purification seals these energetic leaks,</strong> ensuring your wealth rituals build lasting abundance instead of temporary fixes.
              </div>
            </div>

            <div className="inclusion-card">
              <div className="inclusion-card-icon"><span className="text-white font-bold text-[17px]">9</span></div>
              <div className="inclusion-card-text">
                <strong className="text-text-primary">Your report included furniture adjustments to nourish abundance-creating energies</strong> – but furniture adjustments alone can't overcome deep environmental contamination. <strong className="text-text-primary">The video course shows you how to optimize these adjustments while the wind chimes maintain the purified energy field needed for them to work…</strong>
              </div>
            </div>

            <div className="inclusion-card">
              <div className="inclusion-card-icon"><span className="text-white font-bold text-[17px]">10</span></div>
              <div className="inclusion-card-text">
                <strong className="text-text-primary">You learned to detect death particles that create financial nooses around your cash cows</strong> – now you need protection from them. <strong className="text-text-primary">The wind chimes' sacred frequencies actively repel death particles</strong> while the video course teaches you to identify and eliminate their environmental breeding grounds.
              </div>
            </div>

            {/* SECOND TESTIMONIAL */}
            <div className="testimonial-card my-6">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start p-2">
                <div className="flex-shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
                    alt="David C."
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                    <p className="text-text-primary font-bold text-[15px]">David C., Real Estate Investor, New York</p>
                    <p className="text-gray-900 text-xs tracking-tighter mt-1">★★★★★</p>
                  </div>
                  <p className="text-text-muted leading-relaxed text-[15px]">
                    "The BaZi reading showed me I was in a peak luck period, but nothing was manifesting until I got the wind chimes. My Fire Day Master was being suffocated by Water elements in my environment – no wonder I felt drained all the time! The moment I placed them in my home office and bedroom, it was like someone turned on a switch. The 'death particles' my reading warned about started clearing out, and within 3 weeks I closed on two properties that netted me over $200K. The combination of inner and outer feng shui is absolutely game-changing."
                  </p>
                </div>
              </div>
            </div>

          </div>

          <h2 className="closing-subheading text-center mt-8 mb-6 px-4 md:px-8">
            This is the missing piece that makes everything "click" together…
          </h2>
          <div className="closing-paragraph">
            <p>Your Inner Feng Shui <strong className="text-text-primary">(BaZi reading)</strong> revealed your energetic blueprint and natural gifts. <strong className="text-text-primary">Your Outer Feng Shui (purifying environment) creates the conditions for those gifts to flourish in reality.</strong></p>
            <p>Without both pieces working together, you'll have the knowledge but not the results. You'll understand your potential but watch it get strangled by environmental contamination.</p>
          </div>
        </div>

        {/* ACTIVATION STEPS */}
        <div className="closing-flow-section p-6 md:p-8 mb-6">
          <h2 className="closing-subheading text-center mb-6 px-4 md:px-8">
            And here's how simple it is to activate this ancient purification technology:
          </h2>

          <div className="flex justify-center mb-8">
             {/* <!-- INSERT IMAGE: image-12.png --> */}
          </div>

          <div className="space-y-10">
            <div className="text-center">
              <h3 className="text-lg font-bold text-accent-gold mb-4">Step One: Hang Your Wind Chimes Where<br/>You Spend Significant Time In</h3>
              <div className="flex justify-center mb-4">
                 {/* <!-- INSERT IMAGE: image-13.png --> */}
              </div>
              <p className="text-text-muted max-w-md mx-auto">Whether it's your bedroom, office, or main living space,<br/>the sacred frequencies will immediately begin dissolving Sha Qi particles<br/>in a 20-foot radius around each chime.</p>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-accent-gold mb-4">Step Two: Each Time You Hear A Gentle Ring,<br/>Take A Moment To Focus On One Of The<br/>Positive Traits Revealed In Your Report.</h3>
              <div className="flex justify-center mb-4">
                 {/* <!-- INSERT IMAGE: image-14.png --> */}
              </div>
              <p className="text-text-muted max-w-md mx-auto">Whether it's your natural intelligence patterns, your Day Master's gifts,<br/>or your upcoming peak luck periods – let each ring<br/>remind you of your true potential.</p>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-accent-gold mb-4">Step Three: Feel The Toxic Energy<br/>Leaving Your Space And Your Soul<br/>With Each Cleansing Tone.</h3>
              <div className="flex justify-center mb-4">
                 {/* <!-- INSERT IMAGE: image-15.png --> */}
              </div>
              <p className="text-text-muted max-w-md mx-auto">Visualize the death energy dissolving like smoke in the wind, replaced by<br/>pure, nourishing energy that feeds your elemental nature.</p>
            </div>
          </div>

          <p className="text-center italic mt-8 text-text-muted font-medium">
            That's it. No complicated rituals. No hours of meditation. No expensive ongoing maintenance.
          </p>
        </div>

        {/* CTA 1 */}
        <div className="text-center mb-10">
          <button 
            onClick={handlePurchase} 
            className="btn-mystical w-full text-base tracking-wider px-6 py-5 whitespace-normal flex flex-col items-center justify-center gap-1 shadow-[0_0_20px_rgba(235,190,105,0.4)] hover:shadow-[0_0_30px_rgba(235,190,105,0.6)]"
          >
            <span className="font-bold text-lg leading-tight uppercase">YES → INSTALL THE MONK PURIFICATION SYSTEM IN MY HOME</span>
            <span className="text-sm font-medium opacity-90">Dissolve Sha Stop Points & Activate My Luck Cycles: Only $79 Today</span>
          </button>
        </div>

        {/* GUARANTEE */}
        <div className="guarantee-section mb-6">
          
          <h2 className="text-xl md:text-2xl font-mystical text-accent-gold text-center mb-6 px-4 md:px-8 leading-snug">
            And because we're so confident that this environmental transformation will amplify every insight from your Life Energy Attunement Report, we're backing this offer with our complete 60-Day Money-Back Guarantee.
          </h2>
          
          <div className="flex justify-center mb-6">
            <img 
              src="/money-back-guarantee.png" 
              alt="60-Day Money Back Guarantee"
              className="w-32 h-32 object-contain"
            />
          </div>

          {/* THIRD TESTIMONIAL */}
          <div className="testimonial-card my-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start p-2">
              <div className="flex-shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face"
                  alt="Sarah R."
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                  <p className="text-text-primary font-bold text-[15px]">Sarah R., Small Business Owner, Texas</p>
                  <p className="text-gray-900 text-xs tracking-tighter mt-1">★★★★★</p>
                </div>
                <p className="text-text-muted leading-relaxed text-[15px]">
                  "My Life Energy Attunement Report revealed I was severely deficient in Metal element, which explained why I had zero structure or follow-through in my business. But even after learning about my intelligence patterns and daily adjustments, I still felt stuck until I addressed my environment. The wind chimes transformed my workspace into what feels like a sacred sanctuary. Now when they ring, I remember I'm an Earth Day Master with natural nurturing abilities, and my confidence has skyrocketed. My business revenue doubled in 6 weeks, and three former clients reached out asking to work with me again. The toxic energy that was repelling success has completely cleared – I can actually feel the difference in my home now."
                </p>
              </div>
            </div>
          </div>

          <p className="text-text-muted mb-4 px-4 font-medium">If you don't experience:</p>
          <ul className="closing-bullet-list px-4 mb-6">
            <li><span className="text-accent-gold mr-2">●</span>Clearer thinking and stronger intuition within the first week</li>
            <li><span className="text-accent-gold mr-2">●</span>Noticeable improvements in your energy levels and motivation</li>
            <li><span className="text-accent-gold mr-2">●</span>Better sleep and more peaceful feelings in your home</li>
            <li><span className="text-accent-gold mr-2">●</span>Increased synchronicities and opportunities flowing your way</li>
            <li><span className="text-accent-gold mr-2">●</span>The sense that your BaZi gifts are finally being expressed fully</li>
          </ul>

          <p className="text-center font-medium px-4 mb-6">Simply return the wind chimes for a full refund – no questions asked.</p>
          
          <p className="text-center text-text-muted px-4">
            We've seen this combination of Inner and Outer Feng Shui transform thousands of lives. We know that when you align your environment to support rather than sabotage your Day Master's nature, results follow naturally and inevitably.
          </p>
        </div>

        {/* FINAL CTA */}
        <div className="text-center mb-12">
          <button 
            onClick={handlePurchase} 
            className="btn-mystical w-full text-base tracking-wider px-6 py-5 whitespace-normal flex flex-col items-center justify-center gap-1 shadow-[0_0_20px_rgba(235,190,105,0.4)] hover:shadow-[0_0_30px_rgba(235,190,105,0.6)]"
          >
            <span className="font-bold text-lg leading-tight uppercase">YES → INSTALL THE MONK PURIFICATION SYSTEM IN MY HOME</span>
            <span className="text-sm font-medium opacity-90">Dissolve Sha Stop Points & Activate My Luck Cycles: Only $79 Today</span>
          </button>
          
          {/* Note: Skipped strikethrough lines 532-568 which were the alternative text below the button in the mockups */}

          <div className="mt-8 flex flex-col items-center gap-4">
            {/* <!-- INSERT IMAGE: image-18.png --> */}
            <div className="flex flex-wrap justify-center gap-2 mt-2 grayscale opacity-70">
              {/* <!-- INSERT IMAGE: image-19.png --> */}
              {/* <!-- INSERT IMAGE: image-20.png --> */}
              {/* <!-- INSERT IMAGE: image-21.png --> */}
              {/* <!-- INSERT IMAGE: image-22.png --> */}
              {/* <!-- INSERT IMAGE: image-23.png --> */}
              {/* <!-- INSERT IMAGE: image-24.png --> */}
            </div>
            
            <button 
              onClick={handleDecline}
              className="mt-6 text-sm text-text-muted hover:text-white underline underline-offset-4 opacity-70 transition-opacity hover:opacity-100"
            >
              No thanks, I will pass on this opportunity to purify my environment.
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
