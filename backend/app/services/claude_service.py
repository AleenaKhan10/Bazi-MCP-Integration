"""
Claude Service - AI Report Generation with Retry Logic
========================================================

Features:
- Retry logic with exponential backoff (tenacity)
- 13 sections verification
- Manager-approved detailed prompt (Updated Jan 2026)
"""

import anthropic
from typing import Optional, List
import json
import logging
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
# Using flexible keywords that match Claude's actual output (Manager Feb 2026)
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
    
    Features:
    - Retry with exponential backoff
    - Section verification
    - Manager-approved detailed prompt (Updated Jan 2026)
    """
    
    # ===========================================
    # System Prompt - Manager Updated (Feb 2026) v2
    # NOW WITH DYNAMIC DATE (Change 1)
    # ===========================================
    @property
    def SYSTEM_PROMPT(self) -> str:
        """Generate system prompt with DYNAMIC current date"""
        from datetime import datetime
        current_date = datetime.now()
        month_name = current_date.strftime("%B").upper()  # e.g., "FEBRUARY"
        year = current_date.year  # e.g., 2026
        
        return f"""You are a master BaZi (八字) astrologer. Generate a complete BaZi report in Markdown.

**CRITICAL INSTRUCTIONS:**
1. TODAY IS {month_name} {year} - all dates must reflect this
2. Complete ALL 13 sections - do NOT skip any
3. Markdown only - NO HTML/CSS
4. Be mystical and engaging, but CONCISE
5. Use Chinese terms with brief explanations

**⚠️ STRICT WORD LIMITS (Total: ~3,500 words MAX)**
| Section | Max Words | Instructions |
|---------|-----------|--------------|
| Section | Max Words | Instructions |
|---------|-----------|--------------|
| Introduction | 150 | Concise history & definition |
| Section 1-5 | 200 each | BULLET POINTS preferred |
| Section 6-10 | 150 each | Direct & actionable |
| Section 11 | 250 | Follow specific product format |
| Section 12 | 400 | 3 Celebrities (130 words each) |
| Section 13 | 300 | Daily routine (75 words/part) |

⛔ **HARD STOP RULE**: If you find yourself writing long paragraphs, STOP. Use lists.
⛔ **ANTI-FLUFF**: Do not use flowery metaphors like "dancing with the cosmos". Be direct.
⛔ **PENALTY**: Reports over 40 pages will be REJECTED. Keep it tight.

**ABSOLUTE RULES (NEVER VIOLATE):**
- ❌ NEVER include dollar amounts ($), yen amounts (¥), or ANY currency figures
- ❌ NEVER mention estimated prices, investment costs, or monetary ROI
- ❌ NEVER include "Cost-Benefit" analysis or "Total investment" sections
- ❌ NEVER include "Estimated income increase" or monetary projections
- ✅ Focus on SPIRITUAL and ENERGETIC benefits only
- ✅ Keep elemental percentages IDENTICAL everywhere they appear (Introduction, Section 3, etc.)"""

    # ===========================================
    # Manager's Detailed 13 Sections (Feb 2026) v2
    # ===========================================
    SECTION_TEMPLATE = """## BIRTH CHART DATA
{bazi_json}

---

## REPORT STRUCTURE

### INTRODUCTION [300 words MAX]
Cover these 4 points concisely:
A) **Bazi History:** Xu Ziping (Song Dynasty ~960 CE) shifted from Year Branch to Day Master analysis. Ganzhi Calendar = 10 Heavenly Stems + 12 Earthly Branches = 60-year cycle.
B) **Five Elements (Wu Xing):**
   - Generating: Wood→Fire→Earth→Metal→Water→Wood
   - Controlling: Wood→Earth→Water→Fire→Metal→Wood
C) **Four Pillars:** Year (ancestry), Month (career), Day (self), Hour (legacy)
D) **Elements Quick Guide:** Wood=growth, Fire=passion, Earth=stability, Metal=precision, Water=wisdom

---

