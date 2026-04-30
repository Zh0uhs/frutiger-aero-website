'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { Heart, Leaf, Lightbulb, Users } from 'lucide-react'

const glass =
  "rounded-2xl border border-white/40 bg-white/15 backdrop-blur-xl shadow-[0_8px_32px_rgba(31,77,122,0.15),inset_0_1px_0_rgba(255,255,255,0.6)]"

const team = [
  {
    name: 'Alex Chen',
    role: 'Founder & CEO',
    bio: 'Visionary leader with 15 years in sustainable tech',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  },
  {
    name: 'Sarah Johnson',
    role: 'Head of Design',
    bio: 'Award-winning designer passionate about organic aesthetics',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
  },
  {
    name: 'Marcus Lee',
    role: 'Tech Lead',
    bio: 'Full-stack wizard with a love for nature photography',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  },
  {
    name: 'Emma Watson',
    role: 'Product Manager',
    bio: 'Bridge between vision and execution, sustainability advocate',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
  },
]

const values = [
  {
    icon: Leaf,
    title: 'Sustainability First',
    description: 'Every decision we make considers its environmental impact',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Pushing boundaries to create meaningful solutions',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Building connections that inspire and uplift',
  },
  {
    icon: Heart,
    title: 'Authenticity',
    description: 'Genuine care for users, partners, and the planet',
  },
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

export default function AboutPage() {
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
                About Us
              </h1>
              <p className="mt-3 text-lg text-white/80">
                Building the future where nature and technology coexist in harmony
              </p>
            </div>
          </TiltCard>
        </div>

        {/* Mission Statement */}
        <div className="mb-16">
          <TiltCard max={8} ease={0.08}>
            <div className={`${glass} p-8 text-center text-white`}>
              <h2 className="text-2xl font-semibold md:text-3xl">Our Mission</h2>
              <p className="mt-4 text-lg leading-relaxed text-white/90">
                We believe technology should enhance, not replace, our connection with nature.
                Our mission is to create digital experiences that remind people of the beauty
                around them while reducing our collective environmental footprint.
              </p>
            </div>
          </TiltCard>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-semibold text-white">Our Values</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {values.map((value) => (
              <TiltCard key={value.title} max={10} ease={0.1}>
                <div className={`${glass} flex items-start gap-4 p-6 text-white`}>
                  <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-white/20 backdrop-blur">
                    <value.icon className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{value.title}</h3>
                    <p className="mt-1 text-sm text-white/70">{value.description}</p>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-semibold text-white">Meet Our Team</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <TiltCard key={member.name} max={12} ease={0.1}>
                <div className={`${glass} p-6 text-center text-white transition hover:bg-white/20`}>
                  <div className="mx-auto mb-4 size-24 overflow-hidden rounded-full border-2 border-white/30">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="size-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-sm text-sky-300">{member.role}</p>
                  <p className="mt-2 text-xs text-white/60">{member.bio}</p>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* Journey */}
        <div className="mb-16">
          <TiltCard max={6} ease={0.08}>
            <div className={`${glass} p-8 text-white`}>
              <h2 className="mb-6 text-2xl font-semibold text-center">Our Journey</h2>
              <div className="grid gap-4 md:grid-cols-4">
                {[
                  { year: '2019', event: 'Founded with a vision' },
                  { year: '2020', event: 'First product launch' },
                  { year: '2022', event: '10,000 users milestone' },
                  { year: '2024', event: 'Global expansion' },
                ].map((milestone, i) => (
                  <div key={milestone.year} className="text-center">
                    <div className="text-3xl font-bold text-sky-300">{milestone.year}</div>
                    <p className="mt-1 text-sm text-white/70">{milestone.event}</p>
                  </div>
                ))}
              </div>
            </div>
          </TiltCard>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/contact"
            className={`${glass} inline-block px-8 py-4 text-white transition hover:bg-white/25`}
          >
            <span className="text-lg">Want to join our mission?</span>
            <br />
            <span className="text-sm text-white/70">We're always looking for passionate people</span>
          </Link>
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