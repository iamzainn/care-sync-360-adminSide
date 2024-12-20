"use server"

import { db } from "@/lib/db"
import { OrderStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    console.log("order status : ",status)
    await db.medicine_orders.update({
      where: { id: orderId },
      data: { orderStatus: status }
    })

    console.log("success")
    
    revalidatePath("/medicine-orders")
    return { success: true }
  } catch (error) {
    console.error("Failed to update order status:", error)
    return { success: false, error: "Failed to update order status" }
  }
}