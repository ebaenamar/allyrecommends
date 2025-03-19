import React from 'react';
import Image from 'next/image';
import { UberEatsRecommendations, HealthScore } from './ubereats-recommendations';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface UberEatsChatIntegrationProps {
  recommendations: any[];
  healthScore: number;
  healthHistory: { date: string; score: number }[];
  onRequestMoreRecommendations: () => void;
}

export function UberEatsChatIntegration({
  recommendations,
  healthScore,
  healthHistory,
  onRequestMoreRecommendations,
}: UberEatsChatIntegrationProps) {
  return (
    <Card className="w-full max-w-3xl mx-auto my-4">
      <CardContent className="p-4">
        <div>
          <div className="grid w-full grid-cols-2 bg-muted p-1 rounded-md">
            <button className="px-3 py-1.5 rounded-sm bg-background text-foreground shadow-sm">Food Recommendations</button>
            <button className="px-3 py-1.5 rounded-sm text-muted-foreground">Health Score</button>
          </div>
          <div className="mt-4">
            <UberEatsRecommendations recommendations={recommendations} />
            <div className="mt-4 flex justify-center">
              <Button onClick={onRequestMoreRecommendations}>
                Get More Recommendations
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// This component can be used to display a recommendation directly in the chat
export function UberEatsRecommendationInChat({
  recommendation,
  onOrder,
}: {
  recommendation: any;
  onOrder: () => void;
}) {
  if (!recommendation) return null;
  
  return (
    <Card className="w-full max-w-md my-2">
      <div className="relative h-32 w-full">
        {recommendation.menuItem.imageUrl ? (
          <div className="relative h-full w-full">
            <Image 
              src={recommendation.menuItem.imageUrl} 
              alt={recommendation.menuItem.name} 
              fill
              className="object-cover rounded-t-lg"
            />
          </div>
        ) : (
          <div className="h-full w-full bg-muted flex items-center justify-center rounded-t-lg">
            <span className="text-muted-foreground">No image available</span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div>
            <h3 className="font-bold">{recommendation.menuItem.name}</h3>
            <p className="text-sm text-muted-foreground">{recommendation.restaurant.name}</p>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{recommendation.menuItem.price}</span>
            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Health Score: {recommendation.healthScore}/10
            </span>
          </div>
          <Button className="w-full" size="sm" asChild>
            <a href={recommendation.orderLink} target="_blank" rel="noopener noreferrer" onClick={onOrder}>
              Order Now
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
