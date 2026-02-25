/* ===========================================
   CountryCityPicker — 3-Tier Location Selector
   ===========================================
   
   HOW IT WORKS (3 levels):
   
   LEVEL 1: Country dropdown (always shown)
     → User picks "United States"
   
   LEVEL 2: State/Province dropdown (CONDITIONAL — only if country has states)
     → API returns states? Show dropdown: ["Alabama", "Alaska", ...]
     → API returns empty? SKIP this level entirely
   
   LEVEL 3: City dropdown (always shown after previous levels complete)
     → If state was selected: load cities for THAT state only (fast! ~100 cities)
     → If no states exist:   load cities for entire country (current behavior)
   
   VISUAL FLOW:
   
   [Country: United States ▼]     ← Level 1
   [State: Texas ▼]               ← Level 2 (appears because US has states)
   [City: Austin ▼]               ← Level 3 (only Texas cities — fast!)
   
   vs.
   
   [Country: Singapore ▼]         ← Level 1
   [City: Singapore ▼]            ← Level 3 directly (no states for Singapore)
   
   CASCADING RESET:
   - Change country → clears state AND city
   - Change state → clears city only
   =========================================== */

import { useState, useEffect } from 'react'
import { getCountries, getCities, getStates, getCitiesByState } from '../api/client'

