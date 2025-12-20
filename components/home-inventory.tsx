"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { WatchCard } from "@/components/watch-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { InventoryItem } from "@/lib/types/inventory"

interface HomeInventoryProps {
  watches: InventoryItem[]
}

export function HomeInventory({ watches }: HomeInventoryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [brandFilter, setBrandFilter] = useState<string>("all")
  const [visibleCount, setVisibleCount] = useState(12)

  const availableWatches = useMemo(() => watches.filter((w) => w.status !== "Sold"), [watches])

  const brandOptions = useMemo(() => {
    const unique = new Set(availableWatches.map((w) => w.brand))
    return ["all", ...Array.from(unique).sort()]
  }, [availableWatches])

  const filteredWatches = useMemo(() => {
    return availableWatches.filter((watch) => {
      const matchesSearch =
        searchQuery === "" ||
        watch.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        watch.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        watch.reference.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesBrand = brandFilter === "all" || watch.brand === brandFilter

      return matchesSearch && matchesBrand
    })
  }, [availableWatches, brandFilter, searchQuery])

  const visibleWatches = filteredWatches.slice(0, visibleCount)

  const canLoadMore = visibleCount < filteredWatches.length

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by brand, model, or reference..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setVisibleCount(12)
            }}
            className="pl-10"
          />
        </div>

        <Select
          value={brandFilter}
          onValueChange={(value) => {
            setBrandFilter(value)
            setVisibleCount(12)
          }}
        >
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Filter by brand" />
          </SelectTrigger>
          <SelectContent>
            {brandOptions.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand === "all" ? "All Brands" : brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Showing {visibleWatches.length} of {filteredWatches.length} available watches • All prices in CAD
      </p>

      {visibleWatches.length > 0 ? (
        <>
          <div
            className="-mx-4 flex gap-6 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0"
            aria-label="Available watches"
          >
            {visibleWatches.map((watch) => (
              <div key={watch.id} className="shrink-0 w-[260px] sm:w-[280px] lg:w-[300px]">
                <WatchCard watch={watch} />
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
            {canLoadMore && (
              <Button variant="outline" onClick={() => setVisibleCount((c) => c + 12)} className="bg-transparent">
                Load More
              </Button>
            )}
            <Button asChild className="bg-gold hover:bg-gold/90 text-black font-medium">
              <Link href="/inventory">View Full Inventory</Link>
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg font-medium">No watches found</p>
          <p className="text-muted-foreground mt-2">Try adjusting your search or brand filter.</p>
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              className="bg-transparent"
              onClick={() => {
                setSearchQuery("")
                setBrandFilter("all")
                setVisibleCount(12)
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
