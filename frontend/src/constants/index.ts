import { Dimensions } from 'react-native';

// Screen dimensions
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// API Configuration
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api/v1' 
  : 'https://your-production-api.com/api/v1';

// Colors - AgriQuest Theme (Based on your designs)
export const COLORS = {
  // Primary colors (from your green theme)
  primary: '#4CAF50', // Main green
  primaryLight: '#66BB6A', // Light green
  primaryDark: '#388E3C', // Dark green
  
  // Secondary colors (blue gradients from designs)
  secondary: '#2196F3', // Blue
  secondaryLight: '#64B5F6', // Light blue
  secondaryDark: '#1976D2', // Dark blue
  
  // Accent colors
  accent: '#FF9800', // Orange for difficulty
  accentLight: '#FFB74D', // Light orange
  gold: '#FFC107', // Gold for rewards/XP
  
  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray: '#9E9E9E',
  lightGray: '#F5F5F5',
  darkGray: '#424242',
  
  // Background colors (clean white theme from designs)
  background: '#FFFFFF',
  surface: '#FFFFFF',
  cardBackground: '#F8F9FA',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Text colors (from your designs)
  textPrimary: '#1A1A1A',
  textSecondary: '#666666',
  textLight: '#FFFFFF',
  textMuted: '#999999',
  
  // Gradient colors (from your scan crop design)
  gradientStart: '#4CAF50',
  gradientEnd: '#2196F3',
  
  // Eco-specific colors
  ecoGreen: '#4CAF50',
  soilBrown: '#8D6E63',
  waterBlue: '#2196F3',
  sunYellow: '#FFC107',
};

// Typography
export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
};

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  title: 28,
  header: 32,
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  round: 50,
};

// Shadows
export const SHADOWS = {
  light: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  heavy: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Animation durations
export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
};

// Badge configurations
export const BADGE_CONFIGS = {
  'eco-newcomer': {
    name: 'Eco Newcomer',
    description: 'Welcome to sustainable farming!',
    icon: '🌱',
    color: COLORS.ecoGreen,
  },
  'first-scan': {
    name: 'First Scan',
    description: 'Completed first crop analysis',
    icon: '📸',
    color: COLORS.info,
  },
  'eco-warrior': {
    name: 'Eco Warrior',
    description: 'Reached level 5 in sustainable practices',
    icon: '⚔️',
    color: COLORS.primary,
  },
  'sustainability-champion': {
    name: 'Sustainability Champion',
    description: 'Reached level 10 with excellent eco-score',
    icon: '🏆',
    color: COLORS.gold,
  },
  'green-master': {
    name: 'Green Master',
    description: 'Achieved mastery in sustainable farming',
    icon: '👑',
    color: COLORS.gold,
  },
  'water-saver': {
    name: 'Water Saver',
    description: 'Demonstrated excellent water conservation',
    icon: '💧',
    color: COLORS.waterBlue,
  },
  'soil-protector': {
    name: 'Soil Protector',
    description: 'Maintained healthy soil practices',
    icon: '🌍',
    color: COLORS.soilBrown,
  },
  'wise-farmer': {
    name: 'Wise Farmer',
    description: 'Made consistently smart farming choices',
    icon: '🧠',
    color: COLORS.secondary,
  },
  'eco-champion': {
    name: 'Eco Champion',
    description: 'Excellent performance in missions',
    icon: '🌟',
    color: COLORS.gold,
  },
};

// Difficulty colors
export const DIFFICULTY_COLORS = {
  easy: COLORS.success,
  medium: COLORS.warning,
  hard: COLORS.error,
};

// Mission outcome colors
export const OUTCOME_COLORS = {
  excellent: COLORS.success,
  good: COLORS.info,
  okay: COLORS.warning,
  poor: COLORS.error,
};

// Default images/placeholders
export const PLACEHOLDER_IMAGES = {
  crop: 'https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Crop+Image',
  challenge: 'https://via.placeholder.com/300x200/2E7D32/FFFFFF?text=Challenge',
  farmer: 'https://via.placeholder.com/100x100/1976D2/FFFFFF?text=Farmer',
};

// Storage keys
export const STORAGE_KEYS = {
  DEMO_FARMER: 'demo_farmer',
  OFFLINE_DATA: 'offline_data',
  SETTINGS: 'app_settings',
  COMPLETED_MISSIONS: 'completed_missions',
  CACHED_CHALLENGES: 'cached_challenges',
};

// API endpoints
export const ENDPOINTS = {
  FARMERS: {
    DEMO: '/farmers/demo',
    BY_ID: (id: string) => `/farmers/${id}`,
    PROGRESS: (id: string) => `/farmers/${id}/progress`,
    LEADERBOARD: '/farmers/leaderboard',
    REGIONS: '/farmers/regions',
  },
  CHALLENGES: {
    LIST: '/challenges',
    BY_ID: (id: string) => `/challenges/${id}`,
    COMPLETE: (id: string) => `/challenges/${id}/complete`,
    FARMER_COMPLETIONS: (farmerId: string) => `/challenges/farmer/${farmerId}/completions`,
  },
  MISSIONS: {
    LIST: '/missions',
    BY_ID: (id: string) => `/missions/${id}`,
    COMPLETE: (id: string) => `/missions/${id}/complete`,
    STATS: '/missions/stats',
  },
  CROP_SCAN: {
    ANALYZE: '/crop-scan',
    LIST: '/crop-scan',
    BY_ID: (id: string) => `/crop-scan/${id}`,
  },
  HEALTH: '/health',
};
