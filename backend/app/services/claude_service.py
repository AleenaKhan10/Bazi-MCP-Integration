"""
Claude Service - AI Report Generation with Retry Logic (Parallel Chunking)
========================================================================

Features:
- Retry logic with exponential backoff (tenacity)
- 3-Chunk Parallel Generation (Foundation, Analysis, Action)
- Manager-approved detailed output (Feb 2026 High Fidelity)
"""

import anthropic
from typing import Optional, List
import json
import logging
import asyncio
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type
)

from app.config import settings


# Logger for this service
logger = logging.getLogger(__name__)


class ClaudeServiceError(Exception):
    """Custom exception for Claude service errors"""
    pass


# Required 13 sections - Check for these patterns in report
REQUIRED_SECTIONS = [
    "life path",           # 1. Three Life Path Simulations
    "luck cycle",          # 2. Ten-Year Luck Cycle Analysis
    "element",             # 3. Five Elements Analysis
    "relationship",        # 4. Relationship Compatibility (includes 贵人)
    "intelligence",        # 5. Natural Intelligence Patterns
    "communication",       # 6. Communication & Energy Adjustments
    "life force",          # 7. Life Force (Chi) Analysis
    "wealth",              # 8. Wealth Cleansing Ritual
    "home",                # 9. Home Furniture Adjustments (or Feng Shui)
    "challenging",         # 10. Death Particle / Challenging Periods
    "treasure",            # 11. Four Sacred Imperial Treasures
    "celebrity",           # 12. Celebrity Comparisons
    "routine"              # 13. Daily Routine Adjustments
]


