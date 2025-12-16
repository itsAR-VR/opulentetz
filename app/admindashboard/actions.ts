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

const normalizeBrand = (value: string) => {
  const trimmed = value.trim()
  const upper = trimmed.toUpperCase()

  if (!trimmed) return trimmed

  if (upper === "AP" || upper === "A.P.") return "Audemars Piguet"
  if (upper.includes("R0LEX") || upper.includes("ROLEX")) return "Rolex"
  if (upper.includes("PATEK")) return "Patek Philippe"
  if (upper.includes("AUDEMARS")) return "Audemars Piguet"
  if (upper.includes("OMEGA")) return "Omega"
  if (upper.includes("CARTIER")) return "Cartier"
  if (upper.includes("TUDOR")) return "Tudor"
  if (upper.includes("RICHARD") || upper.includes("MILLE")) return "Richard Mille"

  return trimmed
}

const normalizeCondition = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return trimmed

  const normalized = trimmed.replace(/\s+/g, " ")
  const upper = normalized.toUpperCase()

  const canonicalMap: Record<string, string> = {
    "BRAND NEW": "Brand New",
    "BRAND NEW UNWORN": "Brand New Unworn",
    "NEW UNWORN": "Brand New Unworn",
    UNWORN: "Unworn",
    MINT: "Mint",
    "LIKE NEW": "Like New",
    EXCELLENT: "Excellent",
    "VERY GOOD": "Very Good",
    GOOD: "Good",
    FAIR: "Fair",
  }

  if (canonicalMap[upper]) return canonicalMap[upper]

  return normalized
    .toLowerCase()
    .split(/\s+/)
    .map((word) => (word ? `${word[0].toUpperCase()}${word.slice(1)}` : word))
    .join(" ")
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

  const brand = normalizeBrand((formData.get("brand") ?? "").toString())
  const model = (formData.get("model") ?? "").toString().trim()
  const reference = (formData.get("reference") ?? "").toString().trim()
  const year = Number((formData.get("year") ?? "").toString())
  const condition = normalizeCondition((formData.get("condition") ?? "").toString()) || "Excellent"
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
  const visibility = ((formData.get("visibility") ?? "").toString().trim().toUpperCase() || "PUBLIC") as
    | "PUBLIC"
    | "PRIVATE"
  const tagsInput = (formData.get("tags") ?? "").toString()
  const tags = Array.from(
    new Set(
      tagsInput
        .split(/\r?\n|,/)
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  )

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
        visibility,
        tags,
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

export async function getAdminInventory() {
  await requireAdmin()

  const items = await prisma.inventory.findMany({
    orderBy: [{ updatedAt: "desc" }],
    include: {
      _count: {
        select: { inquiries: true },
      },
    },
  })

  return items.map((item) => ({
    id: item.id,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    brand: item.brand,
    model: item.model,
    reference: item.reference,
    year: item.year,
    condition: item.condition,
    price: item.price.toNumber(),
    status: item.status,
    boxAndPapers: item.boxAndPapers,
    description: item.description,
    images: item.images,
    tags: item.tags,
    slug: item.slug,
    featured: item.featured,
    externalId: item.externalId,
    sourceUrl: item.sourceUrl,
    visibility: item.visibility,
    inquiriesCount: item._count.inquiries,
  }))
}

type UpdateInventoryInput = Partial<{
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
}>

export async function updateInventoryAction(id: string, input: UpdateInventoryInput) {
  await requireAdmin()

  const data: Record<string, unknown> = {}

  const setString = (key: keyof UpdateInventoryInput) => {
    const raw = input[key]
    if (typeof raw !== "string") return
    const trimmed = raw.trim()
    if (key === "brand") {
      data[key] = normalizeBrand(trimmed)
      return
    }
    if (key === "condition") {
      data[key] = normalizeCondition(trimmed)
      return
    }
    data[key] = trimmed
  }

  setString("brand")
  setString("model")
  setString("reference")
  setString("condition")
  setString("status")

  if (typeof input.year === "number" && !Number.isNaN(input.year)) {
    data.year = input.year
  }

  if (typeof input.price === "number" && !Number.isNaN(input.price)) {
    data.price = new Prisma.Decimal(input.price)
  }

  if (typeof input.boxAndPapers === "boolean") {
    data.boxAndPapers = input.boxAndPapers
  }

  if (typeof input.featured === "boolean") {
    data.featured = input.featured
  }

  if (typeof input.description === "string") {
    data.description = input.description.trim()
  }

  if (Array.isArray(input.images)) {
    data.images = input.images.map((url) => url.trim()).filter(Boolean)
  }

  if (Array.isArray(input.tags)) {
    data.tags = Array.from(new Set(input.tags.map((tag) => tag.trim()).filter(Boolean)))
  }

  if (typeof input.externalId === "string") {
    const trimmed = input.externalId.trim()
    data.externalId = trimmed.length ? trimmed : null
  } else if (input.externalId === null) {
    data.externalId = null
  }

  if (typeof input.sourceUrl === "string") {
    const trimmed = input.sourceUrl.trim()
    data.sourceUrl = trimmed.length ? trimmed : null
  } else if (input.sourceUrl === null) {
    data.sourceUrl = null
  }

  if (typeof input.visibility === "string") {
    const upper = input.visibility.toUpperCase()
    if (upper === "PUBLIC" || upper === "PRIVATE") {
      data.visibility = upper
    }
  }

  if (typeof input.slug === "string") {
    const newSlug = input.slug.trim()
    if (newSlug.length) {
      const conflict = await prisma.inventory.findFirst({
        where: { slug: newSlug, NOT: { id } },
        select: { id: true },
      })
      if (conflict) {
        return { success: false, error: "Slug already exists." }
      }
      data.slug = newSlug
    }
  }

  await prisma.inventory.update({
    where: { id },
    data,
  })

  return { success: true }
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
