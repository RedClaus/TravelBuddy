import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import navigators
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';

// Import screens
import ItineraryDetailScreen from '../screens/itinerary/ItineraryDetailScreen';
import ItineraryCreateScreen from '../screens/itinerary/ItineraryCreateScreen';

const Stack = createStackNavigator();

const AppNavigator = ({ userToken }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken == null ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen 
              name="ItineraryDetail" 
              component={ItineraryDetailScreen} 
              options={{ headerShown: true, title: 'Itinerary Details' }}
            />
            <Stack.Screen 
              name="ItineraryCreate" 
              component={ItineraryCreateScreen} 
              options={{ headerShown: true, title: 'Create Itinerary' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
