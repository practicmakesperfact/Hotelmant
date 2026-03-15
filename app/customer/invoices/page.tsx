"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/auth-context"
import { useBookings } from "@/lib/hooks/use-bookings"
import { useLocale } from "@/lib/i18n/locale-context"
import { 
  Download, 
  Eye, 
  CreditCard, 
  Printer,
  FileText
} from "lucide-react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { format } from "date-fns"

export default function CustomerInvoicesPage() {
  const { user } = useAuth()
  const { getCustomerBookings } = useBookings()
  const { t } = useLocale()

  // Only show bookings for the logged-in user, matched by email
  const userBookings = user ? getCustomerBookings(user.email) : []

  const invoices = userBookings.map(b => ({
    id: `INV-${b.id}`,
    date: b.checkOutDate,
    amount: b.totalAmount,
    paidAmount: b.paidAmount,
    status: b.paymentStatus,
    reservation: b.bookingNumber || b.id,
    period: `${format(new Date(b.checkInDate), "MMM dd")} - ${format(new Date(b.checkOutDate), "MMM dd, yyyy")}`
  }))

  const totalSpent = userBookings.reduce((sum, b) => sum + (b.paidAmount || 0), 0)
  const lastPaid = userBookings.find(b => b.paymentStatus === 'paid')
  const pendingBalance = userBookings
    .filter(b => b.paymentStatus === 'pending')
    .reduce((s, b) => s + (b.totalAmount - b.paidAmount), 0)

  return (
    <DashboardLayout requiredRoles={["customer"]} title={t.customer.billsPayments}>
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-primary/5 border-none">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
              <p className="text-3xl font-bold text-primary">ETB {totalSpent.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Last Payment</p>
              <p className="text-xl font-bold">
                {lastPaid ? `ETB ${lastPaid.paidAmount.toLocaleString()}` : 'No payments yet'}
              </p>
              {lastPaid && (
                <p className="text-xs text-muted-foreground mt-1">
                  Paid on {format(new Date(lastPaid.checkOutDate), "MMM dd, yyyy")}
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Outstanding Balance</p>
              <p className="text-xl font-bold">ETB {pendingBalance.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1 text-green-500">
                {pendingBalance === 0 ? 'No outstanding balances' : 'Payment pending'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>
              {invoices.length === 0 
                ? `No bookings found for ${user?.email ?? 'this account'}`
                : 'View and download your past stay receipts'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-lg font-medium">No invoices yet</p>
                <p className="text-sm mt-1">Complete a booking to see your payment history here.</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Stay Period</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            {invoice.id}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{invoice.period}</span>
                            <span className="text-[10px] text-muted-foreground uppercase">Ref: {invoice.reservation}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">ETB {invoice.amount.toLocaleString()}</span>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={invoice.status === 'paid' ? 'secondary' : 'outline'} 
                            className="capitalize"
                          >
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Printer className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Help */}
        <Card className="border-dashed">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-muted rounded-full">
                <CreditCard className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-bold">Need assistance with billing?</p>
                <p className="text-sm text-muted-foreground">Our finance team is available 24/7 to help with payment issues.</p>
              </div>
            </div>
            <Button variant="outline">Contact Finance</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