### 1. THREE LIFE PATHS [200 words MAX]
Create 3 allegorical life trajectories based on Day Master:
- **Path A (Conservative):** Safe route - obstacles, supporters, outcome
- **Path B (Balanced):** Middle path - challenges, helpers, outcome  
- **Path C (Ambitious):** Bold route - risks, allies needed, outcome

For each path: Name it poetically, show obstacles tied to clashing elements, identify zodiac/element allies. Connect to their 大运 luck phases. Explain feng shui terms in context.

⚠️ DO NOT include any monetary amounts, salary figures, or income projections in life paths. Focus on career roles, legacy, and personal growth.

---

### 2. TEN-YEAR LUCK CYCLE [200 words MAX]
Create this EXACT table (2026-2035):

| Year | Luck (1-10) | Element Energy | Key Action |
|------|-------------|----------------|------------|
| 2026 | X | [element] | [action] |
| ... | ... | ... | ... |
| 2035 | X | [element] | [action] |

Then add:
- Current 大运 pillar analysis
- Peak luck months in next 12 months
- How good years FEEL vs bad years FEEL

---

### 3. FIVE ELEMENTS ANALYSIS [300 words MAX]
Based on Day Master, create:

| Element | % in Chart | Status | Manifestation |
|---------|------------|--------|---------------|
| Wood | X% | Strong/Weak/Balanced | [how it shows in life] |
| Fire | X% | ... | ... |
| Earth | X% | ... | ... |
| Metal | X% | ... | ... |
| Water | X% | ... | ... |

⚠️ CRITICAL: These percentages MUST be EXACTLY the same values in the Introduction section's "Elemental Intelligence Made Simple" list. Any discrepancy = report failure.

Then explain:
- Which elements to BOOST (and how)
- Which elements to CALM (and how)
- Visualization exercise for balance
- Frame as "control, insight, clarity" over their emotional states

---

### 4. RELATIONSHIPS [300 words MAX]
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

### 5. NATURAL INTELLIGENCE (10 Gods) [300 words MAX]
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

### 6. COMMUNICATION & ENERGY [250 words]
Based on Day Master:
- How to present yourself to the world
- Talents you must demonstrate
- Energy to project when luck is UP (expand, take risks)
- Energy to project when luck is DOWN (consolidate, conserve)

---

### 7. LIFE FORCE (CHI) ANALYSIS [250 words]
- Current Chi level (high/medium/low)
- Best months to "strike" and take action
- Months to rest and recover
- How energy will shift through the year

---

### 8. WEALTH CLEANSING RITUAL [250 words]
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

### 9. HOME FENG SHUI [250 words]
**Sha Qi (Suffocating Energy):**
Brief explanation of how negative energy collects and must be cleansed.

**CHANGE 6: Two Main Recommendations (use EXACT format below):**

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

---

### 10. CHALLENGING PERIODS (Death Particle) [250 words]
Warning periods ahead:
- **Period 1:** [Month-Month 2026] - Challenge: [what], Strategy: [how to survive]
- **Period 2:** [Month-Month 2026/27] - Challenge: [what], Strategy: [how to survive]
- **Period 3:** [Month-Month 2027] - Challenge: [what], Strategy: [how to survive]

During these times: Work 10x harder. Warning signs to watch. Encouraging message.

---

### 11. FOUR SACRED IMPERIAL TREASURES [300 words MAX]
**CHANGE 7: The Emperor's Protection Arsenal for [Day Master]**

Introduce 4 protective items tailored to their chart using EXACT format below.
DO NOT create comparison tables. DO NOT mention "Investment Priority" or "Authentication Warning".
❌ DO NOT include estimated prices, cost, ROI, or "Cost-Benefit Reality" section.
❌ DO NOT include Size/Material/Gender specifications for any product.

Use this EXACT format for EACH product (all 4 must follow identical structure):

