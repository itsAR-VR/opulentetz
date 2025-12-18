"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import {
  adminLogin,
  adminLogout,
  importJsonAction,
  createInventoryAction,
  updateInventoryAction,
  updateSellRequestStatus,
  publishInventoryAction,
  unpublishInventoryAction,
  publishAllDraftInventoryAction,
  uploadInventoryImagesAction,
} from "./actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { WatchGallery } from "@/components/watch-gallery"
import { cn } from "@/lib/utils"
import { formatCadPrice } from "@/lib/formatters"
import { Mail, Phone, Clock, Package, User } from "lucide-react"

interface SellRequest {
  id: string
  createdAt: string
  brand: string
  model: string
  expectedPrice: string | null
  condition: string
  boxAndPapers: boolean
  imagesUrl: string | null
  contactInfo: unknown
  status: string
}

interface Inquiry {
  id: string
  createdAt: string
  name: string
  email: string
  phone: string | null
  type: string
  message: string | null
  watchId: string | null
  watch: {
    brand: string
    model: string
    slug: string
  } | null
}

interface InventoryItem {
  id: string
  createdAt: string
  updatedAt: string
  brand: string
  model: string
  reference: string
  year: number
  condition: string
  price: number
  status: string
  boxAndPapers: boolean
  description: string
  images: string[]
  tags: string[]
  slug: string
  featured: boolean
  externalId: string | null
  sourceUrl: string | null
  visibility: "PUBLIC" | "PRIVATE"
  inquiriesCount: number
}

interface Props {
  sessionEmail: string | null
  sellRequests: SellRequest[]
  inquiries: Inquiry[]
  inventory: InventoryItem[]
}

type InventoryDraft = {
  id: string
  brand: string
  model: string
  reference: string
  year: string
  condition: string
  price: string
  status: string
  visibility: "PUBLIC" | "PRIVATE"
  tags: string
  images: string
  description: string
  slug: string
  featured: boolean
  boxAndPapers: boolean
  externalId: string
  sourceUrl: string
}

