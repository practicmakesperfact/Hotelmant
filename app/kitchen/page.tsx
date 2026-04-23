"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ChefHat, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Flame,
  Timer,
  User
} from "lucide-react"
import { mockMenuItems } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

// Mock orders for kitchen
const mockKitchenOrders = [
  {
    id: 'order-001',
    orderNumber: 'ORD-001',
    roomNumber: '102',
    customerName: 'Yohannes G.',
    items: [
      { id: 'food-001', name: 'Special Doro Wat', quantity: 2, notes: 'Extra spicy' },
      { id: 'food-002', name: 'Beyaynetu', quantity: 1, notes: '' },
    ],
    status: 'pending',
    priority: 'high',
    orderTime: new Date(Date.now() - 5 * 60000),
    estimatedTime: 20,
  },
  {
    id: 'order-002',
    orderNumber: 'ORD-002',
    roomNumber: '205',
    customerName: 'Sara Ahmed',
    items: [
      { id: 'food-003', name: 'Grilled T-Bone Steak', quantity: 1, notes: 'Medium rare' },
      { id: 'food-004', name: 'Spaghetti Aglio e Olio', quantity: 1, notes: '' },
    ],
    status: 'preparing',
    priority: 'medium',
    orderTime: new Date(Date.now() - 15 * 60000),
    estimatedTime: 30,
  },
  {
    id: 'order-003',
    orderNumber: 'ORD-003',
    roomNumber: '301',
    customerName: 'Michael T.',
    items: [
      { id: 'food-006', name: 'Kitfo Special', quantity: 1, notes: 'Well done' },
      { id: 'food-009', name: 'Ethiopian Coffee Ceremony', quantity: 1, notes: '' },
    ],
    status: 'pending',
    priority: 'low',
    orderTime: new Date(Date.now() - 2 * 60000),
    estimatedTime: 15,
  },
]

export default function KitchenDashboard() {
  const { toast } = useToast()
  const [orders, setOrders] = useState(mockKitchenOrders)

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
    toast({
      title: "Order Updated",
      description: `Order status changed to ${newStatus}`,
    })
  }

  const getElapsedTime = (orderTime: Date) => {
    const minutes = Math.floor((Date.now() - orderTime.getTime()) / 60000)
    return minutes
  }

  const stats = [
    { label: "Pending Orders", value: orders.filter(o => o.status === 'pending').length, icon: AlertCircle, color: "text-orange-500" },
    { label: "In Progress", value: orders.filter(o => o.status === 'preparing').length, icon: Flame, color: "text-red-500" },
    { label: "Completed Today", value: 24, icon: CheckCircle2, color: "text-green-500" },
    { label: "Avg. Prep Time", value: "18 min", icon: Timer, color: "text-blue-500" },
  ]

  const priorityColors = {
    high: "bg-red-500/10 text-red-500 border-red-500",
    medium: "bg-orange-500/10 text-orange-500 border-orange-500",
    low: "bg-blue-500/10 text-blue-500 border-blue-500",
  }

  const statusColors = {
    pending: "bg-orange-500/10 text-orange-500",
    preparing: "bg-blue-500/10 text-blue-500",
    ready: "bg-green-500/10 text-green-500",
    delivered: "bg-gray-500/10 text-gray-500",
  }

  return (
    <DashboardLayout requiredRoles={["admin", "manager"]} title="Kitchen Display System">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Active Orders */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Pending */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Pending ({orders.filter(o => o.status === 'pending').length})
            </h3>
            <div className="space-y-4">
              {orders.filter(o => o.status === 'pending').map((order) => (
                <Card key={order.id} className={`border-2 ${priorityColors[order.priority as keyof typeof priorityColors]}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <User className="h-3 w-3" />
                          Room {order.roomNumber} - {order.customerName}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className={priorityColors[order.priority as keyof typeof priorityColors]}>
                        {order.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="text-sm">
                        <div className="flex items-start justify-between">
                          <span className="font-medium">{item.quantity}x {item.name}</span>
                        </div>
                        {item.notes && (
                          <p className="text-xs text-muted-foreground mt-1">Note: {item.notes}</p>
                        )}
                      </div>
                    ))}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                      <Clock className="h-3 w-3" />
                      <span>{getElapsedTime(order.orderTime)} min ago</span>
                      <span className="ml-auto">Est. {order.estimatedTime} min</span>
                    </div>
                    <Button 
                      className="w-full" 
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                    >
                      Start Preparing
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Preparing */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Flame className="h-5 w-5 text-red-500" />
              Preparing ({orders.filter(o => o.status === 'preparing').length})
            </h3>
            <div className="space-y-4">
              {orders.filter(o => o.status === 'preparing').map((order) => (
                <Card key={order.id} className="border-2 border-blue-500/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <User className="h-3 w-3" />
                          Room {order.roomNumber} - {order.customerName}
                        </CardDescription>
                      </div>
                      <Badge className="bg-blue-500">
                        In Progress
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="text-sm">
                        <div className="flex items-start justify-between">
                          <span className="font-medium">{item.quantity}x {item.name}</span>
                        </div>
                        {item.notes && (
                          <p className="text-xs text-muted-foreground mt-1">Note: {item.notes}</p>
                        )}
                      </div>
                    ))}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                      <Clock className="h-3 w-3" />
                      <span>{getElapsedTime(order.orderTime)} min elapsed</span>
                    </div>
                    <Button 
                      className="w-full bg-green-500 hover:bg-green-600" 
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark as Ready
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Ready */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Ready (0)
            </h3>
            <div className="space-y-4">
              {orders.filter(o => o.status === 'ready').length === 0 && (
                <Card className="p-8 text-center border-dashed">
                  <ChefHat className="h-12 w-12 mx-auto mb-2 text-muted-foreground opacity-20" />
                  <p className="text-sm text-muted-foreground">No orders ready</p>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Menu Quick Reference */}
        <Card>
          <CardHeader>
            <CardTitle>Menu Quick Reference</CardTitle>
            <CardDescription>Preparation times and ingredients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockMenuItems.slice(0, 6).map((item) => (
                <div key={item.id} className="p-3 bg-secondary/30 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {item.preparationTime}m
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {item.ingredients.slice(0, 3).join(', ')}
                    {item.ingredients.length > 3 && '...'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