**Treasure 1: 铜风铃 Bronze Purifying Wind Chimes**
[Sales: https://www.chimanifestation.com/chimes]
- Element: Metal (庚辛金)
- Divine Beast: White Tiger (西方白虎) - Guardian of Metal Direction
- What It Does: Transforms Sha Qi into harmonious sound vibrations
- Specific Benefits for Your Chart: [Connect to Day Master's needs]
- Placement: West or Northwest corner, 7 feet high
- Why #1 Priority: [Based on chart's Metal/Sha Qi situation]

**Treasure 2: 龙龟长生护符 Long Gui (Dragon-Turtle) Longevity Amulet**
[Sales: https://www.chimanifestation.com/longgui]
- Element: Earth-Water fusion (戊己土 + 壬癸水)
- Divine Beast: Black Tortoise (北方玄武) + Dragon Emperor (东方青龙)
- What It Does: Mediates Water-Earth conflict, attracts noble helpers
- Specific Benefits for Your Chart: [Connect to Day Master's needs]
- Placement: Desk item, facing door
- Why #2 Priority: [Based on chart]

**Treasure 3: 虎眼石貔貅手链 Pixiu Bracelet - Tiger Eye**
[Sales: https://www.chimanifestation.com/pixiu]
- Element: Earth-Fire fusion (戊己土 + 丙丁火)
- Divine Beast: Pixiu (貔貅) - Celestial Wealth Guardian
- What It Does: Attracts wealth while providing protection and courage
- Specific Benefits for Your Chart: [Connect to Day Master's needs]
- Wearing Protocol: Left wrist for receiving wealth, cleanse weekly
- Why #3 Priority: [Based on chart]

**Treasure 4: 招财石狮 Chi Prosperity Stone Lions (Fortune Guardian Dogs)**
[Sales: https://www.chimanifestation.com/fortunelions2]
- Element: Earth (戊己土) — Pure grounding protective energy
- Divine Beast: 石狮 (Guardian Lions) — Imperial protectors placed at palace gates for 2,000+ years
- What It Does: Wards off negative energy, evil spirits, ensures prosperity
- Specific Benefits for Your Chart: [Connect to Day Master's needs]
- Placement: Pair on desk facing door/entrance
- Why #4 Priority: [Based on chart]

**The Emperor's Wisdom:** These treasures create the "四象守护阵" (Four Symbols Guardian Formation). You are ENHANCING an already powerful foundation. The Emperor doesn't apologize for using superior weapons.

---

### 12. CELEBRITY COMPARISONS [400 words]
3 famous individuals with similar Day Master or element configuration.
For each celebrity provide:
- **Celebrity Name** with their Day Master or key elemental similarity
- **The Parallel:** What specific BaZi trait they share with the reader
- **Their Challenge:** How this trait created obstacles in their life
- **Their Lesson:** What the reader can learn from their journey
- **Practical Application:** How to apply this lesson to the reader's chart

⚠️ MUST include exactly 3 celebrities. Do NOT go over 400 words.

---

### 13. DAILY ROUTINE ADJUSTMENTS [300 words MAX]
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

**CHANGE 8: DO NOT INCLUDE "MONTHLY CYCLE ATTUNEMENT" - no moon phase content!**

**Emergency Reset Protocol (INCLUDE THIS):**
When feeling overwhelmed (Water Excess) or paralyzed (Metal Excess):
- Immediate (5 min): Jumping jacks, cold water on face, sour/spicy food
- Within 1 Hour: Go outside near trees, call Fire-element friend
- Same Day: Exercise until sweat, journal emotions, early bedtime

**The 100-Day Transformation Promise (INCLUDE THIS):**
Commit to these practices for 100 consecutive days starting {START_MONTH}-{END_MONTH} {YEAR}:
- Days 1-30: Will feel forced—do it anyway (building neural pathways)
- Days 31-60: Becomes routine—notice energy/mood improvements
- Days 61-100: Becomes automatic—IDENTITY shifts from "overthinker" to "creator"

Expected Outcomes by Day 100:
- Physical: Better sleep, clearer skin, 5-10 lbs optimization
- Mental: 50% anxiety reduction, faster decisions
- Financial: 1-2 new income sources, +20-30% existing income
- Relational: Deeper connections, mentors appearing

**The work begins NOW.**

---

## OUTPUT RULES
- Return ONLY Markdown
- Complete ALL 13 sections
- Stay within word limits
- Be mystical but practical
- End with an encouraging closing message"""

    def __init__(self, api_key: Optional[str] = None):
        """Initialize Claude Service"""
        self.api_key = api_key or settings.ANTHROPIC_API_KEY
        
        if not self.api_key:
            raise ClaudeServiceError(
                "ANTHROPIC_API_KEY not set. Check your .env file."
            )
        
        self.client = anthropic.Anthropic(api_key=self.api_key)
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
    def _call_claude(self, user_prompt: str) -> str:
        """
        Call Claude API with STREAMING for large token requests
        
        Streaming is REQUIRED by Anthropic for requests >10 minutes
        (28K tokens = ~10-15 min generation time)
        
        Retries on:
        - Connection errors
        - Rate limits (429)
        - Server errors (5xx)
        """
        collected_text = []
        
        # Use streaming context manager
        with self.client.messages.stream(
            model=self.model,
            max_tokens=25000,  # Optimized for complete 13 sections (~4000 words)
            system=self.SYSTEM_PROMPT,
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
        """
        Verify that all 13 required sections are present
        
        Returns:
            List of missing section keywords (empty if all present)
        """
        missing = []
        content_lower = content.lower()
        
        for section in REQUIRED_SECTIONS:
            if section.lower() not in content_lower:
                missing.append(section)
        
        return missing
    
    def generate_report(self, bazi_data: dict) -> str:
        """
        Generate BaZi report content (Markdown only)
        
        Features:
        - Retry on failure
        - Section verification
        - Complete 13 sections
        
        Returns:
            Markdown text string with all 13 sections
        """
        # Extract key data for prompt
        zodiac = bazi_data.get('生肖', 'Unknown')
        birth_date = bazi_data.get('阳历', 'Unknown date')
        
        # CHANGE 8: Calculate dynamic 100-Day Promise dates
        from datetime import datetime
        from dateutil.relativedelta import relativedelta
        
        now = datetime.now()
        start_month = now.strftime("%B")  # e.g., "February"
        end_date = now + relativedelta(months=3)
        end_month = end_date.strftime("%B")  # e.g., "May"
        promise_year = now.year  # e.g., 2026
        
        # Format BaZi data
        bazi_json = json.dumps(bazi_data, ensure_ascii=False, indent=2)
        
        # Replace dynamic date placeholders in template
        template_with_dates = self.SECTION_TEMPLATE.replace(
            "{START_MONTH}-{END_MONTH} {YEAR}",
            f"{start_month}-{end_month} {promise_year}"
        )
        
        user_prompt = template_with_dates.format(
            bazi_json=bazi_json,
            zodiac=zodiac,
            birth_date=birth_date
        )
        
        try:
            # Call Claude with retry logic
            logger.info("🤖 Calling Claude API for report generation...")
            content = self._call_claude(user_prompt)
            logger.info("✅ Claude report received")
            
            # Verify all 13 sections
            missing = self.verify_sections(content)
            
            if missing:
                logger.warning(f"⚠️ Some sections may be incomplete: {missing}")
                # Still return content - better partial than nothing
            else:
                logger.info("✅ All 13 sections verified in report")
            
            return content
            
        except anthropic.APIConnectionError as e:
            logger.error(f"❌ Connection error after retries: {e}")
            raise ClaudeServiceError(f"Connection error: {str(e)}")
        except anthropic.RateLimitError:
            logger.error("❌ Rate limit exceeded after retries")
            raise ClaudeServiceError("Rate limit exceeded. Please wait a few minutes.")
        except anthropic.APIStatusError as e:
            logger.error(f"❌ API error: {e}")
            raise ClaudeServiceError(f"API error: {e.message}")


# Singleton
_claude_service: Optional[ClaudeService] = None

def get_claude_service() -> ClaudeService:
    global _claude_service
    if _claude_service is None:
        _claude_service = ClaudeService()
    return _claude_service
