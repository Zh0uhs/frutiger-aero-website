'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react'

const glass =
  "rounded-2xl border border-white/40 bg-white/15 backdrop-blur-xl shadow-[0_8px_32px_rgba(31,77,122,0.15),inset_0_1px_0_rgba(255,255,255,0.6)]"

const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
    title: 'Mountain Sunrise',
    description: 'The harmony of light and nature',
  },
  {
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop',
    title: 'Ocean Waves',
    description: 'Where water meets sky',
  },
  {
    src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&h=800&fit=crop',
    title: 'Forest Path',
    description: 'Journey through tranquility',
  },
  {
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&h=800&fit=crop',
    title: 'Misty Valley',
    description: 'Nature in its purest form',
  },
  {
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=800&fit=crop',
    title: 'Forest Dawn',
    description: 'Embracing the new day',
  },
  {
    src: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1200&h=800&fit=crop',
    title: 'Lake Reflection',
    description: 'Perfect symmetry of nature',
  },
]

export default function GalleryPage() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }

    emblaApi.on('select', onSelect)
    onSelect()

    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi])

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden bg-cover bg-center bg-no-repeat font-sans"
      style={{ backgroundImage: "url('/frutiger-bg.jpg')" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-300/10 via-transparent to-cyan-200/10" />

      <div className="relative mx-auto max-w-[1500px] px-6 py-8 md:px-10 md:py-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className={`${glass} inline-block px-8 py-4`}>
            <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
              Gallery
            </h1>
            <p className="mt-3 text-lg text-white/80">
              Explore the beauty of nature through our lens
            </p>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative mb-12">
          <div
            className="overflow-hidden cursor-pointer"
            ref={emblaRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex">
              {galleryImages.map((image, index) => (
                <div
                  key={image.title}
                  className="min-w-0 flex-[0_0_100%] px-4 md:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
                >
                  <div
                    className={`relative overflow-hidden rounded-2xl border border-white/40 bg-white/10 backdrop-blur-xl transition-all duration-300 ${
                      selectedIndex === index ? 'scale-100 opacity-100' : 'scale-95 opacity-60'
                    }`}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={image.src}
                        alt={image.title}
                        className="size-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-6">
                      <h3 className="text-xl font-semibold text-white">{image.title}</h3>
                      <p className="text-sm text-white/80">{image.description}</p>
                    </div>
                    {selectedIndex === index && (
                      <div className="absolute right-4 top-4 rounded-full bg-white/20 p-2 backdrop-blur">
                        <Expand className="size-5 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={scrollPrev}
            className={`${glass} absolute left-4 top-1/2 -translate-y-1/2 grid size-12 place-items-center text-white transition hover:bg-white/25`}
            aria-label="Previous slide"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            onClick={scrollNext}
            className={`${glass} absolute right-4 top-1/2 -translate-y-1/2 grid size-12 place-items-center text-white transition hover:bg-white/25`}
            aria-label="Next slide"
          >
            <ChevronRight className="size-6" />
          </button>

          {/* Dots */}
          <div className="mt-8 flex justify-center gap-2">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`size-2 rounded-full transition-all ${
                  selectedIndex === index
                    ? 'bg-white w-8'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Image Counter */}
        <div className="text-center text-white/60">
          <p>{selectedIndex + 1} / {galleryImages.length}</p>
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