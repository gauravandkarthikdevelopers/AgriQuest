import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/constants';

export default function App() {
  useEffect(() => {
    // Initialize app
    console.log('🌱 AgriQuest App Started - Play. Learn. Grow.');
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      <AppNavigator />
      <Toast />
    </SafeAreaProvider>
  );
}
