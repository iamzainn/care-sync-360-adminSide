// lib/actions/test-booking.ts
"use server"

import { revalidatePath } from "next/cache"
import { db } from "../db"
import { BookingStatus } from "@prisma/client"

export async function updateBookingStatus(
  bookingId: string,
  status: string
) {
  try {
    await db.test_bookings.update({
      where: { id: bookingId },
      data: { status :status as BookingStatus  }
    })

    revalidatePath("/admin/test-bookings")
    return { success: true }
  } catch (error) {
    console.error("Failed to update booking status:", error)
    return { success: false, error: "Failed to update status" }
  }
}