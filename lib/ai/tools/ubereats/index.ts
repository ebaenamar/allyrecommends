import { DataStream } from 'ai';
import { Session } from 'next-auth';
import { ubereatsClient } from '@/lib/api/ubereats';

export const getUberEatsRecommendations = ({
  session,
  dataStream,
}: {
  session: Session | null;
  dataStream: DataStream;
}) => {
  return async function getUberEatsRecommendations({
    latitude,
    longitude,
    dietaryPreferences,
    healthGoals,
  }: {
    latitude: number;
    longitude: number;
    dietaryPreferences: string[];
    healthGoals: string[];
  }) {
    try {
      if (!session?.user) {
        throw new Error('User not authenticated');
      }

      // Get nearby restaurants
      const restaurants = await ubereatsClient.getNearbyRestaurants(latitude, longitude);
      
      // Filter restaurants based on user preferences
      const filteredRestaurants = restaurants.filter(restaurant => {
        // In a real implementation, we would have more sophisticated filtering logic
        // based on restaurant categories, ratings, etc.
        return true;
      });

      // Get menu items for each restaurant
      const restaurantMenuPromises = filteredRestaurants.slice(0, 3).map(async (restaurant) => {
        const menuItems = await ubereatsClient.getRestaurantMenu(restaurant.id);
        return {
          restaurant,
          menuItems,
        };
      });

      const restaurantMenus = await Promise.all(restaurantMenuPromises);

      // Calculate health scores for all menu items
      const recommendationsWithScores = restaurantMenus.flatMap(({ restaurant, menuItems }) => {
        return menuItems.map(item => ({
          restaurant,
          menuItem: item,
          healthScore: ubereatsClient.calculateHealthScore(item),
          orderLink: ubereatsClient.generateOrderingLink(restaurant.id, item.id),
        }));
      });

      // Filter and sort recommendations based on health score and dietary preferences
      const filteredRecommendations = recommendationsWithScores
        .filter(rec => {
          // Filter based on dietary preferences
          // For example, if user is vegetarian, filter out non-vegetarian items
          if (dietaryPreferences.includes('vegetarian') && 
              !rec.menuItem.tags.includes('vegetarian')) {
            return false;
          }

          // Filter based on health goals
          // For example, if user wants to reduce carbs, prioritize low-carb options
          if (healthGoals.includes('low-carb') && 
              rec.menuItem.nutritionalInfo.carbs > 50) {
            return false;
          }

          return true;
        })
        .sort((a, b) => b.healthScore - a.healthScore)
        .slice(0, 5); // Get top 5 recommendations

      return {
        recommendations: filteredRecommendations,
      };
    } catch (error) {
      console.error('Error getting UberEats recommendations:', error);
      return {
        error: 'Failed to get recommendations from UberEats',
      };
    }
  };
};

export const linkUberEatsAccount = ({
  session,
  dataStream,
}: {
  session: Session | null;
  dataStream: DataStream;
}) => {
  return async function linkUberEatsAccount({
    uberEatsUserId,
  }: {
    uberEatsUserId: string;
  }) {
    try {
      if (!session?.user) {
        throw new Error('User not authenticated');
      }

      // In a real implementation, we would store the UberEats user ID in our database
      // and associate it with the current user
      
      // For now, we'll just return a success message
      return {
        success: true,
        message: 'UberEats account linked successfully',
      };
    } catch (error) {
      console.error('Error linking UberEats account:', error);
      return {
        success: false,
        error: 'Failed to link UberEats account',
      };
    }
  };
};

export const getHealthierAlternatives = ({
  session,
  dataStream,
}: {
  session: Session | null;
  dataStream: DataStream;
}) => {
  return async function getHealthierAlternatives({
    restaurantId,
    menuItemId,
  }: {
    restaurantId: string;
    menuItemId: string;
  }) {
    try {
      if (!session?.user) {
        throw new Error('User not authenticated');
      }

      const alternatives = await ubereatsClient.findHealthierAlternatives(restaurantId, menuItemId);
      
      return {
        alternatives,
      };
    } catch (error) {
      console.error('Error getting healthier alternatives:', error);
      return {
        error: 'Failed to find healthier alternatives',
      };
    }
  };
};
