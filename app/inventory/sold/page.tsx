import { getInventory } from "@/lib/actions"
import InventoryClient from "../inventory-client"

export const dynamic = "force-dynamic"

export default async function SoldInventoryPage() {
  const watches = await getInventory()
  return <InventoryClient watches={watches} view="sold" />
}
