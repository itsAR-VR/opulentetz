import type { Inventory, Prisma } from "@/lib/generated/prisma/client"

export type InventoryItem = Omit<Inventory, "price" | "createdAt" | "updatedAt"> & {
  price: number
  createdAt: string
  updatedAt: string
}

export interface SellRequestInput {
  brand: string
  model: string
  expectedPrice?: string | null
  condition: string
  boxAndPapers: boolean
  imagesUrl?: string | null
  contactInfo: Prisma.InputJsonValue
}
