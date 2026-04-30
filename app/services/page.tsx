'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import {
  ArrowRight,
  Cpu,
  Droplets,
  Globe,
  Leaf,
  Lightbulb,
  Mountain,
  Recycle,
  TreePine,
  Wind,
} from 'lucide-react'

const glass =
  "rounded-2xl border border-white/40 bg-white/15 backdrop-blur-xl shadow-[0_8px_32px_rgba(31,77,122,0.15),inset_0_1px_0_rgba(255,255,255,0.6)]"

const services = [
  {
    icon: Globe,
    title: 'Eco-Friendly Design',
    description: 'Sustainable digital experiences that minimize environmental impact while maximizing user engagement.',
    color: 'from-emerald-400/30 to-teal-500/30',
  },
  {
    icon: Leaf,
    title: 'Nature Integration',
    description: 'Seamlessly blend organic elements with cutting-edge technology for harmonious interfaces.',
    color: 'from-green-400/30 to-emerald-500/30',
  },
  {
    icon: Cpu,
    title: 'Smart Automation',
    description: 'Intelligent systems that adapt to user behavior and optimize workflows automatically.',
    color: 'from-sky-400/30 to-blue-500/30',
  },
  {
    icon: Droplets,
    title: 'Fluid Interfaces',
    description: 'Smooth, intuitive interactions that feel natural and respond to human intuition.',
    color: 'from-cyan-400/30 to-blue-500/30',
  },
  {
    icon: Lightbulb,
    title: 'Innovative Solutions',
    description: "Creative approaches to complex problems, pushing boundaries of what's possible.",
    color: 'from-amber-400/30 to-orange-500/30',
  },
  {
    icon: TreePine,
    title: 'Carbon Neutral',
    description: 'Our commitment to sustainability extends to every line of code we write.',
    color: 'from-lime-400/30 to-green-500/30',
  },
]

const stats = [
  { value: '50K+', label: 'Users Worldwide' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '200+', label: 'Projects Delivered' },
  { value: '45', label: 'Countries Served' },
]

// Mouse tracker for tilt cards
const mouse = { x: 0, y: 0, ready: false }
let mouseListenerAttached = false

function ensureMouseListener() {
  if (mouseListenerAttached || typeof window === 'undefined') return
  mouseListenerAttached = true
  mouse.x = window.innerWidth / 2
  mouse.y = window.innerHeight / 2
  window.addEventListener(
    'pointermove',
    (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.ready = true
    },
    { passive: true },
  )
}

type TiltCardProps = {
  children: React.ReactNode
  className?: string
  max?: number
  ease?: number
  parallax?: number
}

function TiltCard({ children, className = '', max = 14, ease = 0.12, parallax = 6 }: TiltCardProps) {
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
      const vw = Math.max(window.innerWidth, 1)
      const vh = Math.max(window.innerHeight, 1)
      const dx = (mouse.x - cx) / (vw / 2)
      const dy = (mouse.y - cy) / (vh / 2)

      state.current.trx = -dy * max
      state.current.try_ = dx * max
      state.current.ttx = dx * parallax
      state.current.tty = dy * parallax

      state.current.rx += (state.current.trx - state.current.rx) * ease
      state.current.ry += (state.current.try_ - state.current.ry) * ease
      state.current.tx += (state.current.ttx - state.current.tx) * ease
      state.current.ty += (state.current.tty - state.current.ty) * ease

      el.style.transform = `translate3d(${state.current.tx.toFixed(2)}px, ${state.current.ty.toFixed(2)}px, 0) rotateX(${state.current.rx.toFixed(2)}deg) rotateY(${state.current.ry.toFixed(2)}deg)`
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [max, ease, parallax])

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]" style={{ willChange: 'transform' }}>
      <div ref={ref} className={className} style={{ transformStyle: 'preserve-3d', transition: 'box-shadow 200ms ease' }}>
        {children}
      </div>
    </div>
  )
}

export default function ServicesPage() {
  return (
    <main
      className="relative min-h-screen w-full overflow-hidden bg-cover bg-center bg-no-repeat font-sans"
      style={{ backgroundImage: "url('/frutiger-bg.jpg')" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-300/10 via-transparent to-cyan-200/10" />

      <div className="relative mx-auto max-w-[1500px] px-6 py-8 md:px-10 md:py-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <TiltCard max={5} ease={0.08}>
            <div className={`${glass} inline-block px-8 py-4`}>
              <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
                Our Services
              </h1>
              <p className="mt-3 text-lg text-white/80">
                Discover how we bring nature and technology together
              </p>
            </div>
          </TiltCard>
        </div>

        {/* Stats */}
        <div className="mb-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat, i) => (
            <TiltCard key={stat.label} max={10} ease={0.1}>
              <div className={`${glass} p-6 text-center text-white`}>
                <p className="text-3xl font-bold md:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-white/70">{stat.label}</p>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* Services Grid */}
        <div className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <TiltCard key={service.title} max={12} ease={0.1}>
              <div className={`${glass} p-6 text-white transition hover:bg-white/25`}>
                <div className={`mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${service.color} backdrop-blur`}>
                  <service.icon className="size-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{service.title}</h3>
                <p className="text-sm text-white/70">{service.description}</p>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <TiltCard max={8} ease={0.08}>
            <div className={`${glass} inline-flex flex-col items-center gap-4 p-8 text-white md:flex-row`}>
              <div>
                <h3 className="text-2xl font-semibold">Ready to get started?</h3>
                <p className="mt-1 text-white/70">Let's create something beautiful together</p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sky-600 transition hover:scale-105"
              >
                Contact Us
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </TiltCard>
        </div>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link href="/" className="text-white/60 transition hover:text-white">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}