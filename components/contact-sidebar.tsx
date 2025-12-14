"use client"

import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const locations = [
  { name: "Calgary", href: "/locations/calgary-luxury-watches" },
  { name: "Edmonton", href: "/locations/edmonton-luxury-watches" },
  { name: "Kelowna", href: "/locations/kelowna-luxury-watches" },
  { name: "Montreal", href: "/locations/montreal-luxury-watches" },
  { name: "Toronto", href: "/locations/toronto-luxury-watches" },
  { name: "Winnipeg", href: "/locations/winnipeg-luxury-watches" },
]

export function ContactSidebar() {
  return (
    <Sheet>
      {/* Desktop trigger (right-side tab) */}
      <SheetTrigger asChild>
        <Button
          className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-50 rounded-l-lg rounded-r-none bg-gold hover:bg-gold/90 text-black shadow-lg px-3 py-8 [writing-mode:vertical-rl] rotate-180"
          aria-label="Open contact sidebar"
        >
          Contact Us
        </Button>
      </SheetTrigger>

      {/* Mobile trigger */}
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="md:hidden fixed right-4 bottom-4 z-50 rounded-full bg-gold hover:bg-gold/90 text-black shadow-lg"
          aria-label="Open contact sidebar"
        >
          <Phone className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-80 sm:w-96">
        <SheetHeader>
          <SheetTitle className="font-serif text-xl">Contact Us</SheetTitle>
          <SheetDescription>Fastest response: call or text. All pricing is in CAD.</SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-6 space-y-6">
          <div className="grid gap-3">
            <Button asChild className="bg-gold hover:bg-gold/90 text-black font-medium w-full">
              <a href="tel:236-334-3434">
                <Phone className="mr-2 h-4 w-4" />
                Call / Text: 236-334-3434
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <a href="mailto:info@exclusivetimezone.com">
                <Mail className="mr-2 h-4 w-4" />
                info@exclusivetimezone.com
              </a>
            </Button>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/contact">Contact Form</Link>
            </Button>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold" />
              Locations
            </p>
            <div className="grid grid-cols-2 gap-2">
              {locations.map((location) => (
                <Link
                  key={location.href}
                  href={location.href}
                  className="text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  {location.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Button asChild variant="outline" className="w-full">
              <Link href="/sell">Sell / Consign</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/inventory">Browse Inventory</Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

