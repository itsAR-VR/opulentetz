import AdminDashboardClient from "./dashboard-client"
import { getSessionEmail } from "@/lib/admin-auth"
import { getSellRequests, getInquiries, getAdminInventory } from "./actions"

export default async function AdminDashboardPage() {
  const sessionEmail = await getSessionEmail()
  
  // Only fetch data if user is logged in
  let sellRequests: Awaited<ReturnType<typeof getSellRequests>> = []
  let inquiries: Awaited<ReturnType<typeof getInquiries>> = []
  let inventory: Awaited<ReturnType<typeof getAdminInventory>> = []
  
  if (sessionEmail) {
    try {
      ;[sellRequests, inquiries, inventory] = await Promise.all([
        getSellRequests(),
        getInquiries(),
        getAdminInventory(),
      ])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    }
  }
  
  return (
    <AdminDashboardClient
      sessionEmail={sessionEmail}
      sellRequests={sellRequests}
      inquiries={inquiries}
      inventory={inventory}
    />
  )
}
