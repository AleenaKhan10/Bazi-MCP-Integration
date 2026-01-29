# 🔮 BaZi MCP Project Documentation

> **AI-Powered Chinese Astrology Report Generator**  
> Combines traditional BaZi (八字) calculations with Claude AI for personalized destiny analysis

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Setup & Installation](#setup--installation)
6. [Configuration](#configuration)
7. [API Endpoints](#api-endpoints)
8. [Report Features](#report-features)
9. [Key Components](#key-components)
10. [Running the Application](#running-the-application)

---

## 🎯 Project Overview

BaZi MCP is a full-stack application that generates comprehensive Chinese astrology reports based on a person's birth date, time, and location. The system:

- **Calculates BaZi (Four Pillars)** using traditional Chinese astrology algorithms
- **Generates AI-powered analysis** using Claude AI for personalized destiny readings
- **Produces professional PDF/HTML reports** with beautiful formatting and diagrams
- **Supports worldwide locations** with automatic timezone detection via Nominatim geocoding

### What is BaZi?

BaZi (八字), also known as "Four Pillars of Destiny," is a Chinese astrological system that uses:

- **Year Pillar** - Social/ancestral influences
- **Month Pillar** - Career/parents
- **Day Pillar** - Self/spouse
- **Hour Pillar** - Children/legacy

Each pillar contains a **Heavenly Stem** (天干) and **Earthly Branch** (地支), associated with the Five Elements (Wood, Fire, Earth, Metal, Water).

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Frontend)                          │
│                    HTML/CSS/JavaScript                              │
│                    Port: 5500 (Live Server)                         │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼ HTTP REST API
┌─────────────────────────────────────────────────────────────────────┐
│                     BACKEND (FastAPI + Python)                      │
│                         Port: 8000                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  /api/generate-report                                        │   │
│  │     │                                                        │   │
│  │     ├── GeocodingService (Nominatim → Timezone)              │   │
│  │     ├── MCPClient (→ BaZi Server)                            │   │
│  │     ├── ClaudeService (→ Anthropic API)                      │   │
│  │     └── ReportGenerator (HTML/PDF via WeasyPrint)            │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼ HTTP
┌─────────────────────────────────────────────────────────────────────┐
│                    MCP SERVER (Node.js/TypeScript)                  │
│                         Port: 3001                                  │
│                    BaZi Calculation Engine                          │
│                    (Traditional Chinese Algorithms)                 │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User** submits birth info via frontend form
2. **Backend** receives request and:
   - Geocodes location → gets timezone
   - Calls MCP Server → gets BaZi data
   - Calls Claude AI → generates analysis
   - Generates HTML/PDF report
3. **User** receives download links for reports

---

## 🛠️ Tech Stack

### Frontend

| Technology        | Purpose                              |
| ----------------- | ------------------------------------ |
| HTML5             | Structure                            |
| CSS3              | Styling (Vanilla CSS, no frameworks) |
| JavaScript (ES6+) | Logic & API calls                    |

### Backend (Python)

| Technology     | Version | Purpose               |
| -------------- | ------- | --------------------- |
| FastAPI        | Latest  | REST API framework    |
| Uvicorn        | Latest  | ASGI server           |
| Anthropic SDK  | Latest  | Claude AI integration |
| WeasyPrint     | Latest  | PDF generation        |
| Jinja2         | Latest  | HTML templating       |
| Geopy          | Latest  | Geocoding (Nominatim) |
| TimezoneFinder | Latest  | Timezone lookup       |
| Pytz           | Latest  | Timezone handling     |

### MCP Server (Node.js)

| Technology       | Version | Purpose                       |
| ---------------- | ------- | ----------------------------- |
| Node.js          | 18+     | Runtime                       |
| TypeScript       | Latest  | Type-safe JavaScript          |
| Express.js       | Latest  | HTTP server                   |
| lunar-javascript | Latest  | Chinese calendar calculations |

### External APIs

| Service          | Purpose                            | Cost        |
| ---------------- | ---------------------------------- | ----------- |
| Anthropic Claude | AI report generation               | Pay-per-use |
| Nominatim        | Geocoding (location → coordinates) | Free        |

---

## 📁 Project Structure

```
bazi-mcp/
├── frontend/                    # Frontend application
│   ├── index.html              # Main HTML file
│   ├── styles/
│   │   └── main.css            # Stylesheet
│   └── scripts/
│       └── app.js              # JavaScript logic
│
├── backend/                     # Python backend
│   ├── app/
│   │   ├── main.py             # FastAPI app entry
│   │   ├── config.py           # Settings & environment
│   │   ├── routers/
│   │   │   └── reports.py      # Report generation endpoints
│   │   ├── services/
│   │   │   ├── mcp_client.py       # BaZi server communication
│   │   │   ├── claude_service.py   # AI report generation
│   │   │   ├── report_generator.py # HTML/PDF creation
│   │   │   └── geocoding_service.py # Location → timezone
│   │   ├── schemas/
│   │   │   └── report.py       # Pydantic models
│   │   └── templates/
│   │       └── report.html     # Report HTML template
│   ├── reports/                # Generated reports storage
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # Environment variables
│
├── mcp-server/                  # BaZi calculation server
│   └── bazi-mcp/
│       ├── src/
│       │   ├── index.ts        # Main exports
│       │   ├── httpServer.ts   # Express server
│       │   └── lib/
│       │       └── bazi.ts     # BaZi calculation logic
│       ├── dist/               # Compiled JavaScript
│       ├── package.json
│       └── tsconfig.json
│
└── bazi_mcp_project.md         # This documentation
```

---

## ⚙️ Setup & Installation

### Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **npm or yarn**
- **Git**

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd bazi-mcp
```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 3: MCP Server Setup

```bash
# Navigate to MCP server
cd mcp-server/bazi-mcp

# Install dependencies
npm install

# Build TypeScript
npm run build
```

### Step 4: Environment Configuration

Create `.env` file in `backend/` folder:

```env
# Anthropic API Key (Required)
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx

# MCP Server URL
MCP_SERVER_URL=http://localhost:3001

# Claude Model (Options: claude-sonnet-4-5-20250929, claude-haiku-4-5-20251001)
CLAUDE_MODEL=claude-sonnet-4-5-20250929
```

---

## 🔧 Configuration

### Backend Configuration (`backend/app/config.py`)

| Variable            | Default                      | Description                    |
| ------------------- | ---------------------------- | ------------------------------ |
| `MCP_SERVER_URL`    | `http://localhost:3001`      | BaZi calculation server        |
| `ANTHROPIC_API_KEY` | Required                     | Claude AI API key              |
| `CLAUDE_MODEL`      | `claude-sonnet-4-5-20250929` | AI model for report generation |

### Claude Model Options

| Model                        | Speed  | Quality   | Cost   |
| ---------------------------- | ------ | --------- | ------ |
| `claude-sonnet-4-5-20250929` | Medium | Excellent | Medium |
| `claude-haiku-4-5-20251001`  | Fast   | Good      | Low    |

---

## 🔌 API Endpoints

### Generate Report

```http
POST /api/generate-report
Content-Type: application/json

{
  "birth_date": "1993-09-28",
  "birth_time": "02:22",
  "location": "Singapore",
  "gender": "male",
  "name": "John"  // Optional
}
```

**Response:**

```json
{
  "report_id": "abc123",
  "bazi_summary": {
    "八字": "癸酉 辛酉 壬子 辛丑",
    "日主": "壬",
    "生肖": "鸡"
  },
  "files": {
    "html": "/reports/abc123/report.html",
    "pdf": "/reports/abc123/report.pdf"
  }
}
```

### Static Files

```http
GET /reports/{report_id}/report.html
GET /reports/{report_id}/report.pdf
```

---

## 📊 Report Features

### 1. Report Header

- Personalized title: "{Name}'s BaZi Destiny Report"
- Subtitle: "Prepared By Chi Manifestation BaZi Master"
- Birth details: Date, Time, Location, Gender

### 2. Four Pillars Display

- Visual grid showing Hour, Day, Month, Year pillars
- **Heavenly Stems** with elemental colors
- **Earthly Branches** with zodiac animals
- Color-coded by element:
  - 🟢 Wood (Green)
  - 🔴 Fire (Red)
  - 🟤 Earth (Brown)
  - 🟡 Metal (Gold)
  - 🔵 Water (Blue)

### 3. Five Element Cycle Diagram

- SVG visualization of elemental relationships
- **Productive Cycle** (solid green arrows)
- **Destructive Cycle** (dashed red arrows)

### 4. AI-Generated Sections (13 Total)

1. 🌟 Three Life Path Simulations
2. 📅 Ten-Year Luck Cycle Analysis (Table)
3. 🔥 Five Elements Analysis
4. 💕 Relationship Compatibility Guide
5. 🧠 Natural Intelligence Pattern
6. 💬 Communication & Energy Signature
7. 💼 Ideal Career Paths
8. 💰 Wealth Accumulation Strategy
9. 🏥 Health & Vitality Zones
10. 🎯 Personal Branding Guide
11. ⏰ Daily/Monthly Optimization
12. 🌍 Feng Shui Recommendations
13. 🔮 Closing Wisdom

---

## 🔑 Key Components

### GeocodingService (`geocoding_service.py`)

- Converts any location to timezone using Nominatim (FREE, unlimited)
- Smart caching to avoid repeated API calls
- Rate limiting protection (1 request/second)
- Fallback to UTC if geocoding fails

### MCPClient (`mcp_client.py`)

- Communicates with BaZi calculation server
- Handles timezone conversion for accurate calculations
- Returns Four Pillars, Five Elements, special stars

### ClaudeService (`claude_service.py`)

- Generates AI-powered destiny analysis
- Uses streaming for real-time response
- Configurable token limits (20,000 max)
- Structured prompt for consistent output

### ReportGenerator (`report_generator.py`)

- Renders Jinja2 HTML template
- Generates PDF using WeasyPrint
- Handles elemental color mapping
- Embeds Five Element Cycle SVG

---

## 🚀 Running the Application

### Terminal 1: Start MCP Server

```bash
cd mcp-server/bazi-mcp
node dist/httpServer.js
```

> Server runs on http://localhost:3001

### Terminal 2: Start Backend

```bash
cd backend
python -m uvicorn app.main:app --reload
```

> Server runs on http://localhost:8000

### Terminal 3: Start Frontend

```bash
cd frontend
# Use VS Code Live Server or:
npx serve -l 5500
```

> Frontend runs on http://localhost:5500

### Quick Test

```bash
curl -X POST http://localhost:8000/api/generate-report \
  -H "Content-Type: application/json" \
  -d '{
    "birth_date": "1990-05-15",
    "birth_time": "14:30",
    "location": "Karachi, Pakistan",
    "gender": "male"
  }'
```

---

## 📝 Notes

### Current Limitations

- Report generation takes ~30-60 seconds (Claude API response time)
- Nominatim rate limit: 1 request/second (cached after first request)

### Future Enhancements (Based on Manager Feedback)

- [ ] Exhaustive Cycle in elemental diagram
- [ ] Product recommendations based on elemental needs
- [ ] Configurable element color schemes

---

## 📞 Support

For issues or questions, contact the development team.

---

_Last Updated: January 29, 2026_
