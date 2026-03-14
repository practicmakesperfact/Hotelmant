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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  Package, 
  Plus,
  Filter,
  AlertTriangle,
  ArrowUpDown,
  Edit,
  Trash2,
  RefreshCcw
} from "lucide-react"
import { mockInventoryItems } from "@/lib/mock-data"
import { InventoryCategory } from "@/lib/types"

export default function InventoryStockPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const filteredItems = mockInventoryItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const lowStockItems = mockInventoryItems.filter(item => item.currentStock <= item.minimumStock)

  const stats = [
    { label: "Total Items", value: mockInventoryItems.length, icon: Package, color: "text-blue-500" },
    { label: "Low Stock Alert", value: lowStockItems.length, icon: AlertTriangle, color: "text-amber-500" },
    { label: "Out of Stock", value: mockInventoryItems.filter(i => i.currentStock === 0).length, icon: AlertTriangle, color: "text-red-500" },
  ]

  const categories: InventoryCategory[] = ['linens', 'toiletries', 'cleaning', 'minibar', 'kitchen', 'office', 'maintenance']

  return (
    <DashboardLayout requiredRoles={["inventory_manager"]} title="Inventory Stock">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 bg-muted rounded-full ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Stock Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Current Stock</CardTitle>
                <CardDescription>Track and manage hotel inventory items</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <RefreshCcw className="mr-2 h-4 w-4" /> Sync
                </Button>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Stock Level</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => {
                    const isLowStock = item.currentStock <= item.minimumStock
                    const stockPercentage = Math.min((item.currentStock / item.maximumStock) * 100, 100)
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.location}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {item.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                        <TableCell>
                          <div className="space-y-1 w-[150px]">
                            <div className="flex justify-between text-xs">
                              <span>{item.currentStock} {item.unit}s</span>
                              <span className={isLowStock ? "text-destructive font-bold" : "text-muted-foreground"}>
                                {isLowStock ? "Low Stock" : "Healthy"}
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${isLowStock ? "bg-destructive" : "bg-primary"}`}
                                style={{ width: `${stockPercentage}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>ETB {item.unitPrice.toLocaleString()}</TableCell>
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
                                <ArrowUpDown className="mr-2 h-4 w-4" /> Update Stock
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" /> Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Item
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No inventory items found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
