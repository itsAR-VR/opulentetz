import type { Inventory } from "@/lib/generated/prisma/client"

export type InventoryItem = Omit<Inventory, "price" | "createdAt" | "updatedAt"> & {
  price: number
  createdAt: string
  updatedAt: string
}
