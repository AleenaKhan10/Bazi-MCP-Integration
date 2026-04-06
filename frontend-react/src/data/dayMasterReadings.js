/* ===========================================
   Day Master Readings — Full Content (10 Types)
   ===========================================
   
   This file contains the FULL reading text for
   each Day Master, shown on the Reading Page
   after the user clicks "REVEAL MY DAYMASTER READING"
   on the Intro page.
   
   KEY: Chinese character matching dayMasters.js
   
   Each reading has:
   - name: English name (e.g., "Jia Wood")
   - chineseLabel: Chinese + type (e.g., "甲木")
   - subtitle: "(甲木) - YANG WOOD"
   - vitalSources: array of paragraphs
   - alignedEnergies: paragraphs when aligned
   - workSuperpowers: 3 items { title, description }
   - relationshipGifts: 3 items { title, description }
   - naturalAbilities: 3 items { title, description }
   - clashingTeaser: closing paragraph
*/

const DAY_MASTER_READINGS = {
  '甲': {
    name: 'Jia Wood',
    number: 1,
    chineseLabel: '甲木',
    subtitle: '(甲木) - YANG WOOD',
    intro: 'You are a Jia Wood – and here\'s how you receive energy as a Jia Wood. This is what nourishes you, makes you feel alive, and what truly brings out your greatest talents...',
    vitalSources: [
      'You come alive when you\'re around people and environments that provide steady, patient nourishment rather than quick fixes. Deep conversations, long-term relationships, and projects that allow for gradual, sustainable growth feed your soul.',
      'You thrive when given space and time to develop your ideas fully, like roots spreading deep before the tree shows growth above ground.',
      'You feel most grounded when you have stable ground to stand on – whether that\'s financial security, clear organizational structure, or strong family/community bonds.',
      'You need environments that won\'t shift beneath you constantly. Tradition, heritage, and established systems energize you because they provide the solid foundation your towering nature requires. Recognition for your steady reliability and principled leadership fuels your continued growth.',
    ],
    alignedEnergies: [
      'And once you feed your Jia Wood Day Master with the right energies...',
      'People start coming to you with their problems without you asking. Your presence becomes noticeably more calming to others. You\'ll find yourself speaking with quiet authority in meetings, and others naturally defer to your judgment.',
      'People seek your mentorship because they recognize your ability to see the bigger picture. Your income stabilizes and grows through your reputation for reliability rather than flashy tactics.',
      'You\'ll wake up feeling like you\'re exactly where you\'re supposed to be, doing exactly what you were born to do.',
    ],
    workSuperpowers: [
      {
        title: '1) Building Things That Last',
        description: 'While others rush for quick wins, you create systems that run smoothly for years. You\'re the person who builds the foundation everyone else relies on.',
      },
      {
        title: '2) Leading Through Crisis',
        description: 'When chaos hits, you become the calm center. Teams naturally look to you because your steady presence transforms panic into focus.',
      },
      {
        title: '3) Seeing The Long Game',
        description: 'You spot opportunities others miss because you think in decades, not months. This patience gives you an almost unfair advantage.',
      },
    ],
    relationshipGifts: [
      {
        title: '1) Making People Feel Safe',
        description: 'Others feel genuinely protected around you – emotionally, not just physically. You\'re who they call when life gets overwhelming.',
      },
      {
        title: '2) Bridging Generations',
        description: 'You naturally connect with all ages. Younger people seek your wisdom, older people respect your depth.',
      },
      {
        title: '3) Solving Conflicts',
        description: 'Your clear moral compass makes you a natural mediator. People trust you to find fair solutions.',
      },
    ],
    naturalAbilities: [
      {
        title: '1) Reading Patterns',
        description: 'You see the real issues beneath surface problems. While others treat symptoms, you fix root causes.',
      },
      {
        title: '2) Making Things Stronger',
        description: 'Whatever you touch becomes more stable. Relationships, businesses, families – you have a gift for strengthening weak foundations.',
      },
      {
        title: '3) Inspiring Trust',
        description: 'People naturally confide in you because your integrity is obvious. You become the standard others measure themselves against.',
      },
    ],
    clashingTeaser: 'However there\'s something that\'s stopping you from using these talents to make thousands of dollars — and you\'re currently getting \'attacked\' by energies that are draining your life force... These clashing energies weaken your natural energies... and I\'ll go through them on the next page.',
  },

  '乙': {
    name: 'Yi Wood',
    number: 2,
    chineseLabel: '乙木',
    subtitle: '(乙木) - YIN WOOD',
    intro: 'You are an Yi Wood – and here\'s how you receive energy as an Yi Wood. This is what nourishes you, makes you feel alive, and what truly brings out your greatest talents...',
    vitalSources: [
      'You come alive when you\'re surrounded by beauty, creativity, and harmonious relationships rather than harsh competition. Artistic environments, collaborative partnerships, and projects that allow for flexible, graceful adaptation feed your soul.',
      'You thrive when given space to express your aesthetic vision and connect different people or ideas together, like vines creating beautiful bridges between separate elements.',
      'You feel most energized when you have supportive structures to climb – whether that\'s mentorship, established systems, or strong partnerships that allow you to grow upward gracefully without having to build everything from scratch.',
      'You need environments that appreciate subtlety and refinement rather than demanding brute force. Recognition for your artistic contributions and diplomatic skills fuels your continued blossoming.',
    ],
    alignedEnergies: [
      'And once you feed your Yi Wood Day Master with the right energies...',
      'People start seeking you out for creative collaboration and peaceful problem-solving. Your presence becomes noticeably more harmonious and beautiful to others. You\'ll find yourself naturally bridging different groups and helping others see connections they missed.',
      'People seek your aesthetic guidance and diplomatic wisdom because they recognize your ability to make things more beautiful and flowing. Your income grows through your reputation for creating harmony and elegance rather than aggressive tactics.',
      'You\'ll wake up feeling like you\'re exactly where you\'re meant to bloom, doing exactly what brings beauty into the world.',
    ],
    workSuperpowers: [
      {
        title: '1) Creating Harmonious Connections',
        description: 'While others build walls, you create beautiful bridges between people, ideas, and departments. You\'re the person who makes collaboration feel natural and elegant.',
      },
      {
        title: '2) Elegant Problem-Solving',
        description: 'When situations feel harsh or ugly, you find graceful solutions. You transform conflict into cooperation with your diplomatic touch.',
      },
      {
        title: '3) Flexible Innovation',
        description: 'You adapt to changing conditions better than anyone, finding creative ways around obstacles that would stop more rigid by personalities.',
      },
    ],
    relationshipGifts: [
      {
        title: '1) Natural Peacemaking',
        description: 'Others feel more beautiful and refined in your presence. You\'re who they call when relationships need healing and grace.',
      },
      {
        title: '2) Artistic Inspiration',
        description: 'You bring out the creative side in everyone you meet. People discover new interests and express themselves more beautifully around you.',
      },
      {
        title: '3) Gentle Guidance',
        description: 'Your soft wisdom helps others grow without feeling criticized. You\'re like sunlight that helps flowers bloom naturally.',
      },
    ],
    naturalAbilities: [
      {
        title: '1) Reading Emotional Currents',
        description: 'You sense the subtle energies in any room and know how to adjust the atmosphere to create harmony.',
      },
      {
        title: '2) Making Things Beautiful',
        description: 'Whatever you touch becomes more elegant and refined. Spaces, relationships, projects – you have a gift for adding grace.',
      },
      {
        title: '3) Connecting Opposites',
        description: 'You see how different elements can work together beautifully, creating unity from diversity like flowers in a garden.',
      },
    ],
    clashingTeaser: 'However there\'s something that\'s stopping you from using these talents to make thousands of dollars — and you\'re currently getting \'attacked\' by energies that are draining your life force... These clashing energies weaken your natural energies... and I\'ll go through them on the next page.',
  },

  '丙': {
    name: 'Bing Fire',
    number: 3,
    chineseLabel: '丙火',
    subtitle: '(丙火) - YANG FIRE',
    intro: 'You are a Bing Fire – and here\'s how you receive energy as a Bing Fire. This is what nourishes you, makes you feel alive, and what truly brings out your greatest talents...',
    vitalSources: [
      'You come alive when you\'re the central focus of inspiring projects and passionate causes rather than working in background support roles. Leadership opportunities, creative stages, and situations where you can ignite enthusiasm in others feed your soul.',
      'You thrive when given space to shine brightly and influence large groups, like the sun warming an entire landscape with your radiant energy.',
      'You feel most energized when you have appreciative audiences and meaningful missions that allow you to transform and illuminate what was previously dark or stagnant. You need environments that celebrate your natural magnetism rather than demanding you dim your light.',
      'Recognition for your inspiring leadership and ability to bring joy and transformation fuels your continued blazing.',
    ],
    alignedEnergies: [
      'And once you feed your Bing Fire Day Master with the right energies...',
      'People start seeking you out for inspiration and passionate leadership. Your presence becomes noticeably more magnetic and energizing to others. You\'ll find yourself naturally taking center stage and helping others see possibilities they never imagined.',
      'People seek your visionary guidance and transformational energy because they recognize your ability to turn dreams into blazing reality. Your income grows through your reputation for creating breakthrough moments and inspiring action rather than quiet, behind-the-scenes work.',
      'You\'ll wake up feeling like you\'re exactly where you\'re meant to burn brightest, doing exactly what sets the world on fire with possibility.',
    ],
    workSuperpowers: [
      {
        title: '1) Igniting Transformation',
        description: 'While others make gradual changes, you create breakthrough moments that completely shift energy and possibility. You\'re the person who turns struggling teams into unstoppable forces.',
      },
      {
        title: '2) Magnetic Leadership',
        description: 'When situations need dynamic direction, you naturally become the beacon everyone follows. Your passionate vision transforms confusion into clear, inspired action.',
      },
      {
        title: '3) Energizing Innovation',
        description: 'You see the big picture and ignite creative solutions that others never considered. Your enthusiasm makes the impossible feel achievable.',
      },
    ],
    relationshipGifts: [
      {
        title: '1) Bringing Out Potential',
        description: 'Others feel more alive and capable in your presence. You\'re who they call when they need to remember what they\'re truly capable of achieving.',
      },
      {
        title: '2) Inspiring Courage',
        description: 'You help people break through their limitations by showing them what\'s possible. Your confidence becomes contagious and transforms fear into excitement.',
      },
      {
        title: '3) Creating Joy',
        description: 'Your natural radiance brightens any environment. People feel happier and more optimistic simply by being around your solar energy.',
      },
    ],
    naturalAbilities: [
      {
        title: '1) Reading the Room',
        description: 'You instantly sense what energy a situation needs and know how to shift the entire atmosphere with your presence.',
      },
      {
        title: '2) Motivating Others',
        description: 'Whatever group you join becomes more passionate and driven. You have a gift for making people believe in bigger possibilities.',
      },
      {
        title: '3) Breakthrough Thinking',
        description: 'You see solutions that illuminate completely new paths forward, like sunlight revealing landscapes that were hidden in darkness.',
      },
    ],
    clashingTeaser: 'However there\'s something that\'s stopping you from using these talents to make thousands of dollars — and you\'re currently getting \'attacked\' by energies that are draining your life force... These clashing energies weaken your natural energies... and I\'ll go through them on the next page.',
  },

  '丁': {
    name: 'Ding Fire',
    number: 4,
    chineseLabel: '丁火',
    subtitle: '(丁火) - YIN FIRE',
    intro: 'You are a Ding Fire – and here\'s how you receive energy as a Ding Fire. This is what nourishes you, makes you feel alive, and what truly brings out your greatest talents...',
    vitalSources: [
      'You come alive when you\'re in intimate, knowledge-rich environments where you can dive deep into meaningful subjects rather than surface-level networking. Thoughtful conversations, research projects, and situations where you can quietly illuminate important truths feed your soul.',
      'You thrive when given consistent support and resources to fuel your intellectual curiosity, like a candle needing steady wax to burn brightly through the night.',
      'You feel most energized when you have close, devoted relationships and mentorship opportunities that allow you to nurture others\' growth with gentle wisdom. You need environments that appreciate depth over flash and value sustained insight over quick brilliance.',
      'Recognition for your thoughtful guidance and ability to bring clarity to complex situations fuels your continued glowing.',
    ],
    alignedEnergies: [
      'And once you feed your Ding Fire Day Master with the right energies...',
      'People start seeking you out for deep wisdom and patient mentoring. Your presence becomes noticeably more illuminating and comforting to others. You\'ll find yourself naturally becoming the trusted advisor who helps others see truth in confusing situations.',
      'People seek your intellectual guidance and devoted support because they recognize your ability to transform complexity into clear understanding. Your income grows through your reputation for deep expertise and loyal service rather than flashy presentations.',
      'You\'ll wake up feeling like you\'re exactly where you\'re meant to glow steadily, doing exactly what brings light to those who need it most.',
    ],
    workSuperpowers: [
      {
        title: '1) Deep Analysis & Insight',
        description: 'While others skim the surface, you illuminate hidden patterns and reveal crucial details others miss. You\'re the person who transforms confusion into crystal clarity.',
      },
      {
        title: '2) Patient Development',
        description: 'When complex projects need sustained attention, you naturally become the steady flame that guides long-term success. Your thoughtful approach prevents costly mistakes.',
      },
      {
        title: '3) Wisdom Cultivation',
        description: 'You see potential in ideas and people that others overlook, nurturing growth through careful attention and devoted support.',
      },
    ],
    relationshipGifts: [
      {
        title: '1) Gentle Illumination',
        description: 'Others feel understood and valued in your presence. You\'re who they call when they need someone who truly listens and offers thoughtful perspective.',
      },
      {
        title: '2) Devoted Mentoring',
        description: 'You bring out the best in people through patient guidance and genuine care. Your steady support helps others develop their own inner light.',
      },
      {
        title: '3) Creating Safety',
        description: 'Your warm, consistent presence makes people feel secure enough to be vulnerable and grow. You\'re like a lighthouse in emotional storms.',
      },
    ],
    naturalAbilities: [
      {
        title: '1) Reading Between Lines',
        description: 'You sense the deeper meanings in conversations and situations, understanding what people really need even when they can\'t express it.',
      },
      {
        title: '2)Sustained Focus',
        description: 'Whatever requires long-term attention thrives under your care. You have a gift for maintaining quality and depth over time.',
      },
      {
        title: '3) Transforming Complexity',
        description: 'You see through tangled problems to find elegant, lasting solutions that honor everyone involved.',
      },
    ],
    clashingTeaser: 'However there\'s something that\'s stopping you from using these talents to make thousands of dollars — and you\'re currently getting \'attacked\' by energies that are draining your life force... These clashing energies weaken your natural energies... and I\'ll go through them on the next page.',
  },

  '戊': {
    name: 'Wu Earth',
    number: 5,
    chineseLabel: '戊土',
    subtitle: '(戊土) - YANG EARTH',
    intro: 'You are a Wu Earth – and here\'s how you receive energy as a Wu Earth. This is what nourishes you, makes you feel alive, and what truly brings out your greatest talents...',
    vitalSources: [
      'You come alive when you\'re in stable, long-term environments where you can build solid foundations rather than constantly adapting to change. Established organizations, trusted relationships, and projects that allow for methodical, lasting development feed your soul.',
      'You thrive when given independence and autonomy to work at your own mountainous pace, like having your own territory where you can be self-sufficient and unshakeable.',
      'You feel most energized when you have strong family support and loyal partnerships that provide the emotional bedrock you need. You need environments that value reliability over speed and appreciate your steady, protective presence.',
      'Recognition for your dependable support and ability to create lasting stability fuels your continued steadfastness.',
    ],
    alignedEnergies: [
      'And once you feed your Wu Earth Day Master with the right energies...',
      'People start seeking you out for rock-solid advice and unwavering support. Your presence becomes noticeably more grounding and reassuring to others. You\'ll find yourself naturally becoming the foundation that others build their dreams upon.',
      'People seek your protective guidance and stable wisdom because they recognize your ability to weather any storm without breaking. Your income grows through your reputation for absolute reliability and long-term thinking rather than quick schemes.',
      'You\'ll wake up feeling like you\'re exactly where you\'re meant to stand strong, doing exactly what provides unshakeable support to those who need it.',
    ],
    workSuperpowers: [
      {
        title: '1) Creating Unshakeable Foundations',
        description: 'While others build on shifting ground, you create systems that endure for decades. You\'re the person who ensures nothing important ever collapses.',
      },
      {
        title: '2) Crisis Stability',
        description: 'When everything is falling apart, you become the immovable center that holds everything together. Your steady presence prevents total organizational collapse.',
      },
      {
        title: '3) Long-term Strategic Thinking',
        description: 'You see the big picture across years and decades, building sustainable success that others can depend on for generations.',
      },
    ],
    relationshipGifts: [
      {
        title: '1) Protective Reliability',
        description: 'Others feel completely secure knowing you\'ll always be there. You\'re who they call when they need someone absolutely dependable through thick and thin.',
      },
      {
        title: '2) Family Foundation',
        description: 'You create the stable home base that allows everyone else to take risks and explore. Your steady presence gives others permission to grow.',
      },
      {
        title: '3) Loyal Support',
        description: 'Your unwavering dedication makes people feel valued and protected. You\'re like bedrock that supports entire ecosystems of relationships.',
      },
    ],
    naturalAbilities: [
      {
        title: '1) Reading Long-term Patterns',
        description: 'You see what will last and what won\'t, understanding the difference between temporary trends and permanent foundations.',
      },
      {
        title: '2) Creating Security',
        description: 'Whatever environment you enter becomes more stable and secure. You have a gift for making people feel safe and grounded.',
      },
      {
        title: '3) Resource Management',
        description: 'You naturally conserve and protect resources, ensuring sustainability and avoiding waste through careful stewardship.',
      },
    ],
    clashingTeaser: 'However there\'s something that\'s stopping you from using these talents to make thousands of dollars — and you\'re currently getting \'attacked\' by energies that are draining your life force... These clashing energies weaken your natural energies... and I\'ll go through them on the next page.',
  },

  '己': {
    name: 'Ji Earth',
    number: 6,
    chineseLabel: '己土',
    subtitle: '(己土) - YIN EARTH',
    intro: 'You are a Ji Earth – and here\'s how you receive energy as a Ji Earth. This is what nourishes you, makes you feel alive, and what truly brings out your greatest talents...',
    vitalSources: [
      'You come alive when you\'re helping others grow and develop their potential. Teaching, mentoring, coaching, and cultivating talent in others feeds your soul like water feeding fertile soil.',
      'You thrive in collaborative environments where your nurturing guidance is valued and where you can see the fruits of your patient cultivation. Projects that require methodical development over time energize you far more than quick wins.',
      'You feel most alive when you have multiple people and projects you\'re nurturing simultaneously – like a garden full of different plants at various stages of growth. Recognition for your behind-the-scenes support and the role you play in others\' success nourishes your core.',
      'You need environments that appreciate your resourcefulness and adaptability, where people come to you for solutions because they know you always find a way to make things work.',
    ],
    alignedEnergies: [
      'And once you feed your Ji Earth Day Master with the right energies...',
      'People start recognizing you as the essential support system that makes everything possible. Your ability to see potential in others and bring it out becomes your signature strength.',
      'You\'ll find yourself naturally becoming the go-to person for development and growth, whether in business, relationships, or personal transformation. Your income grows through your reputation for cultivating success in others – through teaching, consulting, or developing talent.',
      'You\'ll wake up feeling energized by all the different people and projects you\'re helping flourish, knowing you\'re the fertile ground from which amazing things grow.',
    ],
    workSuperpowers: [
      {
        title: '1) Talent Development',
        description: 'You see potential where others see problems. Your patient cultivation turns struggling individuals into high performers through methodical nurturing.',
      },
      {
        title: '2) Resource Optimization',
        description: 'Like soil that can grow anything with the right care, you make the most of whatever resources are available, finding creative solutions others miss.',
      },
      {
        title: '3) Methodical Problem-Solving',
        description: 'Your analytical approach combined with endless resourcefulness means you break down complex challenges into manageable, step-by-step solutions.',
      },
    ],
    relationshipGifts: [
      {
        title: '1) Growth Facilitation',
        description: 'Others feel safe to be vulnerable and grow around you. You create the perfect conditions for people to become their best selves.',
      },
      {
        title: '2) Adaptive Support',
        description: 'You adjust your nurturing style to what each person needs, like soil that supports both delicate flowers and mighty trees.',
      },
      {
        title: '3) Patient Cultivation',
        description: 'Where others give up, you keep nurturing. You understand that real growth takes time and consistent care.',
      },
    ],
    naturalAbilities: [
      {
        title: '1) Reading Growth Potential',
        description: 'You instinctively know what someone needs to flourish and can create the perfect developmental environment for them.',
      },
      {
        title: '2) Resource Multiplication',
        description: 'You take limited resources and somehow make them stretch to support multiple projects and people.',
      },
      {
        title: '3) Sustainable Development',
        description: 'Everything you nurture tends to keep growing long after your direct involvement, because you build strong foundational skills.',
      },
    ],
    clashingTeaser: 'However there\'s something that\'s stopping you from using these talents to make thousands of dollars — and you\'re currently getting \'attacked\' by energies that are draining your life force... These clashing energies weaken your natural fertile abilities... and I\'ll go through them on the next page.',
  },

  '庚': {
    name: 'Geng Metal',
    number: 7,
    chineseLabel: '庚金',
    subtitle: '(庚金) - YANG METAL',
    intro: 'You are a Geng Metal – and here\'s how you receive energy as a Geng Metal. This is what nourishes you, makes you feel alive, and what truly brings out your greatest talents...',
    vitalSources: [
      'You come alive under intense pressure and meaningful challenges that test your limits. Easy, comfortable situations actually drain you – you need resistance to sharpen your edge like a blade being forged.',
      'You thrive in high-stakes environments where your decisiveness and strength can cut through confusion and obstacles. Leadership roles, competitive situations, and crisis management energize your core.',
      'You feel most powerful when you have clear targets and worthy opponents to overcome. Having something concrete to fight for – whether justice, excellence, or protecting others – fuels your righteous fire.',
      'Recognition for your unwavering strength and integrity nourishes you, especially when others depend on your ability to make the hard decisions others avoid.',
    ],
    alignedEnergies: [
      'And once you feed your Geng Metal Day Master with the right energies...',
      'People start seeking you out when they need someone who won\'t bend or break under pressure. Your reputation becomes built on being the person who gets things done when stakes are highest.',
      'You\'ll find yourself naturally becoming the decisive leader who cuts through bureaucracy and weak excuses. Your income grows through your ability to handle what others can\'t – the high-pressure, high-reward situations.',
      'You\'ll wake up feeling like a sharpened weapon ready for battle, knowing you\'re exactly where you\'re meant to be – in the thick of meaningful challenges.',
    ],
    workSuperpowers: [
      {
        title: '1) Crisis Leadership',
        description: 'When everything is falling apart, you become the unshakeable force that makes the tough calls. Others freeze; you advance with calculated precision.',
      },
      {
        title: '2) Cutting Through BS',
        description: 'You have a gift for seeing straight to the core of problems and eliminating everything that doesn\'t matter. Your directness saves massive time and resources.',
      },
      {
        title: '3) Pressure Performance',
        description: 'The more intense the situation, the sharper you become. Your best work emerges when others are overwhelmed by stress.',
      },
    ],
    relationshipGifts: [
      {
        title: '1) Unwavering Loyalty',
        description: 'Once someone earns your respect, you become their fiercest protector. You\'ll fight battles they can\'t fight themselves.',
      },
      {
        title: '2) Righteous Protection',
        description: 'You naturally defend those who can\'t defend themselves. Your sense of justice makes people feel safe under your wing.',
      },
      {
        title: '3) Strength in Storms',
        description: 'Others depend on your emotional steel during their darkest moments. You\'re the rock that doesn\'t erode.',
      },
    ],
    naturalAbilities: [
      {
        title: '1) Reading Power Dynamics',
        description: 'You instantly understand who holds real authority and how to navigate or challenge existing power structures.',
      },
      {
        title: '2) Strategic Striking',
        description: 'Like a master swordsman, you know exactly when and where to apply force for maximum impact with minimum effort.',
      },
      {
        title: '3) Forging Under Fire',
        description: 'Adversity doesn\'t weaken you; it refines your edge. Each challenge makes you sharper and more valuable.',
      },
    ],
    clashingTeaser: 'However there\'s something that\'s stopping you from using these talents to make thousands of dollars — and you\'re currently getting \'attacked\' by energies that are draining your life force... These clashing energies weaken your natural sharpness... and I\'ll go through them on the next page.',
  },

  '辛': {
    name: 'Xin Metal',
    number: 8,
    chineseLabel: '辛金',
    subtitle: '(辛金) - YIN METAL',
    intro: 'You are a Xin Metal – and here\'s how you receive energy as a Xin Metal. This is what nourishes you, makes you feel alive, and what truly brings out your greatest talents...',
    vitalSources: [
      'You come alive when you\'re recognized for your refined taste and creative intelligence. Being acknowledged as the person with the best aesthetic sense, the most innovative ideas, or the most elegant solutions energizes your core.',
      'You thrive in beautiful, stimulating environments where you can experiment with new approaches and express your sophisticated perspective. Luxury settings, creative spaces, and intellectually rich conversations feed your soul.',
      'You feel most powerful when you have multiple projects and interests to explore simultaneously. Unlike others who focus on one thing, you need variety and the freedom to tinker with different ideas, relationships, and creative outlets.',
      'Appreciation from discerning people who understand quality nourishes you. You need an audience that can recognize your subtle brilliance and refined contributions.',
    ],
    alignedEnergies: [
      'And once you feed your Xin Metal Day Master with the right energies...',
      'People start seeking you out as the go-to person for innovative solutions and refined taste. Your reputation becomes built on being able to see possibilities others miss and create elegant approaches to complex problems.',
      'You\'ll find yourself naturally becoming the strategic advisor and creative catalyst who helps others refine their ideas into something truly exceptional. Your income grows through your unique perspective and ability to add sophisticated value.',
      'You\'ll wake up feeling like a polished gem ready to sparkle, knowing you have multiple interesting projects that showcase your intelligence and creativity.',
    ],
    workSuperpowers: [
      {
        title: '1) Strategic Innovation',
        description: 'You see patterns and connections others miss, creating brilliant solutions by combining seemingly unrelated ideas in sophisticated ways.',
      },
      {
        title: '2) Refined Problem-Solving',
        description: 'Where others use brute force, you find elegant approaches. Your solutions are not just effective—they\'re beautiful in their simplicity.',
      },
      {
        title: '3) Creative Intelligence',
        description: 'You excel at taking raw concepts and polishing them into something remarkable, like transforming ore into precious jewelry.',
      },
    ],
    relationshipGifts: [
      {
        title: '1) Sophisticated Guidance',
        description: 'Others come to you when they want to elevate their approach. You help people refine their ideas and present their best selves.',
      },
      {
        title: '2) Experimental Wisdom',
        description: 'Your willingness to try different relationship dynamics gives you unique insights into what works and what doesn\'t.',
      },
      {
        title: '3) Inspirational Elegance',
        description: 'Your presence raises the standard. People naturally want to be more thoughtful and refined when they\'re around you.',
      },
    ],
    naturalAbilities: [
      {
        title: '1) Reading Subtleties',
        description: 'You notice details others miss and can sense the hidden potential in situations, people, and opportunities.',
      },
      {
        title: '2) Multi-dimensional Thinking',
        description: 'While others think linearly, you think in layers, able to juggle multiple perspectives and possibilities simultaneously.',
      },
      {
        title: '3) Quality Refinement',
        description: 'You have an innate ability to take something good and make it exceptional through careful, sophisticated adjustments.',
      },
    ],
    clashingTeaser: 'However there\'s something that\'s stopping you from using these talents to make thousands of dollars — and you\'re currently getting \'attacked\' by energies that are draining your life force... These clashing energies weaken your natural brilliance... and I\'ll go through them on the next page.',
  },

  '壬': {
    name: 'Ren Water',
    number: 9,
    chineseLabel: '壬水',
    subtitle: '(壬水) - YANG WATER',
    intro: 'You are a Ren Water – and here\'s how you receive energy as a Ren Water. This is what nourishes you, makes you feel alive, and what truly brings out your greatest talents...',
    vitalSources: [
      'You come alive when you have freedom to move and explore without restrictions. Being confined to one place, one routine, or one way of thinking drains you like a dammed river losing its flow.',
      'You thrive in dynamic, ever-changing environments where you can adapt, network, and gather information from diverse sources. Social settings, travel opportunities, and situations requiring flexible problem-solving energize your core.',
      'You feel most powerful when you\'re the central hub of information flow – connecting different people, ideas, and opportunities. Having access to extensive networks and being the person others come to for insights feeds your soul.',
      'Recognition for your adaptability and diplomatic solutions nourishes you, especially when people acknowledge how you found a way around seemingly impossible obstacles.',
    ],
    alignedEnergies: [
      'And once you feed your Ren Water Day Master with the right energies...',
      'People start seeking you out as the go-to connector and problem-solver who always knows someone or something that can help. Your reputation becomes built on being able to flow around any obstacle.',
      'You\'ll find yourself naturally becoming the diplomatic bridge-builder who brings together different parties and finds solutions everyone can live with. Your income grows through your extensive network and ability to see opportunities others miss.',
      'You\'ll wake up feeling like a powerful current ready to flow, knowing you have the freedom to explore multiple interesting directions and connections.',
    ],
    workSuperpowers: [
      {
        title: '1) Adaptive Problem-Solving',
        description: 'Where others hit walls, you flow around them. Your ability to find alternative paths creates solutions that preserve relationships while achieving goals.',
      },
      {
        title: '2) Information Synthesis',
        description: 'Like an ocean that reflects everything, you absorb vast amounts of information and can recall exactly what\'s needed when it\'s needed.',
      },
      {
        title: '3) Network Orchestration',
        description: 'You excel at connecting the right people at the right time, creating value through relationships and information flow rather than direct force.',
      },
    ],
    relationshipGifts: [
      {
        title: '1) Diplomatic Navigation',
        description: 'You help people find common ground by flowing between different perspectives and reflecting back what each side needs to hear.',
      },
      {
        title: '2) Expansive Connection',
        description: 'Your social reach allows you to introduce people to opportunities and relationships they never would have found on their own.',
      },
      {
        title: '3) Fluid Adaptation',
        description: 'You adjust your approach to what each relationship needs, like water taking the shape of its container while maintaining your essential nature.',
      },
    ],
    naturalAbilities: [
      {
        title: '1) Reading Currents',
        description: 'You sense the flow of trends, social dynamics, and hidden opportunities before others even notice them emerging.',
      },
      {
        title: '2) Boundary Management',
        description: 'You understand when to push boundaries and when to respect them, knowing that too much freedom becomes destructive while too little stagnates growth.',
      },
      {
        title: '3) Memory Banking',
        description: 'Like the deep ocean holding treasures, you store valuable information and experiences that become incredibly useful at unexpected moments.',
      },
    ],
    clashingTeaser: 'However there\'s something that\'s stopping you from using these talents to make thousands of dollars — and you\'re currently getting \'attacked\' by energies that are draining your life force... These clashing energies block your natural flow... and I\'ll go through them on the next page.',
  },

  '癸': {
    name: 'Gui Water',
    number: 10,
    chineseLabel: '癸水',
    subtitle: '(癸水) - YIN WATER',
    intro: 'You are a Gui Water – and here\'s how you receive energy as a Gui Water. This is what nourishes you, makes you feel alive, and what truly brings out your greatest talents...',
    vitalSources: [
      'You come alive when you have intellectual freedom and variety in your work. Mundane, repetitive tasks drain you like dew evaporating in harsh sunlight – you need stimulating challenges that engage your sharp, observant mind.',
      'You thrive in research-oriented, investigative environments where you can dig deep into mysteries and uncover hidden patterns. Your gentle, nurturing nature flourishes when you can help others grow through your insights without being forced into rigid structures.',
      'You feel most energized when people appreciate your unique perspective and creative solutions. Having the freedom to change direction when your interests shift keeps your mysterious, mist-like essence flowing freely.',
      'Recognition for your intuitive observations and detailed analysis nourishes your core, especially when others value your ability to see what they\'ve missed.',
    ],
    alignedEnergies: [
      'And once you feed your Gui Water Day Master with the right energies...',
      'People start seeking you out as the insightful observer who notices critical details others overlook. Your reputation becomes built on being able to sense the emotional undercurrents and provide gentle guidance that helps others navigate complex situations.',
      'You\'ll find yourself naturally becoming the trusted advisor and creative problem-solver who offers fresh perspectives on old problems. Your income grows through your unique ability to understand what\'s really happening beneath the surface.',
      'You\'ll wake up feeling like gentle rain ready to nourish, knowing you have interesting mysteries to explore and people who value your quiet wisdom.',
    ],
    workSuperpowers: [
      {
        title: '1) Deep Pattern Recognition',
        description: 'Like mist that sees everything it touches, you notice subtle connections and underlying patterns that escape more obvious thinkers.',
      },
      {
        title: '2) Intuitive Research',
        description: 'Your observational skills combined with intellectual curiosity make you exceptional at uncovering hidden truths and solving complex puzzles.',
      },
      {
        title: '3) Gentle Transformation',
        description: 'You create change through patient nurturing rather than force, like how gentle rain gradually transforms landscapes.',
      },
    ],
    relationshipGifts: [
      {
        title: '1) Emotional Intelligence',
        description: 'You sense the unspoken feelings and needs of others, providing comfort and understanding exactly when it\'s needed most.',
      },
      {
        title: '2) Creative Inspiration',
        description: 'Your unique perspectives and idealistic nature inspire others to see possibilities they never considered.',
      },
      {
        title: '3) Safe Space Creation',
        description: 'People feel comfortable sharing their vulnerabilities with you because of your gentle, non-judgmental presence.',
      },
    ],
    naturalAbilities: [
      {
        title: '1) Reading Between Lines',
        description: 'You excel at understanding what people aren\'t saying and picking up on subtle environmental cues others miss entirely.',
      },
      {
        title: '2) Adaptive Flow',
        description: 'Like water taking any shape, you adjust to different situations while maintaining your essential gentle nature.',
      },
      {
        title: '3) Detail Synthesis',
        description: 'You process complex information and distill it into insights that are both accurate and unexpectedly illuminating.',
      },
    ],
    clashingTeaser: 'However there\'s something that\'s stopping you from using these talents to make thousands of dollars — and you\'re currently getting \'attacked\' by energies that are draining your life force... These clashing energies contaminate your natural clarity... and I\'ll go through them on the next page.',
  },
}

export default DAY_MASTER_READINGS
