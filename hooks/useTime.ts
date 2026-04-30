'use client'

import { useState, useEffect } from 'react'

interface TimeState {
  time: string
  date: string
  dayOfWeek: string
}

export function useTime() {
  const [timeState, setTimeState] = useState<TimeState>({
    time: '',
    date: '',
    dayOfWeek: '',
  })

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()

      const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })

      const date = now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })

      const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' })

      setTimeState({ time, date, dayOfWeek })
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return timeState
}
