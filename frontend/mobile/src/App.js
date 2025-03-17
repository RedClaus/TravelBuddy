import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import components
import AppNavigator from './navigation/AppNavigator';
import SplashScreen from './screens/SplashScreen';

// Import context providers
import { AuthProvider } from './context/AuthContext';

// Import theme
import theme from './theme/theme';

// Import store
import store from './redux/store';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const bootstrapAsync = async () => {
      let token;
      try {
        token = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.log('Failed to get token from storage', e);
      }
      setUserToken(token);
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <AuthProvider>
            <AppNavigator userToken={userToken} />
          </AuthProvider>
        </SafeAreaProvider>
      </PaperProvider>
    </ReduxProvider>
  );
};

export default App;