export default function CountryCityPicker({
  country, state, city,
  onCountryChange, onStateChange, onCityChange,
  errors = {},
}) {
  // Data lists
  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])

  // Loading indicators
  const [loadingCountries, setLoadingCountries] = useState(false)
  const [loadingStates, setLoadingStates] = useState(false)
  const [loadingCities, setLoadingCities] = useState(false)

  // Does the selected country have states?
  // null = "we don't know yet" (still loading)
  // true = yes, show State dropdown
  // false = no, skip to City
  const [hasStates, setHasStates] = useState(null)

  // ============================================
  // EFFECT 1: Load countries on first render
  // ============================================
  // This runs ONCE when the component mounts
  // Nominatim API → returns ~250 countries
  useEffect(() => {
    async function loadCountries() {
      setLoadingCountries(true)
      const data = await getCountries()
      setCountries(data)
      setLoadingCountries(false)
    }
    loadCountries()
  }, [])

  // ============================================
  // WHITELIST: Countries where State dropdown should appear
  // ============================================
  // WHY a whitelist?
  //   The countriesnow.space API returns "states" for almost EVERY country,
  //   even Singapore (returns "Community Development Councils"!).
  //   But the getCitiesByState endpoint only works for MAJOR countries.
  //
  //   So instead of trusting the API blindly, we manually list countries
  //   where showing states/provinces actually helps the user find their city.
  //
  // WHEN TO ADD MORE:
  //   If a user from a country not on this list complains about too many cities,
  //   just add that country's name to this set.
  const COUNTRIES_WITH_STATES = new Set([
    'United States',
    'Canada',
    'India',
    'Australia',
    'Brazil',
    'China',
    'Mexico',
    'Germany',
    'Japan',
    'Nigeria',
    'Russia',
    'Indonesia',
    'Italy',
    'Spain',
    'France',
  ])

  // ============================================
  // EFFECT 2: When country changes → check whitelist → fetch states or cities
  // ============================================
  // LOGIC:
  //   1. Is country in our whitelist? → YES: fetch states, show State dropdown
  //   2. Is country in our whitelist? → NO: skip states, load cities directly
  //
  // This avoids the Singapore problem where API returns fake "states"
  useEffect(() => {
    if (!country) {
      setStates([])
      setCities([])
      setHasStates(null)
      return
    }

    // Check whitelist FIRST (instant, no API call)
    const shouldFetchStates = COUNTRIES_WITH_STATES.has(country)

    if (shouldFetchStates) {
      // Country IS in whitelist → fetch states from API
      async function loadStates() {
        setLoadingStates(true)
        setCities([])

        const statesData = await getStates(country)

        if (statesData.length > 0) {
          setStates(statesData)
          setHasStates(true)
        } else {
          // Whitelist said yes, but API returned empty (unlikely, but safe fallback)
          setStates([])
          setHasStates(false)
          setLoadingCities(true)
          const citiesData = await getCities(country)
          setCities(citiesData)
          setLoadingCities(false)
        }
        setLoadingStates(false)
      }
      loadStates()
    } else {
      // Country NOT in whitelist → load cities directly (old behavior)
      // No State dropdown for Singapore, Pakistan, Thailand, etc.
      setStates([])
      setHasStates(false)
      setLoadingStates(false)

      async function loadCities() {
        setLoadingCities(true)
        const citiesData = await getCities(country)
        setCities(citiesData)
        setLoadingCities(false)
      }
      loadCities()
    }
  }, [country])

  // ============================================
  // EFFECT 3: When state changes → fetch cities for that state
  // ============================================
  // Only runs if the country HAS states AND user picked one
  // This loads a SMALL city list (e.g., only Texas cities)
  useEffect(() => {
    if (!state || !country || !hasStates) {
      // If country has no states, cities are already loaded in Effect 2
      return
    }

    async function loadCitiesForState() {
      setLoadingCities(true)
      const data = await getCitiesByState(country, state)
      setCities(data)
      setLoadingCities(false)
    }

    loadCitiesForState()
  }, [state, country, hasStates])

  // ============================================
  // CSS helper
  // ============================================
  const selectClasses = (hasError) => `
    input-mystical select-mystical
    ${hasError ? 'input-error' : ''}
  `

  return (
    <div className="space-y-5">

      {/* ====== LEVEL 1: Country ====== */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-text-primary">
          Birth Country <span className="text-accent-gold">*</span>
        </label>
        <select
          value={country}
          onChange={onCountryChange}
          disabled={loadingCountries}
          className={selectClasses(errors.country)}
        >
          <option value="">
            {loadingCountries ? 'Loading countries...' : 'Select Country'}
          </option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.country && <p className="text-xs text-error mt-0.5">⚠ {errors.country}</p>}
      </div>

      {/* ====== LEVEL 2: State/Province (CONDITIONAL) ====== */}
      {/* Only show if:
          - A country is selected  AND
          - That country has states (hasStates === true)
          - OR we're still loading states (show disabled dropdown)
      */}
      {country && (hasStates === true || loadingStates) && (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-primary">
            Birth State / Province <span className="text-accent-gold">*</span>
          </label>
          <select
            value={state}
            onChange={onStateChange}
            disabled={loadingStates}
            className={selectClasses(errors.state)}
          >
            <option value="">
              {loadingStates ? 'Loading states...' : 'Select State / Province'}
            </option>
            {states.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.state && <p className="text-xs text-error mt-0.5">⚠ {errors.state}</p>}
        </div>
      )}

      {/* ====== LEVEL 3: City ====== */}
      {/* Show city dropdown when:
          - Country has NO states → show immediately after country
          - Country HAS states → show only after state is selected
      */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-text-primary">
          Birth City <span className="text-accent-gold">*</span>
        </label>
        <select
          value={city}
          onChange={onCityChange}
          disabled={
            !country ||                              // No country selected
            loadingCities ||                         // Cities still loading
            (hasStates === true && !state) ||         // Has states but none selected yet
            (hasStates === null && !!country)          // Still figuring out if country has states
          }
          className={selectClasses(errors.city)}
        >
          <option value="">
            {loadingCities
              ? 'Loading cities...'
              : !country
                ? 'Select country first'
                : (hasStates === true && !state)
                  ? 'Select state first'
                  : 'Select City'
            }
          </option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.city && <p className="text-xs text-error mt-0.5">⚠ {errors.city}</p>}
      </div>

    </div>
  )
}
