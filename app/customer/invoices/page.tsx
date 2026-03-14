"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Receipt, 
  Download, 
  Eye, 
  CreditCard, 
  Calendar,
  ChevronRight,
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
import { mockBookings } from "@/lib/mock-data"
import { format } from "date-fns"

export default function CustomerInvoicesPage() {
  // Use mockBookings to simulate invoice history
  const invoices = mockBookings.map(b => ({
    id: `INV-${b.id.split('-').pop()}`,
    date: b.checkOutDate,
    amount: b.totalAmount,
    status: b.paymentStatus,
    reservation: b.id,
    period: `${format(new Date(b.checkInDate), "MMM dd")} - ${format(new Date(b.checkOutDate), "MMM dd, yyyy")}`
  }))

  return (
    <DashboardLayout requiredRoles={["customer"]} title="Billing & Invoices">
      <div className="space-y-6">
        {/* Summary Card */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-primary/5 border-none">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Total Spent (2024)</p>
              <p className="text-3xl font-bold text-primary">ETB 42,500</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Last Payment</p>
              <p className="text-xl font-bold">ETB 6,400</p>
              <p className="text-xs text-muted-foreground mt-1">Paid on March 12, 2024</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Next Bill (Estimated)</p>
              <p className="text-xl font-bold">ETB 0</p>
              <p className="text-xs text-muted-foreground mt-1 text-green-500">No outstanding balances</p>
            </CardContent>
          </Card>
        </div>

        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>View and download your past stay receipts</CardDescription>
          </CardHeader>
          <CardContent>
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
                          <span className="text-[10px] text-muted-foreground uppercase">Confirmation: {invoice.reservation}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">ETB {invoice.amount.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={invoice.status === 'paid' ? 'secondary' : 'outline'} className="capitalize">
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
