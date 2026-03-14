"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  CalendarCheck, 
  Clock,
  Users,
  ArrowRight,
  Bed,
  LogIn,
  LogOut,
  AlertCircle,
  Phone
} from "lucide-react"
import { mockBookings, mockRooms } from "@/lib/mock-data"
import Link from "next/link"
import { format, isToday, isTomorrow, addHours } from "date-fns"

export default function ReceptionistDashboard() {
  const now = new Date()
  
  // Today's check-ins
  const todayCheckins = mockBookings.filter(b => 
    b.status === "confirmed" && (b.checkInDate instanceof Date ? isToday(b.checkInDate) : false)
  )
  
  // Today's check-outs
  const todayCheckouts = mockBookings.filter(b => 
    b.status === "checked_in" && (b.checkOutDate instanceof Date ? isToday(b.checkOutDate) : false)
  )
  
  // Currently checked-in guests
  const checkedInGuests = mockBookings.filter(b => b.status === "checked_in")
  
  // Available rooms
  const availableRooms = mockRooms.filter(r => r.status === "available")
  
  // Upcoming arrivals (next 24 hours)
  const upcomingArrivals = mockBookings.filter(b => {
    const checkIn = b.checkInDate
    return b.status === "confirmed" && (checkIn instanceof Date ? (checkIn >= now && checkIn <= addHours(now, 24)) : false)
  })

  const quickStats = [
    { label: "Today's Check-ins", value: todayCheckins.length, icon: LogIn, color: "text-accent" },
    { label: "Today's Check-outs", value: todayCheckouts.length, icon: LogOut, color: "text-chart-1" },
    { label: "In-House Guests", value: checkedInGuests.length, icon: Users, color: "text-primary" },
    { label: "Rooms Available", value: availableRooms.length, icon: Bed, color: "text-chart-2" }
  ]

  return (
    <DashboardLayout requiredRoles={["receptionist"]} title="Front Desk">
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Button className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                <Link href="/receptionist/checkin">
                  <LogIn className="h-6 w-6" />
                  <span>Check-in Guest</span>
                </Link>
              </Button>
              <Button variant="secondary" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                <Link href="/receptionist/checkin?action=checkout">
                  <LogOut className="h-6 w-6" />
                  <span>Check-out Guest</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                <Link href="/receptionist/reservations">
                  <CalendarCheck className="h-6 w-6" />
                  <span>New Reservation</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                <Link href="/receptionist/rooms">
                  <Bed className="h-6 w-6" />
                  <span>Room Status</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pending Check-ins */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <LogIn className="h-5 w-5 text-accent" />
                  Pending Check-ins
                </CardTitle>
                <CardDescription>Guests arriving today</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/receptionist/checkin">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {todayCheckins.length > 0 ? (
                <div className="space-y-4">
                  {todayCheckins.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                          {booking.customerName.split(" ").map((n: string) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium">{booking.customerName}</p>
                          <p className="text-sm text-muted-foreground">
                            Room {booking.roomNumber} • {booking.numberOfGuests} guests
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right mr-2">
                          <p className="text-sm font-medium">{booking.checkInDate instanceof Date ? format(booking.checkInDate, "h:mm a") : "Arrival"}</p>
                          <p className="text-xs text-muted-foreground">Expected</p>
                        </div>
                        <Button size="sm">Check In</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarCheck className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>No check-ins scheduled for today</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Check-outs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <LogOut className="h-5 w-5 text-chart-1" />
                  Pending Check-outs
                </CardTitle>
                <CardDescription>Guests departing today</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/receptionist/checkin?action=checkout">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {todayCheckouts.length > 0 ? (
                <div className="space-y-4">
                  {todayCheckouts.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-chart-1/20 flex items-center justify-center text-chart-1 font-medium">
                          {booking.customerName.split(" ").map((n: string) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium">{booking.customerName}</p>
                          <p className="text-sm text-muted-foreground">
                            Room {booking.roomNumber}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right mr-2">
                          <p className="text-sm font-medium">11:00 AM</p>
                          <p className="text-xs text-muted-foreground">Checkout</p>
                        </div>
                        <Button size="sm" variant="secondary">Check Out</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <LogOut className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>No check-outs scheduled for today</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Room Status Overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Room Status Overview</CardTitle>
              <CardDescription>Quick view of all rooms</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/receptionist/rooms">
                View Details <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
              {mockRooms.map((room) => {
                const statusColors = {
                  available: "bg-accent/20 border-accent text-accent-foreground",
                  occupied: "bg-chart-1/20 border-chart-1 text-chart-1",
                  cleaning: "bg-chart-4/20 border-chart-4 text-chart-4",
                  maintenance: "bg-destructive/20 border-destructive text-destructive",
                  reserved: "bg-primary/20 border-primary text-primary"
                }
                return (
                  <div 
                    key={room.id}
                    className={`aspect-square rounded-lg border-2 flex items-center justify-center text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity ${statusColors[room.status]}`}
                    title={`Room ${room.roomNumber} - ${room.status}`}
                  >
                    {room.roomNumber}
                  </div>
                )
              })}
            </div>
            <div className="flex flex-wrap gap-4 mt-4 justify-center">
              {[
                { status: "Available", color: "bg-accent" },
                { status: "Occupied", color: "bg-chart-1" },
                { status: "Cleaning", color: "bg-chart-4" },
                { status: "Maintenance", color: "bg-destructive" },
                { status: "Reserved", color: "bg-primary" }
              ].map((item) => (
                <div key={item.status} className="flex items-center gap-2 text-sm">
                  <div className={`w-3 h-3 rounded ${item.color}`} />
                  <span className="text-muted-foreground">{item.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Guest Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Guest Requests
            </CardTitle>
            <CardDescription>Recent requests from in-house guests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { room: "204", request: "Extra towels requested", time: "10 min ago", urgent: false },
                { room: "312", request: "Room service - dinner order", time: "25 min ago", urgent: false },
                { room: "105", request: "AC not working properly", time: "45 min ago", urgent: true },
                { room: "401", request: "Wake-up call at 6 AM", time: "1 hour ago", urgent: false }
              ].map((req, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Badge variant={req.urgent ? "destructive" : "secondary"}>
                      Room {req.room}
                    </Badge>
                    <span className="text-sm">{req.request}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{req.time}</span>
                    <Button size="sm" variant="outline">Handle</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
