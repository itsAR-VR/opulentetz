import { Prisma } from "../generated/prisma/client"
import { prisma } from "../prisma"

export type RawListing = {
  product_id?: string | number
  final_price?: number | string
  images?: string[]
  url?: string
  description?: string
  title?: string
  status?: string
  featured?: boolean
  boxAndPapers?: boolean
}

export type ImportSummary = {
  created: number
  updated: number
  skipped: number
}

const knownBrands = ["Rolex", "Omega", "Audemars Piguet", "Patek Philippe", "AP"]

export const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const detectBrand = (title: string) => {
  const normalized = title.trim()
  const upper = normalized.toUpperCase()

  if (upper.includes("R0LEX")) {
    return "Rolex"
  }

  for (const brand of knownBrands) {
    if (upper.startsWith(brand.toUpperCase())) {
      if (brand === "AP") return "Audemars Piguet"
      return brand
    }
  }

  const firstWord = normalized.split(" ")[0]
  return firstWord || "Rolex"
}

const parseYear = (title: string, description?: string) => {
  const yearFromDescription = description?.match(/Year:\s*(\d{4})/i)
  if (yearFromDescription?.[1]) {
    return Number(yearFromDescription[1])
  }

  const yearFromTitle = title.match(/\b(19|20)\d{2}\b/)
  if (yearFromTitle?.[0]) {
    return Number(yearFromTitle[0])
  }

  return new Date().getFullYear()
}

const parseReference = (title: string, description?: string) => {
  const refFromDescription = description?.match(/Ref:?\s*([A-Za-z0-9\-\.]+)/i)
  if (refFromDescription?.[1]) {
    return refFromDescription[1]
  }

  const referenceInParens = title.match(/\(([^)]+)\)/)
  if (referenceInParens?.[1]) {
    return referenceInParens[1]
  }

  return "unlisted-reference"
}

const parseCondition = (description?: string) => {
  const conditionFromDescription = description?.match(/Condition:\s*([^\n\r]+)/i)
  if (conditionFromDescription?.[1]) {
    return conditionFromDescription[1].trim()
  }

  const known = ["Unworn", "Excellent", "Very Good", "Good"]
  const found = known.find((condition) => description?.toLowerCase().includes(condition.toLowerCase()))
  return found ?? "Excellent"
}

const deriveModel = (title: string, brand: string, year: number, reference: string) => {
  let model = title
  if (brand) {
    model = model.replace(new RegExp(`^${brand}\\s*`, "i"), "")
  }
  if (year) {
    model = model.replace(new RegExp(String(year), "g"), "")
  }
  if (reference) {
    const escapedRef = reference.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")
    model = model.replace(new RegExp(escapedRef, "ig"), "")
  }

  return model.replace(/\([^)]*\)/g, "").replace(/\s+/g, " ").trim() || title
}

const parsePrice = (value?: number | string) => {
  if (typeof value === "number") return value
  if (typeof value === "string") {
    const numeric = value.replace(/[^0-9.]/g, "")
    const parsed = Number(numeric)
    if (!Number.isNaN(parsed)) return parsed
  }
  return 0
}

export const ensureUniqueSlug = async (baseSlug: string, externalId?: string) => {
  const fallback = externalId ? toSlug(externalId) : "inventory-item"
  const initial = baseSlug || fallback
  let slug = initial
  let suffix = 1

  // Avoid collisions with other items that do not share the same externalId
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.inventory.findFirst({
      where: externalId ? { slug, NOT: { externalId } } : { slug },
      select: { id: true },
    })
    if (!existing) break
    slug = `${initial}-${suffix}`
    suffix += 1
  }

  return slug
}

const normalizeImages = (images?: string[]) => {
  if (!Array.isArray(images)) return [] as string[]
  return images.filter((url) => typeof url === "string" && url.trim().length > 0)
}

const upsertListing = async (item: RawListing) => {
  const externalId = item.product_id?.toString()
  if (!externalId) {
    return { created: false, skipped: true }
  }

  const title = item.title ?? "Untitled Listing"
  const description = item.description ?? ""
  const brand = detectBrand(title)
  const year = parseYear(title, description)
  const reference = parseReference(title, description)
  const model = deriveModel(title, brand, year, reference)
  const price = parsePrice(item.final_price)
  const condition = parseCondition(description)
  const images = normalizeImages(item.images)
  const slugBase = toSlug(`${brand}-${model}-${reference}`)
  const slug = await ensureUniqueSlug(slugBase, externalId)
  const status = item.status ?? "Available"
  const featured = Boolean(item.featured)
  const boxAndPapers = item.boxAndPapers ?? true

  const existing = await prisma.inventory.findUnique({
    where: { externalId },
    select: { id: true },
  })

  await prisma.inventory.upsert({
    where: { externalId },
    update: {
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
      sourceUrl: item.url ?? null,
    },
    create: {
      externalId,
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
      sourceUrl: item.url ?? null,
    },
  })

  return { created: !existing, skipped: false }
}

export const parseListingsFromJson = (raw: unknown): RawListing[] => {
  if (Array.isArray(raw)) return raw as RawListing[]
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>
    if (Array.isArray(obj.items)) return obj.items as RawListing[]
    if (Array.isArray(obj.data)) return obj.data as RawListing[]
  }
  return []
}

export async function importListings(entries: RawListing[]): Promise<ImportSummary> {
  let created = 0
  let updated = 0
  let skipped = 0

  for (const entry of entries) {
    const result = await upsertListing(entry)
    if (result.skipped) {
      skipped += 1
      continue
    }
    if (result.created) {
      created += 1
    } else {
      updated += 1
    }
  }

  return { created, updated, skipped }
}
