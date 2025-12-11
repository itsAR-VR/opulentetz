"use server"

import { Prisma } from "@/lib/generated/prisma/client"
import { importListings, parseListingsFromJson, toSlug, ensureUniqueSlug } from "@/lib/importers/facebook"
import { validateCredentials, setSessionCookie, clearSessionCookie, getSessionEmail } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"

const requireAdmin = async () => {
  const email = await getSessionEmail()
  if (!email) {
    throw new Error("Unauthorized")
  }
  return email
}

export async function adminLogin(formData: FormData) {
  const email = (formData.get("email") ?? "").toString().trim()
  const password = (formData.get("password") ?? "").toString()

  if (!validateCredentials(email, password)) {
    return { success: false, error: "Invalid credentials" }
  }

  await setSessionCookie(email)
  return { success: true }
}

export async function adminLogout() {
  await clearSessionCookie()
  return { success: true }
}

export async function importJsonAction(formData: FormData) {
  await requireAdmin()

  const file = formData.get("file")
  if (!(file instanceof File)) {
    return { success: false, error: "Please attach a JSON file." }
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const text = buffer.toString("utf8")

  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch (err) {
    return { success: false, error: "Invalid JSON file." }
  }

  const entries = parseListingsFromJson(parsed)
  if (!entries.length) {
    return { success: false, error: "No listings found in JSON." }
  }

  const summary = await importListings(entries)
  return { success: true, summary }
}

export async function createInventoryAction(formData: FormData) {
  await requireAdmin()

  const brand = (formData.get("brand") ?? "").toString().trim()
  const model = (formData.get("model") ?? "").toString().trim()
  const reference = (formData.get("reference") ?? "").toString().trim()
  const year = Number((formData.get("year") ?? "").toString())
  const condition = (formData.get("condition") ?? "").toString().trim() || "Excellent"
  const price = Number((formData.get("price") ?? "").toString())
  const status = (formData.get("status") ?? "").toString().trim() || "Available"
  const boxAndPapers = formData.get("boxAndPapers") === "on"
  const description = (formData.get("description") ?? "").toString().trim()
  const imagesInput = (formData.get("images") ?? "").toString()
  const images = imagesInput
    .split(/\r?\n|,/)
    .map((url) => url.trim())
    .filter(Boolean)
  const featured = formData.get("featured") === "on"
  const externalId = (formData.get("externalId") ?? "").toString().trim() || undefined
  const sourceUrl = (formData.get("sourceUrl") ?? "").toString().trim() || undefined
  const slugInput = (formData.get("slug") ?? "").toString().trim()

  if (!brand || !model || !reference || !description || Number.isNaN(year) || Number.isNaN(price)) {
    return { success: false, error: "Brand, model, reference, year, description, and price are required." }
  }

  const slugBase = slugInput || toSlug(`${brand}-${model}-${reference}`)
  const slug = await ensureUniqueSlug(slugBase, externalId)

  try {
    await prisma.inventory.create({
      data: {
        brand,
        model,
        reference,
        year,
        condition,
        price: new Prisma.Decimal(price),
        status,
        boxAndPapers,
        description,
        images,
        slug,
        featured,
        externalId: externalId ?? null,
        sourceUrl: sourceUrl ?? null,
      },
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const target = Array.isArray(error.meta?.target) ? error.meta?.target.join(", ") : "unique field"
      return { success: false, error: `Duplicate value for ${target}.` }
    }
    throw error
  }

  return { success: true, slug }
}

export async function getSellRequests() {
  await requireAdmin()
  
  const requests = await prisma.sellRequest.findMany({
    orderBy: { createdAt: "desc" },
  })
  
  return requests.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }))
}

export async function getInquiries() {
  await requireAdmin()
  
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      watch: {
        select: {
          brand: true,
          model: true,
          slug: true,
        },
      },
    },
  })
  
  return inquiries.map((i) => ({
    ...i,
    createdAt: i.createdAt.toISOString(),
  }))
}

export async function updateSellRequestStatus(id: string, status: string) {
  await requireAdmin()
  
  await prisma.sellRequest.update({
    where: { id },
    data: { status },
  })
  
  return { success: true }
}

export async function updateInquiryType(id: string, type: string) {
  await requireAdmin()
  
  await prisma.inquiry.update({
    where: { id },
    data: { type },
  })
  
  return { success: true }
}
