import { notFound } from "next/navigation"
import Link from "next/link"
import { WatchCard } from "@/components/watch-card"
import { Button } from "@/components/ui/button"
import { watches } from "@/lib/mock-data"
import { MapPin } from "lucide-react"

interface LocationData {
  name: string
  slug: string
  city: string
  province: string
  address: string
  phone: string
  email: string
  description: string
  heroImage: string
  metaTitle: string
  metaDescription: string
}

const locationData: Record<string, LocationData> = {
  "calgary-luxury-watches": {
    name: "Calgary",
    slug: "calgary-luxury-watches",
    city: "Calgary",
    province: "Alberta",
    address: "123 Luxury Lane, Calgary, AB T2P 1A1",
    phone: "(403) 555-0123",
    email: "calgary@calgaryetz.com",
    description:
      "Our flagship location in Calgary serves as the headquarters of Calgary ETZ. We offer the largest selection of pre-owned luxury watches in Alberta.",
    heroImage: "/calgary-downtown-skyline-luxury.jpg",
    metaTitle: "Luxury Watches Calgary | Buy & Sell Rolex, Patek Philippe | Calgary ETZ",
    metaDescription:
      "Calgary's premier destination for pre-owned luxury watches. Buy, sell, or trade Rolex, Patek Philippe, Audemars Piguet & more.",
  },
  "toronto-luxury-watches": {
    name: "Toronto",
    slug: "toronto-luxury-watches",
    city: "Toronto",
    province: "Ontario",
    address: "456 Bay Street, Toronto, ON M5H 2Y4",
    phone: "(416) 555-0456",
    email: "toronto@calgaryetz.com",
    description:
      "Our Toronto location brings Calgary ETZ's trusted service to Ontario. We serve collectors across the Greater Toronto Area.",
    heroImage: "/toronto-downtown-cn-tower-luxury.jpg",
    metaTitle: "Luxury Watches Toronto | Buy & Sell Rolex, Patek Philippe | Calgary ETZ",
    metaDescription:
      "Toronto's trusted source for pre-owned luxury watches. Buy, sell, or trade Rolex, Patek Philippe, Audemars Piguet & more.",
  },
  "edmonton-luxury-watches": {
    name: "Edmonton",
    slug: "edmonton-luxury-watches",
    city: "Edmonton",
    province: "Alberta",
    address: "789 Jasper Ave, Edmonton, AB T5J 1N9",
    phone: "(780) 555-0789",
    email: "edmonton@calgaryetz.com",
    description:
      "Serving Edmonton and Northern Alberta, our Jasper Avenue location offers the same exceptional service Calgary ETZ is known for.",
    heroImage: "/edmonton-downtown-skyline-river-valley.jpg",
    metaTitle: "Luxury Watches Edmonton | Buy & Sell Rolex, Patek Philippe | Calgary ETZ",
    metaDescription:
      "Edmonton's trusted source for pre-owned luxury watches. Buy, sell, or trade Rolex, Patek Philippe, Audemars Piguet & more.",
  },
  "kelowna-luxury-watches": {
    name: "Kelowna",
    slug: "kelowna-luxury-watches",
    city: "Kelowna",
    province: "British Columbia",
    address: "321 Bernard Ave, Kelowna, BC V1Y 6N6",
    phone: "(250) 555-0321",
    email: "kelowna@calgaryetz.com",
    description:
      "Our Kelowna location serves the Okanagan Valley and interior British Columbia with authenticated luxury timepieces.",
    heroImage: "/kelowna-okanagan-lake-downtown-luxury.jpg",
    metaTitle: "Luxury Watches Kelowna | Buy & Sell Rolex, Patek Philippe | Calgary ETZ",
    metaDescription:
      "Kelowna's trusted source for pre-owned luxury watches. Buy, sell, or trade Rolex, Patek Philippe, Audemars Piguet & more.",
  },
  "montreal-luxury-watches": {
    name: "Montreal",
    slug: "montreal-luxury-watches",
    city: "Montreal",
    province: "Quebec",
    address: "1000 Rue Sherbrooke O, Montreal, QC H3A 3G4",
    phone: "(514) 555-1000",
    email: "montreal@calgaryetz.com",
    description:
      "Our Montreal location brings Calgary ETZ's expertise to Quebec. We serve Montreal's discerning collectors.",
    heroImage: "/montreal-old-port-downtown-luxury.jpg",
    metaTitle: "Luxury Watches Montreal | Buy & Sell Rolex, Patek Philippe | Calgary ETZ",
    metaDescription:
      "Montreal's trusted source for pre-owned luxury watches. Buy, sell, or trade Rolex, Patek Philippe, Audemars Piguet & more.",
  },
  "winnipeg-luxury-watches": {
    name: "Winnipeg",
    slug: "winnipeg-luxury-watches",
    city: "Winnipeg",
    province: "Manitoba",
    address: "555 Portage Ave, Winnipeg, MB R3B 2E9",
    phone: "(204) 555-0555",
    email: "winnipeg@calgaryetz.com",
    description:
      "Serving Manitoba and the prairies, our Winnipeg location offers Calgary ETZ's full range of buying, selling, and trading services.",
    heroImage: "/winnipeg-downtown-portage-exchange-district.jpg",
    metaTitle: "Luxury Watches Winnipeg | Buy & Sell Rolex, Patek Philippe | Calgary ETZ",
    metaDescription:
      "Winnipeg's trusted source for pre-owned luxury watches. Buy, sell, or trade Rolex, Patek Philippe, Audemars Piguet & more.",
  },
}

export async function generateStaticParams() {
  return Object.keys(locationData).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const location = locationData[slug]
  if (!location) return {}

  return {
    title: location.metaTitle,
    description: location.metaDescription,
  }
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const location = locationData[slug]

  if (!location) {
    notFound()
  }

  const featuredWatches = watches.filter((w) => w.status === "Available").slice(0, 4)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-24 lg:py-32">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url('${location.heroImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-gold mb-4">
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-medium tracking-wider uppercase">
                {location.city}, {location.province}
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium mb-6 text-balance">
              Luxury Watches in <span className="text-gold">{location.name}</span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">{location.description}</p>
          </div>
        </div>
      </section>

      {/* Location Info */}
      <section className="py-12 border-b border-border">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="font-medium mb-1">Address</h3>
              <p className="text-sm text-muted-foreground">{location.address}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Phone</h3>
              <a href={`tel:${location.phone}`} className="text-gold hover:underline">
                {location.phone}
              </a>
            </div>
            <div>
              <h3 className="font-medium mb-1">Email</h3>
              <a href={`mailto:${location.email}`} className="text-gold hover:underline text-sm">
                {location.email}
              </a>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-gold hover:bg-gold/90 text-black font-medium">
              <Link href="/inventory">Browse Inventory</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/sell">Sell Your Watch</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Inventory */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-medium">Featured Inventory</h2>
              <p className="text-muted-foreground mt-2">Available for pickup or shipping from {location.name}</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/inventory">View All Watches</Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredWatches.map((watch) => (
              <WatchCard key={watch.id} watch={watch} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
