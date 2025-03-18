export interface UberEatsRestaurant {
  id: string;
  name: string;
  rating: number;
  deliveryTime: string;
  imageUrl: string;
  categories: string[];
}

export interface UberEatsMenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  calories: number;
  nutritionalInfo: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  tags: string[];
  healthScore: number; // 1-10 scale, 10 being the healthiest
}

export interface UberEatsUserProfile {
  id: string;
  name: string;
  email: string;
  dietaryPreferences: string[];
  allergies: string[];
  favoriteRestaurants: string[];
  orderHistory: UberEatsOrder[];
  healthScore: number; // 1-100 scale, tracking overall health choices
}

export interface UberEatsOrder {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: UberEatsMenuItem[];
  orderDate: string;
  totalAmount: string;
  healthScore: number; // 1-10 scale for this specific order
}

export interface HealthyAlternative {
  originalItem: UberEatsMenuItem;
  alternativeItem: UberEatsMenuItem;
  healthImprovementReason: string;
  healthScoreImprovement: number;
}
