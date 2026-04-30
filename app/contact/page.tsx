'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Send, MapPin, Mail, Phone, CheckCircle } from 'lucide-react'

const glass =
  "rounded-2xl border border-white/40 bg-white/15 backdrop-blur-xl shadow-[0_8px_32px_rgba(31,77,122,0.15),inset_0_1px_0_rgba(255,255,255,0.6)]"

const contactInfo = [
  {
    icon: MapPin,
    label: 'Address',
    value: '123 Harmony Street, San Francisco, CA 94102',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@futureofharmony.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+1 (555) 123-4567',
  },
]

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type FormData = z.infer<typeof schema>

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

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast.success('Message sent!', {
      description: `Thanks ${data.name}! We'll get back to you soon.`,
      icon: <CheckCircle className="size-5 text-green-400" />,
    })

    reset()
  }

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
                Contact Us
              </h1>
              <p className="mt-3 text-lg text-white/80">
                We'd love to hear from you
              </p>
            </div>
          </TiltCard>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Info */}
          <div>
            <TiltCard max={8} ease={0.1}>
              <div className={`${glass} p-8 text-white`}>
                <h2 className="mb-6 text-2xl font-semibold">Get in Touch</h2>
                <p className="mb-8 text-white/80">
                  Have questions about our services or want to collaborate?
                  We're here to help and would love to hear from you.
                </p>

                <div className="space-y-6">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-white/20 backdrop-blur">
                        <item.icon className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm text-white/60">{item.label}</p>
                        <p className="text-white">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 border-t border-white/20 pt-8">
                  <p className="text-sm text-white/60">Follow us</p>
                  <div className="mt-2 flex gap-4">
                    {['Twitter', 'LinkedIn', 'Instagram'].map((social) => (
                      <button
                        key={social}
                        className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white/80 transition hover:bg-white/20 hover:text-white"
                      >
                        {social}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Contact Form */}
          <div>
            <TiltCard max={8} ease={0.1}>
              <div className={`${glass} p-8 text-white`}>
                <h2 className="mb-6 text-2xl font-semibold">Send a Message</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm text-white/80">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register('name')}
                      className={`w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur transition placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 ${
                        errors.name ? 'border-red-400' : ''
                      }`}
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm text-white/80">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      className={`w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur transition placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 ${
                        errors.email ? 'border-red-400' : ''
                      }`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="subject" className="mb-2 block text-sm text-white/80">
                      Subject
                    </label>
                    <input
                      id="subject"
                      type="text"
                      {...register('subject')}
                      className={`w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur transition placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 ${
                        errors.subject ? 'border-red-400' : ''
                      }`}
                      placeholder="How can we help?"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-400">{errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm text-white/80">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      {...register('message')}
                      className={`w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur transition placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none ${
                        errors.message ? 'border-red-400' : ''
                      }`}
                      placeholder="Tell us more..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3 text-sky-600 transition hover:bg-white/90 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="size-5 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="size-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </TiltCard>
          </div>
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