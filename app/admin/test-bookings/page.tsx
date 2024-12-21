
// app/admin/test-bookings/page.tsx
import { Metadata } from "next"
import { db } from "@/lib/db"
import { TestBookingsTable } from "@/components/test-bookings/test-bookings-table"

export const metadata: Metadata = {
  title: "Lab Test Bookings",
  description: "Manage and view all lab test bookings"
}

async function getTestBookings() {
  return await db.test_bookings.findMany({
    include: {
      patients: {
        select: {
          name: true,
          email: true,
          phone: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export default async function TestBookingsPage() {
  const bookings = await getTestBookings()

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lab Test Bookings</h1>
      </div>
      <TestBookingsTable bookings={bookings as any} />
    </div>
  )
}
