'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { ArrowRight, Star, Wifi, Car, Utensils, Dumbbell, Sparkles, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PublicLayout } from '@/components/layout/public-layout';
import { useLocale } from '@/lib/i18n/locale-context';
import { mockRooms } from '@/lib/mock-data';

export default function HomePage() {
  const { t, formatCurrency } = useLocale();

  const featuredRooms = mockRooms.filter(room =>
    ['suite', 'deluxe', 'presidential'].includes(room.type)
  ).slice(0, 3);

  const amenities = [
    { icon: Wifi, title: 'Free High-Speed WiFi', description: 'Stay connected with complimentary WiFi throughout the hotel' },
    { icon: Utensils, title: 'Fine Dining', description: 'Experience authentic Ethiopian cuisine and international dishes' },
    { icon: Sparkles, title: 'Spa & Wellness', description: 'Rejuvenate with our full-service spa treatments' },
    { icon: Car, title: 'Airport Transfer', description: 'Convenient pickup and drop-off service' },
    { icon: Dumbbell, title: 'Fitness Center', description: 'State-of-the-art equipment available 24/7' },
    { icon: Clock, title: '24/7 Service', description: 'Our staff is always ready to assist you' },
  ];

  const testimonials = [
    {
      name: 'Sarah John',
      location: 'Addis Ababa',
      rating: 5,
      text: 'An incredible experience! The staff went above and beyond to make our stay memorable. The blend of modern luxury and Ethiopian culture is perfect.',
    },
    {
      name: 'Ahmed Hassan',
      location: 'Dessie',
      rating: 5,
      text: 'Best hotel in Combolcha . The Presidential Suite is absolutely stunning, and the traditional coffee ceremony was a highlight.',
    },
    {
      name: 'Elena Bereket',
      location: 'Combolcha',
      rating: 5,
      text: 'Exceptional hospitality and attention to detail. The spa treatments were divine, and the restaurant serves the best injera I ever had!',
    },
  ];

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

  const getRoomImageUrl = (type: string) => {
    const images: Record<string, string> = {
      presidential: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800',
      suite: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800',
      deluxe: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800',
      standard: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800',
      family: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800',
    };
    return images[type] || images.standard;
  };

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sidebar/90 via-sidebar/70 to-sidebar/90 z-10" />
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"
            alt="Leul Mekonen Hotel"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white mb-6 text-balance">
            {t.landing.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto text-pretty">
            {t.landing.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* BOOK NOW now goes to /rooms so user selects a room first */}
            <Link href="/rooms">
              <Button size="lg" className="text-lg px-8">
                {t.landing.bookNow}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/rooms">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent border-white text-white hover:bg-white/10 hover:text-white">
                {t.landing.viewRooms}
              </Button>
            </Link>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/50 flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Featured Rooms — 3D hover cards */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl mb-4">{t.landing.featuredRooms}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From elegant suites to luxurious presidential accommodations, find your perfect retreat
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ perspective: '1200px' }}>
            {featuredRooms.map((room) => (
              <RoomCard3D
                key={room.id}
                room={room}
                label={getRoomTypeLabel(room.type)}
                imageUrl={getRoomImageUrl(room.type)}
                price={formatCurrency(room.pricePerNight)}
                priceLabel={t.rooms.pricePerNight}
                viewDetailsLabel={t.rooms.viewDetails}
              />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/rooms">
              <Button variant="outline" size="lg">
                View All Rooms
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl mb-4">{t.landing.ourAmenities}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience world-class facilities designed for your comfort and convenience
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {amenities.map((amenity, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <amenity.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{amenity.title}</h3>
                    <p className="text-sm text-muted-foreground">{amenity.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl mb-4">{t.landing.guestReviews}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear what our guests have to say about their experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-4">
            Ready to Experience Ethiopian Hospitality?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Book your stay now and discover why Leul Mekonen Hotel is the premier destination in Kombolcha
          </p>
          <Link href="/rooms">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              {t.landing.bookNow}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}

// 3D Tilt Card Component for Featured Rooms
function RoomCard3D({
  room,
  label,
  imageUrl,
  price,
  priceLabel,
  viewDetailsLabel,
}: {
  room: any;
  label: string;
  imageUrl: string;
  price: string;
  priceLabel: string;
  viewDetailsLabel: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 0.15s ease-out',
        willChange: 'transform',
        borderRadius: '0.75rem',
      }}
      className="overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer bg-card border border-border"
    >
      <div className="relative h-64 overflow-hidden">
        <Image
          src={imageUrl}
          alt={`${label} Room`}
          fill
          className="object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {/* Room type badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-primary text-primary-foreground px-3 py-1 text-sm rounded-full font-medium">
            {label}
          </span>
        </div>
        {/* 360° badge */}
        <div className="absolute top-4 right-4">
          <Badge className="gap-1 bg-black/60 text-white border-0">
            <Eye className="h-3 w-3" />
            360°
          </Badge>
        </div>
        {/* Floating price at bottom of image */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div>
            <span className="text-white text-2xl font-bold">{price}</span>
            <span className="text-white/70 text-sm ml-1">/ {priceLabel}</span>
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-serif text-xl mb-2">{label} Room</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {room.description}
        </p>
        <Link href={`/rooms/${room.id}`} className="block">
          <Button variant="outline" size="sm" className="w-full">
            {viewDetailsLabel}
          </Button>
        </Link>
      </div>
    </div>
  );
}
