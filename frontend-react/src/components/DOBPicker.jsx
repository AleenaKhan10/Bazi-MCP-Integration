/* DOBPicker — Mystical themed date picker */

const MONTHS = [
  { value: '1', label: 'January' }, { value: '2', label: 'February' },
  { value: '3', label: 'March' }, { value: '4', label: 'April' },
  { value: '5', label: 'May' }, { value: '6', label: 'June' },
  { value: '7', label: 'July' }, { value: '8', label: 'August' },
  { value: '9', label: 'September' }, { value: '10', label: 'October' },
  { value: '11', label: 'November' }, { value: '12', label: 'December' },
]

function getDaysInMonth(month, year) {
  if (!month) return 31
  const m = parseInt(month)
  const y = year ? parseInt(year) : 2000
  return new Date(y, m, 0).getDate()
}

const CURRENT_YEAR = new Date().getFullYear()

export default function DOBPicker({
  month, day, year,
  onMonthChange, onDayChange, onYearChange,
  errors = {},
}) {
  const daysInMonth = getDaysInMonth(month, year)

  const selectClasses = (hasError) => `
    input-mystical select-mystical text-sm
    ${hasError ? 'input-error' : ''}
  `

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-primary">
        Date of Birth <span className="text-accent-gold">*</span>
      </label>

      <div className="grid grid-cols-3 gap-3">
        {/* Month */}
        <div>
          <select value={month} onChange={onMonthChange} className={selectClasses(errors.month)}>
            <option value="">Month</option>
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          {errors.month && <p className="text-xs text-error mt-0.5">⚠ {errors.month}</p>}
        </div>

        {/* Day */}
        <div>
          <select value={day} onChange={onDayChange} className={selectClasses(errors.day)}>
            <option value="">Day</option>
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
              <option key={d} value={String(d)}>{d}</option>
            ))}
          </select>
          {errors.day && <p className="text-xs text-error mt-0.5">⚠ {errors.day}</p>}
        </div>

        {/* Year */}
        <div>
          <select value={year} onChange={onYearChange} className={selectClasses(errors.year)}>
            <option value="">Year</option>
            {Array.from({ length: CURRENT_YEAR - 1920 + 1 }, (_, i) => CURRENT_YEAR - i).map((y) => (
              <option key={y} value={String(y)}>{y}</option>
            ))}
          </select>
          {errors.year && <p className="text-xs text-error mt-0.5">⚠ {errors.year}</p>}
        </div>
      </div>

      <p className="text-xs text-text-dim">Select your birth month, day, and year</p>
    </div>
  )
}
