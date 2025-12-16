import "dotenv/config"
import { prisma } from "../lib/prisma"

const canonicalBrands = ["Rolex", "Patek Philippe", "Audemars Piguet", "Omega", "Cartier", "Tudor", "Richard Mille"] as const
type CanonicalBrand = (typeof canonicalBrands)[number]

const detectCanonicalBrand = (text: string): CanonicalBrand | null => {
  const normalized = text.replace(/\s+/g, " ").trim()
  const upper = normalized.toUpperCase()

  if (upper.includes("R0LEX") || /\bROLEX\b/i.test(normalized)) return "Rolex"
  if (/\bA\.?P\.?\b/i.test(normalized) || /\bAP\b/i.test(normalized)) return "Audemars Piguet"
  if (/\bPATEK\b/i.test(normalized)) return "Patek Philippe"
  if (/\bAUDEMARS\b/i.test(normalized)) return "Audemars Piguet"

  for (const brand of canonicalBrands) {
    if (upper.includes(brand.toUpperCase())) return brand
  }

  return null
}

const normalizeCondition = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return value

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

const stripBrandPrefix = (model: string, brand: CanonicalBrand) => {
  const aliases: Record<CanonicalBrand, string[]> = {
    Rolex: ["Rolex"],
    Omega: ["Omega"],
    Cartier: ["Cartier"],
    Tudor: ["Tudor"],
    "Richard Mille": ["Richard Mille", "RM"],
    "Patek Philippe": ["Patek Philippe", "Patek"],
    "Audemars Piguet": ["Audemars Piguet", "Audemars", "AP", "A.P."],
  }

  let result = model.trim()
  for (const prefix of aliases[brand]) {
    const escaped = prefix.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")
    result = result.replace(new RegExp(`^${escaped}\\s+`, "i"), "")
  }

  return result.trim()
}

async function main() {
  const items = await prisma.inventory.findMany({
    select: {
      id: true,
      brand: true,
      model: true,
      condition: true,
      description: true,
      tags: true,
    },
  })

  let updated = 0
  let skipped = 0

  for (const item of items) {
    const candidates = [item.brand, item.model, item.description].filter(Boolean).join(" ")
    const detected = detectCanonicalBrand(candidates)

    const needsBrandFix =
      /^\d{4}$/.test(item.brand) || item.brand === "AP" || (detected !== null && item.brand !== detected)

    const nextBrand = detected ?? item.brand
    const nextCondition = normalizeCondition(item.condition)

    const nextModel =
      detected && item.model.toLowerCase().startsWith(detected.toLowerCase())
        ? stripBrandPrefix(item.model, detected)
        : detected
          ? stripBrandPrefix(item.model, detected)
          : item.model

    const nextTags =
      detected && !item.tags.includes(detected)
        ? Array.from(new Set([...item.tags, detected]))
        : item.tags

    const shouldUpdate =
      (needsBrandFix && detected && item.brand !== detected) ||
      nextCondition !== item.condition ||
      nextModel !== item.model ||
      nextTags.length !== item.tags.length

    if (!shouldUpdate) {
      skipped += 1
      continue
    }

    await prisma.inventory.update({
      where: { id: item.id },
      data: {
        ...(detected && item.brand !== detected ? { brand: detected } : {}),
        ...(nextModel !== item.model ? { model: nextModel } : {}),
        ...(nextCondition !== item.condition ? { condition: nextCondition } : {}),
        ...(nextTags.length !== item.tags.length ? { tags: nextTags } : {}),
      },
    })

    updated += 1
  }

  console.log(`Backfill complete: ${updated} updated, ${skipped} unchanged.`)
}

main()
  .catch((error) => {
    console.error("Backfill failed", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

