
// components/admin/dashboard-metrics.tsx
import { Card } from "@/components/ui/card"
import {  TestTubes, Pill, UserCheck, PhoneCall } from "lucide-react"
import { DashboardMetrics as Metrics } from "./types/dashboard"

const MetricCard = ({ 
  title, 
  value, 
  icon: Icon,
  description 
}: { 
  title: string
  value: number
  icon: React.ElementType
  description: string
}) => (
  <Card className="p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold mt-2">{value}</p>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="rounded-full p-3 bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
    </div>
  </Card>
)

export function DashboardMetrics({ metrics }: { metrics: Metrics }) {
  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Overview</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Test Bookings"
          value={metrics.totalMonthlyBookings}
          icon={TestTubes}
          description="Total bookings this month"
        />
        <MetricCard
          title="Medicine Orders"
          value={metrics.totalMedicineOrders}
          icon={Pill}
          description="Total orders this month"
        />
        <MetricCard
          title="Pending Verifications"
          value={metrics.pendingVerifications}
          icon={UserCheck}
          description="Doctors awaiting verification"
        />
        <MetricCard
          title="Emergency Contacts"
          value={metrics.emergencyContacts}
          icon={PhoneCall}
          description="Total registered contacts"
        />
      </div>
    </div>
  )
}
