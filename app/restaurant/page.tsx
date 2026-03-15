"use client"

import { useState } from "react"
import { PublicLayout } from "@/components/layout/public-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { 
  Search, 
  Utensils, 
  Clock, 
  Flame, 
  Leaf, 
  Info, 
  Plus, 
  ShoppingCart,
  Filter
} from "lucide-react"
import { mockMenuItems } from "@/lib/mock-data"
import { FoodCategory } from "@/lib/types"
import { useLocale } from "@/lib/i18n/locale-context"

export default function RestaurantPage() {
  const { t } = useLocale()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'all'>('all')
  const [selectedItem, setSelectedItem] = useState<typeof mockMenuItems[0] | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const categories: { label: string, value: FoodCategory | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Ethiopian', value: 'ethiopian' },
    { label: 'International', value: 'international' },
    { label: 'Main Course', value: 'main_course' },
    { label: 'Beverages', value: 'beverage' },
    { label: 'Breakfast', value: 'breakfast' },
  ]

  const filteredItems = mockMenuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.foodCategory === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleViewDetails = (item: typeof mockMenuItems[0]) => {
    setSelectedItem(item)
    setShowDetails(true)
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-secondary/30 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl font-serif font-bold mb-4">{t.restaurant?.title || 'Leul Mekonen Restaurant'}</h1>
            <p className="text-muted-foreground text-lg">
              Experience the finest Ethiopian and International cuisine, prepared with the freshest local ingredients.
            </p>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search dishes, ingredients..." 
                className="pl-9 bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  variant={selectedCategory === cat.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.value)}
                  className="rounded-full px-4 h-8 text-xs whitespace-nowrap"
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <Card key={item.id} className="group overflow-hidden border-none shadow-premium hover:shadow-premium-hover transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    {item.isVegetarian && (
                      <Badge className="bg-green-500/90 text-white border-none backdrop-blur-sm">
                        <Leaf className="h-3 w-3 mr-1" /> Veg
                      </Badge>
                    )}
                    {item.isSpicy && (
                      <Badge className="bg-red-500/90 text-white border-none backdrop-blur-sm">
                        <Flame className="h-3 w-3 mr-1" /> Spicy
                      </Badge>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white font-bold text-lg">ETB {item.price.toLocaleString()}</p>
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">{item.name}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">{item.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pb-4">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.preparationTime} min
                    </div>
                    <div className="flex items-center gap-1">
                      <Utensils className="h-3 w-3" />
                      {item.portionSize}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0 border-t bg-secondary/10 flex gap-2 p-4">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewDetails(item)}>
                    <Info className="h-4 w-4 mr-2" /> Details
                  </Button>
                  <Button size="sm" className="flex-1">
                    <Plus className="h-4 w-4 mr-2" /> Add
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-24 bg-background rounded-3xl border-2 border-dashed">
              <Utensils className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
              <h3 className="text-xl font-medium mb-1">No dishes found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl overflow-hidden p-0 gap-0">
          <div className="grid md:grid-cols-2">
            <div className="relative aspect-square md:aspect-auto">
              <img 
                src={selectedItem?.image} 
                alt={selectedItem?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex flex-col">
              <DialogHeader className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="capitalize">{selectedItem?.foodCategory.replace('_', ' ')}</Badge>
                  {selectedItem?.isVegetarian && <Badge className="bg-green-500 text-white"><Leaf className="h-3 w-3 mr-1" /> Veg</Badge>}
                  {selectedItem?.isSpicy && <Badge className="bg-red-500 text-white"><Flame className="h-3 w-3 mr-1" /> Spicy</Badge>}
                </div>
                <DialogTitle className="text-3xl font-serif">{selectedItem?.name}</DialogTitle>
                <DialogDescription className="text-sm">
                  {selectedItem?.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 flex-1">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Ingredients</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem?.ingredients.map(ing => (
                      <Badge key={ing} variant="outline" className="font-normal text-xs">{ing}</Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-secondary/20 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">Portion Size</p>
                    <p className="font-semibold flex items-center gap-2">
                      <Utensils className="h-4 w-4 text-primary" />
                      {selectedItem?.portionSize}
                    </p>
                  </div>
                  <div className="p-3 bg-secondary/20 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">Prep Time</p>
                    <p className="font-semibold flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      {selectedItem?.preparationTime} min
                    </p>
                  </div>
                </div>
                
                {selectedItem?.calories && (
                  <div className="text-xs text-muted-foreground">
                    Approx. {selectedItem.calories} calories per serving
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Price</p>
                  <p className="text-2xl font-bold text-primary">ETB {selectedItem?.price.toLocaleString()}</p>
                </div>
                <Button className="rounded-full px-8 h-12 shadow-lg shadow-primary/25">
                  <ShoppingCart className="h-4 w-4 mr-2" /> Add to Order
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PublicLayout>
  )
}
