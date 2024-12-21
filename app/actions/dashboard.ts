"use server"

import { db } from "@/lib/db"
import { addMonths, startOfMonth, endOfMonth } from "date-fns"

export async function getDashboardMetrics() {
  try {
    const currentDate = new Date()
    const startOfCurrentMonth = startOfMonth(currentDate)
    const endOfCurrentMonth = endOfMonth(currentDate)

    const [
      totalMonthlyBookings,
      totalMedicineOrders,
      pendingVerifications,
      emergencyContacts
    ] = await Promise.all([
      // Test bookings this month
      db.test_bookings.count({
        where: {
          createdAt: {
            gte: startOfCurrentMonth,
            lte: endOfCurrentMonth
          }
        }
      }),
      // Medicine orders this month
      db.medicine_orders.count({
        where: {
          createdAt: {
            gte: startOfCurrentMonth,
            lte: endOfCurrentMonth
          }
        }
      }),
      // Pending doctor verifications
      db.doctorVerification.count({
        where: {
          status: "PENDING"
        }
      }),
      // Emergency contacts count
      db.emergency_patient_details.count()
    ])

    return {
      totalMonthlyBookings,
      totalMedicineOrders,
      pendingVerifications,
      emergencyContacts
    }
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error)
    throw new Error("Failed to fetch dashboard metrics")
  }
}

export async function getRecentActivities() {
  try {
    const [
      recentBookings,
      recentOrders,
      recentVerifications,
      recentEmergencyContacts
    ] = await Promise.all([
      // Recent test bookings
      db.test_bookings.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          patients: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }),
      // Recent medicine orders
      db.medicine_orders.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          transactions:
           {
            select:{
                status:true,
                paymentDate:true,
                amount:true,
                id:true,
                stripePaymentId:true
            }
           } 
        }
      }),
      // Recent doctor verifications
      db.doctorVerification.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          fullName: true,
          email: true,
          status: true,
          createdAt: true
        }
      }),
      // Recent emergency contacts
      db.emergency_patient_details.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          patients: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })
    ])

    return {
      recentBookings,
      recentOrders,
      recentVerifications,
      recentEmergencyContacts
    }
  } catch (error) {
    console.error("Error fetching recent activities:", error)
    throw new Error("Failed to fetch recent activities")
  }
}

export async function getChartData() {
  try {
    const startDate = startOfMonth(addMonths(new Date(), -1))
    const endDate = endOfMonth(new Date())

    const [bookings, orders] = await Promise.all([
      // Test bookings by date
      db.test_bookings.groupBy({
        by: ['createdAt'],
        _count: true,
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      }),
      // Medicine orders by date
      db.medicine_orders.groupBy({
        by: ['createdAt'],
        _count: true,
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      })
    ])

    return {
      bookings,
      orders
    }
  } catch (error) {
    console.error("Error fetching chart data:", error)
    throw new Error("Failed to fetch chart data")
  }
}