import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Award, Users, Clock } from "lucide-react"

export const metadata = {
  title: "About Us | Exclusive Time Zone (ETZ)",
  description:
    "Learn about Exclusive Time Zone (ETZ), Canada's trusted destination for luxury watch buying, selling, consignment, and trade-ups.",
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
      <section className="relative py-20 bg-black text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero_images/039A8880 2.png"
            alt="Luxury watch workshop"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-medium mb-4">About Us</h1>
          <p className="text-gray-400">Your trusted destination for luxury timepieces</p>
        </div>
      </section>

      {/* Company Profile */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-medium text-gold mb-6">Company Profile</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              <strong className="text-foreground">Exclusive Time Zone (ETZ)</strong> was founded on a profound admiration
              for luxury timepieces. With access to a vast network of global wholesalers, authorized dealers, and
              secondary market specialists, we offer our clients an unrivaled selection of exquisite watches, paired
              with exceptional service and competitive pricing.
            </p>
            <p>
              At <strong className="text-foreground">ETZ</strong>, our mission is to be the trusted destination for
              buying, selling, consigning, and trading luxury watches. We are dedicated to providing a positive,
              transparent, and secure experience for every client.
            </p>
            <p>
              Each timepiece in our collection is meticulously inspected and authenticated by expert watchmakers, and
              when necessary, carefully serviced and restored to meet our stringent quality standards.{" "}
              <strong className="text-foreground">ETZ</strong> guarantees the complete authenticity of all products upon
              delivery and recommends that all watches be exclusively serviced by the manufacturer's approved
              watchmakers.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-20 bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-medium text-gold mb-6">Contact Us</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              <strong className="text-foreground">Call or Text:</strong> Monday to Friday 10AM - 6PM, Saturday 11AM -
              4PM MST at{" "}
              <a href="tel:236-334-3434" className="text-gold hover:underline">
                236-334-3434
              </a>
            </p>
            <p>
              <strong className="text-foreground">Email:</strong>{" "}
              <a href="mailto:info@exclusivetimezone.com" className="text-gold hover:underline">
                info@exclusivetimezone.com
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

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button asChild className="bg-gold hover:bg-gold/90 text-black font-medium">
              <Link href="/inventory">Browse Inventory</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/sell">Sell Your Watch</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
