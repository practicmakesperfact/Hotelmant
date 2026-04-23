"use client"

import { useState } from "react"
import { PublicLayout } from "@/components/layout/public-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Calendar, 
  Users, 
  MapPin, 
  DollarSign,
  Wifi,
  Monitor,
  Coffee,
  Mic,
  Video,
  CheckCircle2
} from "lucide-react"
import { mockConferenceHalls } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { useLocale } from "@/lib/i18n/locale-context"

export default function EventsPage() {
  const { t } = useLocale()
  const { toast } = useToast()
  const [selectedHall, setSelectedHall] = useState<typeof mockConferenceHalls[0] | null>(null)
  const [showInquiry, setShowInquiry] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "conference",
    eventDate: "",
    numberOfGuests: "",
    requirements: ""
  })

  const handleInquiry = () => {
    toast({
      title: t.events.inquirySubmitted,
      description: t.events.contactWithin24,
    })
    setShowInquiry(false)
    setFormData({
      name: "",
      email: "",
      phone: "",
      eventType: "conference",
      eventDate: "",
      numberOfGuests: "",
      requirements: ""
    })
  }

  const amenityIcons: Record<string, any> = {
    'Projector': Monitor,
    'Sound System': Mic,
    'WiFi': Wifi,
    'Video Conferencing': Video,
    'Catering Service': Coffee,
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-secondary/30 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl font-serif font-bold mb-4">{t.events.title}</h1>
            <p className="text-muted-foreground text-lg">
              {t.events.subtitle}
            </p>
          </div>

          {/* Features */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Users, title: t.events.flexibleCapacity, desc: t.events.from20to500 },
              { icon: Monitor, title: t.events.modernTech, desc: t.events.avEquipment },
              { icon: Coffee, title: t.events.catering, desc: t.events.fullFBServices },
              { icon: CheckCircle2, title: t.events.fullSupport, desc: t.events.dedicatedTeam },
            ].map((feature, i) => (
              <Card key={i} className="text-center p-6">
                <feature.icon className="h-10 w-10 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>

          {/* Conference Halls */}
          <div className="space-y-8">
            <h2 className="text-2xl font-serif font-bold text-center mb-8">{t.events.ourVenues}</h2>
            
            {mockConferenceHalls.map((hall) => (
              <Card key={hall.id} className="overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative aspect-[4/3] md:aspect-auto">
                    <img 
                      src={hall.images[0]} 
                      alt={hall.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-serif font-bold mb-2">{hall.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              Up to {hall.capacity} guests
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {hall.size} sqm
                            </div>
                          </div>
                        </div>
                        <Badge variant={hall.isAvailable ? "secondary" : "outline"}>
                          {hall.isAvailable ? t.events.available : t.events.booked}
                        </Badge>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-sm font-semibold mb-3">{t.events.amenitiesEquipment}</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {hall.amenities.map((amenity) => {
                            const Icon = amenityIcons[amenity] || CheckCircle2
                            return (
                              <div key={amenity} className="flex items-center gap-2 text-sm">
                                <Icon className="h-4 w-4 text-primary" />
                                <span>{amenity}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div className="bg-secondary/30 rounded-lg p-4 mb-6">
                        <h4 className="text-sm font-semibold mb-2">{t.events.pricing}</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">{t.events.perHour}</p>
                            <p className="text-lg font-bold text-primary">ETB {hall.pricePerHour.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">{t.events.fullDay}</p>
                            <p className="text-lg font-bold text-primary">ETB {hall.pricePerDay.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => {
                        setSelectedHall(hall)
                        setShowInquiry(true)
                      }}
                      disabled={!hall.isAvailable}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      {t.events.requestBooking}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Event Types */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle>{t.events.perfectFor}</CardTitle>
              <CardDescription>{t.events.weHost}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  "Corporate Conferences",
                  "Business Meetings",
                  "Wedding Receptions",
                  "Product Launches",
                  "Training Sessions",
                  "Seminars & Workshops",
                  "Gala Dinners",
                  "Private Parties"
                ].map((type) => (
                  <div key={type} className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm">{type}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Inquiry Dialog */}
      <Dialog open={showInquiry} onOpenChange={setShowInquiry}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t.events.eventInquiry}</DialogTitle>
            <DialogDescription>
              {selectedHall?.name} - {t.events.tellUsAbout}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t.events.yourName} *</Label>
                <Input 
                  id="name" 
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t.events.phone} *</Label>
                <Input 
                  id="phone" 
                  placeholder="+251911223344"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t.events.email} *</Label>
              <Input 
                id="email" 
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventDate">{t.events.eventDate} *</Label>
                <Input 
                  id="eventDate" 
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guests">{t.events.numberOfGuests} *</Label>
                <Input 
                  id="guests" 
                  type="number"
                  placeholder="50"
                  value={formData.numberOfGuests}
                  onChange={(e) => setFormData({...formData, numberOfGuests: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="requirements">{t.events.specialRequirements}</Label>
              <Textarea 
                id="requirements" 
                placeholder={t.events.anySpecialSetup}
                value={formData.requirements}
                onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInquiry(false)}>{t.common.cancel}</Button>
            <Button onClick={handleInquiry}>{t.events.submitInquiry}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PublicLayout>
  )
}
