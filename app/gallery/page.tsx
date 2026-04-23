"use client"

import { useState } from "react"
import { PublicLayout } from "@/components/layout/public-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Image as ImageIcon, 
  Maximize2, 
  X,
  Eye,
  Layers
} from "lucide-react"
import { mockGalleryItems } from "@/lib/mock-data"
import { useLocale } from "@/lib/i18n/locale-context"
import { Viewer360 } from "@/components/viewer-360"

export default function GalleryPage() {
  const { t } = useLocale()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedItem, setSelectedItem] = useState<typeof mockGalleryItems[0] | null>(null)
  const [showViewer, setShowViewer] = useState(false)

  const categories = [
    { label: t.gallery?.allCategories || 'All', value: 'all' },
    { label: t.gallery?.rooms || 'Rooms', value: 'rooms' },
    { label: t.gallery?.restaurant || 'Restaurant', value: 'restaurant' },
    { label: t.gallery?.lobby || 'Lobby', value: 'lobby' },
    { label: t.gallery?.events || 'Events', value: 'events' },
    { label: t.gallery?.facilities || 'Facilities', value: 'facilities' },
    { label: t.gallery?.exterior || 'Exterior', value: 'exterior' },
  ]

  const filteredItems = selectedCategory === 'all' 
    ? mockGalleryItems 
    : mockGalleryItems.filter(item => item.category === selectedCategory)

  const handleViewItem = (item: typeof mockGalleryItems[0]) => {
    setSelectedItem(item)
    setShowViewer(true)
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-secondary/30 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl font-serif font-bold mb-4">{t.gallery?.title || 'Hotel Gallery'}</h1>
            <p className="text-muted-foreground text-lg">
              {t.gallery?.subtitle || 'Explore our beautiful spaces with interactive 360° virtual tours'}
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.value)}
                className="rounded-full"
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {item.is360 && (
                    <Badge className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm">
                      <Eye className="h-3 w-3 mr-1" /> 360°
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleViewItem(item)}
                    >
                      <Maximize2 className="h-4 w-4 mr-2" />
                      {item.is360 ? (t.gallery?.view360 || 'View 360°') : (t.gallery?.viewImage || 'View Image')}
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <Badge variant="outline" className="capitalize text-xs">
                      {item.category}
                    </Badge>
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-24 bg-background rounded-3xl border-2 border-dashed">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
              <h3 className="text-xl font-medium mb-1">{t.gallery?.noImages || 'No images found'}</h3>
              <p className="text-muted-foreground">{t.gallery?.tryDifferentCategory || 'Try selecting a different category.'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Viewer Modal */}
      <Dialog open={showViewer} onOpenChange={setShowViewer}>
        <DialogContent className="max-w-6xl h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl">{selectedItem?.title}</DialogTitle>
                {selectedItem?.description && (
                  <p className="text-sm text-muted-foreground mt-1">{selectedItem.description}</p>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowViewer(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 relative bg-black">
            {selectedItem?.is360 ? (
              <Viewer360 
                imageUrl={selectedItem.imageUrl}
                hotspots={selectedItem.hotspots}
                title={selectedItem.title}
              />
            ) : (
              <img 
                src={selectedItem?.imageUrl} 
                alt={selectedItem?.title}
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </PublicLayout>
  )
}
