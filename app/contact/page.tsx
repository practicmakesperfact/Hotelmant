"use client"

import { useState } from "react"
import { PublicLayout } from "@/components/layout/public-layout"
import { useLocale } from "@/lib/i18n/locale-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, CheckCircle } from "lucide-react"

export default function ContactPage() {
  const { t } = useLocale()
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  const contactInfo = [
    { 
      icon: MapPin, 
      title: t.contact.address, 
      details: ["Kombolcha", "Ethiopia, 1000"],
      action: "Get Directions"
    },
    { 
      icon: Phone, 
      title: t.contact.phone, 
      details: ["+251 11 234 5678", "+251 91 234 5678"],
      action: "Call Now"
    },
    { 
      icon: Mail, 
      title: t.contact.email, 
      details: ["info@leulmekonenhotel.com", "reservations@leulmekonenhotel.com"],
      action: "Send Email"
    },
    { 
      icon: Clock, 
      title: t.contact.hours, 
      details: ["Front Desk: 24/7", "Reservations: 8AM - 10PM"],
      action: null
    }
  ]

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center bg-hotel-dark">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] bg-cover bg-center opacity-30" />
        <div className="relative z-10 text-center text-white px-4">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
            {t.contact.getInTouch}
          </Badge>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            {t.contact.title}
          </h1>
          <p className="text-lg text-white/80 max-w-xl mx-auto">
            {t.contact.subtitle}
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-20 relative z-20">
            {contactInfo.map((info, index) => {
              const Icon = info.icon
              return (
                <Card key={index} className="shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2 text-foreground">{info.title}</h3>
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-sm text-muted-foreground">{detail}</p>
                    ))}
                    {info.action && (
                      <Button variant="link" className="mt-2 p-0 h-auto text-primary">
                        {info.action}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  {t.contact.sendMessage}
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we&apos;ll get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">Message Sent!</h3>
                    <p className="text-muted-foreground mb-4">
                      Thank you for contacting us. We&apos;ll respond to your inquiry shortly.
                    </p>
                    <Button variant="outline" onClick={() => {
                      setIsSubmitted(false)
                      setFormState({ name: "", email: "", phone: "", subject: "", message: "" })
                    }}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t.contact.name}</Label>
                        <Input 
                          id="name" 
                          value={formState.name}
                          onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t.contact.email}</Label>
                        <Input 
                          id="email" 
                          type="email"
                          value={formState.email}
                          onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t.contact.phone}</Label>
                        <Input 
                          id="phone"
                          value={formState.phone}
                          onChange={(e) => setFormState(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+251 91 234 5678"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">{t.contact.subject}</Label>
                        <Input 
                          id="subject"
                          value={formState.subject}
                          onChange={(e) => setFormState(prev => ({ ...prev, subject: e.target.value }))}
                          placeholder="What is this about?"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">{t.contact.message}</Label>
                      <textarea 
                        id="message"
                        className="w-full min-h-[150px] px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
                        value={formState.message}
                        onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="How can we help you?"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          {t.contact.send}
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Map & Additional Info */}
            <div className="space-y-6">
              <Card className="overflow-hidden">
                <div className="aspect-video bg-muted">
                  <img 
                    src="/placeholder.svg?height=400&width=600" 
                    alt="Hotel Location Map"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    Interactive map coming soon. Our hotel is located in the heart of Kombolcha, 
                    Ethiopia, with easy access to major attractions.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Response Channels</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">WhatsApp</p>
                        <p className="text-sm text-muted-foreground">Chat with us directly</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Open</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Telegram</p>
                        <p className="text-sm text-muted-foreground">@LeulMekonenHotel</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Open</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4">FAQ</Badge>
          <h2 className="font-serif text-3xl font-bold mb-4 text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Can&apos;t find what you&apos;re looking for? Check our FAQ or contact us directly.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
            {[
              { q: "What are the check-in/check-out times?", a: "Check-in: 2:00 PM, Check-out: 11:00 AM" },
              { q: "Is airport pickup available?", a: "Yes, complimentary for suite bookings" },
              { q: "Do you accept international cards?", a: "Yes, Visa, Mastercard & Amex accepted" }
            ].map((faq, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2 text-foreground">{faq.q}</h4>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
