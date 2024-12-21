
// components/admin/navigation.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Menu, Activity, TestTubes, Pill, UserCog, PhoneCall } from "lucide-react"

const routes = [
  {
    label: "Overview",
    href: "/admin",
    icon: Activity
  },
  {
    label: "Test Bookings",
    href: "/admin/test-bookings",
    icon: TestTubes
  },
  {
    label: "Medicine Orders",
    href: "/admin/medicine-orders",
    icon: Pill
  },
  {
    label: "Doctor Verifications",
    href: "/admin/doctor-verifications",
    icon: UserCog
  },
  {
    label: "Emergency Contacts",
    href: "/admin/emergency-contacts",
    icon: PhoneCall
  }
]

export function Navigation() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile Navigation */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            className="md:hidden fixed top-4 left-4 p-2"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <nav className="flex flex-col gap-4 p-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === route.href 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted"
                )}
              >
                <route.icon className="h-5 w-5" />
                {route.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b z-50">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/admin" className="font-bold text-xl">
            Admin Dashboard
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors",
                  pathname === route.href 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  )
}
