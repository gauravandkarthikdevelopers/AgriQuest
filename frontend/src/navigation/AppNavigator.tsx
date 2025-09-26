import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, FONT_SIZES } from '../constants';
import { TabParamList, RootStackParamList } from '../types';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import ScanCropScreen from '../screens/ScanCropScreen';
import CropResultScreen from '../screens/CropResultScreen';
import ChallengesScreen from '../screens/ChallengesScreen';
import ChallengeDetailScreen from '../screens/ChallengeDetailScreen';
import MissionsScreen from '../screens/MissionsScreen';
import MissionPlayerScreen from '../screens/MissionPlayerScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import ProgressScreen from '../screens/ProgressScreen';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'HomeTab':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'ChallengesTab':
              iconName = focused ? 'trophy' : 'trophy-outline';
              break;
            case 'ScanTab':
              iconName = focused ? 'camera' : 'camera-outline';
              break;
            case 'LeaderboardTab':
              iconName = focused ? 'podium' : 'podium-outline';
              break;
            case 'ProgressTab':
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.lightGray,
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: FONT_SIZES.xs,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="ChallengesTab"
        component={ChallengesScreen}
        options={{ tabBarLabel: 'Challenges' }}
      />
      <Tab.Screen
        name="ScanTab"
        component={ScanCropScreen}
        options={{ tabBarLabel: 'Scan' }}
      />
      <Tab.Screen
        name="LeaderboardTab"
        component={LeaderboardScreen}
        options={{ tabBarLabel: 'Leaderboard' }}
      />
      <Tab.Screen
        name="ProgressTab"
        component={ProgressScreen}
        options={{ tabBarLabel: 'Progress' }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.white,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: FONT_SIZES.xl,
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ScanCrop"
          component={ScanCropScreen}
          options={{
            title: 'Scan Crop',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="CropResult"
          component={CropResultScreen}
          options={{
            title: 'Analysis Result',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="ChallengeDetail"
          component={ChallengeDetailScreen}
          options={{
            title: 'Challenge Details',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="Missions"
          component={MissionsScreen}
          options={{
            title: 'Knowledge Missions',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="MissionPlayer"
          component={MissionPlayerScreen}
          options={{
            title: 'Mission',
            headerBackTitleVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
