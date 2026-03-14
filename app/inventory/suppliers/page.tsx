"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Search, 
  MoreHorizontal, 
  Truck, 
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Edit,
  Trash2,
  ExternalLink
} from "lucide-react"
import { mockSuppliers } from "@/lib/mock-data"

export default function InventorySuppliersPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSuppliers = mockSuppliers.filter(supplier => {
    const searchLower = searchTerm.toLowerCase()
    return (
      supplier.name.toLowerCase().includes(searchLower) ||
      supplier.contactPerson.toLowerCase().includes(searchLower) ||
      supplier.email.toLowerCase().includes(searchLower) ||
      supplier.categories.some(cat => cat.toLowerCase().includes(searchLower))
    )
  })

  return (
    <DashboardLayout requiredRoles={["inventory_manager"]} title="Supplier Directory">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Suppliers</CardTitle>
                <CardDescription>Manage hotel vendors and supply partners</CardDescription>
              </div>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" /> Add Supplier
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by company, person, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Table */}
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Categories</TableHead>
                    <TableHead>Terms & Lead Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                            <Truck className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{supplier.name}</p>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <MapPin className="mr-1 h-3 w-3" />
                              {supplier.address}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{supplier.contactPerson}</p>
                          <div className="flex flex-col gap-0.5 mt-1">
                            <p className="text-xs text-muted-foreground flex items-center">
                              <Mail className="mr-1 h-3 w-3" /> {supplier.email}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center">
                              <Phone className="mr-1 h-3 w-3" /> {supplier.phone}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {supplier.categories.map(cat => (
                            <Badge key={cat} variant="secondary" className="text-[10px] capitalize">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{supplier.paymentTerms}</p>
                          <p className="text-xs text-muted-foreground">{supplier.leadTimeDays} days lead time</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={supplier.isActive ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground"}>
                          {supplier.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <ExternalLink className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" /> Edit Supplier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" /> Remove Supplier
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredSuppliers.length === 0 && (
              <div className="text-center py-12">
                <Truck className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No suppliers found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
