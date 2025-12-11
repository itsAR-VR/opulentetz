import { notFound } from "next/navigation"
import Link from "next/link"
import { WatchCard } from "@/components/watch-card"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"

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
}

const locationData: Record<string, LocationData> = {
  "vancouver-luxury-watches": {
    name: "Vancouver",
    slug: "vancouver-luxury-watches",
    city: "Vancouver",
    province: "British Columbia",
    phone: "236-833-3952",
    email: "info@exclusivetimezone.com",
    description:
      "Exclusive Time Zone headquarters in Vancouver - Canada's premier destination for authenticated luxury watches.",
    seoContent: `Welcome to Exclusive Time Zone's Vancouver headquarters, your premier destination for authenticated pre-owned luxury watches in British Columbia. Located in the heart of Vancouver at 943 W Broadway, we specialize in sought-after brands including Rolex, Patek Philippe, Audemars Piguet, Omega, Richard Mille, and Cartier.

Our team of experienced watch specialists provides honest assessments and competitive offers for every timepiece. Whether you're looking to purchase your first luxury watch, add to an existing collection, or sell a timepiece you no longer wear, we ensure every transaction is transparent and fair.

We serve collectors throughout the Greater Vancouver Area including Burnaby, Richmond, North Vancouver, West Vancouver, Surrey, and Coquitlam. Our showroom is available by appointment only, ensuring personalized attention for every client.

Exclusive Time Zone has built its reputation on authenticity, fair pricing, and exceptional customer service. Every watch we sell undergoes thorough authentication to ensure you receive exactly what you're paying for.`,
    metaTitle: "Luxury Watches Vancouver | Buy & Sell Rolex, Patek Philippe, Audemars Piguet | Exclusive Time Zone",
    metaDescription:
      "Vancouver's trusted dealer for pre-owned Rolex, Patek Philippe, Audemars Piguet, Omega & Cartier watches. Buy, sell, or trade with confidence at Exclusive Time Zone.",
  },
  "calgary-luxury-watches": {
    name: "Calgary",
    slug: "calgary-luxury-watches",
    city: "Calgary",
    province: "Alberta",
    phone: "403-703-6671",
    email: "info@exclusivetimezone.com",
    description:
      "Exclusive Time Zone Calgary - your trusted source for buying and selling pre-owned luxury watches in Alberta.",
    seoContent: `Exclusive Time Zone's Calgary location serves collectors throughout Alberta with authenticated pre-owned luxury watches. Located at 2120 4th Street SW, Unit 210, we specialize in sought-after brands including Rolex, Patek Philippe, Audemars Piguet, Omega, and Cartier.

Our Calgary showroom is available by appointment only, ensuring personalized attention for every client. Whether you're looking to purchase your first luxury watch, add to an existing collection, or sell a timepiece you no longer wear, our team provides honest assessments and competitive offers.

We serve collectors throughout Calgary and surrounding areas including Airdrie, Cochrane, Okotoks, Chestermere, and Red Deer. Every watch we sell undergoes thorough authentication to ensure you receive exactly what you're paying for.

Exclusive Time Zone is proud to maintain an excellent reputation with hundreds of successful transactions. We believe in transparency, fair dealing, and building long-term relationships with collectors across Alberta.`,
    metaTitle: "Luxury Watches Calgary | Buy & Sell Rolex, Patek Philippe, Audemars Piguet | Exclusive Time Zone",
    metaDescription:
      "Calgary's trusted dealer for pre-owned Rolex, Patek Philippe, Audemars Piguet, Omega & Cartier watches. Buy, sell, or trade with confidence at Exclusive Time Zone.",
  },
  "toronto-luxury-watches": {
    name: "Toronto",
    slug: "toronto-luxury-watches",
    city: "Toronto",
    province: "Ontario",
    phone: "514-298-8666",
    email: "info@exclusivetimezone.com",
    description:
      "Exclusive Time Zone Toronto - bringing trusted luxury watch services to the Greater Toronto Area.",
    seoContent: `Exclusive Time Zone serves Toronto and the Greater Toronto Area with authenticated pre-owned luxury watches. Located at 25 Sheppard Ave W in North York, we specialize in pre-owned luxury watches from brands including Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier, and IWC.

Toronto collectors can expect the same high standards that have made Exclusive Time Zone a trusted name across Canada. Every watch is authenticated by experienced professionals, and we provide detailed condition reports for complete transparency.

We work with clients across the GTA including Mississauga, Brampton, Markham, Vaughan, Richmond Hill, and Oakville. Our showroom is available by appointment only. Whether you're buying your first Submariner or selling a vintage Daytona, our team is ready to assist.

Our commitment to fair pricing means we research current market values to ensure competitive offers on watches we purchase and reasonable prices on watches we sell. Contact us today to discuss your luxury watch needs in Toronto.`,
    metaTitle: "Luxury Watches Toronto | Buy & Sell Rolex, Patek Philippe, Audemars Piguet | Exclusive Time Zone",
    metaDescription:
      "Toronto's source for authenticated pre-owned Rolex, Patek Philippe, Audemars Piguet & more. Buy, sell, or trade luxury watches with Exclusive Time Zone.",
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

async function getFeaturedWatches() {
  const watches = await prisma.inventory.findMany({
    where: { status: "Available" },
    take: 4,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  })

  return watches.map((w) => ({
    ...w,
    price: w.price.toNumber(),
    createdAt: w.createdAt.toISOString(),
    updatedAt: w.updatedAt.toISOString(),
  }))
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const location = locationData[slug]

  if (!location) {
    notFound()
  }

  const featuredWatches = await getFeaturedWatches()

  return (
    <main className="min-h-screen bg-background">
      {/* Simple Header Section */}
      <section className="py-16 lg:py-20 border-b border-border">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-3xl md:text-4xl font-medium mb-4">Luxury Watches in {location.name}</h1>
          <p className="text-muted-foreground">{location.description}</p>
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
              <a href={`tel:${location.phone}`} className="text-gold hover:underline">
                {location.phone}
              </a>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Email</p>
              <a href={`mailto:${location.email}`} className="text-gold hover:underline">
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
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl font-medium mb-2">Featured Inventory</h2>
            <p className="text-muted-foreground">Available for pickup or shipping from {location.name}</p>
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
