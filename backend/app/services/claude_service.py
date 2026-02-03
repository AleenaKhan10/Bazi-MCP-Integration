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
    # ===========================================
    SYSTEM_PROMPT = """You are a master BaZi (八字) astrologer. Generate a complete BaZi report in Markdown.

**CRITICAL INSTRUCTIONS:**
1. TODAY IS FEBRUARY 2026 - all dates must reflect this
2. Complete ALL 13 sections - do NOT skip any
3. Markdown only - NO HTML/CSS
4. Be mystical and engaging, but CONCISE
5. Use Chinese terms with brief explanations

**STRICT WORD LIMITS (Total: ~5,500 words / ~25 pages):**
| Section | Words |
|---------|-------|
| Introduction | 350 |
| Section 1-5 | 400 each |
| Section 6-13 | 250 each |

STAY WITHIN LIMITS - Quality over quantity. One powerful sentence beats three weak ones."""

    # ===========================================
    # Manager's Detailed 13 Sections (Feb 2026) v2
    # ===========================================
    SECTION_TEMPLATE = """## BIRTH CHART DATA
{bazi_json}

---

## REPORT STRUCTURE

### INTRODUCTION [350 words]
Cover these 4 points concisely:
A) **Bazi History:** Xu Ziping (Song Dynasty ~960 CE) shifted from Year Branch to Day Master analysis. Ganzhi Calendar = 10 Heavenly Stems + 12 Earthly Branches = 60-year cycle.
B) **Five Elements (Wu Xing):**
   - Generating: Wood→Fire→Earth→Metal→Water→Wood
   - Controlling: Wood→Earth→Water→Fire→Metal→Wood
C) **Four Pillars:** Year (ancestry), Month (career), Day (self), Hour (legacy)
D) **Elements Quick Guide:** Wood=growth, Fire=passion, Earth=stability, Metal=precision, Water=wisdom

---

### 1. THREE LIFE PATHS [400 words]
Create 3 allegorical life trajectories based on Day Master:
- **Path A (Conservative):** Safe route - obstacles, supporters, outcome
- **Path B (Balanced):** Middle path - challenges, helpers, outcome  
- **Path C (Ambitious):** Bold route - risks, allies needed, outcome

For each path: Name it poetically, show obstacles tied to clashing elements, identify zodiac/element allies. Connect to their 大运 luck phases. Explain feng shui terms in context.

---

### 2. TEN-YEAR LUCK CYCLE [400 words]
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

### 3. FIVE ELEMENTS ANALYSIS [400 words]
Based on Day Master, create:

| Element | % in Chart | Status | Manifestation |
|---------|------------|--------|---------------|
| Wood | X% | Strong/Weak/Balanced | [how it shows in life] |
| Fire | X% | ... | ... |
| Earth | X% | ... | ... |
| Metal | X% | ... | ... |
| Water | X% | ... | ... |

Then explain:
- Which elements to BOOST (and how)
- Which elements to CALM (and how)
- Visualization exercise for balance
- Frame as "control, insight, clarity" over their emotional states

---

### 4. RELATIONSHIPS [400 words]
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

### 5. NATURAL INTELLIGENCE (10 Gods) [400 words]
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
Explain how negative energy collects in homes and must be cleansed.

**Recommendations:**
1. **Bronze Wind Chimes** - Place at [direction] to cleanse Sha Qi
2. **Wealth Corner** - For your Day Master, activate the [direction] corner
3. **3 Quick Adjustments:**
   - [Room 1 adjustment]
   - [Room 2 adjustment]
   - [Room 3 adjustment]

---

### 10. CHALLENGING PERIODS (Death Particle) [250 words]
Warning periods ahead:
- **Period 1:** [Month-Month 2026] - Challenge: [what], Strategy: [how to survive]
- **Period 2:** [Month-Month 2026/27] - Challenge: [what], Strategy: [how to survive]
- **Period 3:** [Month-Month 2027] - Challenge: [what], Strategy: [how to survive]

During these times: Work 10x harder. Warning signs to watch. Encouraging message.

---

### 11. FOUR SACRED IMPERIAL TREASURES [250 words]
Introduce these 4 protective items tailored to their chart:

1. **Purifying Wind Chimes** (Bronze) - Removes suffocating Sha Qi energy
2. **Long Gui Longevity Amulet** (Himalayan Resin) - Desk item for health & longevity
3. **Pixiu Bracelet - Obsidian** - Wealth attraction & negative energy absorption
4. **Pixiu Bracelet - Tiger Eye** - Protection & courage

Explain which is MOST important for their specific Day Master.

---

### 12. CELEBRITY COMPARISONS [250 words]
2-3 famous individuals with similar Day Master or element configuration:
- **Celebrity 1:** [Name] - Similarity: [what], Lesson: [what to learn]
- **Celebrity 2:** [Name] - Similarity: [what], Lesson: [what to learn]
- **Celebrity 3:** [Name] - Similarity: [what], Lesson: [what to learn]

---

### 13. DAILY ROUTINE ADJUSTMENTS [250 words]
Personalized daily practices based on Day Master + weak elements:

**Morning Ritual:**
- [Specific practice to energize weak element]

**Afternoon Practice:**
- [Energy management technique]

**Evening Restoration:**
- [Balance/recovery practice]

**Weekly Power Day:**
- [Best day of week for this Day Master and why]

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
        
        # Format BaZi data
        bazi_json = json.dumps(bazi_data, ensure_ascii=False, indent=2)
        user_prompt = self.SECTION_TEMPLATE.format(
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
