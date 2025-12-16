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

  if (/\bA\.?P\.?\b/i.test(normalized) || /\bAP\b/i.test(normalized)) {
    return "Audemars Piguet"
  }

  const canonicalBrands = ["Rolex", "Patek Philippe", "Audemars Piguet", "Omega", "Cartier", "Tudor", "Richard Mille"]

  // Prefer explicit multi-word matches
  for (const brand of canonicalBrands) {
    if (upper.includes(brand.toUpperCase())) {
      return brand
    }
  }

  // Helpful partials/aliases
  if (/\bPATEK\b/i.test(normalized)) return "Patek Philippe"
  if (/\bAUDEMARS\b/i.test(normalized)) return "Audemars Piguet"

  // Fallback: first non-year token
  const withoutLeadingYear = normalized.replace(/^(19|20)\d{2}\s+/, "")
  const firstWord = withoutLeadingYear.split(" ")[0]
  if (!firstWord) return "Rolex"
  if (/^\d{4}$/.test(firstWord)) return "Rolex"
  return firstWord
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
  const normalizeCondition = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return "Excellent"

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

  const conditionFromDescription = description?.match(/Condition:\s*([^\n\r]+)/i)
  if (conditionFromDescription?.[1]) {
    return normalizeCondition(conditionFromDescription[1])
  }

  const known = ["Brand New Unworn", "Brand New", "Unworn", "Mint", "Excellent", "Very Good", "Good", "Fair"]
  const found = known.find((condition) => description?.toLowerCase().includes(condition.toLowerCase()))
  return normalizeCondition(found ?? "Excellent")
}

const deriveModel = (title: string, brand: string, year: number, reference: string) => {
  let model = title

  // Remove leading year first (common in marketplace titles)
  if (year) {
    model = model.replace(new RegExp(`^\\s*${year}\\s*`, "i"), "")
  }

  const brandAliases: Record<string, string[]> = {
    "Audemars Piguet": ["Audemars Piguet", "Audemars", "AP", "A.P."],
    "Patek Philippe": ["Patek Philippe", "Patek"],
    Rolex: ["Rolex"],
    Omega: ["Omega"],
    Cartier: ["Cartier"],
    Tudor: ["Tudor"],
    "Richard Mille": ["Richard Mille", "RM"],
  }

  const prefixesToStrip = brandAliases[brand] ?? (brand ? [brand] : [])
  for (const prefix of prefixesToStrip) {
    if (!prefix) continue
    const escaped = prefix.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")
    model = model.replace(new RegExp(`^\\s*${escaped}\\s*`, "i"), "")
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
