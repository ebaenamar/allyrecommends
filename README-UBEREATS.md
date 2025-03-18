# AllyRecommends UberEats Integration

## Overview

This integration connects the AllyRecommends dietary chatbot with the UberEats API, allowing users to receive personalized food recommendations based on their dietary preferences and health goals, with direct ordering links for convenience.

## Features

- **Restaurant Recommendations**: Get healthy food options from nearby restaurants based on location and preferences
- **Healthier Alternatives**: Find healthier alternatives to specific menu items
- **Health Scoring**: Track and display a user's health score based on their food choices
- **UberEats Account Linking**: Link a user's UberEats account for personalized recommendations

## Implementation Details

### API Client

The UberEats API client (`lib/api/ubereats.ts`) provides methods for:
- Authenticating with the UberEats API
- Getting nearby restaurants
- Retrieving restaurant menus
- Calculating health scores for menu items
- Finding healthier alternatives
- Generating ordering links

### AI Tools

The integration includes AI tools (`lib/ai/tools/ubereats/index.ts`) that allow the chatbot to:
- Get UberEats recommendations based on user preferences
- Link UberEats accounts
- Find healthier alternatives to specific menu items

### UI Components

The UI components (`components/ubereats/`) provide:
- Display of food recommendations with health scores
- Health score tracking and visualization
- UberEats account linking interface

## Setup

1. Register as a developer on the [Uber Developer Portal](https://developer.uber.com/)
2. Create a new application and request access to the UberEats API
3. Add your UberEats API credentials to the `.env` file:
   ```
   UBEREATS_CLIENT_ID=your_client_id
   UBEREATS_CLIENT_SECRET=your_client_secret
   UBEREATS_API_BASE_URL=https://api.uber.com/v1/eats
   ```

## Usage

The chatbot will automatically use the UberEats integration when users ask for food recommendations. It will:

1. Ask for the user's location to find nearby restaurants
2. Inquire about dietary preferences and health goals
3. Provide personalized recommendations with health scores
4. Include direct ordering links to UberEats

## Health Score System

The health score system evaluates menu items based on:
- Calorie content
- Protein amount
- Fiber content
- Fat and carbohydrate levels

Users receive an overall health score (1-100) based on their food choices, encouraging healthier eating habits.
