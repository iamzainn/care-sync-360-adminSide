// src/types/index.ts
import { type medicine_orders, type transactions, } from "@prisma/client"

export type MedicineOrderWithTransaction = medicine_orders & {
  transaction: transactions | null
}

export type OrderTableData = {
  id: string
  patientName: string
  medicines: string[]
  totalAmount: number
  paymentStatus: string
  orderStatus: string
  pharmacyName: string | null
  createdAt: Date
  transaction: {

    id: string
    paymentDate: Date
    stripePaymentId: string | null
  } | null
}


export const ORDER_STATUSES = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
} as const