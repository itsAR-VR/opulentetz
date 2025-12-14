import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Shield, Award, RefreshCw, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HomeInventory } from "@/components/home-inventory"
import { getInventory } from "@/lib/actions"

const valueProps = [
  {
    icon: Shield,
    title: "100% Authenticated",
    description: "Every timepiece undergoes rigorous verification by our certified watchmakers.",
  },
  {
    icon: Award,
    title: "Premium Selection",
    description: "Curated collection of the world's most prestigious luxury watch brands.",
  },
  {
    icon: RefreshCw,
    title: "Trade-In Program",
    description: "Upgrade your collection with our competitive trade-in valuations.",
  },
  {
    icon: Clock,
    title: "Warranty Included",
    description: "All watches come with our comprehensive 2-year service warranty.",
  },
]

export default async function HomePage() {
  const inventory = await getInventory()

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center bg-black text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/luxury-watch-collection-dark-elegant-background.jpg"
            alt="Luxury watch collection"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            <p className="text-gold uppercase tracking-[0.3em] text-sm font-medium mb-4">Established Excellence</p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-balance">
              Exceptional Timepieces, <span className="text-gold">Uncompromising Standards</span>
            </h1>
            <p className="mt-6 text-lg text-gray-300 leading-relaxed max-w-xl">
              Discover our curated collection of authenticated pre-owned luxury watches. From Rolex to Patek Philippe,
              each piece tells a story of craftsmanship and heritage — including Audemars Piguet, Omega, Cartier, and Tudor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button asChild size="lg" className="bg-gold hover:bg-gold/90 text-black font-medium">
                <Link href="/inventory">
                  Browse Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black bg-transparent"
              >
                <Link href="/sell">Sell Your Watch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valueProps.map((prop) => (
              <div key={prop.title} className="flex flex-col items-center text-center">
                <div className="h-14 w-14 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                  <prop.icon className="h-6 w-6 text-gold" />
                </div>
                <h3 className="font-serif text-lg font-medium">{prop.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{prop.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inventory */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <p className="text-gold uppercase tracking-[0.2em] text-sm font-medium mb-2">Inventory</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold">Available Watches</h2>
              <p className="text-muted-foreground mt-2">Browse our current inventory of authenticated luxury watches.</p>
            </div>
          </div>
          <HomeInventory watches={inventory} />
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
                  src="/luxury-watch-being-examined-by-expert-jeweler.jpg"
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
