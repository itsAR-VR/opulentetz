"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { adminLogin, adminLogout, importJsonAction, createInventoryAction, updateSellRequestStatus } from "./actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  contactInfo: Record<string, unknown>
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

interface Props {
  sessionEmail: string | null
  sellRequests: SellRequest[]
  inquiries: Inquiry[]
}

export default function AdminDashboardClient({ sessionEmail, sellRequests, inquiries }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [loginError, setLoginError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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
      setSuccessMessage(
        `Import complete: ${summary.created} created, ${summary.updated} updated, ${summary.skipped} skipped.`,
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
      setSuccessMessage(`Created item with slug ${result.slug}`)
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
              <form action={handleManualCreate} className="space-y-3">
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
                    <Label htmlFor="price">Price (numeric) *</Label>
                    <Input id="price" name="price" type="number" step="0.01" min="0" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="status">Status</Label>
                    <Input id="status" name="status" placeholder="Available" />
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
                  <Label htmlFor="boxAndPapers">Box & Papers</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input id="featured" name="featured" type="checkbox" className="h-4 w-4" />
                  <Label htmlFor="featured">Featured</Label>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="images">Image URLs (comma or newline separated)</Label>
                  <Textarea id="images" name="images" rows={3} placeholder="https://example.com/image1.jpg" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea id="description" name="description" rows={4} required />
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
                  const contact = request.contactInfo as Record<string, string>
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
                          <span className="text-muted-foreground">Box & Papers:</span>{" "}
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
