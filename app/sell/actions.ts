"use server"

import { prisma } from "@/lib/prisma"
import { supabase } from "@/lib/supabase"

interface SellFormData {
  brand: string
  model: string
  reference: string
  year: string
  condition: string
  hasBoxPapers: string
  transactionType: string
  firstName: string
  lastName: string
  email: string
  phone: string
  comments: string
  imageUrls?: string[]
}

export async function uploadImage(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const file = formData.get("file") as File
    if (!file) {
      return { success: false, error: "No file provided" }
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "Only image files are allowed" }
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: "File size must be less than 10MB" }
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split(".").pop()
    const fileName = `sell-requests/${timestamp}-${randomId}.${extension}`

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("watch-images")
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      })

    if (error) {
      console.error("Supabase upload error:", error)
      return { success: false, error: "Failed to upload image" }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("watch-images")
      .getPublicUrl(data.path)

    return { success: true, url: urlData.publicUrl }
  } catch (error) {
    console.error("Error uploading image:", error)
    return { success: false, error: "Failed to upload image" }
  }
}

export async function submitSellRequest(data: SellFormData) {
  try {
    // Join image URLs into a single string if present
    const imagesUrl = data.imageUrls && data.imageUrls.length > 0 
      ? data.imageUrls.join(",") 
      : null

    const record = await prisma.sellRequest.create({
      data: {
        brand: data.brand,
        model: data.model,
        expectedPrice: null,
        condition: data.condition,
        boxAndPapers: data.hasBoxPapers === "yes",
        imagesUrl,
        contactInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          reference: data.reference,
          year: data.year,
          transactionType: data.transactionType,
          comments: data.comments,
        },
        status: "New",
      },
    })

    // Send email notification to admins
    await sendAdminNotification(data, record.id)

    return { success: true, id: record.id }
  } catch (error) {
    console.error("Error submitting sell request:", error)
    return { success: false, error: "Failed to submit request. Please try again." }
  }
}

async function sendAdminNotification(data: SellFormData, requestId: string) {
  const adminEmails = (process.env.ADMIN_ALLOWED_EMAILS ?? "Astro.aimedia@gmail.com,ar@soramedia.co")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean)

  // If Resend API key is available, send email
  const resendApiKey = process.env.RESEND_API_KEY
  if (!resendApiKey) {
    console.log("RESEND_API_KEY not configured - skipping email notification")
    console.log("New sell request from:", data.email, "for", data.brand, data.model)
    return
  }

  const emailContent = `
New Sell/Trade Request Received

Request ID: ${requestId}
Type: ${data.transactionType === "sell" ? "Sell" : "Trade"}

Watch Details:
- Brand: ${data.brand}
- Model: ${data.model}
	- Reference: ${data.reference || "Not provided"}
	- Year: ${data.year || "Not provided"}
	- Condition: ${data.condition}
	- Set: ${data.hasBoxPapers === "yes" ? "Yes" : data.hasBoxPapers === "partial" ? "Partial" : "No"}

	Contact Information:
- Name: ${data.firstName} ${data.lastName}
- Email: ${data.email}
- Phone: ${data.phone || "Not provided"}

Comments:
${data.comments || "None"}

View in dashboard: ${process.env.NEXT_PUBLIC_SITE_URL || "https://exclusivetimezone.vercel.app"}/admindashboard
`

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Exclusive Time Zone <noreply@exclusivetimezone.com>",
        to: adminEmails,
        subject: `New ${data.transactionType === "sell" ? "Sell" : "Trade"} Request: ${data.brand} ${data.model}`,
        text: emailContent,
      }),
    })

    if (!response.ok) {
      console.error("Failed to send email notification:", await response.text())
    }
  } catch (error) {
    console.error("Error sending email notification:", error)
  }
}
