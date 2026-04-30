'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

const glass =
  "rounded-full border border-white/40 bg-white/15 backdrop-blur-xl shadow-[0_8px_32px_rgba(31,77,122,0.15),inset_0_1px_0_rgba(255,255,255,0.6)]"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={`${glass} size-10`} />
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`${glass} grid size-10 place-items-center text-white transition hover:bg-white/25`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="size-5 fill-yellow-300 stroke-yellow-400" aria-hidden />
      ) : (
        <Moon className="size-5 fill-slate-700 stroke-slate-600" aria-hidden />
      )}
    </button>
  )
}
