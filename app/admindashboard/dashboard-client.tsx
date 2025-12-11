"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { adminLogin, adminLogout, importJsonAction, createInventoryAction } from "./actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface Props {
  sessionEmail: string | null
}

export default function AdminDashboardClient({ sessionEmail }: Props) {
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
      </div>
    </main>
  )
}
