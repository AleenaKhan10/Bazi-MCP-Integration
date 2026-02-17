/* ===========================================
   Day Masters Data — 10 Types
   ===========================================
   
   BaZi has 10 "Day Masters" (日主), one for each
   Heavenly Stem. Each represents a person's core
   element and personality.
   
   This data is used on:
   - Reading Page: show personalized reading
   - Closing Page: show attacking element
   
   STRUCTURE:
   Each Day Master has:
   - chinese: Chinese character (e.g., "甲")
   - pinyin: Pronunciation (e.g., "Jiǎ")
   - element: which of Wu Xing (e.g., "Wood")
   - polarity: Yin or Yang
   - title: display name for UI
   - description: brief personality summary
   - attackingElement: what this element destroys
   - attackedBy: what destroys this element
   
   The Destructive Cycle (相剋):
   Wood → Earth → Water → Fire → Metal → Wood
   (Wood breaks Earth, Earth dams Water, etc.)
*/

const DAY_MASTERS = {
  '甲': {
    chinese: '甲',
    pinyin: 'Jiǎ',
    element: 'Wood',
    polarity: 'Yang',
    title: 'Yang Wood — The Mighty Tree',
    color: 'text-wood',
    bgColor: 'bg-green-900/30',
    description: 'You are like a towering tree — strong, upright, and always reaching for the sky. Yang Wood people are natural leaders with immense growth potential.',
    attackingElement: 'Earth',
    attackedBy: 'Metal',
    traits: ['Leadership', 'Growth-oriented', 'Resilient', 'Ambitious'],
  },
  '乙': {
    chinese: '乙',
    pinyin: 'Yǐ',
    element: 'Wood',
    polarity: 'Yin',
    title: 'Yin Wood — The Graceful Vine',
    color: 'text-wood',
    bgColor: 'bg-green-900/30',
    description: 'You are like a flexible vine — adaptable, graceful, and able to find your way around any obstacle. Yin Wood people thrive through connection and adaptability.',
    attackingElement: 'Earth',
    attackedBy: 'Metal',
    traits: ['Adaptable', 'Diplomatic', 'Creative', 'Gentle'],
  },
  '丙': {
    chinese: '丙',
    pinyin: 'Bǐng',
    element: 'Fire',
    polarity: 'Yang',
    title: 'Yang Fire — The Radiant Sun',
    color: 'text-fire',
    bgColor: 'bg-red-900/30',
    description: 'You are like the sun — radiant, warm, and impossible to ignore. Yang Fire people light up every room with their natural charisma and generosity.',
    attackingElement: 'Metal',
    attackedBy: 'Water',
    traits: ['Charismatic', 'Generous', 'Passionate', 'Inspiring'],
  },
  '丁': {
    chinese: '丁',
    pinyin: 'Dīng',
    element: 'Fire',
    polarity: 'Yin',
    title: 'Yin Fire — The Candlelight',
    color: 'text-fire',
    bgColor: 'bg-red-900/30',
    description: 'You are like a candle flame — warm, intimate, and illuminating. Yin Fire people possess deep intuition and the ability to see through darkness.',
    attackingElement: 'Metal',
    attackedBy: 'Water',
    traits: ['Intuitive', 'Warm-hearted', 'Perceptive', 'Thoughtful'],
  },
  '戊': {
    chinese: '戊',
    pinyin: 'Wù',
    element: 'Earth',
    polarity: 'Yang',
    title: 'Yang Earth — The Mountain',
    color: 'text-earth',
    bgColor: 'bg-amber-900/30',
    description: 'You are like a mountain — stable, reliable, and unmovable. Yang Earth people are the bedrock others depend on, offering unwavering support.',
    attackingElement: 'Water',
    attackedBy: 'Wood',
    traits: ['Reliable', 'Grounded', 'Protective', 'Steady'],
  },
  '己': {
    chinese: '己',
    pinyin: 'Jǐ',
    element: 'Earth',
    polarity: 'Yin',
    title: 'Yin Earth — The Fertile Garden',
    color: 'text-earth',
    bgColor: 'bg-amber-900/30',
    description: 'You are like fertile garden soil — nurturing, productive, and full of hidden potential. Yin Earth people cultivate growth in everything they touch.',
    attackingElement: 'Water',
    attackedBy: 'Wood',
    traits: ['Nurturing', 'Resourceful', 'Patient', 'Supportive'],
  },
  '庚': {
    chinese: '庚',
    pinyin: 'Gēng',
    element: 'Metal',
    polarity: 'Yang',
    title: 'Yang Metal — The Sword',
    color: 'text-metal',
    bgColor: 'bg-yellow-900/30',
    description: 'You are like a forged sword — sharp, decisive, and powerful. Yang Metal people cut through confusion with clarity and unwavering determination.',
    attackingElement: 'Wood',
    attackedBy: 'Fire',
    traits: ['Decisive', 'Strong-willed', 'Righteous', 'Disciplined'],
  },
  '辛': {
    chinese: '辛',
    pinyin: 'Xīn',
    element: 'Metal',
    polarity: 'Yin',
    title: 'Yin Metal — The Precious Jewel',
    color: 'text-metal',
    bgColor: 'bg-yellow-900/30',
    description: 'You are like a refined jewel — elegant, precious, and beautifully crafted. Yin Metal people have an eye for beauty and a talent for perfection.',
    attackingElement: 'Wood',
    attackedBy: 'Fire',
    traits: ['Elegant', 'Detail-oriented', 'Sensitive', 'Refined'],
  },
  '壬': {
    chinese: '壬',
    pinyin: 'Rén',
    element: 'Water',
    polarity: 'Yang',
    title: 'Yang Water — The Ocean',
    color: 'text-water',
    bgColor: 'bg-blue-900/30',
    description: 'You are like the vast ocean — deep, powerful, and full of hidden wisdom. Yang Water people flow through life with unstoppable momentum.',
    attackingElement: 'Fire',
    attackedBy: 'Earth',
    traits: ['Wise', 'Adventurous', 'Resourceful', 'Free-spirited'],
  },
  '癸': {
    chinese: '癸',
    pinyin: 'Guǐ',
    element: 'Water',
    polarity: 'Yin',
    title: 'Yin Water — The Morning Dew',
    color: 'text-water',
    bgColor: 'bg-blue-900/30',
    description: 'You are like morning dew — gentle, life-giving, and quietly transformative. Yin Water people possess deep emotional intelligence and spiritual awareness.',
    attackingElement: 'Fire',
    attackedBy: 'Earth',
    traits: ['Empathetic', 'Spiritual', 'Observant', 'Gentle'],
  },
}

export default DAY_MASTERS
