import type { Inventory } from "@/lib/generated/prisma/client"
import type { InventoryItem, SellRequestInput } from "@/lib/types/inventory"
import { prisma } from "@/lib/prisma"

const serializeInventory = (item: Inventory): InventoryItem => ({
  ...item,
  price: item.price.toNumber(),
  createdAt: item.createdAt.toISOString(),
  updatedAt: item.updatedAt.toISOString(),
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
