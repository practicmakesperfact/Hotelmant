"use client"

import { PublicLayout } from "@/components/layout/public-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Tag, 
  Calendar, 
  Percent,
  DollarSign,
  Copy,
  CheckCircle2,
  Clock
} from "lucide-react"
import { mockPromotions } from "@/lib/mock-data"
import { format, differenceInDays } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { useLocale } from "@/lib/i18n/locale-context"

export default function PromotionsPage() {
  const { t } = useLocale()
  const { toast } = useToast()

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: t.promotions.codeCopied,
      description: `${code} ${t.promotions.copiedToClipboard}`,
    })
  }

  const getDaysRemaining = (validTo: Date) => {
    return differenceInDays(new Date(validTo), new Date())
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-secondary/30 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl font-serif font-bold mb-4">{t.promotions.title}</h1>
            <p className="text-muted-foreground text-lg">
              {t.promotions.subtitle}
            </p>
          </div>

          {/* Promotions Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPromotions.filter(p => p.isActive).map((promo) => {
              const daysRemaining = getDaysRemaining(promo.validTo)
              const usagePercentage = promo.usageLimit ? (promo.usedCount / promo.usageLimit) * 100 : 0
              
              return (
                <Card key={promo.id} className="overflow-hidden border-2 hover:border-primary/50 transition-colors">
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 border-b">
                    <div className="flex items-start justify-between mb-4">
                      <Badge variant="secondary" className="text-xs">
                        {promo.discountType === 'percentage' ? (
                          <><Percent className="h-3 w-3 mr-1" /> {promo.discountValue}% OFF</>
                        ) : (
                          <><DollarSign className="h-3 w-3 mr-1" /> ETB {promo.discountValue} OFF</>
                        )}
                      </Badge>
                      {daysRemaining <= 7 && (
                        <Badge variant="destructive" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" /> {daysRemaining} {t.promotions.daysLeft}
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{promo.name}</h3>
                    <p className="text-sm text-muted-foreground">{promo.description}</p>
                  </div>

                  <CardContent className="p-6">
                    {/* Promo Code */}
                    <div className="bg-secondary/50 rounded-lg p-4 mb-4 border-2 border-dashed">
                      <p className="text-xs text-muted-foreground mb-2">{t.promotions.promoCode}</p>
                      <div className="flex items-center justify-between">
                        <code className="text-lg font-bold tracking-wider">{promo.code}</code>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyCode(promo.code)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 text-sm">
                      {promo.minBookingAmount && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                          <span>{t.promotions.minBooking}: ETB {promo.minBookingAmount.toLocaleString()}</span>
                        </div>
                      )}
                      {promo.maxDiscount && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Tag className="h-4 w-4" />
                          <span>{t.promotions.maxDiscount}: ETB {promo.maxDiscount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{t.promotions.validUntil} {format(new Date(promo.validTo), 'MMM dd, yyyy')}</span>
                      </div>
                      {promo.applicableRoomTypes && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>{t.promotions.applicableTo}: {promo.applicableRoomTypes.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')}</span>
                        </div>
                      )}
                    </div>

                    {/* Usage Stats */}
                    {promo.usageLimit && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                          <span>{promo.usedCount} {t.promotions.used}</span>
                          <span>{promo.usageLimit - promo.usedCount} {t.promotions.remaining}</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all"
                            style={{ width: `${usagePercentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="p-6 pt-0">
                    <Button className="w-full" asChild>
                      <a href="/rooms">
                        {t.promotions.bookNow}
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>

          {/* Terms */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle>{t.promotions.termsConditions}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Promo codes cannot be combined with other offers unless specified</li>
                <li>Discounts apply to room rates only, excluding taxes and service charges</li>
                <li>Promo codes must be entered at the time of booking</li>
                <li>Management reserves the right to modify or cancel promotions at any time</li>
                <li>Blackout dates may apply during peak seasons and holidays</li>
                <li>One promo code per booking unless otherwise stated</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  )
}
