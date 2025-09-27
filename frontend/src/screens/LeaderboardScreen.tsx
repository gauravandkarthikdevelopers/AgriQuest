import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Animated,
  FlatList,
  Modal,
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
} from '../constants';
import { NavigationProps, LeaderboardEntry, Farmer } from '../types';
import { apiService } from '../services/api';

interface LeaderboardScreenProps extends NavigationProps {}

type FilterType = 'global' | 'region' | 'village';
type SortType = 'xp' | 'ecoScore' | 'level';

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ navigation }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentFarmer, setCurrentFarmer] = useState<Farmer | null>(null);
  const [filter, setFilter] = useState<FilterType>('global');
  const [sortBy, setSortBy] = useState<SortType>('xp');
  const [showFilters, setShowFilters] = useState(false);
  const [animatedValues] = useState(
    Array.from({ length: 10 }, () => new Animated.Value(0))
  );

  useEffect(() => {
    loadLeaderboard();
    loadCurrentFarmer();
  }, [filter, sortBy]);

  useEffect(() => {
    if (leaderboard.length > 0) {
      startAnimations();
    }
  }, [leaderboard]);

  const startAnimations = () => {
    const animations = animatedValues.map((value, index) =>
      Animated.timing(value, {
        toValue: 1,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      })
    );
    Animated.stagger(100, animations).start();
  };

  const loadCurrentFarmer = async () => {
    try {
      const farmer = await apiService.getDemoFarmer();
      setCurrentFarmer(farmer);
    } catch (error) {
      console.error('Error loading current farmer:', error);
      // Create demo farmer
      setCurrentFarmer({
        _id: 'demo',
        name: 'Eco Warrior',
        village: 'Green Valley',
        region: 'Maharashtra',
        xp: 1450,
        ecoScore: 88,
        badges: ['eco-warrior', 'water-saver'],
        level: 7,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const loadLeaderboard = async () => {
    try {
      // Create mock leaderboard data
      const mockLeaderboard: LeaderboardEntry[] = [
        {
          farmer: {
            _id: '1',
            name: 'Green Guru',
            village: 'Eco Village',
            region: 'Maharashtra',
            xp: 2800,
            ecoScore: 95,
            badges: ['eco-champion', 'sustainability-champion', 'green-master'],
            level: 12,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          rank: 1,
          xp: 2800,
          ecoScore: 95,
          badges: ['eco-champion', 'sustainability-champion', 'green-master'],
        },
        {
          farmer: {
            _id: '2',
            name: 'Sustainable Sam',
            village: 'Green Valley',
            region: 'Punjab',
            xp: 2650,
            ecoScore: 92,
            badges: ['eco-warrior', 'water-saver', 'soil-protector'],
            level: 11,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          rank: 2,
          xp: 2650,
          ecoScore: 92,
          badges: ['eco-warrior', 'water-saver', 'soil-protector'],
        },
        {
          farmer: {
            _id: '3',
            name: 'Nature Ninja',
            village: 'Organic Oasis',
            region: 'Karnataka',
            xp: 2400,
            ecoScore: 90,
            badges: ['eco-warrior', 'wise-farmer'],
            level: 10,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          rank: 3,
          xp: 2400,
          ecoScore: 90,
          badges: ['eco-warrior', 'wise-farmer'],
        },
        {
          farmer: currentFarmer || {
            _id: 'demo',
            name: 'Eco Warrior',
            village: 'Green Valley',
            region: 'Maharashtra',
            xp: 1450,
            ecoScore: 88,
            badges: ['eco-warrior', 'water-saver'],
            level: 7,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          rank: 6,
          xp: 1450,
          ecoScore: 88,
          badges: ['eco-warrior', 'water-saver'],
        },
      ];

      setLeaderboard(mockLeaderboard);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLeaderboard();
    setRefreshing(false);
  };

  const getCurrentFarmerRank = () => {
    const entry = leaderboard.find(entry => entry.farmer._id === currentFarmer?._id);
    return entry?.rank || null;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading leaderboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Leaderboard</Text>
          <Text style={styles.headerSubtitle}>See how you rank among farmers</Text>
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="options-outline" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Your Rank */}
      {getCurrentFarmerRank() && (
        <View style={styles.yourRankCard}>
          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.yourRankGradient}
          >
            <Text style={styles.yourRankTitle}>Your Rank</Text>
            <View style={styles.yourRankContent}>
              <View style={styles.yourRankNumber}>
                <Text style={styles.yourRankText}>#{getCurrentFarmerRank()}</Text>
              </View>
              <View style={styles.yourRankStats}>
                <Text style={styles.yourRankName}>{currentFarmer?.name}</Text>
                <Text style={styles.yourRankXP}>{currentFarmer?.xp} XP</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      )}

      <ScrollView
        style={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Podium */}
        <View style={styles.podiumContainer}>
          <Text style={styles.podiumTitle}>Top Farmers 🏆</Text>
          <View style={styles.podium}>
            {leaderboard.slice(0, 3).map((entry, index) => (
              <Animated.View 
                key={entry.farmer._id}
                style={[
                  styles.podiumItem,
                  index === 0 && styles.firstPlace,
                  index === 1 && styles.secondPlace,
                  index === 2 && styles.thirdPlace,
                  {
                    opacity: animatedValues[index] || 1,
                    transform: [{
                      translateY: (animatedValues[index] || new Animated.Value(1)).interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    }],
                  },
                ]}
              >
                {index === 0 && (
                  <LinearGradient
                    colors={[COLORS.gold, '#FFD700']}
                    style={styles.crownContainer}
                  >
                    <Ionicons name="trophy" size={20} color={COLORS.white} />
                  </LinearGradient>
                )}
                <View style={styles.podiumRank}>
                  <Text style={styles.podiumRankText}>{entry.rank}</Text>
                </View>
                <Text style={styles.podiumName} numberOfLines={1}>
                  {entry.farmer.name}
                </Text>
                <Text style={styles.podiumScore}>{entry.xp} XP</Text>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Full Leaderboard */}
        <View style={styles.fullLeaderboard}>
          <Text style={styles.fullLeaderboardTitle}>All Rankings</Text>
          {leaderboard.map((entry, index) => {
            const isCurrentUser = entry.farmer._id === currentFarmer?._id;
            return (
              <Animated.View
                key={entry.farmer._id}
                style={[
                  styles.leaderboardItem,
                  isCurrentUser && styles.currentUserItem,
                  {
                    opacity: animatedValues[Math.min(index, animatedValues.length - 1)] || 1,
                    transform: [{
                      translateX: (animatedValues[Math.min(index, animatedValues.length - 1)] || new Animated.Value(1)).interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      }),
                    }],
                  },
                ]}
              >
                <View style={styles.rankContainer}>
                  <Text style={[styles.rankText, isCurrentUser && styles.currentUserText]}>
                    #{entry.rank}
                  </Text>
                </View>

                <View style={styles.farmerInfo}>
                  <View style={styles.farmerHeader}>
                    <Text style={[styles.farmerName, isCurrentUser && styles.currentUserText]} numberOfLines={1}>
                      {entry.farmer.name}
                      {isCurrentUser && <Text style={styles.youText}> (You)</Text>}
                    </Text>
                    <View style={styles.levelBadge}>
                      <Text style={styles.levelText}>Lv.{entry.farmer.level || Math.floor(entry.xp / 200) + 1}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.farmerLocation} numberOfLines={1}>
                    {entry.farmer.village}, {entry.farmer.region}
                  </Text>

                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Ionicons name="flash-outline" size={16} color={COLORS.gold} />
                      <Text style={styles.statText}>{entry.xp} XP</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Ionicons name="leaf-outline" size={16} color={COLORS.ecoGreen} />
                      <Text style={styles.statText}>{entry.ecoScore}%</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Ionicons name="ribbon-outline" size={16} color={COLORS.secondary} />
                      <Text style={styles.statText}>{entry.badges.length}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.badgesPreview}>
                  {entry.badges.slice(0, 3).map((badge) => {
                    const badgeConfig = BADGE_CONFIGS[badge as keyof typeof BADGE_CONFIGS];
                    return badgeConfig ? (
                      <View key={badge} style={[styles.miniBadge, { backgroundColor: badgeConfig.color }]}>
                        <Text style={styles.miniBadgeEmoji}>{badgeConfig.icon}</Text>
                      </View>
                    ) : null;
                  })}
                </View>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  filterButton: {
    padding: SPACING.sm,
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
  },
  yourRankCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  yourRankGradient: {
    padding: SPACING.lg,
  },
  yourRankTitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: SPACING.sm,
  },
  yourRankContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yourRankNumber: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BORDER_RADIUS.round,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  yourRankText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  yourRankStats: {
    flex: 1,
  },
  yourRankName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  yourRankXP: {
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
    opacity: 0.9,
  },
  scrollContainer: {
    flex: 1,
  },
  podiumContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.light,
  },
  podiumTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  podium: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 180,
  },
  podiumItem: {
    alignItems: 'center',
    marginHorizontal: SPACING.sm,
    flex: 1,
    position: 'relative',
  },
  firstPlace: {
    height: 140,
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    justifyContent: 'flex-end',
  },
  secondPlace: {
    height: 120,
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    justifyContent: 'flex-end',
  },
  thirdPlace: {
    height: 100,
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    justifyContent: 'flex-end',
  },
  crownContainer: {
    position: 'absolute',
    top: -10,
    left: '50%',
    marginLeft: -15,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  podiumRank: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.round,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  podiumRankText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  podiumName: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  podiumScore: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  fullLeaderboard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.light,
  },
  fullLeaderboardTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
  },
  currentUserItem: {
    backgroundColor: COLORS.primaryLight,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rankText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  currentUserText: {
    color: COLORS.white,
  },
  farmerInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  farmerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  farmerName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
  },
  youText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: 'normal',
    color: COLORS.white,
    opacity: 0.8,
  },
  levelBadge: {
    backgroundColor: COLORS.gold,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
  },
  levelText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.white,
  },
  farmerLocation: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  badgesPreview: {
    flexDirection: 'row',
    marginLeft: SPACING.sm,
  },
  miniBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -SPACING.xs,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  miniBadgeEmoji: {
    fontSize: 10,
  },
});

export default LeaderboardScreen;
