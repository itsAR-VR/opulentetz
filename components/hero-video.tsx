"use client"

import { useEffect, useRef } from "react"

interface HeroVideoProps {
  src: string
  poster?: string
  className?: string
  preload?: "none" | "metadata" | "auto"
}

export function HeroVideo({ src, poster, className, preload = "metadata" }: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    const play = async () => {
      try {
        await video.play()
      } catch {
        // Some browsers may block autoplay; poster will still show.
      }
    }

    void play()
  }, [])

  return (
    <video
      ref={ref}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload={preload}
      poster={poster}
      aria-hidden="true"
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}
