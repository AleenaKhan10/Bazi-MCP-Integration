/* ===========================================
   ProgressBar — Animated Loading Indicator
   ===========================================
   
   Used on the Loading Page to show BaZi calculation progress.
   
   FEATURES:
   - Smooth width transition (CSS)
   - Percentage text
   - Gold gradient fill
   - Glow effect when near completion
   
   PROPS:
   - progress (number): 0–100
   - label (string): optional text below bar
*/

export default function ProgressBar({ progress = 0, label = '' }) {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, progress))

  return (
    <div className="w-full space-y-2">
      {/* Progress bar container */}
      <div className="w-full h-3 bg-bg-card rounded-full overflow-hidden border border-border">
        {/* Animated fill */}
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${clampedProgress}%`,
            background: 'linear-gradient(90deg, #f59e0b 0%, #ec4899 100%)',
            // Add glow when near completion
            boxShadow: clampedProgress > 80
              ? '0 0 12px rgba(245, 158, 11, 0.5)'
              : 'none',
          }}
        />
      </div>

      {/* Label + percentage */}
      <div className="flex justify-between items-center">
        {label && (
          <p className="text-sm text-text-muted">{label}</p>
        )}
        <p className="text-sm font-semibold text-accent-gold ml-auto">
          {clampedProgress}%
        </p>
      </div>
    </div>
  )
}
