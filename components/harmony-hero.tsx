"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import {
  ArrowUpRight,
  ChevronRight,
  Cloud,
  Home,
  Leaf,
  Music2,
  Pause,
  Play,
  Settings,
  SkipBack,
  SkipForward,
  Sun,
} from "lucide-react"

// Reusable glass panel utility classes (Frutiger Aero glassmorphism)
const glass =
  "rounded-2xl border border-white/40 bg-white/15 backdrop-blur-xl shadow-[0_8px_32px_rgba(31,77,122,0.15),inset_0_1px_0_rgba(255,255,255,0.6)]"

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

function TiltCard({
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
      const nx = Math.max(-1, Math.min(1, dx))
      const ny = Math.max(-1, Math.min(1, dy))

      // Card "looks at" the cursor: rotateY follows X, rotateX inverse of Y
      state.current.trx = -ny * max
      state.current.try_ = nx * max
      state.current.ttx = nx * parallax
      state.current.tty = ny * parallax

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
      className="[perspective:1200px] [transform-style:preserve-3d]"
      style={{ willChange: "transform" }}
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
          <div className="flex flex-col gap-8">
            <TiltCard>
              <Navigation />
            </TiltCard>
            <TiltCard>
              <NaturalBalanceCard />
            </TiltCard>
          </div>

          {/* Center hero */}
          <div className="flex flex-1 flex-col items-center justify-start pt-6 lg:pt-16">
            <TiltCard max={8} parallax={10} ease={0.08}>
              <HeroText />
            </TiltCard>
          </div>

          {/* Right column */}
          <div className="flex flex-col items-end justify-between gap-8">
            <TiltCard>
              <WeatherWidget />
            </TiltCard>
            <TiltCard>
              <MusicPlayer />
            </TiltCard>
          </div>
        </div>

        {/* Bottom dock */}
        <div className="mt-8 flex justify-start">
          <Dock />
        </div>
      </div>
    </main>
  )
}

/* ---------- Navigation ---------- */
function Navigation() {
  const items = [
    { label: "Home", active: true },
    { label: "Services" },
    { label: "Gallery" },
    { label: "About Us" },
    { label: "Contact" },
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
            <a
              href="#"
              className={`text-lg tracking-wide drop-shadow-sm transition-colors ${
                item.active ? "font-medium text-white" : "text-white/85 hover:text-white"
              }`}
            >
              {item.label}
            </a>
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
      <h1 className="text-5xl leading-[1.05] font-semibold tracking-tight text-balance drop-shadow-[0_2px_12px_rgba(31,77,122,0.35)] md:text-6xl lg:text-7xl">
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
  return (
    <aside className={`${glass} w-72 px-6 py-6 text-white`} aria-label="Weather and time">
      <div className="flex items-start justify-between">
        <div className="flex items-baseline">
          <span className="text-6xl leading-none font-light tracking-tight drop-shadow-sm">24</span>
          <span className="ml-1 text-3xl font-light">°</span>
        </div>
        <div className="relative mt-2">
          <Cloud className="size-10 fill-white/90 stroke-white/70" aria-hidden />
          <Sun
            className="absolute -top-1 -right-1 size-5 fill-yellow-200 stroke-yellow-300"
            aria-hidden
          />
        </div>
      </div>

      <p className="mt-3 text-base text-white/95">Mostly Sunny</p>
      <p className="text-sm text-white/80">Feel like 24°</p>

      <div className="my-5 h-px bg-white/30" />

      <p className="text-3xl font-light tracking-wide drop-shadow-sm">14:35</p>
      <p className="mt-1 text-sm text-white/80">May 20, 2024</p>
    </aside>
  )
}

/* ---------- Music player ---------- */
function MusicPlayer() {
  return (
    <aside className={`${glass} w-72 px-6 py-6 text-white`} aria-label="Music player">
      <div className="mb-4 grid size-12 place-items-center rounded-full border border-white/40 bg-white/15 backdrop-blur">
        <Music2 className="size-6" aria-hidden />
      </div>

      <h4 className="text-2xl font-medium tracking-tight">Dream Land</h4>
      <p className="text-sm text-white/85">Oasis</p>

      <div className="mt-5 flex items-center gap-3">
        <div className="relative h-1 flex-1 rounded-full bg-white/25">
          <div className="absolute inset-y-0 left-0 w-2/5 rounded-full bg-white/90" />
          <div className="absolute top-1/2 left-2/5 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-md" />
        </div>
        <span className="text-xs text-white/80 tabular-nums">02:35</span>
      </div>

      <div className="mt-5 flex items-center justify-center gap-6">
        <button
          type="button"
          aria-label="Previous track"
          className="text-white/90 transition hover:text-white"
        >
          <SkipBack className="size-5 fill-current" />
        </button>
        <button
          type="button"
          aria-label="Pause"
          className="grid size-12 place-items-center rounded-full bg-white text-sky-600 shadow-lg transition hover:scale-105"
        >
          <Pause className="size-5 fill-current" />
        </button>
        <button
          type="button"
          aria-label="Next track"
          className="text-white/90 transition hover:text-white"
        >
          <SkipForward className="size-5 fill-current" />
        </button>
      </div>
    </aside>
  )
}

/* ---------- Bottom dock ---------- */
function Dock() {
  const items = [
    { icon: Home, label: "Home" },
    { icon: Leaf, label: "Nature" },
    { icon: Music2, label: "Music" },
    { icon: Settings, label: "Settings" },
  ]
  return (
    <div className="flex items-center gap-3">
      {items.map(({ icon: Icon, label }) => (
        <TiltCard key={label} max={20} parallax={4} ease={0.18}>
          <button
            type="button"
            aria-label={label}
            className={`${glass} grid size-14 place-items-center text-white transition hover:bg-white/25`}
          >
            <Icon className="size-6" aria-hidden />
          </button>
        </TiltCard>
      ))}
    </div>
  )
}
