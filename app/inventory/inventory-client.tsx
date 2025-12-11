"use client"

import { useEffect, useMemo, useState } from "react"
import { Filter, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { WatchCard } from "@/components/watch-card"
import type { InventoryItem } from "@/lib/types/inventory"

interface InventoryClientProps {
  watches: InventoryItem[]
}

export default function InventoryClient({ watches }: InventoryClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const maxPrice = useMemo(() => {
    if (!watches.length) return 200000
    return Math.max(...watches.map((w) => w.price))
  }, [watches])

  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice])

  useEffect(() => {
    setPriceRange([0, maxPrice])
  }, [maxPrice])

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

      const matchesPrice = watch.price >= priceRange[0] && watch.price <= priceRange[1]

      return matchesSearch && matchesBrand && matchesCondition && matchesPrice
    })
  }, [searchQuery, selectedBrands, selectedConditions, priceRange, watches])

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
    setPriceRange([0, maxPrice])
  }

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedBrands.length > 0 ||
    selectedConditions.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < maxPrice

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Brands */}
      <div>
        <h3 className="font-medium mb-4">Brands</h3>
        <div className="space-y-3">
          {brandOptions.map((brand) => (
            <div key={brand} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
              />
              <Label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div>
        <h3 className="font-medium mb-4">Condition</h3>
        <div className="space-y-3">
          {conditionOptions.map((condition) => (
            <div key={condition} className="flex items-center gap-2">
              <Checkbox
                id={`condition-${condition}`}
                checked={selectedConditions.includes(condition)}
                onCheckedChange={() => toggleCondition(condition)}
              />
              <Label htmlFor={`condition-${condition}`} className="text-sm cursor-pointer">
                {condition}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-medium mb-4">Price Range</h3>
        <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={maxPrice} step={1000} className="mb-4" />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
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
      <section className="bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Our Collection</h1>
          <p className="text-muted-foreground mt-2">Explore our curated selection of authenticated luxury timepieces</p>
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
                      <span className="ml-2 h-5 w-5 rounded-full bg-gold text-black text-xs flex items-center justify-center">
                        !
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
