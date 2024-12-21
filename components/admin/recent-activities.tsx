import { format } from "date-fns"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RecentActivities as Activities } from "./types/dashboard"

function StatusBadge({ status }: { status: string }) {
  const variant = status === "COMPLETED" 
    ? "default" 
    : status === "PENDING" 
    ? "outline" 
    : "secondary"

  return <Badge variant={variant}>{status}</Badge>
}

export function RecentActivities({ activities }: { activities: Activities }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Test Bookings */}
      <Card className="p-6">
        <h3 className="font-medium mb-4">Recent Test Bookings</h3>
        <div className="space-y-4">
          {activities.recentBookings.map((booking) => (
            <div key={booking.id} className="flex items-start justify-between">
              <div>
                <p className="font-medium">{booking.patients.name}</p>
                <p className="text-sm text-muted-foreground">{booking.patients.email}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {format(new Date(booking.createdAt), 'MMM dd, yyyy')}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Medicine Orders */}
      <Card className="p-6">
        <h3 className="font-medium mb-4">Recent Medicine Orders</h3>
        <div className="space-y-4">
          {activities.recentOrders.map((order) => (
            <div key={order.id} className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <StatusBadge status={order.transactions?.status || 'PENDING'} />
                  <p className="text-sm mt-1">
                    Amount: Rs. {order.transactions?.amount}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                </p>
              </div>
              {order.transactions?.stripePaymentId && (
                <p className="text-xs text-muted-foreground">
                  Payment ID: {order.transactions.stripePaymentId}
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Doctor Verifications */}
      <Card className="p-6">
        <h3 className="font-medium mb-4">Recent Verification Requests</h3>
        <div className="space-y-4">
          {activities.recentVerifications.map((verification) => (
            <div key={verification.id} className="flex items-start justify-between">
              <div>
                <p className="font-medium">{verification.fullName}</p>
                <p className="text-sm text-muted-foreground">{verification.email}</p>
                <StatusBadge status={verification.status} />
              </div>
              <p className="text-sm text-muted-foreground">
                {format(new Date(verification.createdAt), 'MMM dd, yyyy')}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Emergency Contacts */}
      <Card className="p-6">
        <h3 className="font-medium mb-4">Recent Emergency Contacts</h3>
        <div className="space-y-4">
          {activities.recentEmergencyContacts.map((contact) => (
            <div key={contact.id} className="flex items-start justify-between">
              <div>
                <p className="font-medium">{contact.patients.name}</p>
                <p className="text-sm text-muted-foreground">{contact.patients.email}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {format(new Date(contact.createdAt), 'MMM dd, yyyy')}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}