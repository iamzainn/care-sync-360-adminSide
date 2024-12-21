
// components/admin/dashboard-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

function MetricSkeleton() {
  return (
    <Card className="p-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-8 w-[60px]" />
        <Skeleton className="h-4 w-[130px]" />
      </div>
    </Card>
  )
}

function ActivitySkeleton() {
  return (
    <Card className="p-6">
      <Skeleton className="h-6 w-[140px] mb-4" />
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-4 w-[160px]" />
            </div>
            <Skeleton className="h-4 w-[80px]" />
          </div>
        ))}
      </div>
    </Card>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <MetricSkeleton key={i} />
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <ActivitySkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
