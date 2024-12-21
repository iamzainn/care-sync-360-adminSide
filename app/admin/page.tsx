// app/admin/page.tsx
import { Suspense } from "react"
import { getDashboardMetrics, getRecentActivities } from "../actions/dashboard"
import { DashboardSkeleton } from "@/components/admin/dashboard-skeleton"
import { RecentActivities } from "@/components/admin/recent-activities"
import { DashboardMetrics } from "@/components/admin/dashboard-metrics"


export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminDashboard() {
  const [metrics, activities] = await Promise.all([
    getDashboardMetrics(),
    getRecentActivities()
  ])

  return (
    <div className="space-y-8">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardMetrics metrics={metrics} />
        <RecentActivities activities={activities as any} />
      </Suspense>
    </div>
  )
}