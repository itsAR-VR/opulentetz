"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface WatchGalleryProps {
  images: string[]
  alt: string
  status: string
  statusLabel: string
}

export function WatchGallery({ images, alt, status, statusLabel }: WatchGalleryProps) {
  const normalizedImages = useMemo(
    () => images.filter((src) => typeof src === "string" && src.trim().length > 0),
    [images],
  )

  const [activeIndex, setActiveIndex] = useState(0)

  const activeSrc = normalizedImages[activeIndex] || "/placeholder.svg"

  const statusTone = useMemo(() => {
    const normalized = status.trim().toLowerCase()
    if (normalized === "sold") return "sold"
    if (normalized === "pending") return "pending"
    return "available"
  }, [status])

  return (
    <div className="space-y-4">
      <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
        <Image src={activeSrc} alt={alt} fill className="object-cover" priority />

        <Badge
          className={cn(
            "absolute top-4 left-4",
            statusTone === "sold"
              ? "bg-red-600 text-white"
              : statusTone === "pending"
                ? "bg-yellow-500 text-black"
                : "bg-green-600 text-white",
          )}
        >
          {statusLabel}
        </Badge>
      </div>

      {normalizedImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {normalizedImages.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative aspect-square bg-muted rounded-md overflow-hidden border-2 transition-colors",
                index === activeIndex ? "border-gold" : "border-transparent hover:border-gold/70",
              )}
              aria-label={`View image ${index + 1}`}
            >
              <Image src={src} alt={`${alt} - Image ${index + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
