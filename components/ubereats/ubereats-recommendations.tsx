import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface UberEatsRecommendationProps {
  recommendations: {
    restaurant: {
      id: string;
      name: string;
      rating: number;
      deliveryTime: string;
      imageUrl: string;
    };
    menuItem: {
      id: string;
      name: string;
      description: string;
      price: string;
      imageUrl: string;
      calories: number;
      tags: string[];
      healthScore: number;
    };
    healthScore: number;
    orderLink: string;
  }[];
}

export function UberEatsRecommendations({ recommendations }: UberEatsRecommendationProps) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Healthy Food Recommendations</CardTitle>
          <CardDescription>
            No recommendations available at the moment. Try updating your preferences or location.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Healthy Food Recommendations</h2>
      <p className="text-muted-foreground">
        Based on your preferences, here are some healthy options from UberEats:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => (
          <Card key={`${rec.restaurant.id}-${rec.menuItem.id}`} className="overflow-hidden">
            <div className="relative h-48 w-full">
              {rec.menuItem.imageUrl ? (
                <div className="relative h-full w-full">
                  <Image 
                    src={rec.menuItem.imageUrl} 
                    alt={rec.menuItem.name} 
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No image available</span>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                  Health Score: {rec.healthScore}/10
                </span>
              </div>
            </div>
            <CardHeader>
              <CardTitle>{rec.menuItem.name}</CardTitle>
              <CardDescription>{rec.restaurant.name} • {rec.restaurant.deliveryTime}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {rec.menuItem.description}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {rec.menuItem.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-foreground">
                    {tag}
                  </span>
                ))}
              </div>
              <hr className="my-4 border-t border-gray-200" />
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Price</p>
                  <p className="text-lg font-bold">{rec.menuItem.price}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Calories</p>
                  <p className="text-lg font-bold">{rec.menuItem.calories}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <a href={rec.orderLink} target="_blank" rel="noopener noreferrer">
                  Order Now
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

interface UberEatsAccountLinkProps {
  onLinkAccount: (userId: string) => void;
  isLinked: boolean;
}

export function UberEatsAccountLink({ onLinkAccount, isLinked }: UberEatsAccountLinkProps) {
  const [userId, setUserId] = React.useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userId) {
      onLinkAccount(userId);
    }
  };

  if (isLinked) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>UberEats Account</CardTitle>
          <CardDescription>
            Your UberEats account is successfully linked. We'll use your order history to provide personalized recommendations.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Manage Account
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Link Your UberEats Account</CardTitle>
        <CardDescription>
          Connect your UberEats account to get personalized healthy food recommendations based on your order history.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="userId" className="text-sm font-medium">
              UberEats User ID
            </label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your UberEats User ID"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Link Account
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don't have an UberEats account?{' '}
          <a 
            href="https://www.ubereats.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Sign up here
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}

interface HealthScoreProps {
  score: number;
  history: { date: string; score: number }[];
}

export function HealthScore({ score, history }: HealthScoreProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Health Score</CardTitle>
        <CardDescription>
          Based on your food choices and recommendations followed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="relative h-32 w-32 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={score > 70 ? "#10b981" : score > 40 ? "#f59e0b" : "#ef4444"}
                strokeWidth="10"
                strokeDasharray={`${(score / 100) * 283} 283`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold">{score}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {score > 70
              ? "Great job! You're making healthy choices."
              : score > 40
              ? "You&apos;re on the right track. Keep it up!"
              : "There&apos;s room for improvement in your food choices."}
          </p>
        </div>
        
        {history.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Recent History</h4>
            <div className="space-y-2">
              {history.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{item.date}</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">{item.score}</span>
                    <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.score > 70 ? "bg-green-500" : item.score > 40 ? "bg-amber-500" : "bg-red-500"}`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
