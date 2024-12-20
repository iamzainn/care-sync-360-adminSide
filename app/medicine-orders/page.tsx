// src/app/medicine-orders/page.tsx
import { Metadata } from "next"
import { db } from "@/lib/db"
import { OrdersTable } from "@/components/orders-table"


export const metadata: Metadata = {
  title: "Medicine Orders",
  description: "Manage and view all medicine orders",
}

async function getMedicineOrders() {
  return await db.medicine_orders.findMany({
    
    include: {
     transactions:true
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export default async function MedicineOrdersPage() {
  const orders = await getMedicineOrders()

  console.log(JSON.stringify(orders,null,2))

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Medicine Orders</h1>
      <OrdersTable orders={orders as any} />
    </div>
  )
}