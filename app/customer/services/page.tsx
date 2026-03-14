"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Sparkles, 
  Utensils, 
  Waves, 
  Car, 
  Clock, 
  Bell,
  Heart,
  ChevronRight,
  Info
} from "lucide-react"
import { mockServices } from "@/lib/mock-data"

export default function CustomerServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = [
    { id: "all", label: "All Services", icon: Sparkles },
    { id: "room_service", label: "Room Service", icon: Utensils },
    { id: "spa", label: "Spa & Wellness", icon: Waves },
    { id: "transport", label: "Transport", icon: Car },
    { id: "laundry", label: "Laundry", icon: Heart },
  ]

  const filteredServices = mockServices.filter(s => 
    selectedCategory === "all" || s.category === selectedCategory
  )

  return (
    <DashboardLayout requiredRoles={["customer"]} title="Experience Our Services">
      <div className="space-y-8">
        {/* Category Selection */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                className="rounded-full px-6 whitespace-nowrap"
                onClick={() => setSelectedCategory(cat.id)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {cat.label}
              </Button>
            )
          })}
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-primary/5 hover:border-primary/20">
              <div className="h-48 bg-muted relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <div className="absolute bottom-4 left-4 z-20 text-white">
                  <Badge className="mb-2 bg-primary/80 backdrop-blur-md border-none capitalize">
                    {service.category.replace('_', ' ')}
                  </Badge>
                  <h3 className="text-xl font-bold">{service.name}</h3>
                </div>
                {/* Image placeholder with accent color */}
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
              </div>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-6 line-clamp-2 h-10">
                  {service.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Price</p>
                    <p className="text-lg font-bold">
                      {service.price === 0 ? "Complimentary" : `ETB ${service.price.toLocaleString()}`}
                    </p>
                    <p className="text-[10px] text-muted-foreground capitalize">
                      {service.chargeType.replace('_', ' ')}
                    </p>
                  </div>
                  <Button size="sm" className="rounded-full shadow-md group">
                    Request <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Card */}
        <Card className="bg-primary/5 border-none">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <Info className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg mb-1">Standard Wait Times</h4>
              <p className="text-sm text-muted-foreground">
                Room service and laundry typically arrive within 30-45 minutes. For Spa and Transport, we recommend booking at least 2 hours in advance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
