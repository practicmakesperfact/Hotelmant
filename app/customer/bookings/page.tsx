"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/auth-context"
import { useBookings } from "@/lib/hooks/use-bookings"
import { CalendarCheck, Clock, Check, X, CreditCard, Building } from "lucide-react"
import { format, isFuture } from "date-fns"
import { toast } from "sonner"

export default function CustomerBookingsPage() {
  const { user } = useAuth()
  const { getCustomerBookings, cancelBooking } = useBookings()
  
  const bookings = user ? getCustomerBookings(user.email) : []

  const handleCancel = (bookingId: string) => {
    cancelBooking(bookingId)
    toast.success("Booking cancelled successfully")
  }

  return (
    <DashboardLayout requiredRoles={["customer"]} title="My Bookings">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Booking History</h1>
            <p className="text-muted-foreground">
              Manage your upcoming reservations and view past stays.
            </p>
          </div>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              You have no bookings yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const checkInDate = booking.checkInDate
              const _isFuture = checkInDate instanceof Date ? isFuture(checkInDate) : false
              const canCancel = _isFuture && booking.status !== 'cancelled'

              return (
                <Card key={booking.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-6 flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">
                            {booking.roomType.charAt(0).toUpperCase() + booking.roomType.slice(1)} Room - {booking.roomNumber}
                          </h3>
                          <div className="text-sm text-muted-foreground">
                            Booking Reference: <span className="font-mono">{booking.bookingNumber}</span>
                          </div>
                        </div>
                        <Badge variant={booking.status === 'confirmed' ? 'default' : booking.status === 'cancelled' ? 'destructive' : 'secondary'}>
                            {booking.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 text-sm mt-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                            <span>Check-in: {booking.checkInDate instanceof Date ? format(booking.checkInDate, "MMM dd, yyyy") : "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                            <span>Check-out: {booking.checkOutDate instanceof Date ? format(booking.checkOutDate, "MMM dd, yyyy") : "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{booking.numberOfNights} nights ({booking.numberOfGuests} guests)</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <span className="capitalize">Payment: {booking.paymentMethod} ({booking.paymentStatus})</span>
                          </div>
                          <div className="flex items-center gap-2 font-medium">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span>Total: ETB {booking.totalAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Panel */}
                    <div className="bg-muted p-6 flex flex-col justify-center items-center gap-4 md:w-48 border-t md:border-t-0 md:border-l">
                      {booking.status === "confirmed" && (
                        <>
                          <Button variant="default" className="w-full">
                            <Check className="mr-2 h-4 w-4" /> Check-in Guide
                          </Button>
                        </>
                      )}
                      
                      {canCancel && (
                        <Button 
                          variant="destructive" 
                          className="w-full"
                          onClick={() => handleCancel(booking.id)}
                        >
                          <X className="mr-2 h-4 w-4" /> Cancel Booking
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
