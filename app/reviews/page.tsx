"use client"

import { useState } from "react"
import { PublicLayout } from "@/components/layout/public-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  Star, 
  ThumbsUp,
  MessageSquare,
  TrendingUp
} from "lucide-react"
import { mockReviews } from "@/lib/mock-data"
import { useLocale } from "@/lib/i18n/locale-context"
import { format } from "date-fns"

export default function ReviewsPage() {
  const { t } = useLocale()
  const [filter, setFilter] = useState<number | 'all'>('all')

  const filteredReviews = filter === 'all' 
    ? mockReviews.filter(r => r.status === 'approved')
    : mockReviews.filter(r => r.status === 'approved' && r.rating === filter)

  // Calculate stats
  const totalReviews = mockReviews.filter(r => r.status === 'approved').length
  const averageRating = mockReviews
    .filter(r => r.status === 'approved')
    .reduce((sum, r) => sum + r.rating, 0) / totalReviews

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: mockReviews.filter(r => r.status === 'approved' && r.rating === rating).length,
    percentage: (mockReviews.filter(r => r.status === 'approved' && r.rating === rating).length / totalReviews) * 100
  }))

  const categoryAverages = {
    cleanliness: mockReviews.reduce((sum, r) => sum + r.cleanliness, 0) / totalReviews,
    service: mockReviews.reduce((sum, r) => sum + r.service, 0) / totalReviews,
    amenities: mockReviews.reduce((sum, r) => sum + r.amenities, 0) / totalReviews,
    value: mockReviews.reduce((sum, r) => sum + r.value, 0) / totalReviews,
    location: mockReviews.reduce((sum, r) => sum + r.location, 0) / totalReviews,
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-secondary/30 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl font-serif font-bold mb-4">{t.reviews?.title || 'Guest Reviews'}</h1>
            <p className="text-muted-foreground text-lg">
              {t.reviews?.subtitle || 'See what our guests are saying about their experience'}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Overall Rating */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <h3 className="font-semibold text-lg">Overall Rating</h3>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-5 w-5 ${star <= Math.round(averageRating) ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Based on {totalReviews} reviews</p>
                </div>

                <div className="space-y-3">
                  {ratingDistribution.map(({ rating, count, percentage }) => (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-16">
                        <span className="text-sm font-medium">{rating}</span>
                        <Star className="h-3 w-3 fill-primary text-primary" />
                      </div>
                      <Progress value={percentage} className="flex-1 h-2" />
                      <span className="text-sm text-muted-foreground w-8">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Ratings */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <h3 className="font-semibold text-lg">Rating Breakdown</h3>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-6">
                  {Object.entries(categoryAverages).map(([category, avg]) => (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium capitalize">{category}</span>
                        <span className="text-sm font-bold">{avg.toFixed(1)}/5</span>
                      </div>
                      <Progress value={(avg / 5) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant={filter === 'all' ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter('all')}
              className="rounded-full"
            >
              All Reviews
            </Button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <Button
                key={rating}
                variant={filter === rating ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(rating)}
                className="rounded-full"
              >
                {rating} <Star className="h-3 w-3 ml-1 fill-current" />
              </Button>
            ))}
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {filteredReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {review.customerName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{review.customerName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(review.createdAt), 'MMMM dd, yyyy')}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-4 w-4 ${star <= review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-sm mb-4 leading-relaxed">{review.comment}</p>

                      {/* Category Scores */}
                      <div className="flex flex-wrap gap-3 mb-4">
                        <Badge variant="secondary" className="text-xs">
                          Cleanliness: {review.cleanliness}/5
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Service: {review.service}/5
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Amenities: {review.amenities}/5
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Value: {review.value}/5
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Location: {review.location}/5
                        </Badge>
                      </div>

                      {/* Admin Response */}
                      {review.response && (
                        <div className="bg-secondary/50 rounded-lg p-4 border-l-4 border-primary">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="h-4 w-4 text-primary" />
                            <span className="text-sm font-semibold">Response from Management</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.response}</p>
                          {review.respondedAt && (
                            <p className="text-xs text-muted-foreground mt-2">
                              {format(new Date(review.respondedAt), 'MMMM dd, yyyy')}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          Helpful
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredReviews.length === 0 && (
            <div className="text-center py-24 bg-background rounded-3xl border-2 border-dashed">
              <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
              <h3 className="text-xl font-medium mb-1">No reviews found</h3>
              <p className="text-muted-foreground">Try adjusting your filter.</p>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  )
}
