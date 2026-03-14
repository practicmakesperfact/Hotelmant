"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { 
  Search, 
  LogIn, 
  LogOut,
  User,
  CreditCard,
  Key,
  CheckCircle,
  Printer
} from "lucide-react"
import { mockBookings } from "@/lib/mock-data"
import { format, isToday } from "date-fns"

function CheckInOutContent() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get("action") === "checkout" ? "checkout" : "checkin"
  
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBooking, setSelectedBooking] = useState<typeof mockBookings[0] | null>(null)
  const [showCheckInDialog, setShowCheckInDialog] = useState(false)
  const [showCheckOutDialog, setShowCheckOutDialog] = useState(false)
  const [checkInComplete, setCheckInComplete] = useState(false)
  const [checkOutComplete, setCheckOutComplete] = useState(false)

  const pendingCheckins = mockBookings.filter(b => 
    b.status === "confirmed" && 
    (searchTerm === "" || 
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.roomNumber.includes(searchTerm))
  )

  const pendingCheckouts = mockBookings.filter(b => 
    b.status === "checked_in" &&
    (searchTerm === "" || 
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.roomNumber.includes(searchTerm))
  )

  const handleCheckIn = (booking: typeof mockBookings[0]) => {
    setSelectedBooking(booking)
    setShowCheckInDialog(true)
    setCheckInComplete(false)
  }

  const handleCheckOut = (booking: typeof mockBookings[0]) => {
    setSelectedBooking(booking)
    setShowCheckOutDialog(true)
    setCheckOutComplete(false)
  }

  const processCheckIn = () => {
    // Simulate check-in process
    setTimeout(() => {
      setCheckInComplete(true)
    }, 1000)
  }

  const processCheckOut = () => {
    // Simulate check-out process
    setTimeout(() => {
      setCheckOutComplete(true)
    }, 1000)
  }

  return (
    <DashboardLayout requiredRoles={["receptionist"]} title="Check-in / Check-out">
      <div className="space-y-6">
        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by guest name or room number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue={initialTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="checkin" className="gap-2">
              <LogIn className="h-4 w-4" />
              Check-in ({pendingCheckins.length})
            </TabsTrigger>
            <TabsTrigger value="checkout" className="gap-2">
              <LogOut className="h-4 w-4" />
              Check-out ({pendingCheckouts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="checkin" className="mt-6">
            <div className="grid gap-4">
              {pendingCheckins.length > 0 ? (
                pendingCheckins.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium text-lg">
                            {booking.customerName.split(" ").map((n: string) => n[0]).join("")}
                          </div>
                          <div>
                            <h3 className="font-semibold">{booking.customerName}</h3>
                            <p className="text-sm text-muted-foreground">{booking.customerEmail}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">Room {booking.roomNumber}</Badge>
                              <Badge variant="secondary">{booking.numberOfGuests} guests</Badge>
                              {booking.checkInDate instanceof Date && isToday(booking.checkInDate) && (
                                <Badge className="bg-accent/10 text-accent">Today</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Expected</p>
                            <p className="font-medium">{booking.checkInDate instanceof Date ? format(booking.checkInDate, "MMM dd, h:mm a") : "Arrival"}</p>
                          </div>
                          <Button onClick={() => handleCheckIn(booking)}>
                            <LogIn className="mr-2 h-4 w-4" /> Check In
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <LogIn className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No pending check-ins found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="checkout" className="mt-6">
            <div className="grid gap-4">
              {pendingCheckouts.length > 0 ? (
                pendingCheckouts.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-chart-1/20 flex items-center justify-center text-chart-1 font-medium text-lg">
                            {booking.customerName.split(" ").map((n: string) => n[0]).join("")}
                          </div>
                          <div>
                            <h3 className="font-semibold">{booking.customerName}</h3>
                            <p className="text-sm text-muted-foreground">{booking.customerEmail}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">Room {booking.roomNumber}</Badge>
                              <Badge variant="secondary">{booking.numberOfNights} nights</Badge>
                              {booking.checkOutDate instanceof Date && isToday(booking.checkOutDate) && (
                                <Badge className="bg-chart-1/10 text-chart-1">Due Today</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Checkout by</p>
                            <p className="font-medium">{booking.checkOutDate instanceof Date ? format(booking.checkOutDate, "MMM dd") : "Today"} 11:00 AM</p>
                          </div>
                          <Button variant="secondary" onClick={() => handleCheckOut(booking)}>
                            <LogOut className="mr-2 h-4 w-4" /> Check Out
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <LogOut className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No pending check-outs found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Check-in Dialog */}
        <Dialog open={showCheckInDialog} onOpenChange={setShowCheckInDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {checkInComplete ? "Check-in Complete" : "Process Check-in"}
              </DialogTitle>
              <DialogDescription>
                {selectedBooking?.customerName} - Room {selectedBooking?.roomNumber}
              </DialogDescription>
            </DialogHeader>
            
            {!checkInComplete ? (
              <>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Guest ID Verification</Label>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">Verify guest identity document</span>
                      <CheckCircle className="h-5 w-5 text-accent ml-auto" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Confirmation</Label>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">ETB {selectedBooking?.totalAmount.toLocaleString()} - Paid</span>
                      <CheckCircle className="h-5 w-5 text-accent ml-auto" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Room Key</Label>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                      <Key className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">Generate key card for Room {selectedBooking?.roomNumber}</span>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCheckInDialog(false)}>Cancel</Button>
                  <Button onClick={processCheckIn}>Complete Check-in</Button>
                </DialogFooter>
              </>
            ) : (
              <div className="py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Guest Checked In Successfully</h3>
                <p className="text-muted-foreground mb-6">
                  Room {selectedBooking?.roomNumber} is ready. Key card has been generated.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => setShowCheckInDialog(false)}>
                    Close
                  </Button>
                  <Button>
                    <Printer className="mr-2 h-4 w-4" /> Print Welcome Card
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Check-out Dialog */}
        <Dialog open={showCheckOutDialog} onOpenChange={setShowCheckOutDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {checkOutComplete ? "Check-out Complete" : "Process Check-out"}
              </DialogTitle>
              <DialogDescription>
                {selectedBooking?.customerName} - Room {selectedBooking?.roomNumber}
              </DialogDescription>
            </DialogHeader>
            
            {!checkOutComplete ? (
              <>
                <div className="space-y-4 py-4">
                  <div className="p-4 rounded-lg bg-muted">
                    <h4 className="font-medium mb-2">Stay Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Room Charges</span>
                        <span>ETB {selectedBooking?.totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Minibar</span>
                        <span>ETB 500</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Room Service</span>
                        <span>ETB 1,200</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t font-medium">
                        <span>Total Outstanding</span>
                        <span>ETB 1,700</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Room Key Return</Label>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                      <Key className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">Collect key card from guest</span>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCheckOutDialog(false)}>Cancel</Button>
                  <Button onClick={processCheckOut}>Complete Check-out</Button>
                </DialogFooter>
              </>
            ) : (
              <div className="py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Guest Checked Out Successfully</h3>
                <p className="text-muted-foreground mb-6">
                  Room {selectedBooking?.roomNumber} has been marked for cleaning.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => setShowCheckOutDialog(false)}>
                    Close
                  </Button>
                  <Button>
                    <Printer className="mr-2 h-4 w-4" /> Print Invoice
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

export default function CheckInOutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckInOutContent />
    </Suspense>
  )
}
