import Link from "next/link"
import Image from "next/image"
import { ArrowRight, BadgeCheck, CheckCircle2, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HomeInventory } from "@/components/home-inventory"
import { getInventory } from "@/lib/actions"

const trustBullets = ["Certified Authenticity", "Multi-point Inspection", "Verified Sourcing"] as const

const trustMedia = [
  {
    src: "/hero_images/IMG_0266 2.png",
    alt: "Close-up watch inspection",
    label: "Close-up inspection",
  },
  {
    src: "/hero_images/IMG_0025 2.png",
    alt: "Watchmaker tools and workshop",
    label: "Watchmaker tools",
    icon: Wrench,
  },
  {
    src: "/hero_images/IMG_0140.png",
    alt: "Serial and certificate verification",
    label: "Certificate + serial verified",
    icon: BadgeCheck,
  },
] as const

export default async function HomePage() {
  const inventory = await getInventory()

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-5rem)] flex items-center bg-black text-white overflow-hidden">
        <div className="absolute inset-0">
          <video
            className="absolute inset-0 h-full w-full object-cover scale-105"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          >
            <source src="/hero_images/video_20230311002338.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(0,0,0,0.65),rgba(0,0,0,0.38)_45%,rgba(0,0,0,0.12)_72%,rgba(0,0,0,0)_100%)]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-gold uppercase tracking-[0.35em] text-xs sm:text-sm font-medium mb-6">
              <span className="h-px w-10 bg-gold/40" aria-hidden="true" />
              <p>Established Excellence</p>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] text-balance">
              Exceptional Timepieces,<span className="block text-gold">Uncompromising Standards</span>
            </h1>
            <p className="mt-6 text-lg text-gray-200/80 leading-relaxed max-w-xl">
              Discover our curated collection of authenticated pre-owned luxury watches. From Rolex to Patek Philippe,
              each piece tells a story of craftsmanship and heritage — including Audemars Piguet, Omega, Cartier, and Tudor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button
                asChild
                size="lg"
                className="bg-gold hover:bg-gold/90 text-black font-medium shadow-[0_18px_45px_rgba(0,0,0,0.45)] ring-1 ring-gold/25"
              >
                <Link href="/inventory">
                  Browse Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/35 text-white bg-white/5 hover:bg-white/10 hover:border-white/60"
              >
                <Link href="/sell">Sell Your Watch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Inventory */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <p className="text-gold uppercase tracking-[0.2em] text-sm font-medium mb-2">Featured Watches</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold">Best Sellers & New Arrivals</h2>
              <p className="text-muted-foreground mt-2">
                High-intent buyers start here — browse what's available now. All prices in CAD.
              </p>
            </div>
          </div>
          <HomeInventory watches={inventory} />
        </div>
      </section>

      {/* Authentication & Trust */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gold uppercase tracking-[0.2em] text-sm font-medium mb-2">Authentication & Trust</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-balance">
                Proof behind every listing
              </h2>
              <p className="text-muted-foreground mt-3 max-w-xl">
                Luxury buyers skim. We keep it simple — and show the process.
              </p>

              <div className="mt-8 space-y-4">
                {trustBullets.map((title) => (
                  <div key={title} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-gold" />
                    </div>
                    <p className="text-base font-semibold">{title}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 sm:col-span-7">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-border bg-black">
                  <Image src={trustMedia[0].src} alt={trustMedia[0].alt} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <p className="absolute bottom-3 left-3 text-xs font-medium text-white/90">{trustMedia[0].label}</p>
                </div>
              </div>

              <div className="col-span-12 sm:col-span-5 flex flex-col gap-4">
                {trustMedia.slice(1).map((item) => (
                  <div key={item.label} className="relative aspect-[5/3] rounded-xl overflow-hidden border border-border bg-black">
                    <Image src={item.src} alt={item.alt} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs font-medium text-white/90">
                      {item.icon && <item.icon className="h-4 w-4 text-gold" />}
                      <span>{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Private vs Online */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gold uppercase tracking-[0.2em] text-sm font-medium mb-2">How It Works</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-balance">Online Inventory vs Private Collection</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              Some pieces are listed publicly for immediate checkout. Others are shared privately on request.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border bg-background p-8">
              <h3 className="font-serif text-2xl font-semibold">Online Inventory</h3>
              <p className="text-sm text-muted-foreground mt-2">Ready to purchase</p>
              <div className="mt-6 space-y-3">
                {["Ready to purchase", "Live pricing", "Immediate checkout"].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-gold shrink-0" />
                    <p className="font-medium">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button asChild className="bg-gold hover:bg-gold/90 text-black font-medium w-full sm:w-auto">
                  <Link href="/inventory">Browse Online Inventory</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-8">
              <h3 className="font-serif text-2xl font-semibold">Private Collection</h3>
              <p className="text-sm text-muted-foreground mt-2">Shared on request</p>
              <div className="mt-6 space-y-3">
                {["Off-market pieces kept private", "Private viewing by appointment", "Can be toggled live vs private"].map(
                  (item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-gold shrink-0" />
                      <p className="font-medium">{item}</p>
                    </div>
                  ),
                )}
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button asChild className="bg-gold hover:bg-gold/90 text-black font-medium">
                  <a href="tel:236-334-3434">Request Private List</a>
                </Button>
                <Button asChild variant="outline" className="bg-transparent">
                  <Link href="/contact">Contact</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <p className="text-gold uppercase tracking-[0.2em] text-sm font-medium mb-4">Ready to Sell?</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-balance">
                Get Top Dollar for Your Luxury Timepiece
              </h2>
              <p className="mt-4 text-gray-400 leading-relaxed">
                Whether you are looking to sell outright or trade up to your dream watch, our experts provide
                competitive offers with a seamless, transparent process.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button asChild size="lg" className="bg-gold hover:bg-gold/90 text-black font-medium">
                  <Link href="/sell">
                    Get a Free Quote
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                <Image
                  src="/hero_images/IMG_0028 2.png"
                  alt="Watch authentication process"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
