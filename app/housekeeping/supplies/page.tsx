"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Package, 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Filter,
  Trash2,
  CheckCircle2,
  ArrowRight
} from "lucide-react"
import { mockInventoryItems } from "@/lib/mock-data"

interface CartItem {
  id: string
  name: string
  quantity: number
  unit: string
}

export default function HousekeepingSuppliesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  
  // Filter inventory for housekeeping relevant categories
  const supplies = mockInventoryItems.filter(item => 
    (item.category === 'linens' || item.category === 'toiletries' || item.category === 'cleaning') &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { id: item.id, name: item.name, quantity: 1, unit: item.unit }]
    })
  }

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === id)
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i)
      }
      return prev.filter(i => i.id !== id)
    })
  }

  const clearCart = () => setCart([])

  return (
    <DashboardLayout requiredRoles={["housekeeping"]} title="Cleaning Supplies">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Supplies Catalog */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Catalog</CardTitle>
                  <CardDescription>Available items for your cleaning duties</CardDescription>
                </div>
                <div className="relative w-full sm:w-[250px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search items..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {supplies.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border bg-muted/30 group hover:border-primary/50 transition-colors">
                    <div className="space-y-1">
                      <p className="font-semibold text-sm">{item.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] capitalize font-normal">
                          {item.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">Stock: {item.currentStock} {item.unit}s</span>
                      </div>
                    </div>
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => addToCart(item)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Request Cart */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Request Cart
                </CardTitle>
                {cart.length > 0 && (
                  <Button variant="ghost" size="sm" className="text-xs h-8" onClick={clearCart}>
                    Clear
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-10 w-10 mx-auto mb-4 text-muted-foreground opacity-20" />
                  <p className="text-sm text-muted-foreground">Your cart is empty</p>
                  <p className="text-xs text-muted-foreground mt-1">Add items from the catalog</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.quantity} {item.unit}{item.quantity > 1 ? 's' : ''}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => removeFromCart(item.id)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => addToCart(item)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span>Total Items</span>
                      <span>{cart.reduce((sum, i) => sum + i.quantity, 0)}</span>
                    </div>
                    <Button className="w-full">
                      Submit Request <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recently Received */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recent Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { date: 'Today', items: 5, status: 'approved' },
                { date: 'Yesterday', items: 3, status: 'received' },
              ].map((req, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div className="text-xs">
                    <p className="font-medium">{req.date}</p>
                    <p className="text-muted-foreground">{req.items} items requested</p>
                  </div>
                  <Badge variant={req.status === 'received' ? 'secondary' : 'outline'} className="text-[10px] capitalize">
                    {req.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
