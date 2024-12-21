
// app/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  TestTubes, 
  Pill, 
  UserCheck, 
  PhoneCall,
  ArrowRight,
  ShieldCheck,
  Clock,
  MapPin 
} from "lucide-react"

const features = [
  {
    icon: TestTubes,
    title: "Lab Tests",
    description: "Book diagnostic tests from trusted labs across Pakistan"
  },
  {
    icon: Pill,
    title: "Medicine Delivery",
    description: "Order prescribed medicines with doorstep delivery"
  },
  {
    icon: UserCheck,
    title: "Doctor Consultations",
    description: "Connect with verified healthcare professionals"
  },
  {
    icon: PhoneCall,
    title: "Emergency Services",
    description: "Quick access to emergency medical assistance"
  }
]

const highlights = [
  {
    icon: ShieldCheck,
    title: "Verified Services",
    description: "All healthcare providers and services are thoroughly verified"
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Access healthcare services round the clock"
  },
  {
    icon: MapPin,
    title: "Nationwide Coverage",
    description: "Services available in major cities across Pakistan"
  }
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary" />
            <span className="font-bold text-xl">CareSync 360</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/admin"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Admin Dashboard
            </Link>
            <Button>Get Started</Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold max-w-2xl mx-auto leading-tight">
              Your Complete Healthcare Solution in Pakistan
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-xl mx-auto">
              Access quality healthcare services, book tests, order medicines, and connect with doctors - all in one platform.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button size="lg">View Services</Button>
              <Button size="lg" variant="outline">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Our Services
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => (
                <Card key={feature.title} className="p-6">
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Highlights Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {highlights.map((highlight) => (
                <div key={highlight.title} className="flex gap-4">
                  <highlight.icon className="h-8 w-8 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">{highlight.title}</h3>
                    <p className="text-muted-foreground">{highlight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="font-bold text-lg">CareSync 360</span>
              <p className="text-sm text-muted-foreground mt-1">
                © 2024 CareSync 360. All rights reserved.
              </p>
            </div>
            <div className="flex gap-6">
              <Link 
                href="#" 
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Privacy Policy
              </Link>
              <Link 
                href="#" 
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Terms of Service
              </Link>
              <Link 
                href="#" 
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
