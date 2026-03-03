/* ===========================================
   MysticalLoader Component
   - Handles the "Fake Progress" animation
   - Cycles through random messages
   =========================================== */
import { useEffect, useState } from 'react'

export default function MysticalLoader({ messages = [], duration = 60, progress }) {
  const [localProgress, setLocalProgress] = useState(0)
  const [currentMessage, setCurrentMessage] = useState(messages[0] || 'Loading...')

  // 1. Progress Animation (Time Stretch)
  useEffect(() => {
    // If parent provides progress (e.g. 100%), use it. 
    // Otherwise simulate progress up to 90% over 'duration' seconds.
    if (progress !== undefined) {
      setLocalProgress(progress)
      return
    }

    const intervalTime = 100 // Update every 100ms
    const totalSteps = (duration * 1000) / intervalTime
    const increment = 90 / totalSteps // Target 90%

    const timer = setInterval(() => {
      setLocalProgress((prev) => {
        if (prev >= 90) return 90
        return prev + increment
      })
    }, intervalTime)

    return () => clearInterval(timer)
  }, [duration, progress])

  // 2. Message Carousel (Sequential Cycling)
  useEffect(() => {
    if (!messages.length) return
    let index = 0

    const messageInterval = setInterval(() => {
      index = (index + 1) % messages.length
      setCurrentMessage(messages[index])
    }, 5000) // Change every 5 seconds (sequential)

    return () => clearInterval(messageInterval)
  }, [messages])

  const displayProgress = Math.min(100, Math.max(0, localProgress))

  return (
    <div className="w-full max-w-md mx-auto text-center animate-fade-in-up">

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="progress-mystical mb-2">
          <div
            className="progress-mystical-fill transition-all duration-300 ease-out"
            style={{ width: `${displayProgress}%` }}
          ></div>
        </div>
        <span className="text-accent-gold font-mono text-xs tracking-widest">
          {Math.round(displayProgress)}%
        </span>
      </div>

      {/* Message Area */}
      <div className="h-12 flex items-center justify-center">
         <p className="text-text-muted text-sm font-mystical animate-pulse-slow transition-all duration-500">
           {currentMessage}
         </p>
      </div>

    </div>
  )
}
