'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Home, Leaf, Music2, Settings, Sun } from 'lucide-react'
import { TiltCard } from './harmony-hero'

const dockGlass =
  "rounded-2xl border border-white/30 bg-white/10 backdrop-blur-md shadow-[0_4px_16px_rgba(31,77,122,0.1),inset_0_1px_0_rgba(255,255,255,0.3)]"

export function Dock() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const dockItems = [
    {
      icon: Home,
      label: "Home",
      onClick: () => router.push('/'),
    },
    {
      icon: Leaf,
      label: "Nature",
      onClick: () => router.push('/services'),
    },
    {
      icon: Music2,
      label: "Music",
      onClick: () => router.push('/gallery'),
    },
    {
      icon: Settings,
      label: "Settings",
      onClick: toggleTheme,
    },
  ]

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-50">
      {dockItems.map(({ icon: Icon, label, onClick }) => (
        <TiltCard key={label} max={20} parallax={4} ease={0.18}>
          <button
            type="button"
            aria-label={label}
            className={`${dockGlass} grid size-14 place-items-center text-white/90 transition hover:bg-white/20 hover:text-white`}
            onClick={onClick}
          >
            {mounted && label === 'Settings' && theme === 'dark' ? (
              <Sun className="size-6" aria-hidden />
            ) : (
              <Icon className="size-6" aria-hidden />
            )}
          </button>
        </TiltCard>
      ))}
    </div>
  )
}
