import "./load-env"
import { prisma } from "../lib/prisma"
import { ingestInventoryImagesFromUrls, isStoredInventoryImageUrl } from "../lib/inventory-images"

const isExternalUrl = (value: string) => /^https?:\/\//i.test(value.trim())

async function main() {
  const items = await prisma.inventory.findMany({
    select: { id: true, slug: true, images: true },
    orderBy: { createdAt: "desc" },
  })

  let updated = 0
  let skipped = 0
  let failed = 0

  for (const item of items) {
    const normalized = item.images.map((src) => (typeof src === "string" ? src.trim() : "")).filter(Boolean)
    const hasAnyExternal = normalized.some((src) => isExternalUrl(src))

    if (!hasAnyExternal) {
      skipped += 1
      continue
    }

    const allExternal = normalized.length > 0 && normalized.every((src) => isExternalUrl(src))
    const startSortOrder = allExternal
      ? 0
      : ((await prisma.inventoryImage.findFirst({
          where: { inventoryId: item.id },
          orderBy: [{ sortOrder: "desc" }, { createdAt: "desc" }],
          select: { sortOrder: true },
        }))?.sortOrder ?? -1) + 1

    if (allExternal) {
      await prisma.inventoryImage.deleteMany({
        where: { inventoryId: item.id },
      })
    }

    const stored = await ingestInventoryImagesFromUrls(item.id, normalized, { startSortOrder })

    if (stored.length === 0) {
      skipped += 1
      continue
    }

    const changed = stored.length !== normalized.length || stored.some((value, idx) => value !== normalized[idx])
    if (!changed) {
      failed += 1
      console.log(`Failed to fetch images for ${item.slug} (upstream blocked)`)
      continue
    }

    await prisma.inventory.update({
      where: { id: item.id },
      data: { images: stored },
    })

    updated += 1
    console.log(`Stored ${stored.length} images for ${item.slug}`)
  }

  console.log(`Backfill complete: ${updated} updated, ${failed} failed, ${skipped} skipped.`)
}

main()
  .catch((error) => {
    console.error("Backfill failed", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
