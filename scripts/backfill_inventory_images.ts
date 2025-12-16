import "dotenv/config"
import { prisma } from "../lib/prisma"
import { ingestInventoryImagesFromUrls, isStoredInventoryImageUrl } from "../lib/inventory-images"

async function main() {
  const items = await prisma.inventory.findMany({
    select: { id: true, slug: true, images: true },
    orderBy: { createdAt: "desc" },
  })

  let updated = 0
  let skipped = 0

  for (const item of items) {
    const hasStoredImages = item.images.some((src) => isStoredInventoryImageUrl(src))
    const allExternal =
      item.images.length > 0 && item.images.every((src) => typeof src === "string" && /^https?:\/\//i.test(src.trim()))

    if (hasStoredImages || !allExternal) {
      skipped += 1
      continue
    }

    await prisma.inventoryImage.deleteMany({
      where: { inventoryId: item.id },
    })

    const stored = await ingestInventoryImagesFromUrls(item.id, item.images)

    await prisma.inventory.update({
      where: { id: item.id },
      data: { images: stored },
    })

    updated += 1
    console.log(`Stored ${stored.length} images for ${item.slug}`)
  }

  console.log(`Backfill complete: ${updated} updated, ${skipped} skipped.`)
}

main()
  .catch((error) => {
    console.error("Backfill failed", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

