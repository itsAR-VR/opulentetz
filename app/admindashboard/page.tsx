import AdminDashboardClient from "./dashboard-client"
import { getSessionEmail } from "@/lib/admin-auth"

export default async function AdminDashboardPage() {
  const sessionEmail = getSessionEmail()
  return <AdminDashboardClient sessionEmail={sessionEmail} />
}
