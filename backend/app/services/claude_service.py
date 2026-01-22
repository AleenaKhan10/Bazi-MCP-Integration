"""
Claude Service - AI Report Generation with Retry Logic
========================================================

Features:
- Retry logic with exponential backoff (tenacity)
- 13 sections verification
- 8000 max tokens for complete reports
- Manager-approved section format
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
    "furniture",           # 9. Home Furniture
    "death",               # 10. Death Particle
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
    - Optimized prompt for all 13 sections
    """
    
    # ===========================================
    # System Prompt - Claude's Personality
    # ===========================================
    SYSTEM_PROMPT = """You are a master BaZi (八字) astrologer with decades of experience in Chinese metaphysics.

Your task is to generate the text content of a comprehensive BaZi report in Markdown format.

CRITICAL RULES:
1. You MUST include ALL 13 sections - no exceptions
2. Do NOT generate any HTML, CSS, or styling
3. Use Markdown formatting (headers, bold, italics, lists)
4. Be mystical, engaging, and personalized
5. Base everything on the actual chart data provided
6. Each section should be 150-250 words - detailed but CONCISE
7. Return ONLY Markdown content
8. COMPLETE ALL 13 SECTIONS - if running low on space, make sections shorter but NEVER skip sections

IMPORTANT: Completing all 13 sections is MORE important than making each section extremely long."""

    # ===========================================
    # Manager-Approved 13 Sections Prompt
    # ===========================================
    SECTION_TEMPLATE = """Based on the following BaZi birth chart, generate a COMPLETE personalized destiny report.

## Birth Chart Data
{bazi_json}

## CRITICAL INSTRUCTION
You MUST generate ALL 13 sections below. Missing any section is NOT acceptable.

---

# 🔮 Your Personalized BaZi Destiny Report

*For a {zodiac} born on {birth_date}*

---

## 1. 🌟 Three Life Path Simulations
Dive into the hidden intricacies that lie before you – map out:
- **Obstacles** that will test your resolve
- **Challenges** you must overcome  
- **Opportunities** waiting to be seized
Generate 3 distinct possible life paths based on different choices.

---

## 2. 📅 Ten-Year Luck Cycle Analysis
Analyze the 大运 (Major Luck Cycles):
- Your current 10-year luck cycle and its meaning
- The upcoming cycle and what to expect
- **PEAK LUCK periods in the next 12 months** - specific months to watch
- How to maximize these favorable windows

---

## 3. 🔥 Five Elements Analysis
Examine the 5 elements (木火土金水) in this chart:
- Which elements **nourish** your Day Master
- Which elements **clash** with your energetic fingerprints
- Signs of elemental deficiency and what bad luck it brings
- Practical ways to balance your elements (colors, foods, directions)

---

## 4. 💕 Relationship Compatibility
Reveal the spooky relationship truths:
- Who is **right for you** - ideal partner elements
- Who is **meant to stay** in your life
- Who is **secretly trying to help you**
- Traits that reveal who's really on your side
- Warning signs of incompatible people

---

## 5. 🧠 Natural Intelligence Patterns
Unlock your mental potential:
- Your natural thinking style based on Ten Gods (十神)
- The **BEST ways to use your intelligence**
- How working with your natural patterns can increase income (like our users who see up to 25% increase in 1 month)
- Specific career and learning recommendations

---

## 6. 💬 Communication & Energy Adjustments
Simple adjustments to **how you talk, move, and act**:
- Speaking patterns that charge you with right energies
- Body language adjustments for better reception
- How to attract the right people who provide gifts, guidance & wisdom
- Daily energy optimization techniques

---

## 7. ⚡ Life Force (Chi) Analysis
If you feel **uninspired, stuck, or trapped** in old patterns:
- Signs that you're low on Life Force (Chi)
- How clashing energies drain hundreds of thousands of people yearly
- **The way out** if you feel stuck and lethargic
- Specific Chi-building exercises for this chart

---

## 8. 💰 Wealth Cleansing Ritual
A simple wealth cleansing tailored to your **specific Day Master**:
- Step-by-step ritual instructions
- How to replenish wealth blocks
- Clearing clashing energies around money
- Best timing for performing this ritual

---

## 9. 🏠 Home Furniture Adjustments
Feng Shui for abundance:
- Specific furniture placements for your chart
- How to nourish abundance-creating energies
- The shocking changes people experience at full potential
- Room-by-room recommendations

---

## 10. ⚠️ Death Particle Detection
Detect the little-known **death particle (死氣)** from your chart:
- Methods to identify this particle
- How it invites misfortune
- People to **stay away from** who carry this particle
- How it creates a "hanging noose" around your cash cows

---

## 11. 👑 Four Sacred Imperial Treasures
Instructions for 4 treasures tailored to YOUR chart:
- What each treasure does for your Day Master
- How they **scare away death particles**
- How they welcome correct energies
- Specific activation instructions

---

## 12. 🌟 Celebrity Comparisons
Discover who you could become:
- 2-3 **rich, powerful, celebrity-status** individuals similar to you
- What gifts they expressed from their BaZi
- What you share with them
- How to fully express YOUR true hidden gifts

---

## 13. ☀️ Daily Routine Adjustments
Simple daily practices to:
- **Energize weak elements** in your chart
- Feel refreshed from the moment you wake
- Tune your mind to the frequency of abundance in seconds
- Morning, afternoon, and evening routines

---

Write in English with occasional Chinese terms for authenticity. 
Be engaging, mystical, and SPECIFIC to this individual's chart.
Return ONLY the Markdown content - no HTML, no extra formatting."""

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
        Call Claude API with retry logic
        
        Retries on:
        - Connection errors
        - Rate limits (429)
        - Server errors (5xx)
        """
        message = self.client.messages.create(
            model=self.model,
            max_tokens=12000,  # Optimized for speed while keeping all sections
            system=self.SYSTEM_PROMPT.replace("150-250 words", "150-200 words"),  # Enforce conciseness
            messages=[{"role": "user", "content": user_prompt}]
        )
        
        if message.content and len(message.content) > 0:
            return message.content[0].text
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
