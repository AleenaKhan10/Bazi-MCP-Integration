/* FormInput — Mystical themed input component */

export default function FormInput({
  label,
  type = 'text',
  id,
  value,
  onChange,
  error,
  required = false,
  placeholder = '',
  hint = '',
  disabled = false,
  children,           // For select options
}) {
  const isSelect = type === 'select'

  const fieldClasses = `
    input-mystical
    ${isSelect ? 'select-mystical' : ''}
    ${error ? 'input-error' : ''}
  `

  return (
    <div className="space-y-1.5">
      {/* Label */}
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text-primary">
          {label}
          {required && <span className="text-accent-gold ml-1">*</span>}
        </label>
      )}

      {/* Input or Select */}
      {isSelect ? (
        <select
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={fieldClasses}
        >
          {children}
        </select>
      ) : (
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={fieldClasses}
        />
      )}

      {/* Hint text */}
      {hint && !error && (
        <p className="text-xs text-text-dim mt-0.5">{hint}</p>
      )}

      {/* Error message */}
      {error && (
        <p className="text-xs text-error mt-0.5">⚠ {error}</p>
      )}
    </div>
  )
}
