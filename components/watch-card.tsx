import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatCadPrice } from "@/lib/formatters"
import type { InventoryItem } from "@/lib/types/inventory"

type WatchCardData = Pick<
  InventoryItem,
  "id" | "brand" | "model" | "reference" | "year" | "condition" | "price" | "status" | "boxAndPapers" | "images" | "slug"
> &
  Partial<Pick<InventoryItem, "description" | "featured" | "externalId" | "sourceUrl" | "createdAt" | "updatedAt">>

interface WatchCardProps {
  watch: WatchCardData
}

export function WatchCard({ watch }: WatchCardProps) {
  const getStatusBadge = () => {
    if (watch.status === "Pending") {
      return <Badge className="absolute top-3 left-3 bg-yellow-500 text-black text-xs">Pending Sale</Badge>
    }
    if (watch.status === "Sold") {
      return <Badge className="absolute top-3 left-3 bg-red-600 text-white text-xs">Sold</Badge>
    }
    return null
  }

  return (
    <Link href={`/inventory/${watch.slug}`} className="group">
      <Card className="overflow-hidden border-border hover:border-gold/50 transition-colors duration-300">
        <div className="relative aspect-square bg-muted overflow-hidden">
          <Image
            src={watch.images[0] || "/placeholder.svg"}
            alt={`${watch.brand} ${watch.model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {getStatusBadge()}
          {watch.boxAndPapers && (
            <Badge className="absolute top-3 right-3 bg-gold text-black text-xs">Complete Set</Badge>
          )}
        </div>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{watch.brand}</p>
          <h3 className="font-serif text-lg font-medium mt-1 group-hover:text-gold transition-colors">{watch.model}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Ref. {watch.reference} • {watch.year}
          </p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <span className="font-medium text-lg">{formatCadPrice(watch.price)}</span>
            <Badge variant="secondary" className="text-xs">
              {watch.condition}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
