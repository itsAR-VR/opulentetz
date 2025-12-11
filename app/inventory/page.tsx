import { getInventory } from "@/lib/actions"
import InventoryClient from "./inventory-client"

export default async function InventoryPage() {
  const watches = await getInventory()

  return <InventoryClient watches={watches} />
}
