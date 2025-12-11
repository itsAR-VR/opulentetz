"use client"

import type React from "react"

import { useState, useTransition, useRef, useCallback } from "react"
import Image from "next/image"
import { ArrowRight, Upload, CheckCircle2, Clock, DollarSign, Send, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { brands } from "@/lib/mock-data"
import { submitSellRequest, uploadImage } from "./actions"

interface UploadedFile {
  id: string
  file: File
  preview: string
  url?: string
  uploading: boolean
  error?: string
}

const steps = [
  {
    id: 1,
    title: "Submit Details",
    description: "Tell us about your watch",
    icon: Send,
  },
  {
    id: 2,
    title: "Get Your Quote",
    description: "Receive a competitive offer",
    icon: DollarSign,
  },
  {
    id: 3,
    title: "Complete Transaction",
    description: "Get paid quickly & securely",
    icon: CheckCircle2,
  },
]

export default function SellPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    reference: "",
    year: "",
    condition: "",
    hasBoxPapers: "",
    transactionType: "sell",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    comments: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const validFiles = fileArray.filter(
      (file) => file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024
    )

    if (validFiles.length === 0) return

    // Add files to state with preview
    const newFiles: UploadedFile[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 15),
      file,
      preview: URL.createObjectURL(file),
      uploading: true,
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])

    // Upload each file
    for (const uploadedFile of newFiles) {
      const formData = new FormData()
      formData.append("file", uploadedFile.file)

      const result = await uploadImage(formData)

      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === uploadedFile.id
            ? {
                ...f,
                uploading: false,
                url: result.success ? result.url : undefined,
                error: result.success ? undefined : result.error,
              }
            : f
        )
      )
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (e.dataTransfer.files) {
        processFiles(e.dataTransfer.files)
      }
    },
    [processFiles]
  )

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        processFiles(e.target.files)
      }
    },
    [processFiles]
  )

  const handleRemoveFile = useCallback((id: string) => {
    setUploadedFiles((prev) => {
      const file = prev.find((f) => f.id === id)
      if (file) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter((f) => f.id !== id)
    })
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Get successfully uploaded image URLs
    const imageUrls = uploadedFiles
      .filter((f) => f.url && !f.error)
      .map((f) => f.url!)

    startTransition(async () => {
      const result = await submitSellRequest({ ...formData, imageUrls })
      if (result.success) {
        setSubmitted(true)
      } else {
        setError(result.error ?? "Something went wrong. Please try again.")
      }
    })
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-gold" />
          </div>
          <h1 className="font-serif text-3xl font-bold">Quote Request Submitted</h1>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Thank you for your submission. One of our watch specialists will review your information and contact you
            within 24-48 hours with a competitive offer.
          </p>
          <Button asChild className="mt-8 bg-gold hover:bg-gold/90 text-black">
            <a href="/">Return Home</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 bg-black text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/luxury-watches-on-dark-velvet-elegant-display.jpg"
            alt="Sell your luxury watch"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-gold uppercase tracking-[0.2em] text-sm font-medium mb-4">Sell or Trade</p>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-balance">
              Turn Your Timepiece Into <span className="text-gold">Top Dollar</span>
            </h1>
            <p className="mt-6 text-gray-300 leading-relaxed">
              Whether you are looking to sell outright or trade towards your next watch, our expert team provides
              competitive offers with a seamless, transparent process.
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`h-14 w-14 rounded-full flex items-center justify-center mb-4 ${
                      currentStep >= step.id ? "bg-gold text-black" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <step.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-lg font-medium">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-[60%] w-[80%] h-px bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Watch Details */}
            {currentStep === 1 && (
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <h2 className="font-serif text-2xl font-medium mb-6">Watch Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand *</Label>
                      <Select value={formData.brand} onValueChange={(value) => handleInputChange("brand", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {brands.map((brand) => (
                            <SelectItem key={brand} value={brand}>
                              {brand}
                            </SelectItem>
                          ))}
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Model *</Label>
                      <Input
                        id="model"
                        placeholder="e.g., Submariner, Nautilus"
                        value={formData.model}
                        onChange={(e) => handleInputChange("model", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reference">Reference Number</Label>
                      <Input
                        id="reference"
                        placeholder="e.g., 126610LN"
                        value={formData.reference}
                        onChange={(e) => handleInputChange("reference", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Year of Purchase</Label>
                      <Input
                        id="year"
                        placeholder="e.g., 2022"
                        value={formData.year}
                        onChange={(e) => handleInputChange("year", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="condition">Condition *</Label>
                      <Select
                        value={formData.condition}
                        onValueChange={(value) => handleInputChange("condition", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New / Unworn</SelectItem>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="very-good">Very Good</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Box & Papers</Label>
                      <RadioGroup
                        value={formData.hasBoxPapers}
                        onValueChange={(value) => handleInputChange("hasBoxPapers", value)}
                        className="flex gap-4 pt-2"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="yes" id="box-yes" />
                          <Label htmlFor="box-yes" className="font-normal cursor-pointer">
                            Yes
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="partial" id="box-partial" />
                          <Label htmlFor="box-partial" className="font-normal cursor-pointer">
                            Partial
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="no" id="box-no" />
                          <Label htmlFor="box-no" className="font-normal cursor-pointer">
                            No
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    <Label>What would you like to do? *</Label>
                    <RadioGroup
                      value={formData.transactionType}
                      onValueChange={(value) => handleInputChange("transactionType", value)}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
                    >
                      <Label
                        htmlFor="type-sell"
                        className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                          formData.transactionType === "sell"
                            ? "border-gold bg-gold/5"
                            : "border-border hover:border-gold/50"
                        }`}
                      >
                        <RadioGroupItem value="sell" id="type-sell" />
                        <div>
                          <p className="font-medium">Sell</p>
                          <p className="text-sm text-muted-foreground">Get cash for your watch</p>
                        </div>
                      </Label>
                      <Label
                        htmlFor="type-trade"
                        className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                          formData.transactionType === "trade"
                            ? "border-gold bg-gold/5"
                            : "border-border hover:border-gold/50"
                        }`}
                      >
                        <RadioGroupItem value="trade" id="type-trade" />
                        <div>
                          <p className="font-medium">Trade</p>
                          <p className="text-sm text-muted-foreground">Trade towards another watch</p>
                        </div>
                      </Label>
                    </RadioGroup>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <Button type="button" onClick={handleNextStep} className="bg-gold hover:bg-gold/90 text-black">
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Photos */}
            {currentStep === 2 && (
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <h2 className="font-serif text-2xl font-medium mb-2">Upload Photos</h2>
                  <p className="text-muted-foreground mb-6">Clear photos help us provide the most accurate quote</p>

                  {/* Drop Zone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                      isDragging
                        ? "border-gold bg-gold/5"
                        : "border-border hover:border-gold/50"
                    }`}
                  >
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                    <p className="font-medium">Drag and drop your photos here</p>
                    <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
                    <p className="text-xs text-muted-foreground mt-4">
                      PNG, JPG up to 10MB each. Include front, back, and side views.
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleFileInputChange}
                    />
                  </div>

                  {/* Uploaded Files Preview */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-6">
                      <p className="text-sm font-medium mb-3">
                        Uploaded Photos ({uploadedFiles.length})
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {uploadedFiles.map((file) => (
                          <div
                            key={file.id}
                            className="relative aspect-square rounded-lg overflow-hidden border bg-muted"
                          >
                            <Image
                              src={file.preview}
                              alt="Upload preview"
                              fill
                              className="object-cover"
                            />
                            {file.uploading && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Loader2 className="h-6 w-6 text-white animate-spin" />
                              </div>
                            )}
                            {file.error && (
                              <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center p-2">
                                <p className="text-white text-xs text-center">{file.error}</p>
                              </div>
                            )}
                            {file.url && !file.uploading && (
                              <div className="absolute top-1 right-1">
                                <CheckCircle2 className="h-5 w-5 text-green-500 bg-white rounded-full" />
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveFile(file.id)
                              }}
                              className="absolute top-1 left-1 p-1 bg-black/70 rounded-full hover:bg-black transition-colors"
                            >
                              <X className="h-4 w-4 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-8 flex justify-between">
                    <Button type="button" variant="outline" onClick={handlePrevStep}>
                      Back
                    </Button>
                    <Button 
                      type="button" 
                      onClick={handleNextStep} 
                      className="bg-gold hover:bg-gold/90 text-black"
                      disabled={uploadedFiles.some((f) => f.uploading)}
                    >
                      {uploadedFiles.some((f) => f.uploading) ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          Continue
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Contact Info */}
            {currentStep === 3 && (
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <h2 className="font-serif text-2xl font-medium mb-6">Contact Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mt-6 space-y-2">
                    <Label htmlFor="comments">Additional Comments</Label>
                    <Textarea
                      id="comments"
                      placeholder="Any additional details about your watch..."
                      rows={4}
                      value={formData.comments}
                      onChange={(e) => handleInputChange("comments", e.target.value)}
                    />
                  </div>

                  {error && (
                    <p className="mt-4 text-sm text-red-500">{error}</p>
                  )}

                  <div className="mt-8 flex justify-between">
                    <Button type="button" variant="outline" onClick={handlePrevStep} disabled={isPending}>
                      Back
                    </Button>
                    <Button type="submit" className="bg-gold hover:bg-gold/90 text-black" disabled={isPending}>
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Quote Request
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>

          {/* Trust Badges */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Clock className="h-6 w-6 text-gold mb-2" />
              <p className="text-sm font-medium">24-48 Hour Response</p>
            </div>
            <div className="flex flex-col items-center">
              <DollarSign className="h-6 w-6 text-gold mb-2" />
              <p className="text-sm font-medium">Competitive Offers</p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle2 className="h-6 w-6 text-gold mb-2" />
              <p className="text-sm font-medium">Secure Transactions</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