export default function AdminDashboardClient({ sessionEmail, sellRequests, inquiries, inventory }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [loginError, setLoginError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isDraggingImages, setIsDraggingImages] = useState(false)
  const [inventorySearch, setInventorySearch] = useState("")
  const [inventoryBrandFilter, setInventoryBrandFilter] = useState("all")
  const [inventoryStatusFilter, setInventoryStatusFilter] = useState("all")
  const [inventoryVisibilityFilter, setInventoryVisibilityFilter] = useState("all")
  const [selectedInventoryId, setSelectedInventoryId] = useState<string | null>(inventory[0]?.id ?? null)
  const [inventoryDraft, setInventoryDraft] = useState<InventoryDraft | null>(null)
  const imageUploadInputRef = useRef<HTMLInputElement | null>(null)

  const brandOptions = useMemo(() => {
    const unique = new Set(inventory.map((item) => item.brand).filter(Boolean))
    return ["all", ...Array.from(unique).sort()]
  }, [inventory])

  const filteredInventory = useMemo(() => {
    const q = inventorySearch.trim().toLowerCase()

    return inventory.filter((item) => {
      const matchesSearch =
        q.length === 0 ||
        item.brand.toLowerCase().includes(q) ||
        item.model.toLowerCase().includes(q) ||
        item.reference.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q)

      const matchesBrand = inventoryBrandFilter === "all" || item.brand === inventoryBrandFilter
      const matchesStatus = inventoryStatusFilter === "all" || item.status === inventoryStatusFilter
      const matchesVisibility =
        inventoryVisibilityFilter === "all" || item.visibility === (inventoryVisibilityFilter as "PUBLIC" | "PRIVATE")

      return matchesSearch && matchesBrand && matchesStatus && matchesVisibility
    })
  }, [inventory, inventoryBrandFilter, inventorySearch, inventoryStatusFilter, inventoryVisibilityFilter])

  const selectedInventoryItem = useMemo(() => {
    if (!selectedInventoryId) return null
    return inventory.find((item) => item.id === selectedInventoryId) ?? null
  }, [inventory, selectedInventoryId])

  const selectedInquiries = useMemo(() => {
    if (!selectedInventoryItem) return []
    return inquiries.filter((inquiry) => inquiry.watch?.slug === selectedInventoryItem.slug)
  }, [inquiries, selectedInventoryItem])

  useEffect(() => {
    if (filteredInventory.length === 0) {
      setSelectedInventoryId(null)
      return
    }

    if (!selectedInventoryId || !filteredInventory.some((item) => item.id === selectedInventoryId)) {
      setSelectedInventoryId(filteredInventory[0].id)
    }
  }, [filteredInventory, selectedInventoryId])

  useEffect(() => {
    if (!selectedInventoryItem) {
      setInventoryDraft(null)
      return
    }

    setInventoryDraft({
      id: selectedInventoryItem.id,
      brand: selectedInventoryItem.brand,
      model: selectedInventoryItem.model,
      reference: selectedInventoryItem.reference,
      year: String(selectedInventoryItem.year),
      condition: selectedInventoryItem.condition,
      price: String(selectedInventoryItem.price),
      status: selectedInventoryItem.status,
      visibility: selectedInventoryItem.visibility,
      tags: selectedInventoryItem.tags.join(", "),
      images: selectedInventoryItem.images.join("\n"),
      description: selectedInventoryItem.description,
      slug: selectedInventoryItem.slug,
      featured: selectedInventoryItem.featured,
      boxAndPapers: selectedInventoryItem.boxAndPapers,
      externalId: selectedInventoryItem.externalId ?? "",
      sourceUrl: selectedInventoryItem.sourceUrl ?? "",
    })
  }, [selectedInventoryItem])

  const parseCommaNewlineList = (value: string) =>
    value
      .split(/\r?\n|,/)
      .map((entry) => entry.trim())
      .filter(Boolean)

  const getStatusTone = (status: string) => {
    switch (status) {
      case "Sold":
        return "bg-red-600 text-white"
      case "Pending":
        return "bg-yellow-500 text-black"
      default:
        return "bg-green-600 text-white"
    }
  }

  const handleSaveInventory = () => {
    if (!inventoryDraft) return

    const year = Number(inventoryDraft.year)
    const price = Number(inventoryDraft.price)
    if (Number.isNaN(year) || Number.isNaN(price)) {
      setErrorMessage("Year and price must be valid numbers.")
      return
    }

    setSuccessMessage(null)
    setErrorMessage(null)

    const images = parseCommaNewlineList(inventoryDraft.images)
    const tags = parseCommaNewlineList(inventoryDraft.tags)

    startTransition(async () => {
      const result = await updateInventoryAction(inventoryDraft.id, {
        brand: inventoryDraft.brand,
        model: inventoryDraft.model,
        reference: inventoryDraft.reference,
        year,
        condition: inventoryDraft.condition,
        price,
        status: inventoryDraft.status,
        visibility: inventoryDraft.visibility,
        tags,
        images,
        description: inventoryDraft.description,
        slug: inventoryDraft.slug,
        featured: inventoryDraft.featured,
        boxAndPapers: inventoryDraft.boxAndPapers,
        externalId: inventoryDraft.externalId,
        sourceUrl: inventoryDraft.sourceUrl,
      })

      if (!result.success) {
        setErrorMessage(result.error ?? "Could not update inventory item.")
        return
      }

      setSuccessMessage("Inventory updated.")
      router.refresh()
    })
  }

  const handleLogin = async (formData: FormData) => {
    setLoginError(null)
    startTransition(async () => {
      const result = await adminLogin(formData)
      if (!result.success) {
        setLoginError(result.error ?? "Login failed")
        return
      }
      router.refresh()
    })
  }

  const handleLogout = () => {
    startTransition(async () => {
      await adminLogout()
      router.refresh()
    })
  }

  const handleImport = async (formData: FormData) => {
    setSuccessMessage(null)
    setErrorMessage(null)
    startTransition(async () => {
      const result = await importJsonAction(formData)
      if (!result.success) {
        setErrorMessage(result.error ?? "Import failed")
        return
      }
      const summary = result.summary
      if (!summary) {
        setSuccessMessage("Import complete.")
        router.refresh()
        return
      }
      setSuccessMessage(
        `Import complete: ${summary.created} created (saved as drafts), ${summary.updated} updated, ${summary.skipped} skipped.`,
      )
      router.refresh()
    })
  }

  const handleManualCreate = async (formData: FormData) => {
    setSuccessMessage(null)
    setErrorMessage(null)
    startTransition(async () => {
      const result = await createInventoryAction(formData)
      if (!result.success) {
        setErrorMessage(result.error ?? "Could not create inventory item")
        return
      }
      setSuccessMessage(`Created draft item with slug ${result.slug}. Click Publish to push it live.`)
      router.refresh()
    })
  }

  const handlePublishSelected = () => {
    if (!inventoryDraft) return

    setSuccessMessage(null)
    setErrorMessage(null)

    startTransition(async () => {
      const result = await publishInventoryAction(inventoryDraft.id)
      if (!result.success) {
        setErrorMessage(result.error ?? "Could not publish inventory item.")
        return
      }
      setSuccessMessage("Published.")
      router.refresh()
    })
  }

  const handleUnpublishSelected = () => {
    if (!inventoryDraft) return

    setSuccessMessage(null)
    setErrorMessage(null)

    startTransition(async () => {
      const result = await unpublishInventoryAction(inventoryDraft.id)
      if (!result.success) {
        setErrorMessage(result.error ?? "Could not unpublish inventory item.")
        return
      }
      setSuccessMessage("Unpublished (now hidden on website).")
      router.refresh()
    })
  }

  const handlePublishAllDrafts = () => {
    setSuccessMessage(null)
    setErrorMessage(null)

    startTransition(async () => {
      const result = await publishAllDraftInventoryAction()
      if (!result.success) {
        setErrorMessage(result.error ?? "Could not publish draft inventory.")
        return
      }
      setSuccessMessage(result.published ? `Published ${result.published} draft listings.` : "No draft listings to publish.")
      router.refresh()
    })
  }

  const handleUploadInventoryImages = (files: FileList | File[]) => {
    if (!inventoryDraft) return

    const list = Array.from(files)
    if (list.length === 0) return

    setSuccessMessage(null)
    setErrorMessage(null)

    const formData = new FormData()
    formData.append("inventoryId", inventoryDraft.id)
    for (const file of list) {
      formData.append("imageFiles", file)
    }

    startTransition(async () => {
      const result = await uploadInventoryImagesAction(formData)
      if (!result.success) {
        setErrorMessage(result.error ?? "Could not upload images.")
        return
      }
      setSuccessMessage(`Uploaded ${result.uploaded} image${result.uploaded === 1 ? "" : "s"}.`)
      router.refresh()
    })
  }

  if (!sessionEmail) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center font-serif text-2xl">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              {loginError && <p className="text-sm text-red-500">{loginError}</p>}
              <Button type="submit" disabled={isPending} className="w-full bg-gold text-black hover:bg-gold/90">
                {isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Logged in as</p>
            <p className="font-medium">{sessionEmail}</p>
          </div>
          <Button variant="outline" onClick={handleLogout} disabled={isPending} className="bg-transparent">
            Logout
          </Button>
        </div>

        <div className="h-px w-full bg-border" />

        {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}
        {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}

        {/* Inventory Manager */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="font-serif">Inventory Manager ({inventory.length})</CardTitle>
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={handlePublishAllDrafts}
                className="bg-transparent"
              >
                {isPending ? "Working..." : "Publish All Drafts"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <Input
                    placeholder="Search by brand, model, reference, or slug..."
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                  />

                  <Select value={inventoryBrandFilter} onValueChange={setInventoryBrandFilter}>
                    <SelectTrigger className="w-full md:w-52">
                      <SelectValue placeholder="Brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brandOptions.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand === "all" ? "All Brands" : brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={inventoryVisibilityFilter} onValueChange={setInventoryVisibilityFilter}>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="Visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="PUBLIC">Public</SelectItem>
                      <SelectItem value="PRIVATE">Private</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={inventoryStatusFilter} onValueChange={setInventoryStatusFilter}>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {filteredInventory.length === 0 ? (
                  <p className="text-muted-foreground text-center py-10">No inventory matches your filters.</p>
                ) : (
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredInventory.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedInventoryId(item.id)}
                        className="text-left"
                      >
                        <Card
                          className={cn(
                            "overflow-hidden border-border hover:border-gold/50 transition-colors",
                            item.id === selectedInventoryId && "border-gold",
                          )}
                        >
                          <div className="relative aspect-square bg-muted overflow-hidden">
                            <Image
                              src={item.images[0] || "/placeholder.svg"}
                              alt={`${item.brand} ${item.model}`}
                              fill
                              className="object-cover"
                            />
                            <Badge className={cn("absolute top-3 left-3 text-xs", getStatusTone(item.status))}>
                              {item.status}
                            </Badge>
                            {item.visibility === "PRIVATE" && (
                              <Badge className="absolute top-3 right-3 bg-black/70 text-white text-xs border border-white/10">
                                Private
                              </Badge>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.brand}</p>
                            <h3 className="font-serif text-lg font-medium mt-1">{item.model}</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              Ref. {item.reference} • {item.year}
                            </p>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                              <span className="font-medium">{formatCadPrice(item.price)}</span>
                              <span className="text-xs text-muted-foreground">{item.inquiriesCount} inquiries</span>
                            </div>
                          </CardContent>
                        </Card>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle className="font-serif text-xl">Edit Listing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!inventoryDraft ? (
                      <p className="text-muted-foreground text-sm">Select a listing to edit.</p>
                    ) : (
                      <>
                        <WatchGallery
                          images={parseCommaNewlineList(inventoryDraft.images)}
                          alt={`${inventoryDraft.brand} ${inventoryDraft.model}`}
                          status={inventoryDraft.status}
                          statusLabel={inventoryDraft.status}
                        />

                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{inventoryDraft.visibility === "PUBLIC" ? "Published" : "Draft"}</Badge>
                            {inventoryDraft.visibility === "PUBLIC" ? (
                              <Button type="button" size="sm" variant="outline" disabled={isPending} onClick={handleUnpublishSelected}>
                                Unpublish
                              </Button>
                            ) : (
                              <Button type="button" size="sm" className="bg-gold text-black hover:bg-gold/90" disabled={isPending} onClick={handlePublishSelected}>
                                Publish
                              </Button>
                            )}
                          </div>
                          {inventoryDraft.visibility === "PUBLIC" ? (
                            <a
                              href={`/inventory/${inventoryDraft.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-gold hover:underline"
                            >
                              Open public page →
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground">Hidden on website</span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label>Visibility</Label>
                              <Input value={inventoryDraft.visibility === "PUBLIC" ? "Published" : "Draft"} disabled />
                            </div>

                            <div className="space-y-1.5">
                              <Label>Status</Label>
                              <Select
                                value={inventoryDraft.status}
                                onValueChange={(value) => setInventoryDraft((prev) => (prev ? { ...prev, status: value } : prev))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Available">Available</SelectItem>
                                  <SelectItem value="Pending">Pending</SelectItem>
                                  <SelectItem value="Sold">Sold</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label>Brand</Label>
                              <Input
                                value={inventoryDraft.brand}
                                onChange={(e) => setInventoryDraft((prev) => (prev ? { ...prev, brand: e.target.value } : prev))}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label>Model</Label>
                              <Input
                                value={inventoryDraft.model}
                                onChange={(e) => setInventoryDraft((prev) => (prev ? { ...prev, model: e.target.value } : prev))}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label>Reference</Label>
                              <Input
                                value={inventoryDraft.reference}
                                onChange={(e) =>
                                  setInventoryDraft((prev) => (prev ? { ...prev, reference: e.target.value } : prev))
                                }
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label>Year</Label>
                              <Input
                                type="number"
                                value={inventoryDraft.year}
                                onChange={(e) => setInventoryDraft((prev) => (prev ? { ...prev, year: e.target.value } : prev))}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label>Condition</Label>
                              <Input
                                value={inventoryDraft.condition}
                                onChange={(e) =>
                                  setInventoryDraft((prev) => (prev ? { ...prev, condition: e.target.value } : prev))
                                }
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label>Price (CAD)</Label>
                              <Input
                                type="number"
                                value={inventoryDraft.price}
                                onChange={(e) =>
                                  setInventoryDraft((prev) => (prev ? { ...prev, price: e.target.value } : prev))
                                }
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={inventoryDraft.boxAndPapers}
                                onChange={(e) =>
                                  setInventoryDraft((prev) => (prev ? { ...prev, boxAndPapers: e.target.checked } : prev))
                                }
                                className="h-4 w-4"
                              />
                              Complete Set
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={inventoryDraft.featured}
                                onChange={(e) =>
                                  setInventoryDraft((prev) => (prev ? { ...prev, featured: e.target.checked } : prev))
                                }
                                className="h-4 w-4"
                              />
                              Featured
                            </label>
                          </div>

                          <div className="space-y-1.5">
                            <Label>Tags (comma/newline)</Label>
                            <Input
                              value={inventoryDraft.tags}
                              onChange={(e) => setInventoryDraft((prev) => (prev ? { ...prev, tags: e.target.value } : prev))}
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label>Images</Label>
                            <input
                              ref={imageUploadInputRef}
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={(e) => {
                                const files = e.target.files
                                if (files) handleUploadInventoryImages(files)
                                e.target.value = ""
                              }}
                            />
                            <div
                              className={cn(
                                "rounded-md border border-dashed px-4 py-6 text-center text-sm transition-colors cursor-pointer",
                                isDraggingImages ? "border-gold bg-gold/5" : "border-border hover:border-gold/70",
                              )}
                              onClick={() => imageUploadInputRef.current?.click()}
                              onDragOver={(e) => {
                                e.preventDefault()
                                setIsDraggingImages(true)
                              }}
                              onDragLeave={() => setIsDraggingImages(false)}
                              onDrop={(e) => {
                                e.preventDefault()
                                setIsDraggingImages(false)
                                if (e.dataTransfer.files?.length) {
                                  handleUploadInventoryImages(e.dataTransfer.files)
                                }
                              }}
                            >
                              <p className="font-medium text-foreground">Drag & drop images here</p>
                              <p className="text-xs text-muted-foreground mt-1">or click to upload (stored in database)</p>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <Label>Description</Label>
                            <Textarea
                              rows={5}
                              value={inventoryDraft.description}
                              onChange={(e) =>
                                setInventoryDraft((prev) => (prev ? { ...prev, description: e.target.value } : prev))
                              }
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label>Slug</Label>
                            <Input
                              value={inventoryDraft.slug}
                              onChange={(e) => setInventoryDraft((prev) => (prev ? { ...prev, slug: e.target.value } : prev))}
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label>External ID</Label>
                            <Input
                              value={inventoryDraft.externalId}
                              onChange={(e) =>
                                setInventoryDraft((prev) => (prev ? { ...prev, externalId: e.target.value } : prev))
                              }
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label>Source URL</Label>
                            <Input
                              value={inventoryDraft.sourceUrl}
                              onChange={(e) =>
                                setInventoryDraft((prev) => (prev ? { ...prev, sourceUrl: e.target.value } : prev))
                              }
                            />
                          </div>

                          {inventoryDraft && (
                            <div className="border-t pt-4 space-y-3">
                              <Button
                                type="button"
                                onClick={handleSaveInventory}
                                disabled={isPending}
                                className="w-full bg-gold text-black hover:bg-gold/90"
                              >
                                {isPending ? "Saving..." : "Save Changes"}
                              </Button>

                              <div>
                                <p className="text-sm font-medium">Inquiries for this watch</p>
                                {selectedInquiries.length === 0 ? (
                                  <p className="text-xs text-muted-foreground mt-1">No inquiries for this listing yet.</p>
                                ) : (
                                  <div className="mt-2 space-y-2">
                                    {selectedInquiries.slice(0, 5).map((inquiry) => (
                                      <div key={inquiry.id} className="rounded-md border border-border p-2">
                                        <p className="text-xs font-medium">{inquiry.name}</p>
                                        <p className="text-xs text-muted-foreground">{inquiry.email}</p>
                                      </div>
                                    ))}
                                    {selectedInquiries.length > 5 && (
                                      <p className="text-xs text-muted-foreground">+ {selectedInquiries.length - 5} more</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Import Listings (JSON)</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={handleImport} className="space-y-4" encType="multipart/form-data">
                <div className="space-y-2">
                  <Label htmlFor="file">Upload Bright Data JSON</Label>
                  <Input id="file" name="file" type="file" accept=".json,application/json" required />
                  <p className="text-xs text-muted-foreground">Uses externalId to upsert; safe to re-run.</p>
                </div>
                <Button type="submit" disabled={isPending} className="bg-gold text-black hover:bg-gold/90">
                  {isPending ? "Importing..." : "Import JSON"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Add Inventory Manually</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={handleManualCreate} className="space-y-3" encType="multipart/form-data">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="brand">Brand *</Label>
                    <Input id="brand" name="brand" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="model">Model *</Label>
                    <Input id="model" name="model" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="reference">Reference *</Label>
                    <Input id="reference" name="reference" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="year">Year *</Label>
                    <Input id="year" name="year" type="number" min="1900" max="2100" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="condition">Condition</Label>
                    <Input id="condition" name="condition" placeholder="Excellent" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="price">Price (CAD) *</Label>
                    <Input id="price" name="price" type="number" step="0.01" min="0" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="status">Status</Label>
                    <Input id="status" name="status" placeholder="Available" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Visibility</Label>
                    <Input value="Draft (click Publish after saving)" disabled />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="tags">Tags</Label>
                    <Input id="tags" name="tags" placeholder="Rolex, Daytona, Panda" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" name="slug" placeholder="auto-generated if blank" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="externalId">External ID</Label>
                    <Input id="externalId" name="externalId" placeholder="optional" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="sourceUrl">Source URL</Label>
                    <Input id="sourceUrl" name="sourceUrl" placeholder="optional" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input id="boxAndPapers" name="boxAndPapers" type="checkbox" defaultChecked className="h-4 w-4" />
                  <Label htmlFor="boxAndPapers">Complete Set</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input id="featured" name="featured" type="checkbox" className="h-4 w-4" />
                  <Label htmlFor="featured">Featured</Label>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="imageFiles">Images</Label>
                  <Input id="imageFiles" name="imageFiles" type="file" accept="image/*" multiple />
                  <p className="text-xs text-muted-foreground">Drag & drop supported. Images are stored in the database.</p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description">Description (Standard Format) *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={5}
                    placeholder={`Year: 2023\nRef: 326934\nCondition: MINT\nAvailable for purchase from Exclusive Time Zone`}
                    required
                  />
                </div>

                <Button type="submit" disabled={isPending} className="bg-gold text-black hover:bg-gold/90 w-full">
                  {isPending ? "Saving..." : "Save Inventory Item"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sell/Trade Requests Section */}
        <div className="h-px w-full bg-border mt-8" />
        
        <Card>
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              <Package className="h-5 w-5 text-gold" />
              Sell/Trade Requests ({sellRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sellRequests.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No sell/trade requests yet.</p>
            ) : (
              <div className="space-y-4">
                {sellRequests.map((request) => {
                  const contact =
                    request.contactInfo && typeof request.contactInfo === "object"
                      ? (request.contactInfo as Record<string, string>)
                      : ({} as Record<string, string>)
                  return (
                    <div key={request.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {request.brand} {request.model}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            {new Date(request.createdAt).toLocaleDateString("en-CA", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              request.status === "New"
                                ? "default"
                                : request.status === "Contacted"
                                ? "secondary"
                                : request.status === "Completed"
                                ? "outline"
                                : "destructive"
                            }
                          >
                            {request.status}
                          </Badge>
                          <Select
                            defaultValue={request.status}
                            onValueChange={(value) => {
                              startTransition(async () => {
                                await updateSellRequestStatus(request.id, value)
                                router.refresh()
                              })
                            }}
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="New">New</SelectItem>
                              <SelectItem value="Contacted">Contacted</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                              <SelectItem value="Declined">Declined</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Condition:</span>{" "}
                          <span className="font-medium">{request.condition}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Set:</span>{" "}
                          <span className="font-medium">{request.boxAndPapers ? "Yes" : "No"}</span>
                        </div>
                        {contact?.reference && (
                          <div>
                            <span className="text-muted-foreground">Reference:</span>{" "}
                            <span className="font-medium">{contact.reference}</span>
                          </div>
                        )}
                        {contact?.year && (
                          <div>
                            <span className="text-muted-foreground">Year:</span>{" "}
                            <span className="font-medium">{contact.year}</span>
                          </div>
                        )}
                        {contact?.transactionType && (
                          <div>
                            <span className="text-muted-foreground">Type:</span>{" "}
                            <span className="font-medium capitalize">{contact.transactionType}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="border-t pt-3 mt-3">
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span>{contact?.firstName} {contact?.lastName}</span>
                          </div>
                          <a
                            href={`mailto:${contact?.email}`}
                            className="flex items-center gap-1 text-gold hover:underline"
                          >
                            <Mail className="h-3 w-3" />
                            {contact?.email}
                          </a>
                          {contact?.phone && (
                            <a
                              href={`tel:${contact.phone}`}
                              className="flex items-center gap-1 text-gold hover:underline"
                            >
                              <Phone className="h-3 w-3" />
                              {contact.phone}
                            </a>
                          )}
                        </div>
                        {contact?.comments && (
                          <p className="mt-2 text-sm text-muted-foreground italic">
                            &ldquo;{contact.comments}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inquiries Section */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              <Mail className="h-5 w-5 text-gold" />
              Inquiries ({inquiries.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {inquiries.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No inquiries yet.</p>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inquiry) => (
                  <div key={inquiry.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{inquiry.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(inquiry.createdAt).toLocaleDateString("en-CA", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      <Badge variant="outline">{inquiry.type}</Badge>
                    </div>
                    
                    {inquiry.watch && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Watch:</span>{" "}
                        <span className="font-medium">{inquiry.watch.brand} {inquiry.watch.model}</span>
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <a
                        href={`mailto:${inquiry.email}`}
                        className="flex items-center gap-1 text-gold hover:underline"
                      >
                        <Mail className="h-3 w-3" />
                        {inquiry.email}
                      </a>
                      {inquiry.phone && (
                        <a
                          href={`tel:${inquiry.phone}`}
                          className="flex items-center gap-1 text-gold hover:underline"
                        >
                          <Phone className="h-3 w-3" />
                          {inquiry.phone}
                        </a>
                      )}
                    </div>
                    
                    {inquiry.message && (
                      <p className="text-sm text-muted-foreground mt-2 italic">
                        &ldquo;{inquiry.message}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
