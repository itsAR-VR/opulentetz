import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { WatchCard } from "@/components/watch-card"
import { Button } from "@/components/ui/button"
import { getInventory } from "@/lib/actions"
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_HREF } from "@/lib/contact"

export const dynamic = "force-dynamic"

interface LocationData {
  name: string
  slug: string
  city: string
  province: string
  phone: string
  email: string
  description: string
  seoContent: string
  metaTitle: string
  metaDescription: string
  heroImage: string
  heroAlt: string
}

const locationData: Record<string, LocationData> = {
  "edmonton-luxury-watches": {
    name: "Edmonton",
    slug: "edmonton-luxury-watches",
    city: "Edmonton",
    province: "Alberta",
    phone: CONTACT_PHONE_DISPLAY,
    email: CONTACT_EMAIL,
    description: "ETZ is Edmonton’s trusted luxury watch buyer and consignment specialist.",
    seoContent: `ETZ is Edmonton’s trusted luxury watch buyer and consignment specialist. Operating locally out of Edmonton, we help clients buy, sell, consign, and trade watches with transparent CAD payouts and secure transactions available Canada‑wide. Whether you want to turn your watch into cash, place it on consignment, or request a trade‑up into something more exclusive, ETZ makes the process simple and discreet. If you’re searching “sell my watch Edmonton,” “watch consignment Edmonton,” or “trade my Rolex Edmonton,” ETZ is your go‑to partner for fair valuations and fast results.`,
    metaTitle: "Sell My Watch Edmonton | Luxury Watch Buyer & Consignment | ETZ",
    metaDescription:
      "Sell, consign, or trade luxury watches in Edmonton with transparent CAD payouts and secure Canada‑wide transactions. ETZ makes it simple and discreet.",
    heroImage: "/edmonton-downtown-skyline-river-valley.jpg",
    heroAlt: "Edmonton skyline",
  },
  "toronto-luxury-watches": {
    name: "Toronto",
    slug: "toronto-luxury-watches",
    city: "Toronto",
    province: "Ontario",
    phone: CONTACT_PHONE_DISPLAY,
    email: CONTACT_EMAIL,
    description: "ETZ operates in Toronto as a leading service for buying, selling, and consigning luxury watches.",
    seoContent: `ETZ operates in Toronto as a leading service for buying, selling, and consigning luxury watches, with deals completed safely across Canada. From our Toronto base, we offer competitive cash offers, flexible consignment programs, and trade‑up options for clients looking to upgrade their pieces. Toronto residents searching “sell my watch Toronto,” “watch consignment Toronto,” or “trade my Rolex Toronto” choose ETZ for accurate market pricing in CAD, secure payment methods, and a streamlined process designed for both collectors and first‑time sellers.`,
    metaTitle: "Sell My Watch Toronto | Luxury Watch Buyer & Consignment | ETZ",
    metaDescription:
      "Sell, consign, or trade luxury watches in Toronto with accurate CAD pricing, secure payments, and a streamlined process for collectors and first‑time sellers.",
    heroImage: "/toronto-downtown-cn-tower-luxury.jpg",
    heroAlt: "Toronto skyline",
  },
  "winnipeg-luxury-watches": {
    name: "Winnipeg",
    slug: "winnipeg-luxury-watches",
    city: "Winnipeg",
    province: "Manitoba",
    phone: CONTACT_PHONE_DISPLAY,
    email: CONTACT_EMAIL,
    description: "ETZ brings expert watch buying and consignment services to Winnipeg with Canada‑wide reach.",
    seoContent: `ETZ brings expert watch buying and consignment services to Winnipeg with Canada‑wide reach. Operating out of Winnipeg, we specialize in evaluating luxury watches, offering strong cash payouts, and managing consignment listings to maximize your return. You can also request a trade‑up, moving into a more exclusive piece while using your current watch as value. If you’re searching “sell my watch Winnipeg,” “watch buyer Winnipeg,” or “watch consignment Winnipeg,” ETZ delivers honest appraisals, transparent fees, and insured shipping options across Canada.`,
    metaTitle: "Sell My Watch Winnipeg | Luxury Watch Buyer & Consignment | ETZ",
    metaDescription:
      "Sell, consign, or trade luxury watches in Winnipeg with honest appraisals, transparent fees, strong CAD payouts, and insured Canada‑wide shipping options.",
    heroImage: "/winnipeg-downtown-portage-exchange-district.jpg",
    heroAlt: "Winnipeg skyline",
  },
  "montreal-luxury-watches": {
    name: "Montreal",
    slug: "montreal-luxury-watches",
    city: "Montreal",
    province: "Quebec",
    phone: CONTACT_PHONE_DISPLAY,
    email: CONTACT_EMAIL,
    description: "ETZ’s Montreal operation focuses on high‑end watch buying, selling, and consignment.",
    seoContent: `ETZ’s Montreal operation focuses on high‑end watch buying, selling, and consignment, supporting clients in Quebec and throughout Canada. From Montreal, we provide fair CAD offers for your watch, flexible consignment agreements, and trade‑up opportunities for those looking to move into something more exclusive. Montreal clients searching “vendre ma montre Montréal,” “consignation montres de luxe Montréal,” or “trade Rolex Montréal” trust ETZ for bilingual service, secure payments, and a professional, confidential process from start to finish.`,
    metaTitle: "Sell My Watch Montreal | Luxury Watch Buyer & Consignment | ETZ",
    metaDescription:
      "High‑end watch buying, selling, and consignment in Montreal with bilingual service, fair CAD offers, and a confidential, professional process from start to finish.",
    heroImage: "/montreal-old-port-downtown-luxury.jpg",
    heroAlt: "Montreal skyline",
  },
  "calgary-luxury-watches": {
    name: "Calgary",
    slug: "calgary-luxury-watches",
    city: "Calgary",
    province: "Alberta",
    phone: CONTACT_PHONE_DISPLAY,
    email: CONTACT_EMAIL,
    description: "From our Calgary base, ETZ offers a complete watch buying and consignment solution.",
    seoContent: `From our Calgary base, ETZ offers a complete watch buying and consignment solution for Alberta and the rest of Canada. Calgary clients can sell watches for cash, place pieces on consignment, or request a trade‑up into a more exclusive model, all with transparent CAD valuations and insured logistics. If you’re looking for “sell my watch Calgary,” “watch consignment Calgary,” or “trade my Rolex Calgary,” ETZ provides expert market guidance, competitive offers, and a smooth, hassle‑free experience.`,
    metaTitle: "Sell My Watch Calgary | Luxury Watch Buyer & Consignment | ETZ",
    metaDescription:
      "Sell, consign, or trade luxury watches in Calgary with transparent CAD valuations, insured logistics, and a smooth, hassle‑free experience across Canada.",
    heroImage: "/calgary-downtown-skyline-luxury.jpg",
    heroAlt: "Calgary skyline",
  },
  "vancouver-luxury-watches": {
    name: "Vancouver",
    slug: "vancouver-luxury-watches",
    city: "Vancouver",
    province: "British Columbia",
    phone: CONTACT_PHONE_DISPLAY,
    email: CONTACT_EMAIL,
    description: "ETZ serves Vancouver with luxury watch buying, consignment, and trade‑up support across Canada.",
    seoContent: `ETZ serves Vancouver with professional luxury watch buying, selling, and consignment services, while completing deals securely across Canada. From Vancouver, we help clients get accurate CAD valuations, fast payouts, and flexible consignment options designed to maximize value. If you’re searching “sell my watch Vancouver,” “watch consignment Vancouver,” or “trade my Rolex Vancouver,” ETZ provides transparent pricing, secure transactions, and a streamlined process from inquiry to delivery.`,
    metaTitle: "Sell My Watch Vancouver | Luxury Watch Buyer & Consignment | ETZ",
    metaDescription:
      "Sell, consign, or trade luxury watches in Vancouver with accurate CAD valuations, secure transactions, and a streamlined Canada‑wide process from start to finish.",
    heroImage: "/hero_images/039A9048 2.png",
    heroAlt: "Luxury timepieces in Vancouver",
  },
  "kelowna-luxury-watches": {
    name: "Kelowna",
    slug: "kelowna-luxury-watches",
    city: "Kelowna",
    province: "British Columbia",
    phone: CONTACT_PHONE_DISPLAY,
    email: CONTACT_EMAIL,
    description: "ETZ operates out of Kelowna to serve the Okanagan with specialized watch buying and consignment.",
    seoContent: `ETZ operates out of Kelowna to serve the Okanagan with specialized watch buying, selling, and consignment services, while handling transactions Canada‑wide. You can sell your watch for cash, consign it to reach serious buyers, or request a trade‑up into a more exclusive piece using your current watch as value. Kelowna residents searching “sell my watch Kelowna,” “watch consignment Kelowna,” or “trade Rolex Kelowna” rely on ETZ for accurate CAD appraisals, secure payments, and personalized support throughout the process.`,
    metaTitle: "Sell My Watch Kelowna | Luxury Watch Buyer & Consignment | ETZ",
    metaDescription:
      "Sell, consign, or trade luxury watches in Kelowna and the Okanagan with accurate CAD appraisals, secure payments, and personalized support Canada‑wide.",
    heroImage: "/kelowna-okanagan-lake-downtown-luxury.jpg",
    heroAlt: "Kelowna and Okanagan Lake",
  },
}

