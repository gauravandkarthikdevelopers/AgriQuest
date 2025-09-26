import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants';
import { NavigationProps, Challenge } from '../types';

interface ChallengeDetailScreenProps extends NavigationProps {
  route: {
    params: {
      challenge: Challenge;
    };
  };
}

const ChallengeDetailScreen: React.FC<ChallengeDetailScreenProps> = ({ navigation, route }) => {
  const { challenge } = route.params || {
    challenge: {
      _id: '1',
      title: 'Water Conservation Challenge',
      description: 'Implement a water-saving irrigation technique on your farm, such as drip irrigation or rainwater harvesting. Document your method and its impact on water usage.',
      xpReward: 150,
      difficulty: 'easy',
      criteria: 'Photo proof of implementation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };

  const criteriaList = [
    'Implement a water-saving technique',
    'Document with photos or videos',
    'Provide data on water usage',
  ];

  return (
    <View style={styles.container}>
      {/* Hero Section */}
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=600&fit=crop',
        }}
        style={styles.heroSection}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
          style={styles.heroOverlay}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Challenge</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Challenge Title */}
          <View style={styles.heroContent}>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>

      {/* Content */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DESCRIPTION</Text>
          <Text style={styles.description}>{challenge.description}</Text>
        </View>

        {/* Criteria Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CRITERIA</Text>
          <View style={styles.criteriaList}>
            {criteriaList.map((criterion, index) => (
              <View key={index} style={styles.criteriaItem}>
                <View style={styles.checkIcon}>
                  <Ionicons name="checkmark" size={16} color={COLORS.success} />
                </View>
                <Text style={styles.criteriaText}>{criterion}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Reward Info */}
        <View style={styles.rewardSection}>
          <View style={styles.rewardInfo}>
            <View style={styles.rewardItem}>
              <Ionicons name="star" size={20} color={COLORS.gold} />
              <Text style={styles.rewardText}>{challenge.xpReward} XP</Text>
            </View>
            <View style={styles.rewardItem}>
              <View style={[styles.difficultyBadge, { backgroundColor: COLORS.success }]}>
                <Text style={styles.difficultyText}>
                  {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Button */}
      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => {
            // Navigate to completion screen or show completion modal
            navigation.goBack();
          }}
        >
          <View style={styles.actionButtonContent}>
            <Ionicons name="cloud-upload-outline" size={20} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Mark as Completed (Upload Proof)</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  heroSection: {
    height: 300,
  },
  heroOverlay: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  placeholder: {
    width: 40,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: SPACING.xl,
  },
  challengeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    lineHeight: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.success,
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
  criteriaList: {
    marginTop: SPACING.sm,
  },
  criteriaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: `${COLORS.success}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  criteriaText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    flex: 1,
  },
  rewardSection: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  rewardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
  },
  difficultyBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  difficultyText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.white,
  },
  actionContainer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    ...SHADOWS.medium,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: SPACING.sm,
  },
});

export default ChallengeDetailScreen;