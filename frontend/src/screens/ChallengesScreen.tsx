import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants';
import { NavigationProps, Challenge } from '../types';
import { apiService } from '../services/api';

interface ChallengesScreenProps extends NavigationProps {}

const ChallengesScreen: React.FC<ChallengesScreenProps> = ({ navigation }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      const result = await apiService.getChallenges({ limit: 100 });
      setChallenges(result.challenges);
    } catch (error) {
      console.error('Error loading challenges:', error);
      // Mock data for demo
      setChallenges([
        {
          _id: '1',
          title: 'Water Conservation',
          description: 'Reduce water usage by 20%',
          xpReward: 150,
          difficulty: 'easy',
          criteria: 'Implement drip irrigation',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: '2',
          title: 'Organic Pest Control',
          description: 'Use natural pest repellents',
          xpReward: 300,
          difficulty: 'medium',
          criteria: 'Document organic methods',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: '3',
          title: 'Soil Health Boost',
          description: 'Introduce cover crops',
          xpReward: 500,
          difficulty: 'hard',
          criteria: 'Plant and maintain cover crops',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: '4',
          title: 'Crop Rotation Mastery',
          description: 'Plan and execute a full crop rotation cycle',
          xpReward: 1000,
          difficulty: 'medium',
          criteria: 'Complete rotation documentation',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadChallenges();
    setRefreshing(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return COLORS.success;
      case 'medium':
        return COLORS.warning;
      case 'hard':
        return COLORS.error;
      default:
        return COLORS.gray;
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'leaf-outline';
      case 'medium':
        return 'flash-outline';
      case 'hard':
        return 'flame-outline';
      default:
        return 'help-outline';
    }
  };

  const renderChallenge = ({ item, index }: { item: Challenge; index: number }) => (
    <TouchableOpacity
      style={[
        styles.challengeCard,
        index === 2 && styles.completedCard, // Third item (Soil Health Boost) is completed
      ]}
      onPress={() => navigation.navigate('ChallengeDetail', { challenge: item })}
      activeOpacity={0.8}
    >
      <View style={styles.challengeHeader}>
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
          <Ionicons name={getDifficultyIcon(item.difficulty) as any} size={16} color={COLORS.white} />
        </View>
        <View style={styles.xpBadge}>
          <Ionicons name="star" size={16} color={COLORS.gold} />
          <Text style={styles.xpText}>{item.xpReward} XP</Text>
        </View>
      </View>

      <Text style={styles.challengeTitle}>{item.title}</Text>
      <Text style={styles.challengeDescription}>{item.description}</Text>

      <View style={styles.challengeFooter}>
        <View style={styles.difficultyContainer}>
          <Text style={[styles.difficultyText, { color: getDifficultyColor(item.difficulty) }]}>
            {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
          </Text>
        </View>
        
        {index === 2 ? (
          <View style={styles.completedButton}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
            <Text style={styles.completedText}>Submit Proof</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Start Challenge</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = (title: string) => (
    <Text style={styles.sectionTitle}>{title}</Text>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Challenges</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={challenges}
        renderItem={renderChallenge}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {renderSectionHeader('Weekly Challenges')}
            {/* We'll render first 3 items as weekly */}
          </View>
        }
        ListFooterComponent={
          challenges.length > 3 ? (
            <View>
              {renderSectionHeader('Monthly Challenges')}
              {/* Monthly challenges would be rendered here */}
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  placeholder: {
    width: 24,
  },
  listContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  challengeCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.light,
  },
  completedCard: {
    backgroundColor: COLORS.cardBackground,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  xpText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: SPACING.xs,
  },
  challengeTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  challengeDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyContainer: {
    flex: 1,
  },
  difficultyText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  startButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.white,
    marginRight: SPACING.xs,
  },
  completedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  completedText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.success,
    marginLeft: SPACING.xs,
  },
});

export default ChallengesScreen;