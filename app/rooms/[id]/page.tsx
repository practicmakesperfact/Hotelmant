'use client';

import { use } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  Users, 
  Maximize2, 
  BedDouble, 
  Mountain, 
  Cigarette, 
  Wind,
  Check,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PublicLayout } from '@/components/layout/public-layout';
import { useLocale } from '@/lib/i18n/locale-context';
import { mockRooms } from '@/lib/mock-data';

export default function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const room = mockRooms.find((r) => r.id === resolvedParams.id);
  const { t, formatCurrency } = useLocale();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!room) {
    notFound();
  }

  const getRoomTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      standard: t.rooms.types.standard,
      deluxe: t.rooms.types.deluxe,
      suite: t.rooms.types.suite,
      presidential: t.rooms.types.presidential,
      family: t.rooms.types.family,
    };
    return labels[type] || type;
  };

  const getRoomImages = (type: string) => {
    const baseImages: Record<string, string[]> = {
      standard: [
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1200',
        'https://images.unsplash.com/photo-1631049035182-249067d7618e?q=80&w=1200',
        'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200',
      ],
      deluxe: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200',
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200',
        'https://images.unsplash.com/photo-1587985064135-0366536eab42?q=80&w=1200',
      ],
      suite: [
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200',
        'https://images.unsplash.com/photo-1631049035182-249067d7618e?q=80&w=1200',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200',
      ],
      family: [
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1200',
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200',
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1200',
      ],
      presidential: [
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200',
      ],
    };
    return baseImages[type] || baseImages.standard;
  };

  const images = getRoomImages(room.type);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getBedTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      single: 'Single Bed',
      double: 'Double Bed',
      queen: 'Queen Bed',
      king: 'King Bed',
      twin: 'Twin Beds',
    };
    return labels[type] || type;
  };

  const getViewLabel = (view?: string) => {
    const labels: Record<string, string> = {
      city: 'City View',
      garden: 'Garden View',
      pool: 'Pool View',
      mountain: 'Mountain View',
    };
    return view ? labels[view] || view : 'N/A';
  };

  // Find similar rooms
  const similarRooms = mockRooms
    .filter((r) => r.id !== room.id && r.type === room.type)
    .slice(0, 2);

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back button */}
        <Link href="/rooms" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Rooms
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="relative rounded-xl overflow-hidden">
              <div className="relative aspect-[16/10]">
                <Image
                  src={images[currentImageIndex]}
                  alt={`${getRoomTypeLabel(room.type)} Room`}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Navigation arrows */}
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
                {/* 360 badge */}
                {room.panoramaImage && (
                  <Badge className="absolute bottom-4 right-4 gap-1 cursor-pointer">
                    <Eye className="h-3 w-3" />
                    {t.rooms.view360}
                  </Badge>
                )}
              </div>
              {/* Thumbnails */}
              <div className="flex gap-2 mt-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-md overflow-hidden ${
                      idx === currentImageIndex ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Room Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{getRoomTypeLabel(room.type)}</Badge>
                <Badge variant="outline">Room {room.roomNumber}</Badge>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl mb-4">
                {getRoomTypeLabel(room.type)} Room
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {room.description}
              </p>
            </div>

            <Separator />

            {/* Room Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{t.rooms.maxGuests}</p>
                  <p className="font-medium">{room.maxOccupancy}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg">
                <Maximize2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{t.rooms.roomSize}</p>
                  <p className="font-medium">{room.size} m&sup2;</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg">
                <BedDouble className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{t.rooms.bedType}</p>
                  <p className="font-medium">{getBedTypeLabel(room.bedType)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg">
                <Mountain className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{t.rooms.view}</p>
                  <p className="font-medium">{getViewLabel(room.view)}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Amenities */}
            <div>
              <h2 className="font-serif text-2xl mb-4">{t.rooms.amenities}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {room.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Additional Info */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Cigarette className={`h-4 w-4 ${room.isSmokingAllowed ? 'text-muted-foreground' : 'text-destructive'}`} />
                <span className={room.isSmokingAllowed ? '' : 'text-muted-foreground'}>
                  {room.isSmokingAllowed ? 'Smoking Allowed' : 'Non-Smoking'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className={`h-4 w-4 ${room.hasBalcony ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={room.hasBalcony ? '' : 'text-muted-foreground'}>
                  {room.hasBalcony ? 'Has Balcony' : 'No Balcony'}
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-baseline justify-between">
                  <span className="text-3xl font-semibold">{formatCurrency(room.pricePerNight)}</span>
                  <span className="text-sm text-muted-foreground font-normal">/ {t.rooms.pricePerNight}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">{t.rooms.availability}</p>
                  <p className="font-medium text-green-600">
                    {room.status === 'available' ? 'Available Now' : 'Currently Occupied'}
                  </p>
                </div>
                <Link href={`/booking?room=${room.type}`} className="block">
                  <Button size="lg" className="w-full">
                    {t.rooms.bookRoom}
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground text-center">
                  Free cancellation within 24 hours
                </p>
              </CardContent>
            </Card>

            {/* Similar Rooms */}
            {similarRooms.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Similar Rooms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {similarRooms.map((similarRoom) => (
                    <Link key={similarRoom.id} href={`/rooms/${similarRoom.id}`}>
                      <div className="flex gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                        <div className="relative w-16 h-16 rounded overflow-hidden shrink-0">
                          <Image
                            src={getRoomImages(similarRoom.type)[0]}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Room {similarRoom.roomNumber}</p>
                          <p className="text-sm text-muted-foreground">Floor {similarRoom.floor}</p>
                          <p className="text-sm font-medium text-primary">
                            {formatCurrency(similarRoom.pricePerNight)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