export async function generateStaticParams() {
  return Object.keys(locationData).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const location = locationData[slug]
  if (!location) return {}

  return {
    title: location.metaTitle,
    description: location.metaDescription,
    openGraph: {
      title: location.metaTitle,
      description: location.metaDescription,
      images: [{ url: location.heroImage, alt: location.heroAlt }],
    },
  }
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const location = locationData[slug]

  if (!location) {
    notFound()
  }

  const inventory = await getInventory()
  const featuredWatches = inventory.filter((w) => w.status !== "Sold").slice(0, 4)

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-black text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image src={location.heroImage} alt={location.heroAlt} fill className="object-cover opacity-35" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold uppercase tracking-[0.2em] text-sm font-medium mb-4">
            {location.city}, {location.province}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-balance">Sell My Watch {location.city}</h1>
          <p className="mt-6 text-gray-300 leading-relaxed">{location.description}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gold hover:bg-gold/90 text-black font-medium">
              <Link href="/sell">Get a Quote</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black bg-transparent"
            >
              <Link href="/inventory">Browse Inventory</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-gray max-w-none">
            {location.seoContent.split("\n\n").map((paragraph, index) => (
              <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12 bg-muted/30 border-y border-border">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-xl font-medium mb-6 text-center">Contact Us</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-8 text-center">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Phone</p>
              <a href={CONTACT_PHONE_HREF} className="text-gold hover:underline">
                {CONTACT_PHONE_DISPLAY}
              </a>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Email</p>
              <a href={CONTACT_EMAIL_HREF} className="text-gold hover:underline">
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-gold hover:bg-gold/90 text-black font-medium">
              <Link href="/sell">Sell / Consign</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/inventory">Browse Inventory</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Inventory */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl font-medium mb-2">Featured Inventory</h2>
            <p className="text-muted-foreground">Available for delivery or shipping across Canada</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredWatches.map((watch) => (
              <WatchCard key={watch.id} watch={watch} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="outline">
              <Link href="/inventory">View All Watches</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
