import { notFound } from "next/navigation"
import Link from "next/link"
import { WatchCard } from "@/components/watch-card"
import { Button } from "@/components/ui/button"
import { watches } from "@/lib/mock-data"

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
  "calgary-luxury-watches": {
    name: "Calgary",
    slug: "calgary-luxury-watches",
    city: "Calgary",
    province: "Alberta",
    phone: "(403) 555-0123",
    email: "calgary@calgaryetz.com",
    description:
      "Calgary ETZ is your trusted source for buying and selling pre-owned luxury watches in Calgary, Alberta.",
    seoContent: `As Calgary's premier destination for pre-owned luxury timepieces, Calgary ETZ has built a reputation for authenticity, fair pricing, and exceptional customer service. We specialize in sought-after brands including Rolex, Patek Philippe, Audemars Piguet, Omega, and Cartier.

Whether you're looking to purchase your first luxury watch, add to an existing collection, or sell a timepiece you no longer wear, our team provides honest assessments and competitive offers. Every watch we sell undergoes thorough authentication to ensure you receive exactly what you're paying for.

We serve collectors throughout Calgary and surrounding areas including Airdrie, Cochrane, Okotoks, and Chestermere. Our process is simple: contact us with details about your watch, receive a fair quote, and complete your transaction with confidence.

Calgary ETZ is proud to maintain a 5-star reputation on Facebook Marketplace with hundreds of successful transactions. We believe in transparency, fair dealing, and building long-term relationships with collectors across Alberta.`,
    metaTitle: "Luxury Watches Calgary | Buy & Sell Rolex, Patek Philippe, Audemars Piguet | Calgary ETZ",
    metaDescription:
      "Calgary's trusted dealer for pre-owned Rolex, Patek Philippe, Audemars Piguet, Omega & Cartier watches. Buy, sell, or trade with confidence. 5-star rated.",
  },
  "toronto-luxury-watches": {
    name: "Toronto",
    slug: "toronto-luxury-watches",
    city: "Toronto",
    province: "Ontario",
    phone: "(416) 555-0456",
    email: "toronto@calgaryetz.com",
    description:
      "Calgary ETZ brings trusted luxury watch buying and selling services to Toronto and the Greater Toronto Area.",
    seoContent: `Calgary ETZ now serves Toronto and the Greater Toronto Area, bringing our reputation for authenticity and fair dealing to Ontario's largest city. We specialize in pre-owned luxury watches from brands including Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier, and IWC.

Toronto collectors can expect the same high standards that have made Calgary ETZ a trusted name in Western Canada. Every watch is authenticated by experienced professionals, and we provide detailed condition reports for complete transparency.

We work with clients across the GTA including Mississauga, Brampton, Markham, Vaughan, Richmond Hill, and Oakville. Whether you're buying your first Submariner or selling a vintage Daytona, our team is ready to assist.

Our commitment to fair pricing means we research current market values to ensure competitive offers on watches we purchase and reasonable prices on watches we sell. Contact us today to discuss your luxury watch needs in Toronto.`,
    metaTitle: "Luxury Watches Toronto | Buy & Sell Rolex, Patek Philippe, Audemars Piguet | Calgary ETZ",
    metaDescription:
      "Toronto's source for authenticated pre-owned Rolex, Patek Philippe, Audemars Piguet & more. Buy, sell, or trade luxury watches with Calgary ETZ.",
  },
  "edmonton-luxury-watches": {
    name: "Edmonton",
    slug: "edmonton-luxury-watches",
    city: "Edmonton",
    province: "Alberta",
    phone: "(780) 555-0789",
    email: "edmonton@calgaryetz.com",
    description:
      "Calgary ETZ serves Edmonton and Northern Alberta with trusted luxury watch buying and selling services.",
    seoContent: `Edmonton and Northern Alberta collectors now have access to Calgary ETZ's trusted luxury watch services. We buy, sell, and trade pre-owned timepieces from prestigious brands including Rolex, Patek Philippe, Audemars Piguet, Omega, and Breitling.

Our Edmonton services extend throughout the capital region including St. Albert, Sherwood Park, Spruce Grove, Leduc, and Fort Saskatchewan. We also serve collectors in Northern Alberta communities including Fort McMurray, Grande Prairie, and Red Deer.

Every transaction with Calgary ETZ is built on a foundation of honesty and transparency. We provide fair market valuations for watches you wish to sell and authenticate every timepiece we offer for sale. Our goal is to make buying and selling luxury watches as straightforward as possible.

With a proven track record of successful transactions and satisfied customers across Alberta, Calgary ETZ has become a trusted name in the pre-owned luxury watch market. Contact our Edmonton team to discuss buying or selling your next timepiece.`,
    metaTitle: "Luxury Watches Edmonton | Buy & Sell Rolex, Patek Philippe, Audemars Piguet | Calgary ETZ",
    metaDescription:
      "Edmonton's trusted source for pre-owned Rolex, Patek Philippe, Audemars Piguet & Omega watches. Buy, sell, or trade with Calgary ETZ. Serving Northern Alberta.",
  },
  "kelowna-luxury-watches": {
    name: "Kelowna",
    slug: "kelowna-luxury-watches",
    city: "Kelowna",
    province: "British Columbia",
    phone: "(250) 555-0321",
    email: "kelowna@calgaryetz.com",
    description:
      "Calgary ETZ serves Kelowna and the Okanagan Valley with authenticated luxury watch buying and selling.",
    seoContent: `The Okanagan Valley now has access to Calgary ETZ's trusted luxury watch services. Based in Kelowna, we serve collectors throughout British Columbia's interior including Vernon, Penticton, Kamloops, and the surrounding wine country communities.

We specialize in pre-owned luxury timepieces from the world's most respected brands: Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier, and Tag Heuer. Whether you're a long-time collector or purchasing your first luxury watch, our team provides knowledgeable guidance and fair pricing.

Calgary ETZ's authentication process ensures every watch we sell meets our standards for condition and originality. When you sell to us, you receive a competitive offer based on current market values and the specific condition of your timepiece.

Our Kelowna services make it convenient for Okanagan residents to buy and sell luxury watches without traveling to Vancouver. Contact us today to learn more about our inventory or to receive a quote on your watch.`,
    metaTitle: "Luxury Watches Kelowna | Buy & Sell Rolex, Patek Philippe, Audemars Piguet | Calgary ETZ",
    metaDescription:
      "Kelowna and Okanagan Valley's source for pre-owned Rolex, Patek Philippe, Audemars Piguet watches. Buy, sell, or trade with Calgary ETZ.",
  },
  "montreal-luxury-watches": {
    name: "Montreal",
    slug: "montreal-luxury-watches",
    city: "Montreal",
    province: "Quebec",
    phone: "(514) 555-1000",
    email: "montreal@calgaryetz.com",
    description:
      "Calgary ETZ brings trusted luxury watch services to Montreal and Quebec, offering authentication and fair pricing.",
    seoContent: `Montreal collectors can now access Calgary ETZ's trusted luxury watch buying and selling services. We bring the same commitment to authenticity and fair dealing that has built our reputation in Western Canada to Quebec's largest city.

Our Montreal services cover the Greater Montreal Area including Laval, Longueuil, Brossard, and the West Island communities. We specialize in prestigious Swiss timepieces from Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier, and Vacheron Constantin.

Montreal has a rich tradition of watch collecting, and Calgary ETZ is proud to serve this community. Whether you're looking to acquire a classic Datejust, a sporty Submariner, or a complicated Patek Philippe, our team can help you find the right timepiece at a fair price.

We also purchase watches from Montreal collectors, offering competitive quotes based on current market conditions. Every transaction is handled professionally, with clear communication and no hidden fees. Contact Calgary ETZ Montreal to discuss your luxury watch needs.`,
    metaTitle: "Luxury Watches Montreal | Buy & Sell Rolex, Patek Philippe, Audemars Piguet | Calgary ETZ",
    metaDescription:
      "Montreal's trusted dealer for pre-owned Rolex, Patek Philippe, Audemars Piguet & Omega watches. Buy, sell, or trade with Calgary ETZ. Serving Greater Montreal.",
  },
  "winnipeg-luxury-watches": {
    name: "Winnipeg",
    slug: "winnipeg-luxury-watches",
    city: "Winnipeg",
    province: "Manitoba",
    phone: "(204) 555-0555",
    email: "winnipeg@calgaryetz.com",
    description:
      "Calgary ETZ serves Winnipeg and Manitoba with authenticated luxury watch buying, selling, and trading services.",
    seoContent: `Winnipeg and Manitoba collectors now have local access to Calgary ETZ's trusted luxury watch services. We buy, sell, and trade pre-owned timepieces from the world's most respected watchmakers including Rolex, Patek Philippe, Audemars Piguet, Omega, and Breitling.

Our Winnipeg services extend throughout Manitoba, serving collectors in Brandon, Steinbach, and communities across the prairies. We understand the prairie market and work to make luxury watch transactions as convenient as possible for our Manitoba clients.

Calgary ETZ has built its reputation on straightforward dealing and authentic products. Every watch we sell is thoroughly inspected and authenticated. When you sell to us, you receive a fair offer based on the current market value of your timepiece.

Whether you're celebrating a milestone with a new watch or looking to sell a piece from your collection, Calgary ETZ Winnipeg is here to help. Contact us today for a no-obligation quote or to inquire about our current inventory.`,
    metaTitle: "Luxury Watches Winnipeg | Buy & Sell Rolex, Patek Philippe, Audemars Piguet | Calgary ETZ",
    metaDescription:
      "Winnipeg's trusted source for pre-owned Rolex, Patek Philippe, Audemars Piguet & Omega watches. Buy, sell, or trade with Calgary ETZ. Serving all of Manitoba.",
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