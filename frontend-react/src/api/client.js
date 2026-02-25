/* ===========================================
   API Client — Backend Communication
   ===========================================
   
   Centralized API calls using Axios.
   All backend endpoints are called from here.
   
   WHY SEPARATE FILE:
   - One place to change the API URL
   - Consistent error handling
   - Easy to add auth headers later
   
   ENDPOINTS:
   - getBaziOnly(): Quick BaZi calc (for loading page)
   - generateReport(): Full Claude AI report + email
   - sendReportEmail(): Send existing report to email
   - getCountries(): Dynamic country list
   - getCities(): Dynamic cities by country
*/

import axios from 'axios'

// -------------------------------------------
// Axios Instance
// -------------------------------------------
// In development: Vite proxy forwards /api → localhost:8000
// In production: same domain, no proxy needed
const api = axios.create({
  baseURL: '/api',
  timeout: 1200000, // 2 minutes (report generation takes ~60s)
  headers: {
    'Content-Type': 'application/json',
  },
})

// -------------------------------------------
// BaZi Only (Quick Calculation)
// -------------------------------------------
// Used on Loading Page — gets Day Master quickly
// WITHOUT generating the full Claude AI report
export async function getBaziOnly(formData) {
  const response = await api.post('/bazi-only', {
    birth_date: formData.birthDate,
    birth_time: formData.birthTime,
    location: formData.location || "Unknown Location",
    gender: formData.gender,
    name: formData.firstName || formData.name || "Valued User",
  })
  return response.data
}

// -------------------------------------------
// Generate Full Report
// -------------------------------------------
// Used on Closing Page — generates full Claude AI report
// and optionally emails it
export async function generateFullReport(formData) {
  const response = await api.post('/generate-report', {
    birth_date: formData.birthDate,
    birth_time: formData.birthTime,
    location: formData.location || "Unknown Location",
    gender: formData.gender,
    name: formData.firstName || formData.name || "Valued User",
    email: formData.email || null,
  })
  return response.data
}

// -------------------------------------------
// Send Report Email (Standalone)
// -------------------------------------------
export async function sendReportEmail(reportId, email, name) {
  const response = await api.post('/send-report-email', {
    report_id: reportId,
    email,
    name,
  })
  return response.data
}

// -------------------------------------------
// Country/City External APIs (Free, no key needed)
// -------------------------------------------

// Get all countries (sorted A-Z)
export async function getCountries() {
  try {
    const response = await axios.get(
      'https://restcountries.com/v3.1/all?fields=name'
    )
    // Extract common names and sort alphabetically
    const countries = response.data
      .map((c) => c.name.common)
      .sort((a, b) => a.localeCompare(b))
    return countries
  } catch (error) {
    console.error('Failed to load countries:', error)
    // Fallback: return a small default list
    return [
      'Australia', 'Canada', 'China', 'India', 'Indonesia',
      'Japan', 'Malaysia', 'Pakistan', 'Philippines', 'Singapore',
      'South Korea', 'Thailand', 'United Kingdom', 'United States',
    ]
  }
}

// Get cities for a specific country (used when country has NO states)
export async function getCities(country) {
  try {
    const response = await axios.post(
      'https://countriesnow.space/api/v0.1/countries/cities',
      { country }
    )
    if (response.data.error) {
      throw new Error(response.data.msg)
    }
    return response.data.data.sort((a, b) => a.localeCompare(b))
  } catch (error) {
    console.error(`Failed to load cities for ${country}:`, error)
    return [] // Return empty — user can try again
  }
}

// -------------------------------------------
// Get states/provinces for a country
// -------------------------------------------
// HOW IT WORKS:
//   1. User selects a country (e.g., "United States")
//   2. We ask the API: "Does this country have states?"
//   3. API returns a list of states/provinces
//   4. If list is empty → country has no subdivisions (e.g., Singapore)
//   5. If list has items → show State dropdown before City
//
// EXAMPLE RESPONSES:
//   "United States"  → ["Alabama", "Alaska", "Arizona", ...]
//   "Canada"         → ["Alberta", "British Columbia", ...]
//   "Pakistan"       → ["Sindh", "Punjab", "KPK", ...]
//   "Singapore"      → [] (empty — no states)
export async function getStates(country) {
  try {
    const response = await axios.post(
      'https://countriesnow.space/api/v0.1/countries/states',
      { country }
    )
    if (response.data.error) {
      throw new Error(response.data.msg)
    }
    // API returns objects like { name: "Texas", state_code: "TX" }
    // We only need the name
    const states = response.data.data.states || []
    return states
      .map((s) => s.name)
      .sort((a, b) => a.localeCompare(b))
  } catch (error) {
    console.error(`Failed to load states for ${country}:`, error)
    return [] // Empty = treat as "no states"
  }
}

// -------------------------------------------
// Get cities for a specific state in a country
// -------------------------------------------
// WHEN USED: Only after user picks both Country AND State
// This returns a SMALL list of cities (not thousands!)
//
// EXAMPLE:
//   getCitiesByState("United States", "Texas")
//   → ["Austin", "Dallas", "Houston", "San Antonio", ...]
//   (only ~100-200 cities instead of 20,000+)
export async function getCitiesByState(country, state) {
  try {
    const response = await axios.post(
      'https://countriesnow.space/api/v0.1/countries/state/cities',
      { country, state }
    )
    if (response.data.error) {
      throw new Error(response.data.msg)
    }
    return response.data.data.sort((a, b) => a.localeCompare(b))
  } catch (error) {
    console.error(`Failed to load cities for ${state}, ${country}:`, error)
    return []
  }
}
