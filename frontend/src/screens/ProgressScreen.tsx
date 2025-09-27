import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { 
  COLORS, 
  SPACING, 
  FONT_SIZES, 
  BORDER_RADIUS, 
  SHADOWS, 
  BADGE_CONFIGS,
  SCREEN_WIDTH
} from '../constants';
import { NavigationProps, FarmerProgress, Farmer, CropScan, ChallengeCompletion } from '../types';
import { apiService } from '../services/api';

interface ProgressScreenProps extends NavigationProps {}

const { width } = Dimensions.get('window');

const ProgressScreen: React.FC<ProgressScreenProps> = ({ navigation }) => {
  const [progress, setProgress] = useState<FarmerProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    loadProgress();
    startAnimation();
  }, []);

  const startAnimation = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const loadProgress = async () => {
    try {
      // For demo purposes, create mock progress data
      const mockProgress: FarmerProgress = {
        farmer: {
          _id: 'demo',
          name: 'Eco Warrior',
          village: 'Green Valley',
          region: 'Maharashtra',
          xp: 1450,
          ecoScore: 88,
          badges: ['eco-warrior', 'water-saver', 'soil-protector', 'first-scan'],
          level: 7,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        metrics: {
          currentLevel: 7,
          xpForNextLevel: 1600,
          progressToNextLevel: 0.75,
          totalScans: 23,
          totalCompletions: 12,
          avgEcoScore: 88,
          waterUsageEfficiency: 92,
          soilHealthScore: 85,
        },
        recentActivity: {
          scans: [],
          completions: [],
        },
        achievements: {
          badges: ['eco-warrior', 'water-saver', 'soil-protector', 'first-scan'],
          badgeDescriptions: {
            'eco-warrior': 'Reached level 5 in sustainable practices',
            'water-saver': 'Demonstrated excellent water conservation',
            'soil-protector': 'Maintained healthy soil practices',
            'first-scan': 'Completed first crop analysis',
          },
        },
      };
      
      setProgress(mockProgress);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProgress();
    setRefreshing(false);
  };

  const renderProgressBar = (progress: number, color: string = COLORS.primary) => (
    <View style={styles.progressBarContainer}>
      <Animated.View
        style={[
          styles.progressBarFill,
          {
            backgroundColor: color,
            width: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', `${progress * 100}%`],
            }),
          },
        ]}
      />
    </View>
  );

  const renderCircularProgress = (progress: number, size: number = 80, strokeWidth: number = 6) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - progress * circumference;

    return (
      <View style={[styles.circularProgress, { width: size, height: size }]}>
        <Text style={styles.circularProgressText}>
          {Math.round(progress * 100)}%
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your progress...</Text>
      </View>
    );
  }

  if (!progress) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
        <Text style={styles.errorText}>Unable to load progress</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadProgress}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Progress</Text>
        <Text style={styles.headerSubtitle}>Track your farming journey</Text>
      </View>

      {/* Level Progress Card */}
      <View style={styles.levelCard}>
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.levelGradient}
        >
          <View style={styles.levelContent}>
            <View style={styles.levelInfo}>
              <Text style={styles.levelTitle}>Level {progress.metrics.currentLevel}</Text>
              <Text style={styles.levelSubtitle}>
                {progress.metrics.xpForNextLevel - progress.farmer.xp} XP to next level
              </Text>
              <View style={styles.xpContainer}>
                <Text style={styles.xpText}>{progress.farmer.xp} XP</Text>
                <Text style={styles.xpNextText}>/ {progress.metrics.xpForNextLevel} XP</Text>
              </View>
            </View>
            <View style={styles.levelProgressContainer}>
              {renderCircularProgress(progress.metrics.progressToNextLevel)}
            </View>
          </View>
          <View style={styles.levelProgressBar}>
            {renderProgressBar(progress.metrics.progressToNextLevel, COLORS.white)}
          </View>
        </LinearGradient>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="leaf-outline" size={24} color={COLORS.ecoGreen} />
          </View>
          <Text style={styles.statValue}>{progress.farmer.ecoScore}</Text>
          <Text style={styles.statLabel}>Eco Score</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="camera-outline" size={24} color={COLORS.info} />
          </View>
          <Text style={styles.statValue}>{progress.metrics.totalScans}</Text>
          <Text style={styles.statLabel}>Scans</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="trophy-outline" size={24} color={COLORS.gold} />
          </View>
          <Text style={styles.statValue}>{progress.metrics.totalCompletions}</Text>
          <Text style={styles.statLabel}>Challenges</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="ribbon-outline" size={24} color={COLORS.secondary} />
          </View>
          <Text style={styles.statValue}>{progress.achievements.badges.length}</Text>
          <Text style={styles.statLabel}>Badges</Text>
        </View>
      </View>

      {/* Detailed Metrics */}
      <View style={styles.metricsCard}>
        <Text style={styles.cardTitle}>Performance Metrics</Text>
        
        <View style={styles.metricItem}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricLabel}>Average Eco Score</Text>
            <Text style={styles.metricValue}>{progress.metrics.avgEcoScore}%</Text>
          </View>
          {renderProgressBar(progress.metrics.avgEcoScore / 100, COLORS.ecoGreen)}
        </View>

        <View style={styles.metricItem}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricLabel}>Water Usage Efficiency</Text>
            <Text style={styles.metricValue}>{progress.metrics.waterUsageEfficiency}%</Text>
          </View>
          {renderProgressBar(progress.metrics.waterUsageEfficiency / 100, COLORS.waterBlue)}
        </View>

        <View style={styles.metricItem}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricLabel}>Soil Health Score</Text>
            <Text style={styles.metricValue}>{progress.metrics.soilHealthScore}%</Text>
          </View>
          {renderProgressBar(progress.metrics.soilHealthScore / 100, COLORS.soilBrown)}
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.achievementsCard}>
        <Text style={styles.cardTitle}>Achievements</Text>
        <View style={styles.badgesContainer}>
          {progress.achievements.badges.map((badge, index) => {
            const badgeConfig = BADGE_CONFIGS[badge as keyof typeof BADGE_CONFIGS];
            if (!badgeConfig) return null;

            return (
              <Animated.View
                key={badge}
                style={[
                  styles.badgeItem,
                  {
                    opacity: animatedValue,
                    transform: [{
                      translateY: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    }],
                  },
                ]}
              >
                <View style={[styles.badgeIcon, { backgroundColor: badgeConfig.color }]}>
                  <Text style={styles.badgeEmoji}>{badgeConfig.icon}</Text>
                </View>
                <Text style={styles.badgeName}>{badgeConfig.name}</Text>
                <Text style={styles.badgeDescription}>{badgeConfig.description}</Text>
              </Animated.View>
            );
          })}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsCard}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('ScanTab')}
          >
            <Ionicons name="scan-outline" size={20} color={COLORS.primary} />
            <Text style={styles.actionButtonText}>Scan Crop</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('ChallengesTab')}
          >
            <Ionicons name="trophy-outline" size={20} color={COLORS.gold} />
            <Text style={styles.actionButtonText}>New Challenge</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('LeaderboardTab')}
          >
            <Ionicons name="podium-outline" size={20} color={COLORS.secondary} />
            <Text style={styles.actionButtonText}>Leaderboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingBottom: SPACING.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  errorText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
    marginVertical: SPACING.md,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  header: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  headerTitle: {
    fontSize: FONT_SIZES.header,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  levelCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  levelGradient: {
    padding: SPACING.lg,
  },
  levelContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  levelSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: SPACING.sm,
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  xpText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.white,
  },
  xpNextText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    opacity: 0.8,
    marginLeft: SPACING.xs,
  },
  levelProgressContainer: {
    marginLeft: SPACING.md,
  },
  circularProgress: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
  },
  circularProgressText: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  levelProgressBar: {
    marginTop: SPACING.md,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  statIconContainer: {
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  metricsCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.light,
  },
  cardTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  metricItem: {
    marginBottom: SPACING.md,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  metricLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  metricValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  achievementsCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.light,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeItem: {
    width: '48%',
    alignItems: 'center',
    padding: SPACING.md,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
  },
  badgeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  badgeEmoji: {
    fontSize: 24,
  },
  badgeName: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  badgeDescription: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
  },
  actionsCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.light,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
  },
  actionButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
});

export default ProgressScreen;
