"use server"

import { Prisma } from "@/lib/generated/prisma/client"
import type { Inventory } from "@/lib/generated/prisma/client"
import type { InventoryItem } from "@/lib/types/inventory"

export type { InventoryItem }
import { prisma } from "@/lib/prisma"

const serializeInventory = (item: Inventory): InventoryItem => ({
  ...item,
  price: item.price.toNumber(),
  createdAt: item.createdAt.toISOString(),
  updatedAt: item.updatedAt.toISOString(),
})

export async function getInventory(): Promise<InventoryItem[]> {
  const items = await prisma.inventory.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  })

  return items.map(serializeInventory)
}

export interface SellRequestInput {
  brand: string
  model: string
  expectedPrice?: string | null
  condition: string
  boxAndPapers: boolean
  imagesUrl?: string | null
  contactInfo: Prisma.JsonValue
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
