/* CountryCityPicker — Mystical themed */

import { useState, useEffect } from 'react'
import { getCountries, getCities } from '../api/client'

export default function CountryCityPicker({
  country, city,
  onCountryChange, onCityChange,
  errors = {},
}) {
  const [countries, setCountries] = useState([])
  const [cities, setCities] = useState([])
  const [loadingCountries, setLoadingCountries] = useState(false)
  const [loadingCities, setLoadingCities] = useState(false)

  // Load countries on mount
  useEffect(() => {
    async function loadCountries() {
      setLoadingCountries(true)
      const data = await getCountries()
      setCountries(data)
      setLoadingCountries(false)
    }
    loadCountries()
  }, [])

  // Load cities when country changes
  useEffect(() => {
    if (!country) { setCities([]); return }
    async function loadCities() {
      setLoadingCities(true)
      const data = await getCities(country)
      setCities(data)
      setLoadingCities(false)
    }
    loadCities()
  }, [country])

  const selectClasses = (hasError) => `
    input-mystical select-mystical
    ${hasError ? 'input-error' : ''}
  `

  return (
    <div className="space-y-5">
      {/* Country */}
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

      {/* City */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-text-primary">
          Birth City <span className="text-accent-gold">*</span>
        </label>
        <select
          value={city}
          onChange={onCityChange}
          disabled={!country || loadingCities}
          className={selectClasses(errors.city)}
        >
          <option value="">
            {loadingCities ? 'Loading cities...' : !country ? 'Select country first' : 'Select City'}
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
