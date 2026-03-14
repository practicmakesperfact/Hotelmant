"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { PublicLayout } from "@/components/layout/public-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useLocale } from "@/lib/i18n/locale-context"
import { mockRooms, mockServices } from "@/lib/mock-data"
import { CalendarDays, Users, CreditCard, Check, ArrowRight, ArrowLeft, Coffee, Utensils, Car, Sparkles } from "lucide-react"
import { format, differenceInDays, addDays } from "date-fns"
import { useBookings } from "@/lib/hooks/use-bookings"
import type { Booking, RoomType } from "@/lib/types"

type BookingStep = "details" | "extras" | "payment" | "confirmation"

function BookingContent() {
  const { t } = useLocale()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const roomIdParam = searchParams.get("room")
  const checkInParam = searchParams.get("checkIn")
  const checkOutParam = searchParams.get("checkOut")
  const guestsParam = searchParams.get("guests")
  
  // Find room by either direct ID matching or first available of the given type
  const room = mockRooms.find(r => r.id === roomIdParam) || mockRooms.find(r => r.type === roomIdParam);
  
  const { addBooking } = useBookings()
  
  const [step, setStep] = useState<BookingStep>("details")
  const [checkIn, setCheckIn] = useState(checkInParam || format(addDays(new Date(), 1), "yyyy-MM-dd"))
  const [checkOut, setCheckOut] = useState(checkOutParam || format(addDays(new Date(), 3), "yyyy-MM-dd"))
  const [guests, setGuests] = useState(parseInt(guestsParam || "2"))
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [guestInfo, setGuestInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: ""
  })
  const [paymentMethod, setPaymentMethod] = useState<"chapa" | "telebirr" | "card" | "bank_transfer">("chapa")
  const [isProcessing, setIsProcessing] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookingRef, setBookingRef] = useState("")

  const nights = differenceInDays(new Date(checkOut), new Date(checkIn))
  const roomTotal = room ? room.pricePerNight * nights : 0
  const servicesTotal = selectedServices.reduce((sum, serviceId) => {
    const service = mockServices.find(s => s.id === serviceId)
    return sum + (service?.price || 0)
  }, 0)
  const subtotal = roomTotal + servicesTotal
  const tax = subtotal * 0.15
  const total = subtotal + tax

  const steps = [
    { id: "details", label: t.booking.guestDetails, icon: Users },
    { id: "extras", label: t.booking.addOns, icon: Coffee },
    { id: "payment", label: t.payment.title, icon: CreditCard },
    { id: "confirmation", label: t.booking.confirmBooking, icon: Check }
  ]

  const handleNextStep = () => {
    if (step === "details") setStep("extras")
    else if (step === "extras") setStep("payment")
    else if (step === "payment") handlePayment()
  }

  const handlePrevStep = () => {
    if (step === "extras") setStep("details")
    else if (step === "payment") setStep("extras")
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    const ref = `BK-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
    setBookingRef(ref)
    
    // Save to local storage mock backend
    if (room) {
      const selectedAddOns = selectedServices.map(serviceId => {
        const service = mockServices.find(s => s.id === serviceId)
        return {
          id: serviceId,
          name: service?.name || 'Unknown Service',
          price: service?.price || 0,
          quantity: 1
        }
      })

      const newBooking: Booking = {
        id: ref,
        bookingNumber: ref,
        customerId: `cust-guest-${Date.now()}`,
        customerName: `${guestInfo.firstName} ${guestInfo.lastName}`,
        customerEmail: guestInfo.email || "guest@example.com",
        customerPhone: guestInfo.phone || "",
        roomId: room.id,
        roomNumber: room.roomNumber,
        roomType: room.type,
        checkInDate: new Date(checkIn),
        checkOutDate: new Date(checkOut),
        numberOfGuests: guests,
        numberOfNights: nights,
        totalAmount: total,
        paidAmount: paymentMethod === 'bank_transfer' ? 0 : total,
        status: "confirmed",
        paymentStatus: paymentMethod === 'bank_transfer' ? "pending" : "paid",
        paymentMethod: paymentMethod === 'card' ? 'chapa' : paymentMethod === 'telebirr' ? 'telebirr' : 'bank_transfer',
        specialRequests: guestInfo.specialRequests,
        addOns: selectedAddOns,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      addBooking(newBooking)
    }

    setBookingComplete(true)
    setStep("confirmation")
    setIsProcessing(false)
  }

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  if (!room) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Room Not Found</CardTitle>
              <CardDescription>Please select a room to continue booking.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => router.push("/rooms")} className="w-full">
                Browse Rooms
              </Button>
            </CardFooter>
          </Card>
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-secondary/30 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 md:gap-4">
              {steps.map((s, index) => {
                const Icon = s.icon
                const isActive = s.id === step
                const isComplete = steps.findIndex(st => st.id === step) > index || bookingComplete
                
                return (
                  <div key={s.id} className="flex items-center">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${
                      isActive ? "bg-primary text-primary-foreground" :
                      isComplete ? "bg-accent text-accent-foreground" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline text-sm font-medium">{s.label}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <ArrowRight className="h-4 w-4 mx-2 text-muted-foreground hidden sm:block" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {step === "details" && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t.booking.guestDetails}</CardTitle>
                    <CardDescription>Please provide your information for the reservation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">{t.auth.firstName}</Label>
                        <Input 
                          id="firstName" 
                          value={guestInfo.firstName}
                          onChange={(e) => setGuestInfo(prev => ({ ...prev, firstName: e.target.value }))}
                          placeholder="John"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">{t.auth.lastName}</Label>
                        <Input 
                          id="lastName"
                          value={guestInfo.lastName}
                          onChange={(e) => setGuestInfo(prev => ({ ...prev, lastName: e.target.value }))}
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">{t.auth.email}</Label>
                        <Input 
                          id="email" 
                          type="email"
                          value={guestInfo.email}
                          onChange={(e) => setGuestInfo(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="john@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t.common.phone}</Label>
                        <Input 
                          id="phone"
                          value={guestInfo.phone}
                          onChange={(e) => setGuestInfo(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+251 91 234 5678"
                        />
                      </div>
                    </div>
                    <Separator />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="checkIn">{t.booking.checkIn}</Label>
                        <Input 
                          id="checkIn" 
                          type="date"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          min={format(new Date(), "yyyy-MM-dd")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="checkOut">{t.booking.checkOut}</Label>
                        <Input 
                          id="checkOut"
                          type="date"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          min={checkIn}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guests">{t.booking.guests}</Label>
                      <Input 
                        id="guests"
                        type="number"
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                        min={1}
                        max={room.maxOccupancy}
                      />
                      <p className="text-sm text-muted-foreground">Maximum {room.maxOccupancy} guests</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="requests">{t.booking.specialRequests}</Label>
                      <textarea 
                        id="requests"
                        className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background text-sm"
                        value={guestInfo.specialRequests}
                        onChange={(e) => setGuestInfo(prev => ({ ...prev, specialRequests: e.target.value }))}
                        placeholder="Any special requests or preferences..."
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleNextStep} className="ml-auto">
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {step === "extras" && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t.booking.addOns}</CardTitle>
                    <CardDescription>Enhance your stay with additional services</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {mockServices.filter(s => s.isAvailable).map(service => {
                        const isSelected = selectedServices.includes(service.id)
                        const IconComponent = (service.category === "restaurant" || service.category === "room_service") ? Utensils :
                          service.category === "transport" ? Car :
                          service.category === "spa" ? Sparkles : Coffee
                        
                        return (
                          <div 
                            key={service.id}
                            onClick={() => toggleService(service.id)}
                            className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                              isSelected 
                                ? "border-primary bg-primary/5" 
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <div className={`p-3 rounded-full ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{service.name}</h4>
                              <p className="text-sm text-muted-foreground">{service.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">ETB {service.price.toLocaleString()}</p>
                              {isSelected && (
                                <Badge variant="secondary" className="mt-1">Selected</Badge>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handlePrevStep}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button onClick={handleNextStep}>
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {step === "payment" && !bookingComplete && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t.payment.title}</CardTitle>
                    <CardDescription>Select your preferred payment method</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4">
                      {[
                        { id: "chapa" as const, name: "Chapa", desc: "Pay with Chapa - Bank Transfer, Mobile Money" },
                        { id: "telebirr" as const, name: "Telebirr", desc: "Pay with Telebirr Mobile Money" },
                        { id: "card" as const, name: "Credit/Debit Card", desc: "Visa, Mastercard, American Express" },
                        { id: "bank_transfer" as const, name: "Pay at Hotel", desc: "Pay on arrival - Cash or Card" }
                      ].map(method => (
                        <div 
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id as "chapa" | "telebirr" | "card" | "bank_transfer")}
                          className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                            paymentMethod === method.id 
                              ? "border-primary bg-primary/5" 
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === method.id ? "border-primary" : "border-muted-foreground"
                          }`}>
                            {paymentMethod === method.id && (
                              <div className="w-3 h-3 rounded-full bg-primary" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium">{method.name}</h4>
                            <p className="text-sm text-muted-foreground">{method.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {paymentMethod === "card" && (
                      <div className="space-y-4 pt-4 border-t">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input id="cardNumber" placeholder="4242 4242 4242 4242" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input id="expiry" placeholder="MM/YY" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvc">CVC</Label>
                            <Input id="cvc" placeholder="123" />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handlePrevStep}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button onClick={handlePayment} disabled={isProcessing}>
                      {isProcessing ? (
                        <>Processing...</>
                      ) : (
                        <>Pay ETB {total.toLocaleString()}</>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {step === "confirmation" && bookingComplete && (
                <Card className="text-center">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
                      <Check className="h-8 w-8 text-accent-foreground" />
                    </div>
                    <CardTitle className="text-2xl">{t.booking.bookingConfirmed}</CardTitle>
                    <CardDescription>Your reservation has been successfully confirmed</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-muted rounded-lg p-6">
                      <p className="text-sm text-muted-foreground mb-2">Booking Reference</p>
                      <p className="text-3xl font-mono font-bold text-primary">{bookingRef}</p>
                    </div>
                    <div className="text-left space-y-4">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Room</span>
                        <span className="font-medium capitalize">{room.type}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Check-in</span>
                        <span className="font-medium text-sm">{checkIn ? format(new Date(checkIn), "MMM dd, yyyy") : "N/A"}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Check-out</span>
                        <span className="font-medium text-sm">{checkOut ? format(new Date(checkOut), "MMM dd, yyyy") : "N/A"}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Guest</span>
                        <span className="font-medium">{guestInfo.firstName} {guestInfo.lastName}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Total Paid</span>
                        <span className="font-bold text-lg">ETB {total.toLocaleString()}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      A confirmation email has been sent to {guestInfo.email}
                    </p>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <Button onClick={() => router.push("/")} className="w-full">
                      Return to Home
                    </Button>
                    <Button variant="outline" onClick={() => router.push("/customer")} className="w-full">
                      View My Bookings
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>

            {/* Booking Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">{t.booking.reviewBooking}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <img 
                      src={room.images[0] || "/placeholder.svg"} 
                      alt={`${room.type} room`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold capitalize">{room.type} Room</h3>
                    <p className="text-sm text-muted-foreground">Room {room.roomNumber}</p>
                  </div>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <span>{checkIn && checkOut ? `${format(new Date(checkIn), "MMM dd")} - ${format(new Date(checkOut), "MMM dd, yyyy")}` : "Dates N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{guests} {guests === 1 ? "Guest" : "Guests"}</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>ETB {room.pricePerNight.toLocaleString()} x {nights} nights</span>
                      <span>ETB {roomTotal.toLocaleString()}</span>
                    </div>
                    {selectedServices.length > 0 && (
                      <>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Services ({selectedServices.length})</span>
                          <span>ETB {servicesTotal.toLocaleString()}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tax (15%)</span>
                      <span>ETB {tax.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-base">
                      <span>{t.common.total}</span>
                      <span>ETB {total.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingContent />
    </Suspense>
  )
}
