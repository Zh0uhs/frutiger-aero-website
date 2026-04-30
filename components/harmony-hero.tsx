"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import {
  ArrowUpRight,
  ChevronRight,
  Cloud,
  CloudRain,
  CloudSnow,
  Moon,
  Music2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Sun,
  Wind,
} from "lucide-react"
import { useWeather } from "@/hooks/useWeather"
import { useTime } from "@/hooks/useTime"
import { useAudio } from "@/hooks/useAudio"

// Reusable glass panel utility classes (Frutiger Aero glassmorphism)
const glass =
  "rounded-2xl border border-white/60 bg-white/30 backdrop-blur-xl shadow-[0_8px_32px_rgba(31,77,122,0.25),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.05)]"

/* ---------- Global mouse tracker ---------- */
// Shared mouse position so every TiltCard reads from a single source
const mouse = { x: 0, y: 0, ready: false }
let mouseListenerAttached = false

function ensureMouseListener() {
  if (mouseListenerAttached || typeof window === "undefined") return
  mouseListenerAttached = true
  // Initialize at viewport center so cards rest flat before first move
  mouse.x = window.innerWidth / 2
  mouse.y = window.innerHeight / 2
  window.addEventListener(
    "pointermove",
    (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.ready = true
    },
    { passive: true },
  )
}

/* ---------- Tilt wrapper ---------- */
type TiltCardProps = {
  children: React.ReactNode
  className?: string
  /** Max tilt in degrees */
  max?: number
  /** Lerp factor (0-1). Lower = smoother / more lag */
  ease?: number
  /** Subtle parallax translation in px */
  parallax?: number
}

