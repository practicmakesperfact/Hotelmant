"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Package, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Building2,
  BarChart3,
  Plus,
  ArrowRight
} from "lucide-react"
import { 
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"
import { mockInventoryItems, mockSuppliers, mockPurchaseOrders } from "@/lib/mock-data"
import Link from "next/link"
import { format } from "date-fns"

export default function InventoryDashboard() {
  const lowStockItems = mockInventoryItems.filter(i => i.currentStock <= i.minimumStock)
  const outOfStockItems = mockInventoryItems.filter(i => i.currentStock === 0)
  const pendingOrders = mockPurchaseOrders.filter(o => o.status === "ordered" || o.status === "submitted")
  
  const totalValue = mockInventoryItems.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0)

  const stats = [
    { label: "Total Items", value: mockInventoryItems.length, icon: Package, color: "text-primary", change: "+5" },
    { label: "Low Stock Alerts", value: lowStockItems.length, icon: AlertTriangle, color: "text-warning", change: "-2" },
    { label: "Pending Orders", value: pendingOrders.length, icon: ShoppingCart, color: "text-chart-2", change: "+3" },
    { label: "Total Value", value: `ETB ${(totalValue / 1000).toFixed(0)}K`, icon: BarChart3, color: "text-accent", change: "+8%" }
  ]

  // Category breakdown
  const categoryData = [
    { name: "Linens", value: mockInventoryItems.filter(i => i.category === "linens").length },
    { name: "Toiletries", value: mockInventoryItems.filter(i => i.category === "toiletries").length },
    { name: "Cleaning", value: mockInventoryItems.filter(i => i.category === "cleaning").length },
    { name: "Minibar", value: mockInventoryItems.filter(i => i.category === "minibar").length },
    { name: "Kitchen", value: mockInventoryItems.filter(i => i.category === "kitchen").length }
  ]

  const chartColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

  // Monthly usage data
  const usageData = [
    { month: "Jan", usage: 15000 },
    { month: "Feb", usage: 18000 },
    { month: "Mar", usage: 22000 },
    { month: "Apr", usage: 19000 },
    { month: "May", usage: 24000 },
    { month: "Jun", usage: 28000 }
  ]

  return (
    <DashboardLayout requiredRoles={["inventory_manager"]} title="Inventory Management">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {stat.change.startsWith("+") ? (
                          <TrendingUp className="h-4 w-4 text-accent" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        )}
                        <span className="text-sm text-muted-foreground">{stat.change} this month</span>
                      </div>
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

        {/* Low Stock Alerts */}
        {lowStockItems.length > 0 && (
          <Card className="border-warning/50 bg-warning/5">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Low Stock Alerts
                </CardTitle>
                <CardDescription>{lowStockItems.length} items need reordering</CardDescription>
              </div>
              <Button asChild>
                <Link href="/inventory/orders">
                  <Plus className="mr-2 h-4 w-4" /> Create Order
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {lowStockItems.slice(0, 6).map((item) => {
                  const stockPercent = Math.round((item.currentStock / item.minimumStock) * 100)
                  return (
                    <div key={item.id} className="p-4 rounded-lg bg-background border">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                        </div>
                        <Badge variant={item.currentStock === 0 ? "destructive" : "secondary"}>
                          {item.currentStock === 0 ? "Out of Stock" : "Low Stock"}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Current: {item.currentStock} {item.unit}</span>
                          <span className="text-muted-foreground">Min: {item.minimumStock}</span>
                        </div>
                        <Progress value={stockPercent} className="h-2" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Monthly Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Usage</CardTitle>
              <CardDescription>Inventory consumption over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(v) => `${v/1000}K`} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "var(--card)", 
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius)"
                      }}
                      formatter={(value: number) => [`ETB ${value.toLocaleString()}`, "Usage"]}
                    />
                    <Bar dataKey="usage" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Items by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "var(--card)", 
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius)"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders & Suppliers */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest purchase orders</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/inventory/orders">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPurchaseOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.supplierName} • {order.createdAt instanceof Date ? format(order.createdAt, "MMM dd") : "Recent"}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        order.status === "received" ? "secondary" :
                        order.status === "ordered" ? "default" :
                        order.status === "submitted" ? "outline" : "destructive"
                      }>
                        {order.status}
                      </Badge>
                      <p className="text-sm font-medium mt-1">ETB {order.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Suppliers */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Top Suppliers</CardTitle>
                <CardDescription>Active vendor partners</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/inventory/suppliers">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSuppliers.slice(0, 5).map((supplier) => (
                  <div key={supplier.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{supplier.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">{supplier.categories.join(', ')}</p>
                      </div>
                    </div>
                    <Badge variant={supplier.isActive ? "secondary" : "outline"}>
                      {supplier.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                <Link href="/inventory/stock">
                  <Package className="h-6 w-6" />
                  <span>View Stock</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                <Link href="/inventory/orders">
                  <ShoppingCart className="h-6 w-6" />
                  <span>Purchase Orders</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                <Link href="/inventory/suppliers">
                  <Building2 className="h-6 w-6" />
                  <span>Manage Suppliers</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                <Link href="/inventory/reports">
                  <BarChart3 className="h-6 w-6" />
                  <span>Generate Report</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
