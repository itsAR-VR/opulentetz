"use client"

import { useEffect, useMemo, useState } from "react"
import { Filter, X, Search } from "lucide-react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { WatchCard } from "@/components/watch-card"
import type { InventoryItem } from "@/lib/types/inventory"

interface InventoryClientProps {
  watches: InventoryItem[]
}

export default function InventoryClient({ watches }: InventoryClientProps) {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  useEffect(() => {
    const brandParams = Array.from(new Set(searchParams.getAll("brand").filter(Boolean)))
    const conditionParams = Array.from(new Set(searchParams.getAll("condition").filter(Boolean)))
    const qParam = searchParams.get("q") ?? ""

    setSelectedBrands(brandParams)
    setSelectedConditions(conditionParams)
    setSearchQuery(qParam)
  }, [searchParams])

  const brandOptions = useMemo(() => {
    const unique = new Set(watches.map((w) => w.brand))
    return Array.from(unique).sort()
  }, [watches])

  const conditionOptions = useMemo(() => {
    const unique = new Set(watches.map((w) => w.condition))
    return Array.from(unique).sort()
  }, [watches])

  const filteredWatches = useMemo(() => {
    return watches.filter((watch) => {
      const matchesSearch =
        searchQuery === "" ||
        watch.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        watch.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        watch.reference.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(watch.brand)

      const matchesCondition = selectedConditions.length === 0 || selectedConditions.includes(watch.condition)

      return matchesSearch && matchesBrand && matchesCondition
    })
  }, [searchQuery, selectedBrands, selectedConditions, watches])

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))
  }

  const toggleCondition = (condition: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition],
    )
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedBrands([])
    setSelectedConditions([])
  }

  const hasActiveFilters = searchQuery !== "" || selectedBrands.length > 0 || selectedConditions.length > 0

  const activeFiltersCount = (searchQuery ? 1 : 0) + selectedBrands.length + selectedConditions.length

  const toInputId = (prefix: string, value: string) =>
    `${prefix}-${value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Brands */}
      <div>
        <h3 className="font-medium mb-4">Brands</h3>
        <div className="space-y-3">
          {brandOptions.map((brand) => {
            const id = toInputId("brand", brand)
            return (
              <div key={brand} className="flex items-center gap-2">
                <Checkbox id={id} checked={selectedBrands.includes(brand)} onCheckedChange={() => toggleBrand(brand)} />
                <Label htmlFor={id} className="text-sm cursor-pointer">
                  {brand}
                </Label>
              </div>
            )
          })}
        </div>
      </div>

      {/* Condition */}
      <div>
        <h3 className="font-medium mb-4">Condition</h3>
        <div className="space-y-3">
          {conditionOptions.map((condition) => {
            const id = toInputId("condition", condition)
            return (
              <div key={condition} className="flex items-center gap-2">
                <Checkbox
                  id={id}
                  checked={selectedConditions.includes(condition)}
                  onCheckedChange={() => toggleCondition(condition)}
                />
                <Label htmlFor={id} className="text-sm cursor-pointer">
                  {condition}
                </Label>
              </div>
            )
          })}
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
          Clear All Filters
        </Button>
      )}
    </div>
  )

  return (
      <div>
        {/* Page Header */}
      <section className="relative py-16 bg-black text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero_images/039A9088 2.png"
            alt="Luxury watch inventory"
            fill
            className="object-cover opacity-35"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Our Collection</h1>
          <p className="text-gray-300 mt-2 max-w-2xl">
            Explore our curated selection of authenticated luxury timepieces. All prices shown in CAD.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28">
              <h2 className="font-serif text-xl font-medium mb-6">Filters</h2>
              <FilterContent />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Mobile Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by brand, model, or reference..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden bg-transparent">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {hasActiveFilters && (
                      <span className="ml-2 h-5 min-w-5 px-1 rounded-full bg-gold text-black text-xs flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {searchQuery !== "" && (
                  <Button variant="secondary" size="sm" onClick={() => setSearchQuery("")} className="h-7 text-xs">
                    “{searchQuery}”
                    <X className="ml-1 h-3 w-3" />
                  </Button>
                )}
                {selectedBrands.map((brand) => (
                  <Button
                    key={brand}
                    variant="secondary"
                    size="sm"
                    onClick={() => toggleBrand(brand)}
                    className="h-7 text-xs"
                  >
                    {brand}
                    <X className="ml-1 h-3 w-3" />
                  </Button>
                ))}
                {selectedConditions.map((condition) => (
                  <Button
                    key={condition}
                    variant="secondary"
                    size="sm"
                    onClick={() => toggleCondition(condition)}
                    className="h-7 text-xs"
                  >
                    {condition}
                    <X className="ml-1 h-3 w-3" />
                  </Button>
                ))}
              </div>
            )}

            {/* Results Count */}
            <p className="text-sm text-muted-foreground mb-6">
              Showing {filteredWatches.length} of {watches.length} timepieces
            </p>

            {/* Watch Grid */}
            {filteredWatches.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredWatches.map((watch) => (
                  <WatchCard key={watch.id} watch={watch} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-lg font-medium">No watches found</p>
                <p className="text-muted-foreground mt-2">Try adjusting your filters</p>
                <Button variant="outline" onClick={clearFilters} className="mt-4 bg-transparent">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Sourcing Banner */}
        <div className="mt-16 bg-muted rounded-lg p-8 text-center">
          <h3 className="font-serif text-2xl font-medium">Cannot Find What You are Looking For?</h3>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Our network of trusted sources can help you find that specific timepiece. Let us know what you are searching
            for and we will do the rest.
          </p>
          <Button asChild className="mt-6 bg-gold hover:bg-gold/90 text-black">
            <a href="mailto:sourcing@opulentz.com">Request a Watch</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
