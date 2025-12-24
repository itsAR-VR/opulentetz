import type { Inventory } from "@/lib/generated/prisma/client"
import type { InventoryItem, SellRequestInput } from "@/lib/types/inventory"
import { prisma } from "@/lib/prisma"
import { unstable_cache } from "next/cache"

const serializeInventory = (item: Inventory): InventoryItem => ({
  ...item,
  price: item.price.toNumber(),
  createdAt: item.createdAt.toISOString(),
  updatedAt: item.updatedAt.toISOString(),
})

export type WatchSummary = Pick<
  InventoryItem,
  "id" | "brand" | "model" | "reference" | "year" | "condition" | "price" | "status" | "images" | "slug"
>

const getHomeWatchesUncached = async (): Promise<WatchSummary[]> => {
  const items = await prisma.inventory.findMany({
    where: { visibility: "PUBLIC", status: { not: "Sold" } },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: 24,
    select: {
      id: true,
      brand: true,
      model: true,
      reference: true,
      year: true,
      condition: true,
      price: true,
      status: true,
      images: true,
      slug: true,
    },
  })

  return items.map((item) => ({
    ...item,
    price: item.price.toNumber(),
  }))
}

export const getHomeWatches = unstable_cache(getHomeWatchesUncached, ["home-watches-v1"], {
  revalidate: 60,
})

export async function getInventory(): Promise<InventoryItem[]> {
  const items = await prisma.inventory.findMany({
    where: { visibility: "PUBLIC" },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  })

  return items.map(serializeInventory)
}

export async function submitSellRequest(input: SellRequestInput) {
  const record = await prisma.sellRequest.create({
    data: {
      brand: input.brand,
      model: input.model,
      expectedPrice: input.expectedPrice ?? null,
      condition: input.condition,
      boxAndPapers: input.boxAndPapers,
      imagesUrl: input.imagesUrl ?? null,
      contactInfo: input.contactInfo,
      status: "New",
    },
  })

  return record
}
