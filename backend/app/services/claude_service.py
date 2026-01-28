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
# Using flexible keywords that match Claude's actual output
REQUIRED_SECTIONS = [
    "life path",           # 1. Three Life Path Simulations
    "luck cycle",          # 2. Ten-Year Luck Cycle
    "element",             # 3. Five Elements Analysis
    "relationship",        # 4. Relationship Compatibility
    "intelligence",        # 5. Natural Intelligence
    "communication",       # 6. Communication & Energy
    "life force",          # 7. Life Force (Chi)
    "wealth",              # 8. Wealth Cleansing
    "feng shui",           # 9. Home Feng Shui
    "challenging",         # 10. Challenging Periods
    "treasure",            # 11. Imperial Treasures
    "celebrity",           # 12. Celebrity Comparisons
    "routine"              # 13. Daily Routine
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
    # System Prompt - Manager Approved (Optimized)
    # ===========================================
    SYSTEM_PROMPT = """You are a master BaZi (八字) astrologer with decades of experience in Chinese metaphysics.
Generate ONLY Markdown text for a BaZi report.

**CRITICAL WORD BUDGET - MUST FOLLOW EXACTLY:**
Total output: approximately 5,500 words. Budget per section:
- Section 1 (Life Paths): 600 words (200 per path)
- Section 2 (10-Year Table): 500 words (table + analysis)
- Section 3 (Elements): 450 words
- Section 4 (Relationships): 500 words (125 per type)
- Section 5 (Intelligence): 400 words
- Sections 6-13: 300 words EACH

**NON-NEGOTIABLE RULES:**
1. NO section exceeds its word limit
2. You MUST complete ALL 13 sections - stopping early is FAILURE
3. Finish Section 13 (Daily Routine) before output ends
4. Use bullet points for efficiency
5. Chinese terms (正印, 七杀) with brief English meaning
6. Be mystical yet concise - quality over quantity

Output clean Markdown only, no HTML."""

    # ===========================================
    # Optimized 13 Sections (Manager Requirements)
    # ===========================================
    SECTION_TEMPLATE = """Based on this BaZi chart, generate a complete personalized destiny report:

## Chart Data
{bazi_json}

---

## Complete 13 Sections (All Required)

### 1. 🌟 Three Life Path Simulations [600 words]
3 possible life trajectories using Day Master (200 words each):
- **Allegorical Path Name** (poetic title)
- Obstacles, challenges using BaZi terms (explain in context)
- Opportunities from luck cycle
- Who helps: zodiac/element supporters
- Connect to 大运 luck phases

---

### 2. 📅 Ten-Year Luck Cycle [500 words]
Create 10-row table:

| Year | Luck (1-10) | Elemental Analysis | Action to Take |
|------|-------------|-------------------|----------------|
| 2024 | X/10 | [element weather] | [action] |
... continue to 2033

After table: Current 大运 analysis, peak periods, good/bad year feelings.

---

### 3. 🔥 Five Elements Analysis [450 words]
- Day Master strength (strong/weak)
- Each element (金木水火土): % present, manifestation
- Element interactions (mood, energy, productivity)
- Which to boost, which to calm

---

### 4. 💕 Relationship Compatibility [500 words]
4 types (125 words each):
1. **Romantic**: Ideal partner elements + zodiac years
2. **Professional** (Boss & Clients): How to navigate work
3. **Friends**: Supportive peer elements
4. **贵人 (Gui Ren)**: How to attract noble helpers/mentors

---

### 5. 🧠 Natural Intelligence [400 words]
10 Gods in chart:
- 正印/偏印 (Resource Stars): learning style
- 正官/七杀 (Authority Stars): power dynamics
- 正财/偏财 (Wealth Stars): money patterns
- 伤官/食神 (Output Stars): creativity
- 比肩/劫财 (Friend Stars): competition

How they interact with current luck cycle.

---

### 6. 💬 Communication & Energy [300 words]
- Best self-presentation for Day Master
- Energy when luck UP vs DOWN
- Key talents to demonstrate

---

### 7. ⚡ Life Force (Chi) Analysis [300 words]
- Current Chi level (Ganzhi based)
- Best months to take action
- When to rest and recharge
- Planning for when to "strike"

---

### 8. 💰 Wealth Cleansing Ritual [300 words]
5-step personalized ritual for Day Master:
1. Timing (days/hours)
2. Materials
3. Actions
4. Visualization
5. Closing

---

### 9. 🏠 Home Feng Shui [300 words]
- Wealth corner direction for this chart
- Purifying Wind Chimes (chimanifestation.com) placement
- 3 room adjustments

---

### 10. ⚠️ Challenging Periods [300 words]
- 2-3 difficult months/periods ahead
- Warning signs
- Encouragement and survival strategies
- 10x effort reminder

---

### 11. 👑 Four Sacred Imperial Treasures [300 words]
Brief on each (75 words each):
1. **Purifying Wind Chimes** - energy flow
2. **Long Gui Longevity Amulet** - health
3. **Pixiu Bracelet** - wealth attraction
4. **Amethyst Prosperity Tree** - abundance

---

### 12. 🌟 Celebrity Comparisons [300 words]
2-3 celebrities with similar Day Master/elements:
- Why similar, what to learn from them

---

### 13. ☀️ Daily Routine [300 words]
Daily practices for balance:
- **Morning**: specific practice
- **Afternoon**: energy management
- **Evening**: restoration
- How this maintains elemental harmony

---

Write English with Chinese terms (正印, 七杀). Be mystical, practical, complete.
Return ONLY Markdown. COMPLETE ALL 13 SECTIONS."""

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
            max_tokens=20000,  # Reduced as requested, still ensures all 13 sections complete
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
