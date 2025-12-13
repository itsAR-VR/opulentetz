import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Award, Users, Clock } from "lucide-react"

export const metadata = {
  title: "About Us | Calgary ETZ - Trusted Luxury Watch Dealer",
  description:
    "Learn about Calgary ETZ, Canada's trusted source for pre-owned luxury watches. Exceptional service and competitive pricing.",
}

const values = [
  {
    icon: Shield,
    title: "Authenticity Guaranteed",
    description: "Every timepiece is thoroughly inspected and authenticated by certified watchmakers.",
  },
  {
    icon: Award,
    title: "5-Star Reputation",
    description: "Over 500+ five-star reviews on Facebook Marketplace. Our reputation speaks for itself.",
  },
  {
    icon: Users,
    title: "Personal Service",
    description: "We take the time to understand your needs and find the perfect watch for you.",
  },
  {
    icon: Clock,
    title: "Horological Expertise",
    description: "Years of experience in luxury watches, from Rolex to Patek Philippe.",
  },
]

const milestones = [
  { year: "2018", event: "Founded in Calgary with a passion for timepieces" },
  { year: "2020", event: "Expanded to serve customers across Canada" },
  { year: "2022", event: "Reached 500+ five-star reviews on Facebook Marketplace" },
  { year: "2024", event: "Opened service locations in major Canadian cities" },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-black via-[#0a0b0d] to-background text-white py-16 lg:py-24">
        <div
          className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,#d4af37,transparent_25%),radial-gradient(circle_at_80%_0%,#d4af37,transparent_22%),radial-gradient(circle_at_60%_60%,#ffffff,transparent_20%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.25em] text-gold/80">Calgary ETZ</p>
            <h1 className="font-serif text-4xl md:text-5xl font-medium">About Us</h1>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Concierge-level service, meticulous authentication, and a curated selection of luxury timepieces trusted by collectors across Canada.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {["Founder-led concierge", "500+ five-star reviews", "Canada-wide sourcing"].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-100 backdrop-blur"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Profile */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-medium text-gold mb-6">Company Profile</h2>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">Calgary ETZ</strong> was founded on a profound admiration for luxury
                timepieces. With access to a vast network of global wholesalers, authorized dealers, and secondary market
                specialists, we offer our clients an unrivaled selection of exquisite watches, paired with exceptional
                service and competitive pricing.
              </p>
              <p>
                At <strong className="text-foreground">Calgary ETZ</strong>, our mission is to be the trusted destination
                for buying, selling, or trading both new and pre-owned luxury watches. We are dedicated to providing a
                positive, transparent, and secure experience for every client.
              </p>
              <p>
                Each timepiece in our collection is meticulously inspected and authenticated by expert watchmakers, and
                when necessary, carefully serviced and restored to meet our stringent quality standards. <strong className="text-foreground">Calgary ETZ</strong>
                guarantees the complete authenticity of all products upon delivery and recommends that all watches be exclusively serviced by the manufacturer's approved watchmakers.
              </p>
            </div>

            <div className="rounded-2xl border border-gold/30 bg-gold/5 p-6 shadow-lg shadow-gold/10">
              <h3 className="font-serif text-xl text-foreground mb-3">Why clients choose us</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-gold" />
                  <span>Concierge sourcing for rare and discontinued references.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-gold" />
                  <span>Independent authentication and servicing by certified watchmakers.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-gold" />
                  <span>White-glove shipping with insurance and discreet packaging.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-gold" />
                  <span>Transparent pricing and trade-in guidance for your collection.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
            <h2 className="font-serif text-2xl font-medium text-gold">Values we uphold</h2>
            <p className="text-muted-foreground max-w-2xl">
              Every interaction is guided by the same principles that built our reputation: integrity, precision, and personalized service.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon

              return (
                <div
                  key={value.title}
                  className="group rounded-2xl border border-border bg-card/70 p-5 shadow-sm transition hover:-translate-y-1 hover:border-gold/70 hover:shadow-lg hover:shadow-gold/10"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="rounded-full bg-gold/15 p-2 text-gold">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className="font-medium text-foreground">{value.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-medium text-gold mb-8">Our journey</h2>
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className="relative rounded-2xl border border-border/80 bg-card/70 p-6 shadow-sm">
                {index !== milestones.length - 1 && (
                  <div className="absolute left-6 top-[calc(100%+8px)] h-8 w-px bg-border" aria-hidden />
                )}
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold font-semibold">
                    {milestone.year}
                  </div>
                  <p className="text-muted-foreground">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-20 bg-muted/40">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-card/70 p-8 shadow-lg shadow-black/5">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                <h2 className="font-serif text-2xl font-medium text-gold">Contact Us</h2>
                <p className="text-muted-foreground">
                  Whether you're searching for a grail watch or ready to trade in a piece from your collection, our team is ready to assist.
                </p>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Call or Text:</strong> Monday to Friday 10AM - 6PM, Saturday 11AM -
                    4PM MST at{" "}
                    <a href="tel:+14035550123" className="text-gold hover:underline">
                      (403) 555-0123
                    </a>
                  </p>
                  <p>
                    <strong className="text-foreground">Email:</strong>{" "}
                    <a href="mailto:info@calgaryetz.com" className="text-gold hover:underline">
                      info@calgaryetz.com
                    </a>
                  </p>
                  <p>
                    <strong className="text-foreground">Facebook:</strong>{" "}
                    <a
                      href="https://www.facebook.com/marketplace/profile/100082510053081"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:underline"
                    >
                      View our 500+ Five-Star Reviews
                    </a>
                  </p>
                  <p className="pt-2">In-store presentation available by appointment only.</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 bg-gradient-to-br from-gold/15 via-card to-card rounded-2xl p-6 border border-gold/30">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-gold/90">Ready when you are</p>
                  <h3 className="font-serif text-xl text-foreground">Book a consultation</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Share what you're looking for and we'll curate options with transparent pricing and timelines.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild className="bg-gold hover:bg-gold/90 text-black font-medium">
                    <Link href="/inventory">Browse Inventory</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/sell">Sell Your Watch</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
