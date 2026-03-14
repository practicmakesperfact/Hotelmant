"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/auth-context"
import { 
  CalendarCheck, 
  Clock,
  MapPin,
  CreditCard,
  Star,
  Sparkles,
  ArrowRight,
  Hotel,
  Phone,
  MessageSquare
} from "lucide-react"
import { useBookings } from "@/lib/hooks/use-bookings"
import { mockServices } from "@/lib/mock-data"
import Link from "next/link"
import { format, differenceInDays, isPast, isFuture } from "date-fns"

export default function CustomerDashboard() {
  const { user } = useAuth()
  const { getCustomerBookings } = useBookings()
  
  // Use email to match bookings, default to empty string if no user
  const userBookingsElement = user ? getCustomerBookings(user.email) : []
  const userBookings = userBookingsElement.slice(0, 5)
  
  const upcomingBookings = userBookingsElement.filter(b => 
    isFuture(new Date(b.checkInDate)) && b.status === "confirmed"
  )
  
  const currentBooking = userBookingsElement.find(b => b.status === "checked_in")
  
  const pastBookings = userBookingsElement.filter(b => 
    b.status === "checked_out" || isPast(new Date(b.checkOutDate))
  )

  const availableServices = mockServices.filter(s => s.isAvailable).slice(0, 4)

  return (
    <DashboardLayout requiredRoles={["customer"]} title="My Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Welcome back, {user?.firstName}!</h2>
                <p className="text-muted-foreground mt-1">
                  {currentBooking 
                    ? `You're currently staying in Room ${currentBooking.roomNumber}` 
                    : upcomingBookings.length > 0
                    ? `You have ${upcomingBookings.length} upcoming reservation${upcomingBookings.length > 1 ? 's' : ''}`
                    : "Ready to book your next stay?"
                  }
                </p>
              </div>
              <Button asChild>
                <Link href="/rooms">
                  <Hotel className="mr-2 h-4 w-4" /> Book a Room
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Stay */}
        {currentBooking && (
          <Card className="border-accent/50 bg-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hotel className="h-5 w-5 text-accent" />
                Your Current Stay
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden">
                      <img 
                        src="/placeholder.svg?height=80&width=80" 
                        alt="Room"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Room {currentBooking.roomNumber}</h3>
                      <p className="text-muted-foreground">Deluxe Suite • Floor 3</p>
                      <Badge className="mt-2 bg-accent/10 text-accent">Checked In</Badge>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                      <span>Check-out: {format(new Date(currentBooking.checkOutDate), "EEEE, MMMM dd, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{differenceInDays(new Date(currentBooking.checkOutDate), new Date())} days remaining</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="justify-start">
                    <Phone className="mr-2 h-4 w-4" /> Call Front Desk
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Sparkles className="mr-2 h-4 w-4" /> Request Service
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <MessageSquare className="mr-2 h-4 w-4" /> Send Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Reservations */}
        {upcomingBookings.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Reservations</CardTitle>
                <CardDescription>Your confirmed bookings</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/customer/bookings">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden shrink-0">
                        <img 
                          src="/placeholder.svg?height=64&width=64" 
                          alt="Room"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold">Room {booking.roomNumber}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <CalendarCheck className="h-4 w-4" />
                          <span>{format(new Date(booking.checkInDate), "MMM dd")} - {format(new Date(booking.checkOutDate), "MMM dd, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{booking.numberOfNights} nights • {booking.numberOfGuests} guests</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                      <Badge>{booking.status}</Badge>
                      <p className="font-semibold">ETB {booking.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Services */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Hotel Services</CardTitle>
              <CardDescription>Enhance your stay with our services</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/customer/services">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {availableServices.map((service) => (
                <div key={service.id} className="p-4 rounded-lg border hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-medium">{service.name}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{service.description}</p>
                  <p className="text-sm font-semibold text-primary mt-2">ETB {service.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Past Stays */}
        {pastBookings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Past Stays</CardTitle>
              <CardDescription>Your booking history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pastBookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <p className="font-medium">Room {booking.roomNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(booking.checkInDate), "MMM dd")} - {format(new Date(booking.checkOutDate), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm">
                        <Star className="mr-1 h-4 w-4" /> Rate Stay
                      </Button>
                      <Button variant="ghost" size="sm">Book Again</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                <Link href="/customer/profile">
                  <Star className="h-6 w-6" />
                  <span>My Profile</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                <Link href="/customer/invoices">
                  <CreditCard className="h-6 w-6" />
                  <span>Invoices</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                <Link href="/rooms">
                  <Hotel className="h-6 w-6" />
                  <span>Browse Rooms</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                <Link href="/contact">
                  <MessageSquare className="h-6 w-6" />
                  <span>Contact Us</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