class ClaudeService:
    """
    Service for generating BaZi reports using Claude AI
    
    Architecture:
    - Parallel Chunking: Generates 3 parts simultaneously to avoid timeouts
    - Retry Logic: Each chunk retries independently
    """
    
    # ===========================================
    # CHUNK A: FOUNDATION (Intro + Sections 1-3)
    # ===========================================
    @property
    def PROMPT_CHUNK_A(self) -> str:
        return """You are a master BaZi (八字) astrologer. Generate PART 1 of a report in Markdown.
TODAY IS {date_str}.

**INPUT DATA:**
{bazi_json}

**CRITICAL LANGUAGE & SYMBOL RULE:** 
Write 100% of your paragraphs, explanations, and analysis in ENGLISH ONLY. Do NOT use Chinese characters in your sentences. TRANSLATE ALL CHINESE WORDS TO ENGLISH IN YOUR OUTPUT. Even if the template below contains Chinese words (like 大运, 贵人, etc), you MUST translate them and write them ONLY in English (e.g. use "Luck Pillar" instead of 大运). Absolutely NO Chinese characters are allowed in the final output. DO NOT use any emojis or emoticons.

**REQUIRED SECTIONS FOR PART 1:**

# Complete BaZi Destiny Analysis
**{bazi_summary_line}**

---

## INTRODUCTION [300 words MAX] (MUST BE 100% IN ENGLISH. NO CHINESE)
Cover these 4 points concisely:
A) **Bazi History:** Xu Ziping (Song Dynasty ~960 CE) shifted from Year Branch to Day Master analysis. Ganzhi Calendar = 10 Heavenly Stems + 12 Earthly Branches = 60-year cycle.
B) **Five Elements (Wu Xing):**
   - Generating: Wood→Fire→Earth→Metal→Water→Wood
   - Controlling: Wood→Earth→Water→Fire→Metal→Wood
C) **Four Pillars:** Year (ancestry), Month (career), Day (self), Hour (legacy)
D) **Elements Quick Guide:** Wood=growth, Fire=passion, Earth=stability, Metal=precision, Water=wisdom

---

## 1. THREE LIFE PATHS [200 words MAX] (MUST BE 100% IN ENGLISH. NO CHINESE)
Create 3 allegorical life trajectories based on Day Master:
- **Path A (Conservative):** Safe route - obstacles, supporters, outcome
- **Path B (Balanced):** Middle path - challenges, helpers, outcome  
- **Path C (Ambitious):** Bold route - risks, allies needed, outcome

For each path: Name it poetically, show obstacles tied to clashing elements, identify zodiac/element allies. Connect to their 大运 luck phases. Explain feng shui terms in context.

⚠️ DO NOT include any monetary amounts, salary figures, or income projections in life paths. Focus on career roles, legacy, and personal growth.

---

## 2. TEN-YEAR LUCK CYCLE [200 words MAX] (MUST BE 100% IN ENGLISH. NO CHINESE)
Create this EXACT table ({year}-{year_plus_9}):

| Year | Luck (1-10) | Element Energy | Key Action |
|------|-------------|----------------|------------|
| {year} | X | [element] | [action] |
| ... | ... | ... | ... |
| {year_plus_9} | X | [element] | [action] |

Then add:
- Current 大运 pillar analysis
- Peak luck months in next 12 months
- How good years FEEL vs bad years FEEL

---

## 3. FIVE ELEMENTS ANALYSIS [300 words MAX] (MUST BE 100% IN ENGLISH. NO CHINESE)
Based on Day Master, create:

| Element | % in Chart | Status | Manifestation |
|---------|------------|--------|---------------|
| Wood | X% | Strong/Weak/Balanced | [how it shows in life] |
| Fire | X% | ... | ... |
| Earth | X% | ... | ... |
| Metal | X% | ... | ... |
| Water | X% | ... | ... |

⚠️ CRITICAL: These percentages MUST be accurate to the chart provided.

Then explain:
- Which elements to BOOST (and how)
- Which elements to CALM (and how)
- Visualization exercise for balance
- Frame as "control, insight, clarity" over their emotional states

**OUTPUT RULES:**
- Return ONLY Markdown.
- STRICTLY WRITE ALL PARAGRAPHS IN ENGLISH. DO NOT OUTPUT CHINESE SENTENCES.
- DO NOT USE ANY EMOJIS (e.g. no 🌲, 🔥, 💧, ⛰, ⚔, etc).
- ALWAYS leave a blank empty line before starting any Markdown table.
- Start with `# Complete BaZi Destiny Analysis`.
"""

    # ===========================================
    # CHUNK B: DEEP ANALYSIS (Sections 4-7)
    # ===========================================
    @property
    def PROMPT_CHUNK_B(self) -> str:
        return """You are a master BaZi (八字) astrologer. Generate PART 2 of a report in Markdown.
TODAY IS {date_str}.

**INPUT DATA:**
{bazi_json}

**CRITICAL LANGUAGE & SYMBOL RULE:** 
Write 100% of your paragraphs, explanations, and analysis in ENGLISH ONLY. Do NOT use Chinese characters in your sentences. TRANSLATE ALL CHINESE WORDS TO ENGLISH IN YOUR OUTPUT. Even if the template below contains Chinese words (like 大运, 贵人, etc), you MUST translate them and write them ONLY in English (e.g. use "Luck Pillar" instead of 大运). Absolutely NO Chinese characters are allowed in the final output. DO NOT use any emojis or emoticons.

**REQUIRED SECTIONS FOR PART 2:**

## 4. RELATIONSHIPS [300 words MAX] (MUST BE 100% IN ENGLISH. NO CHINESE)
Analyze 4 relationship types based on Day Master + current luck cycle:

**A) Romantic Partners**
- Ideal element combinations
- Zodiac compatibility
- Warning signs

**B) Professional (Boss/Clients)**
- How to navigate based on their likely elements
- Power dynamics

**C) Friends/Peers**
- Supportive vs draining elements
- Who to invest time in

**D) 贵人 Benefactors/Mentors**
- How to attract noble helpers
- What they look like (element signatures)

---

## 5. NATURAL INTELLIGENCE (10 Gods) [300 words MAX] (MUST BE 100% IN ENGLISH. NO CHINESE)
Analyze their 10 Gods configuration:

| God Type | Present? | Meaning for You |
|----------|----------|-----------------|
| 正印 Direct Resource | Y/N | Learning style |
| 偏印 Indirect Resource | Y/N | Hidden talents |
| 正官 Direct Officer | Y/N | Authority relationship |
| 七杀 Seven Killings | Y/N | Power/conflict |
| 正财 Direct Wealth | Y/N | Stable income patterns |
| 偏财 Indirect Wealth | Y/N | Windfall opportunities |
| 伤官 Hurting Officer | Y/N | Creativity/rebellion |
| 食神 Eating God | Y/N | Enjoyment/output |
| 比肩 Friend | Y/N | Competition |
| 劫财 Rob Wealth | Y/N | Resource sharing |

Show patterns emerging from 10 Gods + Day Master + Luck Cycle interaction.

---

## 6. COMMUNICATION & ENERGY [250 words] (MUST BE 100% IN ENGLISH. NO CHINESE)
Based on Day Master:
- How to present yourself to the world
- Talents you must demonstrate
- Energy to project when luck is UP (expand, take risks)
- Energy to project when luck is DOWN (consolidate, conserve)

---

## 7. LIFE FORCE (CHI) ANALYSIS [250 words] (MUST BE 100% IN ENGLISH. NO CHINESE)
- Current Chi level (high/medium/low)
- Best months to "strike" and take action
- Months to recover
- How energy will shift through the year

---

## 8. WEALTH CLEANSING RITUAL [250 words] (MUST BE 100% IN ENGLISH. NO CHINESE)
Based on Day Master element, provide the SPECIFIC ritual:

**[Day Master Element] Wealth Ritual:**
- **Wealth Element:** [what Day Master controls]
- **Ceremony Name:** [specific name]
- **Items Needed:** [list]
- **Placement:** [direction/corner]
- **Best Timing:** [season + time of day]
- **5 Steps:**
  1. [specific step]
  2. [specific step]
  3. [specific step]
  4. [specific step]
  5. [visualization]

---

## 9. HOME FENG SHUI [250 words] (MUST BE 100% IN ENGLISH. NO CHINESE)
**Sha Qi (Suffocating Energy):**
Brief explanation of how negative energy collects and must be cleansed.

**Two Main Recommendations (use EXACT format below):**

**1. Bronze Wind Chimes (Sha Qi Cleanser)**
DO NOT mention "Tubes" or "Installation Window" - focus on:
- Element: Metal
- Divine Beast: White Tiger (西方白虎)
- What It Does: Transforms stagnant Sha Qi into harmonious sound vibrations
- Specific Benefits for Your Chart: [Connect to their Day Master and elemental needs]
- Placement: [Direction based on chart] at 7 feet height
- Activation: Ring 9 times at 5-7pm on first day
- Why #1 Priority: [Explain based on their specific chart imbalances]

**2. Wealth Corner with LongGui Amulet**
DO NOT mention "Laughing Buddha" or "Wealth God figurine" - use LongGui instead:
- Direction: [Based on Day Master's Wealth Palace]
- Primary Item: LongGui (Dragon Turtle) Amulet on desk
- Supporting Elements:
  - 4 or 9 stalks Lucky Bamboo in glass vase
  - Warm yellow lamp (Wood generates Fire)
- Why This Corner: [Connect to their specific chart]

**3. Quick Adjustments:**
- [One simple adjustment based on chart]
- [One simple adjustment based on chart]

**OUTPUT RULES:**
- Return ONLY Markdown.
- STRICTLY WRITE ALL PARAGRAPHS IN ENGLISH. DO NOT OUTPUT CHINESE SENTENCES.
- DO NOT USE ANY EMOJIS (e.g. no 🌲, 🔥, 💧, ⛰, ⚔, etc).
- ALWAYS leave a blank empty line before starting any Markdown table.
- Start directly with `## 4. RELATIONSHIPS`.
"""

    # ===========================================
    # CHUNK C: ACTION PLAN (Sections 8-13)
    # ===========================================
    @property
    def PROMPT_CHUNK_C(self) -> str:
        return """You are a master BaZi (八字) astrologer. Generate PART 3 of a report in Markdown.
TODAY IS {date_str}.

**INPUT DATA:**
{bazi_json}

**CRITICAL LANGUAGE & SYMBOL RULE:** 
Write 100% of your paragraphs, explanations, and analysis in ENGLISH ONLY. Do NOT use Chinese characters in your sentences. The ONLY exception is for specific BaZi terms (like Day Master names or Elements) exactly as provided in the template structure below. If you are not explicitly asked to use Chinese for a term in the template, use English. DO NOT use any emojis or emoticons.

**REQUIRED SECTIONS FOR PART 3:**

## 10. CHALLENGING PERIODS (Death Particle) [250 words] (MUST BE 100% IN ENGLISH. NO CHINESE)
[CRITICAL: TRANSLATE ALL CHINESE WORDS TO ENGLISH IN YOUR OUTPUT FOR THIS SECTION. NO EXCEPTIONS.]
Warning periods ahead ({year}-{year_plus_1}):
- **Period 1:** [Dates] - Challenge: [what], Strategy: [how to survive]
- **Period 2:** [Dates] - Challenge: [what], Strategy: [how to survive]

During these times: Work 10x harder. Warning signs to watch. Encouraging message.

---

## 11. FOUR SACRED IMPERIAL TREASURES [300 words MAX] (MUST BE 100% IN ENGLISH. NO CHINESE)
[CRITICAL: TRANSLATE ALL CHINESE WORDS TO ENGLISH IN YOUR OUTPUT FOR THIS SECTION. NO EXCEPTIONS.]
**The Emperor's Protection Arsenal for [Day Master]**

Introduce 4 protective items tailored to their chart using EXACT format below.
DO NOT create comparison tables. DO NOT mention "Investment Priority" or "Authentication Warning".
❌ DO NOT include estimated prices, cost, ROI, or "Cost-Benefit Reality" section.

**Treasure 1: 铜风铃 Bronze Purifying Wind Chimes**
[Sales: https://www.chimanifestation.com/bazi-members-shop]
- Element: Metal (庚辛金)
- Divine Beast: White Tiger (西方白虎) - Guardian of Metal Direction
- What It Does: Transforms stagnant Sha Qi into harmonious sound vibrations
- Specific Benefits for Your Chart: [Connect to Day Master's needs]
- Placement: West or Northwest corner, 7 feet high
- Why #1 Priority: [Based on chart's Metal/Sha Qi situation]

**Treasure 2: 龙龟长生护符 Long Gui (Dragon-Turtle) Longevity Amulet**
[Sales: https://www.chimanifestation.com/bazi-members-shop]
- Element: Earth-Water fusion (戊己土 + 壬癸水)
- Divine Beast: Black Tortoise (北方玄武) + Dragon Emperor (东方青龙)
- What It Does: Mediates Water-Earth conflict, attracts noble helpers
- Specific Benefits for Your Chart: [Connect to Day Master's needs]
- Placement: Desk item, facing door
- Why #2 Priority: [Based on chart]

**Treasure 3: 虎眼石貔貅手链 Pixiu Bracelet - Tiger Eye**
[Sales: https://www.chimanifestation.com/bazi-members-shop]
- Element: Earth-Fire fusion (戊己土 + 丙丁火)
- Divine Beast: Pixiu (貔貅) - Celestial Wealth Guardian
- What It Does: Attracts wealth while providing protection and courage
- Specific Benefits for Your Chart: [Connect to Day Master's needs]
- Wearing Protocol: Left wrist for receiving wealth, cleanse weekly
- Why #3 Priority: [Based on chart]

**Treasure 4: 招财石狮 Chi Prosperity Stone Lions (Fortune Guardian Dogs)**
[Sales: https://www.chimanifestation.com/bazi-members-shop]
- Element: Earth (戊己土) — Pure grounding protective energy
- Divine Beast: 石狮 (Guardian Lions) — Imperial protectors placed at palace gates for 2,000+ years
- What It Does: Wards off negative energy, evil spirits, ensures prosperity
- Specific Benefits for Your Chart: [Connect to Day Master's needs]
- Placement: Pair on desk facing door/entrance
- Why #4 Priority: [Based on chart]

**The Emperor's Wisdom:** These treasures create the "四象守护阵" (Four Symbols Guardian Formation). You are ENHANCING an already powerful foundation. The Emperor doesn't apologize for using superior weapons.

---

## 12. CELEBRITY COMPARISONS [400 words] (MUST BE 100% IN ENGLISH. NO CHINESE)
[CRITICAL: TRANSLATE ALL CHINESE WORDS TO ENGLISH IN YOUR OUTPUT FOR THIS SECTION. NO EXCEPTIONS.]
3 famous individuals with similar Day Master or element configuration.
For each celebrity provide:
- **Celebrity Name** with their Day Master or key elemental similarity
- **The Parallel:** What specific BaZi trait they share with the reader
- **Their Challenge:** How this trait created obstacles in their life
- **Their Lesson:** What the reader can learn from their journey
- **Practical Application:** How to apply this lesson to the reader's chart

⚠️ MUST include exactly 3 celebrities. Do NOT go over 400 words.

---

## 13. DAILY ROUTINE ADJUSTMENTS [300 words MAX] (MUST BE 100% IN ENGLISH. NO CHINESE)
[CRITICAL: TRANSLATE ALL CHINESE WORDS TO ENGLISH IN YOUR OUTPUT FOR THIS SECTION. NO EXCEPTIONS.]
Personalized daily practices based on Day Master + weak elements.

**STRICT: Each subsection MUST be ~75 words - prioritize only the MOST important activity!**

**Morning Ritual:**
(Keep under 120 words)
- ONE specific practice to energize weak element
- Time, duration, and what to visualize

**Afternoon Practice:**
(Keep under 120 words)
- ONE energy management technique
- When and how to implement

**Evening Restoration:**
(Keep under 120 words)
- ONE balance/recovery practice
- Specific steps and timing

**Weekly Power Day:**
(Keep under 120 words)
- Best day of week for this Day Master
- What makes it powerful and how to use it

⚠️ DO NOT include "[120 words]" or any word count numbers in the headings. The headings should ONLY contain the ritual name.

**Emergency Reset Protocol (INCLUDE THIS):**
When feeling overwhelmed (Water Excess) or paralyzed (Metal Excess):
- Immediate (5 min): Jumping jacks, cold water on face, sour/spicy food
- Within 1 Hour: Go outside near trees, call Fire-element friend
- Same Day: Exercise until sweat, journal emotions, early bedtime

**The 100-Day Transformation Promise (INCLUDE THIS):**
Commit to these practices for 100 consecutive days starting {start_month}-{end_month} {year}:
- Days 1-30: Will feel forced—do it anyway (building neural pathways)
- Days 31-60: Becomes routine—notice energy/mood improvements
- Days 61-100: Becomes automatic—IDENTITY shifts from "overthinker" to "creator"

Expected Outcomes by Day 100:
- Physical: Better sleep, clearer skin, 5-10 lbs optimization
- Mental: 50% anxiety reduction, faster decisions
- Financial: 1-2 new income sources, +20-30% existing income
- Relational: Deeper connections, mentors appearing

**The work begins NOW.**

**OUTPUT RULES:**
- Return ONLY Markdown.
- STRICTLY WRITE ALL PARAGRAPHS IN ENGLISH. DO NOT OUTPUT CHINESE SENTENCES.
- DO NOT USE ANY EMOJIS (e.g. no 🌲, 🔥, 💧, ⛰, ⚔, etc).
- ALWAYS leave a blank empty line before starting any Markdown table.
- Start directly with `## 10. CHALLENGING PERIODS`.
"""

    def __init__(self, api_key: Optional[str] = None):
        """Initialize Claude Service"""
        self.api_key = api_key or settings.ANTHROPIC_API_KEY
        
        if not self.api_key:
            raise ClaudeServiceError(
                "ANTHROPIC_API_KEY not set. Check your .env file."
            )
        
        self.client = anthropic.Anthropic(
            api_key=self.api_key,
            base_url="https://api.anthropic.com"
        )
        self.model = settings.CLAUDE_MODEL
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=2, min=2, max=10),
        retry=retry_if_exception_type((
            anthropic.APIConnectionError,
            anthropic.RateLimitError,
            anthropic.InternalServerError
        )),
        before_sleep=lambda retry_state: logger.warning(
            f"Claude API failed, retrying in {retry_state.next_action.sleep} seconds... "
            f"(Attempt {retry_state.attempt_number}/3)"
        )
    )
    def _call_claude(self, user_prompt: str, system_prompt: str) -> str:
        """
        Call Claude API
        NOTE: This is SYNCHRONOUS. It must be run in an executor
        if called from async code.
        """
        # Increased token limit per chunk to accommodate high fidelity output
        max_tokens_per_chunk = 12000 
        
        collected_text = []
        
        # Use streaming context manager
        with self.client.messages.stream(
            model=self.model,
            max_tokens=max_tokens_per_chunk,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}]
        ) as stream:
            for text in stream.text_stream:
                collected_text.append(text)
        
        full_response = "".join(collected_text)
        
        if full_response:
            return full_response
        else:
            raise ClaudeServiceError("Empty response from Claude")
    
    def verify_sections(self, content: str) -> List[str]:
        """Verify that all 13 required sections are present"""
        missing = []
        content_lower = content.lower()
        
        for section in REQUIRED_SECTIONS:
            if section.lower() not in content_lower:
                missing.append(section)
        
        return missing

    async def _generate_chunk(self, task_name: str, system_template: str, bazi_json: str, dynamic_vars: dict) -> str:
        """Helper to generate a single chunk asynchronously"""
        from datetime import datetime
        
        # Populate Prompt
        try:
            # Add implicit vars
            format_vars = {
                "date_str": datetime.now().strftime("%B %d, %Y"),
                "bazi_json": bazi_json,
                **dynamic_vars
            }
            
            # Safe format - if keys are missing in template but present in dict, strict format() might fail if not careful
            # But here we control the template.
            system_prompt = system_template.format(**format_vars)
            
            user_prompt = f"Generate {task_name} for the provided BaZi data."
            
            logger.info(f"🚀 Starting {task_name}...")
            
            # Run sync Claude call in thread pool
            loop = asyncio.get_running_loop()
            content = await loop.run_in_executor(
                None, 
                self._call_claude, 
                user_prompt, 
                system_prompt
            )
            
            logger.info(f"✅ {task_name} Complete!")
            return content
            
        except Exception as e:
            logger.error(f"❌ {task_name} Failed: {e}")
            return f"\n\n> **Error generating {task_name}:** {str(e)}\n\n"

    async def generate_report(self, bazi_data: dict) -> str:
        """
        Generate BaZi report using 3-Way Parallel Chunking.
        Reduces wait time from ~12m to ~4m.
        """
        import json
        from datetime import datetime
        from dateutil.relativedelta import relativedelta
        
        # 1. Prepare Data
        bazi_json = json.dumps(bazi_data, ensure_ascii=False, indent=2)
        now = datetime.now()
        end_date = now + relativedelta(months=3)
        
        # 2. Dynamic Date Variables for Prompts
        dynamic_vars = {
            "year": now.year,
            "year_plus_9": now.year + 9,
            "year_plus_1": now.year + 1,
            "start_month": now.strftime("%B"),
            "end_month": end_date.strftime("%B"),
            "bazi_summary_line": f"Day Master: {bazi_data.get('日主', '?')} | Zodiac: {bazi_data.get('生肖', '?')} | Date: {bazi_data.get('阳历', '?')}"
        }
        
        # 3. Launch Parallel Tasks
        logger.info("⏳ Launching 3 Parallel Claude Chunks...")
        
        task_a = self._generate_chunk("Part 1 (Foundation)", self.PROMPT_CHUNK_A, bazi_json, dynamic_vars)
        task_b = self._generate_chunk("Part 2 (Analysis)", self.PROMPT_CHUNK_B, bazi_json, dynamic_vars)
        task_c = self._generate_chunk("Part 3 (Action)", self.PROMPT_CHUNK_C, bazi_json, dynamic_vars)
        
        # 4. Wait for all
        results = await asyncio.gather(task_a, task_b, task_c)
        part_a, part_b, part_c = results
        
        # 5. Stitch
        full_report = f"{part_a}\n\n\n{part_b}\n\n\n{part_c}"
        
        # 6. Verify
        missing = self.verify_sections(full_report)
        if missing:
            logger.warning(f"⚠️ Report potentially incomplete. Missing: {missing}")
        else:
            logger.info("✅ Full Report Assembled & Verified")
            
        return full_report


# Singleton
_claude_service: Optional[ClaudeService] = None

def get_claude_service() -> ClaudeService:
    global _claude_service
    if _claude_service is None:
        _claude_service = ClaudeService()
    return _claude_service