export function TiltCard({
  children,
  className = "",
  max = 14,
  ease = 0.12,
  parallax = 6,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const state = useRef({ rx: 0, ry: 0, tx: 0, ty: 0, trx: 0, try_: 0, ttx: 0, tty: 0 })

  useEffect(() => {
    ensureMouseListener()
    let raf = 0
    const el = ref.current
    if (!el) return

    const tick = () => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2

      // Normalized distance from element center to cursor, clamped
      const vw = Math.max(window.innerWidth, 1)
      const vh = Math.max(window.innerHeight, 1)
      const dx = (mouse.x - cx) / (vw / 2)
      const dy = (mouse.y - cy) / (vh / 2)

      // Card "looks at" the cursor: rotateY follows X, rotateX inverse of Y
      state.current.trx = -dy * max
      state.current.try_ = dx * max
      state.current.ttx = dx * parallax
      state.current.tty = dy * parallax

      // Lerp current toward target for smoothness
      state.current.rx += (state.current.trx - state.current.rx) * ease
      state.current.ry += (state.current.try_ - state.current.ry) * ease
      state.current.tx += (state.current.ttx - state.current.tx) * ease
      state.current.ty += (state.current.tty - state.current.ty) * ease

      el.style.transform = `translate3d(${state.current.tx.toFixed(2)}px, ${state.current.ty.toFixed(
        2,
      )}px, 0) rotateX(${state.current.rx.toFixed(2)}deg) rotateY(${state.current.ry.toFixed(
        2,
      )}deg)`

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [max, ease, parallax])

  return (
    <div
      className="[perspective:1200px] [transform-style:preserve-3d] [isolation:isolate]"
    >
      <div
        ref={ref}
        className={className}
        style={{
          transformStyle: "preserve-3d",
          transition: "box-shadow 200ms ease",
        }}
      >
        {children}
      </div>
    </div>
  )
}

export function HarmonyHero() {
  return (
    <main
      className="relative min-h-screen w-full overflow-hidden bg-cover bg-center bg-no-repeat font-sans"
      style={{ backgroundImage: "url('/frutiger-bg.jpg')" }}
    >
      {/* Subtle blue tint for cohesion */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-300/10 via-transparent to-cyan-200/10"
      />

      {/* Layout grid */}
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-6 py-8 md:px-10 md:py-10">
        {/* Top row: Nav + Hero + Weather */}
        <div className="flex flex-1 flex-col gap-8 lg:flex-row">
          {/* Left column */}
          <TiltCard>
            <div className="flex flex-col gap-8">
              <Navigation />
              <NaturalBalanceCard />
            </div>
          </TiltCard>

          {/* Center hero */}
          <div className="flex flex-1 flex-col items-center justify-start pt-6 lg:pt-16">
            <TiltCard max={8} parallax={10} ease={0.08}>
              <HeroText />
            </TiltCard>
          </div>

          {/* Right column */}
          <TiltCard>
            <div className="flex flex-col items-end justify-between gap-8">
              <WeatherWidget />
              <MusicPlayer />
            </div>
          </TiltCard>
        </div>

      </div>
    </main>
  )
}

/* ---------- Navigation ---------- */
function Navigation() {
  const pathname = usePathname()

  const items = [
    { label: "Home", href: "/", active: pathname === "/" },
    { label: "Services", href: "/services", active: pathname === "/services" },
    { label: "Gallery", href: "/gallery", active: pathname === "/gallery" },
    { label: "About Us", href: "/about", active: pathname === "/about" },
    { label: "Contact", href: "/contact", active: pathname === "/contact" },
  ]

  return (
    <nav className={`${glass} w-56 px-6 py-6`} aria-label="Primary">
      <ul className="flex flex-col gap-5 text-white">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-3">
            <span
              className={`size-2 rounded-full ${
                item.active
                  ? "bg-sky-300 shadow-[0_0_8px_rgba(125,211,252,0.9)]"
                  : "bg-transparent"
              }`}
              aria-hidden
            />
            <Link
              href={item.href}
              className={`text-lg tracking-wide drop-shadow-sm transition-colors ${
                item.active ? "font-medium text-white" : "text-white/85 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/* ---------- Natural Balance card ---------- */
function NaturalBalanceCard() {
  return (
    <article className={`${glass} w-56 px-6 py-6 text-white`}>
      <div className="mb-6 flex items-center justify-between">
        <span className="grid size-10 place-items-center rounded-full border border-white/40 bg-white/20 backdrop-blur-md">
          <ArrowUpRight className="size-5" aria-hidden />
        </span>
        <span
          className="size-3 rounded-full bg-white/70 shadow-[0_0_6px_rgba(255,255,255,0.8)]"
          aria-hidden
        />
      </div>
      <h3 className="text-2xl leading-tight font-medium text-balance drop-shadow-sm">
        Natural
        <br />
        Balance
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-white/85 text-pretty">
        The harmony of nature and technology
      </p>
    </article>
  )
}

/* ---------- Hero text ---------- */
function HeroText() {
  return (
    <div className="flex flex-col items-center text-center text-white">
      <h1
        className="text-5xl leading-[1.05] font-light tracking-tight text-balance md:text-6xl lg:text-7xl"
        style={{
          textShadow: `
            0 0 20px rgba(255, 255, 255, 0.9),
            0 0 40px rgba(255, 255, 255, 0.6),
            0 0 60px rgba(255, 255, 255, 0.4),
            0 0 80px rgba(200, 220, 255, 0.3),
            0 2px 12px rgba(31, 77, 122, 0.5)
          `,
        }}
      >
        Future
        <br />
        of Harmony
      </h1>

      <div className="mt-6 flex items-center gap-2 text-white/95">
        <p className="text-base md:text-lg">where nature meets technology</p>
        <span className="grid size-6 place-items-center rounded-full border border-white/50 bg-white/15 backdrop-blur">
          <ChevronRight className="size-3.5" aria-hidden />
        </span>
      </div>

      <button
        type="button"
        className={`${glass} mt-8 inline-flex items-center gap-3 px-6 py-3 text-white transition hover:bg-white/25`}
        onClick={() => window.location.href = '/services'}
      >
        <span className="grid size-8 place-items-center rounded-full bg-white/30 backdrop-blur">
          <Play className="size-4 translate-x-[1px] fill-white" aria-hidden />
        </span>
        <span className="text-base font-medium">Discover More</span>
      </button>
    </div>
  )
}

/* ---------- Weather widget ---------- */
function WeatherWidget() {
  const weather = useWeather()
  const { time, date, dayOfWeek } = useTime()

  const WeatherIcon = () => {
    if (weather.isLoading) {
      return <Cloud className="size-10 fill-white/90 stroke-white/70" aria-hidden />
    }

    const iconMap: Record<string, React.ReactNode> = {
      sun: <Sun className="size-10 fill-yellow-300 stroke-yellow-400" aria-hidden />,
      cloud: <Cloud className="size-10 fill-white/90 stroke-white/70" aria-hidden />,
      rain: <CloudRain className="size-10 fill-sky-400/90 stroke-sky-300" aria-hidden />,
      snow: <CloudSnow className="size-10 fill-slate-300 stroke-slate-200" aria-hidden />,
      thunder: <Wind className="size-10 fill-yellow-400 stroke-yellow-500" aria-hidden />,
      fog: <Cloud className="size-10 fill-white/60 stroke-white/50" aria-hidden />,
    }

    return iconMap[weather.condition.toLowerCase()] || iconMap.cloud
  }

  return (
    <aside className={`${glass} w-72 px-6 py-6 text-white`} aria-label="Weather and time">
      <p className="mb-2 text-xs text-white/60">{weather.location}</p>
      <div className="flex items-start justify-between">
        <div className="flex items-baseline">
          <span className="text-6xl leading-none font-light tracking-tight drop-shadow-sm">
            {weather.isLoading ? "--" : weather.temperature}
          </span>
          <span className="ml-1 text-3xl font-light">°</span>
        </div>
        <div className="relative mt-2">
          <WeatherIcon />
          {!weather.isLoading && weather.condition.toLowerCase().includes('clear') && (
            <Sun
              className="absolute -top-1 -right-1 size-5 fill-yellow-200 stroke-yellow-300"
              aria-hidden
            />
          )}
        </div>
      </div>

      <p className="mt-3 text-base text-white/95">
        {weather.isLoading ? "Loading..." : weather.condition}
      </p>
      <p className="text-sm text-white/80">
        Feel like {weather.isLoading ? "--" : weather.feelsLike}°
      </p>

      <div className="my-5 h-px bg-white/30" />

      <p className="text-3xl font-light tracking-wide drop-shadow-sm">{time || "--:--"}</p>
      <p className="mt-1 text-sm text-white/80">{date}</p>
      <p className="text-xs text-white/60">{dayOfWeek}</p>
    </aside>
  )
}

/* ---------- Music player ---------- */
function MusicPlayer() {
  const { isPlaying, currentTrackInfo, currentTime, progress, togglePlay, nextTrack, prevTrack, seek, formatTime } = useAudio()
  const progressBarRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleSeek = useCallback((clientX: number) => {
    if (progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect()
      const x = clientX - rect.left
      const percentage = (x / rect.width) * 100
      seek(Math.max(0, Math.min(100, percentage)))
    }
  }, [seek])

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    handleSeek(e.clientX)
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      handleSeek(e.clientX)
    }
  }, [isDragging, handleSeek])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true)
    handleSeek(e.touches[0].clientX)
  }

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging) {
      handleSeek(e.touches[0].clientX)
    }
  }, [isDragging, handleSeek])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', handleTouchEnd)
    } else {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])

  return (
    <aside className={`${glass} w-72 px-6 py-6 text-white`} aria-label="Music player">
      <div className="mb-4 flex items-center justify-between">
        <div className="grid size-12 place-items-center rounded-full border border-white/40 bg-white/15 backdrop-blur">
          <Music2 className="size-6" aria-hidden />
        </div>
        <span className="text-xs text-white/60">
          {isPlaying ? 'Playing' : 'Paused'}
        </span>
      </div>

      <h4 className="text-2xl font-medium tracking-tight">{currentTrackInfo.title}</h4>
      <p className="text-sm text-white/85">{currentTrackInfo.artist}</p>

      <div className="mt-5 flex items-center gap-3">
        <div
          ref={progressBarRef}
          className="relative h-1 flex-1 rounded-full bg-white/25 cursor-pointer select-none"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          role="slider"
          aria-label="Music progress"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-white/90"
            style={{ width: `${progress}%` }}
          />
          <div
            className={`absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-md transition-all ${isDragging ? 'scale-125' : ''}`}
            style={{ left: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-white/80 tabular-nums">{formatTime(currentTime)}</span>
      </div>

      <div className="mt-5 flex items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Previous track"
          className="grid size-10 place-items-center rounded-full border border-white/50 bg-white/30 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] text-white transition hover:bg-white/40"
          onClick={prevTrack}
        >
          <SkipBack className="size-5 fill-current" />
        </button>
        <button
          type="button"
          aria-label={isPlaying ? "Pause" : "Play"}
          className="grid size-14 place-items-center rounded-full border border-white/60 bg-white/40 backdrop-blur-lg shadow-[0_4px_16px_rgba(31,77,122,0.2),inset_0_2px_4px_rgba(255,255,255,0.5)] text-white transition hover:bg-white/50"
          onClick={togglePlay}
        >
          {isPlaying ? (
            <Pause className="size-6 fill-current" />
          ) : (
            <Play className="size-6 translate-x-[1px] fill-current" />
          )}
        </button>
        <button
          type="button"
          aria-label="Next track"
          className="grid size-10 place-items-center rounded-full border border-white/50 bg-white/30 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] text-white transition hover:bg-white/40"
          onClick={nextTrack}
        >
          <SkipForward className="size-5 fill-current" />
        </button>
      </div>
    </aside>
  )
}
