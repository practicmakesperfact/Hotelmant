'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, SlidersHorizontal, Users, Maximize2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { PublicLayout } from '@/components/layout/public-layout';
import { useLocale } from '@/lib/i18n/locale-context';
import { mockRooms } from '@/lib/mock-data';
import type { RoomType } from '@/lib/types';

export default function RoomsPage() {
  const { t, formatCurrency } = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<RoomType | 'all'>('all');
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'size'>('price-asc');

  const roomTypes: { value: RoomType | 'all'; label: string }[] = [
    { value: 'all', label: t.common.all },
    { value: 'standard', label: t.rooms.types.standard },
    { value: 'deluxe', label: t.rooms.types.deluxe },
    { value: 'suite', label: t.rooms.types.suite },
    { value: 'family', label: t.rooms.types.family },
    { value: 'presidential', label: t.rooms.types.presidential },
  ];

  // Get unique rooms by type (show one of each type for the listing)
  const uniqueRoomsByType = useMemo(() => {
    const seen = new Set<RoomType>();
    return mockRooms.filter(room => {
      if (seen.has(room.type)) return false;
      seen.add(room.type);
      return true;
    });
  }, []);

  const filteredRooms = useMemo(() => {
    return uniqueRoomsByType
      .filter(room => {
        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          if (!room.type.includes(query) && 
              !room.description.toLowerCase().includes(query) &&
              !room.amenities.some(a => a.toLowerCase().includes(query))) {
            return false;
          }
        }
        // Type filter
        if (selectedType !== 'all' && room.type !== selectedType) {
          return false;
        }
        // Price filter
        if (room.pricePerNight < priceRange[0] || room.pricePerNight > priceRange[1]) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return a.pricePerNight - b.pricePerNight;
          case 'price-desc':
            return b.pricePerNight - a.pricePerNight;
          case 'size':
            return b.size - a.size;
          default:
            return 0;
        }
      });
  }, [uniqueRoomsByType, searchQuery, selectedType, priceRange, sortBy]);

  const getRoomTypeLabel = (type: RoomType) => {
    return roomTypes.find(rt => rt.value === type)?.label || type;
  };

  const getRoomImage = (type: RoomType) => {
    const images: Record<RoomType, string> = {
      standard: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800',
      deluxe: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800',
      suite: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800',
      family: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800',
      presidential: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800',
    };
    return images[type];
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Room Type */}
      <div>
        <label className="text-sm font-medium mb-2 block">{t.rooms.filterByType}</label>
        <Select value={selectedType} onValueChange={(v) => setSelectedType(v as RoomType | 'all')}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roomTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-sm font-medium mb-2 block">{t.rooms.filterByPrice}</label>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={20000}
            step={500}
            className="my-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatCurrency(priceRange[0])}</span>
            <span>{formatCurrency(priceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="text-sm font-medium mb-2 block">{t.rooms.sortBy}</label>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="size">Room Size</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sidebar/80 to-sidebar/90 z-10" />
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070"
            alt="Hotel Rooms"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-20 text-center px-4">
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">{t.rooms.title}</h1>
          <p className="text-lg text-white/80">{t.rooms.subtitle}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t.rooms.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Desktop Filters */}
            <div className="hidden md:flex gap-4">
              <Select value={selectedType} onValueChange={(v) => setSelectedType(v as RoomType | 'all')}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t.rooms.filterByType} />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t.rooms.sortBy} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="size">Room Size</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mobile Filters */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  {t.common.filter}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>{t.common.filter}</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FiltersContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRooms.map((room) => (
              <Card key={room.id} className="overflow-hidden group">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-64 h-48 sm:h-auto shrink-0">
                    <Image
                      src={getRoomImage(room.type)}
                      alt={`${getRoomTypeLabel(room.type)} Room`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {room.panoramaImage && (
                      <Badge className="absolute top-2 right-2 gap-1">
                        <Eye className="h-3 w-3" />
                        360&deg;
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Badge variant="secondary" className="mb-2">
                          {getRoomTypeLabel(room.type)}
                        </Badge>
                        <h3 className="font-serif text-xl">
                          {getRoomTypeLabel(room.type)} Room
                        </h3>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {room.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{room.maxOccupancy} {t.rooms.maxGuests}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Maximize2 className="h-4 w-4" />
                        <span>{room.size} m&sup2;</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {room.amenities.slice(0, 4).map((amenity) => (
                        <Badge key={amenity} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {room.amenities.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{room.amenities.length - 4} more
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <span className="text-2xl font-semibold">{formatCurrency(room.pricePerNight)}</span>
                        <span className="text-muted-foreground text-sm"> / {t.rooms.pricePerNight}</span>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/rooms/${room.id}`}>
                          <Button variant="outline" size="sm">
                            {t.rooms.viewDetails}
                          </Button>
                        </Link>
                        <Link href={`/booking?room=${room.type}`}>
                          <Button size="sm">
                            {t.rooms.bookRoom}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>

          {filteredRooms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No rooms found matching your criteria</p>
              <Button 
                variant="link" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('all');
                  setPriceRange([0, 20000]);
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
