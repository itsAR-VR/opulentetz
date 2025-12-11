"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ChevronDown, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const locations = [
  { name: "Vancouver (HQ)", href: "/locations/vancouver-luxury-watches" },
  { name: "Calgary", href: "/locations/calgary-luxury-watches" },
  { name: "Toronto", href: "/locations/toronto-luxury-watches" },
]

const navLinks = [
  { name: "Inventory", href: "/inventory" },
  { name: "Sell / Trade", href: "/sell" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/calgary-20etz-20logo-20gold.avif"
              alt="Exclusive Time Zone"
              width={180}
              height={50}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <MapPin className="h-4 w-4" />
                  Locations
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {locations.map((location) => (
                  <DropdownMenuItem key={location.name} asChild>
                    <Link href={location.href} className="w-full cursor-pointer">
                      {location.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Button asChild className="bg-gold hover:bg-gold/90 text-black font-medium">
              <Link href="/sell">Get a Quote</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Our Locations
                </p>
                {locations.map((location) => (
                  <Link
                    key={location.name}
                    href={location.href}
                    className="block py-2 text-sm font-medium hover:text-gold transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {location.name}
                  </Link>
                ))}
              </div>
              <Button asChild className="bg-gold hover:bg-gold/90 text-black font-medium mt-4">
                <Link href="/sell">Get a Quote</Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
