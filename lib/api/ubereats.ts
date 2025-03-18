import axios from 'axios';
import { UberEatsMenuItem, UberEatsRestaurant, UberEatsUserProfile } from '../ai/tools/ubereats/types';

// UberEats API base URL
const UBEREATS_API_BASE_URL = process.env.UBEREATS_API_BASE_URL || 'https://api.uber.com/v1/eats';

// UberEats API client
export class UberEatsClient {
  private accessToken: string;
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.clientId = process.env.UBEREATS_CLIENT_ID || '';
    this.clientSecret = process.env.UBEREATS_CLIENT_SECRET || '';
    this.accessToken = '';
  }

  // Authenticate with UberEats API using OAuth 2.0
  async authenticate() {
    try {
      const response = await axios.post('https://login.uber.com/oauth/v2/token', {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials',
        scope: 'eats.store eats.order eats.menu',
      });

      this.accessToken = response.data.access_token;
      return this.accessToken;
    } catch (error) {
      console.error('Failed to authenticate with UberEats API:', error);
      throw new Error('UberEats authentication failed');
    }
  }

  // Get headers for API requests
  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  // Get nearby restaurants based on location
  async getNearbyRestaurants(latitude: number, longitude: number, radius: number = 3000) {
    try {
      if (!this.accessToken) {
        await this.authenticate();
      }

      const response = await axios.get(`${UBEREATS_API_BASE_URL}/restaurants`, {
        headers: this.getHeaders(),
        params: {
          latitude,
          longitude,
          radius,
        },
      });

      return response.data.restaurants as UberEatsRestaurant[];
    } catch (error) {
      console.error('Failed to get nearby restaurants:', error);
      throw new Error('Failed to get nearby restaurants');
    }
  }

  // Get restaurant menu
  async getRestaurantMenu(restaurantId: string) {
    try {
      if (!this.accessToken) {
        await this.authenticate();
      }

      const response = await axios.get(`${UBEREATS_API_BASE_URL}/restaurants/${restaurantId}/menu`, {
        headers: this.getHeaders(),
      });

      return response.data.menu_items as UberEatsMenuItem[];
    } catch (error) {
      console.error(`Failed to get menu for restaurant ${restaurantId}:`, error);
      throw new Error('Failed to get restaurant menu');
    }
  }

  // Get user profile and order history
  async getUserProfile(userId: string) {
    try {
      if (!this.accessToken) {
        await this.authenticate();
      }

      const response = await axios.get(`${UBEREATS_API_BASE_URL}/users/${userId}`, {
        headers: this.getHeaders(),
      });

      return response.data as UberEatsUserProfile;
    } catch (error) {
      console.error(`Failed to get user profile for ${userId}:`, error);
      throw new Error('Failed to get user profile');
    }
  }

  // Generate UberEats ordering link for a specific menu item
  generateOrderingLink(restaurantId: string, menuItemId: string) {
    return `https://www.ubereats.com/store/${restaurantId}/item/${menuItemId}`;
  }

  // Calculate health score for a menu item based on nutritional info
  calculateHealthScore(menuItem: UberEatsMenuItem) {
    // This would be a more sophisticated algorithm in a real implementation
    // For now, we'll use a simple calculation based on calories and nutritional balance
    const { calories, nutritionalInfo } = menuItem;
    
    // Lower calories are better (up to a point)
    const calorieScore = calories < 300 ? 10 : calories < 500 ? 8 : calories < 700 ? 6 : calories < 900 ? 4 : 2;
    
    // Higher protein and fiber are better
    const proteinScore = nutritionalInfo.protein > 20 ? 10 : nutritionalInfo.protein > 15 ? 8 : nutritionalInfo.protein > 10 ? 6 : 4;
    const fiberScore = nutritionalInfo.fiber > 5 ? 10 : nutritionalInfo.fiber > 3 ? 8 : nutritionalInfo.fiber > 1 ? 6 : 4;
    
    // Lower fat and balanced carbs are better
    const fatScore = nutritionalInfo.fat < 10 ? 10 : nutritionalInfo.fat < 15 ? 8 : nutritionalInfo.fat < 20 ? 6 : 4;
    const carbScore = nutritionalInfo.carbs < 30 ? 10 : nutritionalInfo.carbs < 50 ? 8 : nutritionalInfo.carbs < 70 ? 6 : 4;
    
    // Calculate overall health score (1-10 scale)
    const overallScore = Math.round((calorieScore + proteinScore + fiberScore + fatScore + carbScore) / 5);
    
    return overallScore;
  }

  // Find healthier alternatives to a menu item
  async findHealthierAlternatives(restaurantId: string, menuItemId: string) {
    try {
      // Get the original menu item
      const menuItems = await this.getRestaurantMenu(restaurantId);
      const originalItem = menuItems.find(item => item.id === menuItemId);
      
      if (!originalItem) {
        throw new Error('Original menu item not found');
      }
      
      // Calculate health scores for all menu items
      const itemsWithScores = menuItems.map(item => ({
        ...item,
        healthScore: this.calculateHealthScore(item)
      }));
      
      // Find items with better health scores
      const healthierAlternatives = itemsWithScores
        .filter(item => item.id !== menuItemId && item.healthScore > originalItem.healthScore)
        .sort((a, b) => b.healthScore - a.healthScore)
        .slice(0, 3); // Get top 3 healthier alternatives
      
      return healthierAlternatives.map(alternative => ({
        originalItem,
        alternativeItem: alternative,
        healthImprovementReason: this.generateHealthImprovementReason(originalItem, alternative),
        healthScoreImprovement: alternative.healthScore - originalItem.healthScore,
        orderLink: this.generateOrderingLink(restaurantId, alternative.id)
      }));
    } catch (error) {
      console.error('Failed to find healthier alternatives:', error);
      throw new Error('Failed to find healthier alternatives');
    }
  }

  // Generate a reason for why an alternative is healthier
  private generateHealthImprovementReason(originalItem: UberEatsMenuItem, alternativeItem: UberEatsMenuItem) {
    const reasons = [];
    
    if (alternativeItem.calories < originalItem.calories) {
      reasons.push(`${alternativeItem.calories - originalItem.calories} fewer calories`);
    }
    
    if (alternativeItem.nutritionalInfo.protein > originalItem.nutritionalInfo.protein) {
      reasons.push(`${alternativeItem.nutritionalInfo.protein - originalItem.nutritionalInfo.protein}g more protein`);
    }
    
    if (alternativeItem.nutritionalInfo.fiber > originalItem.nutritionalInfo.fiber) {
      reasons.push(`${alternativeItem.nutritionalInfo.fiber - originalItem.nutritionalInfo.fiber}g more fiber`);
    }
    
    if (alternativeItem.nutritionalInfo.fat < originalItem.nutritionalInfo.fat) {
      reasons.push(`${originalItem.nutritionalInfo.fat - alternativeItem.nutritionalInfo.fat}g less fat`);
    }
    
    if (reasons.length === 0) {
      return 'Better overall nutritional profile';
    }
    
    return `This alternative offers: ${reasons.join(', ')}`;
  }
}

// Create a singleton instance
export const ubereatsClient = new UberEatsClient();
