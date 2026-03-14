"use client"

import { PublicLayout } from "@/components/layout/public-layout"
import { useLocale } from "@/lib/i18n/locale-context"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Users, Calendar, MapPin, Coffee, Wifi, Car, Utensils, Dumbbell, Sparkles } from "lucide-react"

export default function AboutPage() {
  const { t } = useLocale()

  const stats = [
    { icon: Calendar, value: "15+", label: t.about.yearsExperience },
    { icon: Users, value: "50,000+", label: t.about.guestsServed },
    { icon: Award, value: "4.8", label: t.about.rating },
    { icon: MapPin, value: "Prime", label: t.about.location }
  ]

  const amenities = [
    { icon: Coffee, name: "Ethiopian Coffee Ceremony", desc: "Daily traditional coffee service" },
    { icon: Wifi, name: "High-Speed WiFi", desc: "Complimentary throughout the hotel" },
    { icon: Car, name: "Airport Transfer", desc: "Scheduled shuttle service available" },
    { icon: Utensils, name: "Fine Dining", desc: "Ethiopian and international cuisine" },
    { icon: Dumbbell, name: "Fitness Center", desc: "24/7 access with modern equipment" },
    { icon: Sparkles, name: "Spa & Wellness", desc: "Traditional and modern treatments" }
  ]

  const team = [
    { name: "Abebe Kebede", role: "General Manager", experience: "20 years in hospitality" },
    { name: "Tigist Haile", role: "Head of Guest Relations", experience: "15 years experience" },
    { name: "Dawit Assefa", role: "Executive Chef", experience: "International culinary training" },
    { name: "Sara Tesfaye", role: "Housekeeping Director", experience: "10 years of excellence" }
  ]

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center bg-hotel-dark">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] bg-cover bg-center opacity-30" />
        <div className="relative z-10 text-center text-white px-4">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
            {t.about.established} 2009
          </Badge>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4 text-balance">
            {t.about.title}
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto text-pretty">
            {t.about.subtitle}
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <Icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">{t.about.ourStory}</Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-foreground">
                {t.about.storyTitle}
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2009, Leul Mekonen Hotel was born from a vision to create a sanctuary where 
                  Ethiopian hospitality meets world-class luxury. Nestled in the heart of Kombolcha, 
                  our hotel has become a landmark of excellence.
                </p>
                <p>
                  Every detail of our hotel reflects the rich cultural heritage of Ethiopia, from the 
                  hand-woven textiles adorning our walls to the aromatic coffee ceremonies held daily 
                  in our lobby.
                </p>
                <p>
                  Our commitment to exceptional service has earned us recognition as one of Ethiopia&apos;s 
                  premier hospitality destinations, welcoming guests from around the world who seek 
                  an authentic experience combined with modern comfort.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                <img 
                  src="/placeholder.svg?height=400&width=300" 
                  alt="Hotel Interior"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted mt-8">
                <img 
                  src="/placeholder.svg?height=400&width=300" 
                  alt="Ethiopian Coffee Ceremony"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">{t.about.amenities}</Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              {t.about.amenitiesTitle}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {amenities.map((amenity, index) => {
              const Icon = amenity.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{amenity.name}</h3>
                      <p className="text-sm text-muted-foreground">{amenity.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">{t.about.team}</Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              {t.about.teamTitle}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4 overflow-hidden">
                    <img 
                      src="/placeholder.svg?height=96&width=96" 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-primary font-medium">{member.role}</p>
                  <p className="text-xs text-muted-foreground mt-1">{member.experience}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">{t.about.location}</Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-foreground">
                {t.about.locationTitle}
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Located in Kombolcha, Leul Mekonen Hotel offers 
                  unparalleled access to the city&apos;s finest attractions, business centers, and cultural landmarks.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>5 minutes from Kombolcha Airport</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>Walking distance to African Union HQ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>Central business district location</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <img 
                src="/placeholder.svg?height=400&width=600" 
                alt="Hotel Location Map"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
