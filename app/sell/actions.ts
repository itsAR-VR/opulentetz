"use server"

import { prisma } from "@/lib/prisma"

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
}

export async function submitSellRequest(data: SellFormData) {
  try {
    const record = await prisma.sellRequest.create({
      data: {
        brand: data.brand,
        model: data.model,
        expectedPrice: null,
        condition: data.condition,
        boxAndPapers: data.hasBoxPapers === "yes",
        imagesUrl: null,
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
- Box & Papers: ${data.hasBoxPapers === "yes" ? "Yes" : data.hasBoxPapers === "partial" ? "Partial" : "No"}

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

