// types/dashboard.ts
export interface DashboardMetrics {
  totalMonthlyBookings: number
  totalMedicineOrders: number
  pendingDoctorVerifications: number
  pendingNurseVerifications: number
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
  recentDoctorVerifications: {
    id: string
    fullName: string
    email: string
    status: string
    createdAt: Date
  }[]
  recentNurseVerifications: {
    id: string
    status: string
    createdAt: Date
    nurses: {
      name: string
      email: string
    }
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
