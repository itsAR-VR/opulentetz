import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Check, Phone, Mail, Shield, Award, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { WatchGallery } from "@/components/watch-gallery"
import { buildStandardProductDescription, buildStandardProductDescriptionInline, formatCadPrice } from "@/lib/formatters"
import { prisma } from "@/lib/prisma"
import type { Metadata } from "next"

async function getWatch(slug: string) {
  const watch = await prisma.inventory.findFirst({
    where: { slug, visibility: "PUBLIC" },
  })

  if (!watch) return null

  return {
    ...watch,
    price: watch.price.toNumber(),
    createdAt: watch.createdAt.toISOString(),
    updatedAt: watch.updatedAt.toISOString(),
  }
}

async function getRelatedWatches(brand: string, excludeSlug: string) {
  const watches = await prisma.inventory.findMany({
    where: {
      brand,
      slug: { not: excludeSlug },
      status: { not: "Sold" },
      visibility: "PUBLIC",
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  })

  return watches.map((w) => ({
    ...w,
    price: w.price.toNumber(),
    createdAt: w.createdAt.toISOString(),
    updatedAt: w.updatedAt.toISOString(),
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const watch = await getWatch(slug)

  if (!watch) {
    return {
      title: "Watch Not Found | Exclusive Time Zone",
    }
  }

  const title = `${watch.brand} ${watch.model} ${watch.reference} | Exclusive Time Zone`
  const description = buildStandardProductDescriptionInline({
    year: watch.year,
    reference: watch.reference,
    condition: watch.condition,
    boxAndPapers: watch.boxAndPapers,
  })

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: watch.images[0] ? [watch.images[0]] : [],
    },
  }
}

export default async function WatchDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const watch = await getWatch(slug)

  if (!watch) {
    notFound()
  }

  const relatedWatches = await getRelatedWatches(watch.brand, slug)

  const publicStatus = watch.status === "Sold" ? "Sold" : "Available"

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/inventory"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-gold transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <WatchGallery
            images={watch.images}
            alt={`${watch.brand} ${watch.model}`}
            status={publicStatus}
            statusLabel={publicStatus}
            boxAndPapers={watch.boxAndPapers}
          />

          {/* Watch Details */}
          <div className="space-y-6">
            {/* Brand & Model */}
            <div>
              <p className="text-gold uppercase tracking-[0.2em] text-sm font-medium mb-2">
                {watch.brand}
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold">{watch.model}</h1>
              <p className="text-muted-foreground mt-2">Reference: {watch.reference}</p>
            </div>

            {/* Price */}
            <div className="border-y border-border py-6">
              <p className="text-sm text-muted-foreground mb-1">Price</p>
              <p className="font-serif text-4xl font-bold text-gold">
                {formatCadPrice(watch.price)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                All pricing in CAD • Price includes authentication & service
              </p>
            </div>

            {/* Key Specs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Year</p>
                <p className="font-medium text-lg">{watch.year}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Condition</p>
                <p className="font-medium text-lg">{watch.condition}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Set</p>
                <p className="font-medium text-lg flex items-center gap-2">
                  {watch.boxAndPapers ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      Complete Set w/ Box and Papers
                    </>
                  ) : (
                    "Watch Only"
                  )}
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium text-lg">{publicStatus}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-serif text-xl font-medium mb-3">Description</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {buildStandardProductDescription({
                  year: watch.year,
                  reference: watch.reference,
                  condition: watch.condition,
                  boxAndPapers: watch.boxAndPapers,
                })}
              </p>
            </div>

            {/* Contact CTAs */}
            <div className="space-y-3 pt-4">
              <Button
                asChild
                size="lg"
                className="w-full bg-gold hover:bg-gold/90 text-black font-medium"
              >
                <a href="tel:236-334-3434">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now: 236-334-3434
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full">
                <a href={`mailto:info@exclusivetimezone.com?subject=Inquiry: ${watch.brand} ${watch.model} (${watch.reference})`}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email About This Watch
                </a>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="flex flex-col items-center text-center">
                <Shield className="h-6 w-6 text-gold mb-2" />
                <p className="text-xs font-medium">100% Authentic</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Award className="h-6 w-6 text-gold mb-2" />
                <p className="text-xs font-medium">Expert Verified</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Clock className="h-6 w-6 text-gold mb-2" />
                <p className="text-xs font-medium">2-Year Warranty</p>
              </div>
            </div>
          </div>
        </div>

        {/* Locations Section */}
        <section className="mt-16 py-12 bg-muted/30 rounded-lg">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="font-serif text-2xl font-medium text-center mb-8">
              Visit Our Showrooms
            </h2>
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              <div>
                <h3 className="font-medium mb-2">Vancouver</h3>
                <p className="text-sm text-muted-foreground mb-1">
                  943 W Broadway, Unit 110
                </p>
                <p className="text-sm text-muted-foreground mb-2">Vancouver, BC V5Z 4E1</p>
                <a href="tel:236-833-3952" className="text-gold text-sm hover:underline">
                  236-833-3952
                </a>
              </div>
              <div>
                <h3 className="font-medium mb-2">Calgary</h3>
                <p className="text-sm text-muted-foreground mb-1">
                  2120 4th Street SW, Unit 210
                </p>
                <p className="text-sm text-muted-foreground mb-2">Calgary, AB T2S 1W7</p>
                <a href="tel:403-703-6671" className="text-gold text-sm hover:underline">
                  403-703-6671
                </a>
              </div>
              <div>
                <h3 className="font-medium mb-2">Toronto</h3>
                <p className="text-sm text-muted-foreground mb-1">25 Sheppard Ave W</p>
                <p className="text-sm text-muted-foreground mb-2">North York, ON M2N 6S6</p>
                <a href="tel:416-298-8666" className="text-gold text-sm hover:underline">
                  416-298-8666
                </a>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-6">
              All locations by appointment only
            </p>
          </div>
        </section>

        {/* Related Watches */}
        {relatedWatches.length > 0 && (
          <section className="mt-16">
            <h2 className="font-serif text-2xl font-medium mb-8">
              More {watch.brand} Watches
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedWatches.map((relatedWatch) => (
                <Link
                  key={relatedWatch.id}
                  href={`/inventory/${relatedWatch.slug}`}
                  className="group"
                >
                  <Card className="overflow-hidden border-border hover:border-gold/50 transition-colors">
                    <div className="relative aspect-square bg-muted overflow-hidden">
                      <Image
                        src={relatedWatch.images[0] || "/placeholder.svg"}
                        alt={`${relatedWatch.brand} ${relatedWatch.model}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        {relatedWatch.brand}
                      </p>
                      <h3 className="font-serif text-lg font-medium mt-1 group-hover:text-gold transition-colors">
                        {relatedWatch.model}
                      </h3>
                      <p className="font-medium mt-2">{formatCadPrice(relatedWatch.price)}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
