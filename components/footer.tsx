import Link from "next/link"
import Image from "next/image"
import { Instagram } from "lucide-react"

const quickLinks = [
  { name: "Inventory", href: "/inventory" },
  { name: "Sell / Trade", href: "/sell" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
]

const brands = ["Rolex", "Patek Philippe", "Audemars Piguet", "Omega", "Cartier", "Tudor", "Richard Mille"]

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/exclusivetimezone/" },
]

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <Image
                src="/images/calgary-20etz-20logo-20gold.avif"
                alt="Exclusive Time Zone"
                width={160}
                height={45}
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              Trusted luxury watch sourcing across Canada. Authentic timepieces backed by transparent deals and real
              market data.
            </p>
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-gold transition-colors"
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
            <a
              href="https://www.instagram.com/exclusivetimezone/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-xs text-gold hover:text-gold/80 transition-colors"
            >
              Follow us on Instagram →
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-medium text-sm uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-gold transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands We Carry */}
          <div>
            <h3 className="font-medium text-sm uppercase tracking-wider mb-4">Brands We Carry</h3>
            <ul className="space-y-3">
              {brands.map((brand) => (
                <li key={brand}>
                  <Link
                    href={`/inventory?brand=${encodeURIComponent(brand)}`}
                    className="text-sm text-gray-400 hover:text-gold transition-colors"
                  >
                    {brand}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact - Updated for Canadian focus */}
          <div>
            <h3 className="font-medium text-sm uppercase tracking-wider mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <p>Serving all of Canada</p>
              <p>Kelowna • Calgary • Edmonton • Winnipeg • Toronto • Montreal</p>
              <p className="pt-2">
                <a href="tel:236-334-3434" className="hover:text-gold transition-colors block">
                  236-334-3434
                </a>
              </p>
              <p>
                <a href="mailto:info@exclusivetimezone.com" className="hover:text-gold transition-colors">
                  info@exclusivetimezone.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">© {new Date().getFullYear()} Exclusive Time Zone. All rights reserved.</p>
            <p className="text-xs text-gray-500 text-center md:text-right max-w-xl">
              Exclusive Time Zone is an independent dealer and is not affiliated with Rolex, Audemars Piguet, Patek
              Philippe, or any other brand. All trademarks are property of their respective owners. All prices are listed in CAD.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
