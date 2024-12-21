
// types/dashboard.ts
export interface DashboardMetrics {
  totalMonthlyBookings: number
  totalMedicineOrders: number
  pendingVerifications: number
  emergencyContacts: number
}

export interface RecentActivities {
  recentBookings: {
    id: string
    createdAt: Date
    patients: {
      name: string
      email: string
    }
  }[]
  recentOrders: {
    id: string
    createdAt: Date
    transactions: {
      status: string
      paymentDate: Date
      amount: number
      id: string
      stripePaymentId: string | null
    }
  }[]
  recentVerifications: {
    id: string
    fullName: string
    email: string
    status: string
    createdAt: Date
  }[]
  recentEmergencyContacts: {
    id: string
    createdAt: Date
    patients: {
      name: string
      email: string
    }
  }[]
}

export interface ChartData {
  bookings: {
    createdAt: Date
    _count: number
  }[]
  orders: {
    createdAt: Date
    _count: number
  }[]
}
