"use client"

import { Phone } from "lucide-react"
import { CONTACT_PHONE_HREF } from "@/lib/contact"

export function ContactSidebar() {
  return (
    <a
      href={CONTACT_PHONE_HREF}
      aria-label="Call Exclusive Time Zone"
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 grid place-items-center h-14 w-14 rounded-full bg-gold text-black shadow-lg shadow-black/25 transition-transform hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Phone className="h-6 w-6" />
    </a>
  )
}
