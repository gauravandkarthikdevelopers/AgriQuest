import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants';
import { NavigationProps, Farmer } from '../types';
import { apiService } from '../services/api';

interface HomeScreenProps extends NavigationProps {}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDemoFarmer();
  }, []);

  const loadDemoFarmer = async () => {
    try {
      const demoFarmer = await apiService.getDemoFarmer();
      setFarmer(demoFarmer);
    } catch (error) {
      console.error('Error loading demo farmer:', error);
      // Create a demo farmer for UI purposes
      setFarmer({
        _id: 'demo',
        name: 'Eco Warrior',
        village: 'Green Valley',
        region: 'Maharashtra',
        xp: 450,
        ecoScore: 88,
        badges: ['eco-warrior', 'water-saver'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDemoFarmer();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading AgriQuest...</Text>
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
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.farmerName}>{farmer?.name || 'Eco Warrior'}</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Scan Crop Card */}
      <TouchableOpacity 
        style={styles.scanCropCard}
        onPress={() => navigation.navigate('ScanTab')}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.scanCropGradient}
        >
          <View style={styles.scanCropContent}>
            <View style={styles.scanCropText}>
              <Text style={styles.scanCropTitle}>Scan Crop</Text>
              <Text style={styles.scanCropSubtitle}>AI-powered crop analysis</Text>
            </View>
            <View style={styles.scanCropIcon}>
              <Ionicons name="scan-outline" size={32} color={COLORS.white} />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Feature Grid */}
      <View style={styles.featuresGrid}>
        <TouchableOpacity 
          style={styles.featureCard}
          onPress={() => navigation.navigate('ChallengesTab')}
        >
          <View style={styles.featureIconContainer}>
            <Ionicons name="trophy-outline" size={24} color={COLORS.primary} />
          </View>
          <Text style={styles.featureTitle}>Challenges</Text>
          <Text style={styles.featureSubtitle}>Take on new tasks</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.featureCard}
          onPress={() => navigation.navigate('Missions')}
        >
          <View style={styles.featureIconContainer}>
            <Ionicons name="school-outline" size={24} color={COLORS.secondary} />
          </View>
          <Text style={styles.featureTitle}>Knowledge</Text>
          <Text style={styles.featureSubtitle}>Learn new skills</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.featureCard}
          onPress={() => navigation.navigate('LeaderboardTab')}
        >
          <View style={styles.featureIconContainer}>
            <Ionicons name="podium-outline" size={24} color={COLORS.gold} />
          </View>
          <Text style={styles.featureTitle}>Leaderboard</Text>
          <Text style={styles.featureSubtitle}>See top farmers</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.featureCard}
          onPress={() => navigation.navigate('ProgressTab')}
        >
          <View style={styles.featureIconContainer}>
            <Ionicons name="trending-up-outline" size={24} color={COLORS.error} />
          </View>
          <Text style={styles.featureTitle}>My Progress</Text>
          <Text style={styles.featureSubtitle}>Track your eco-score</Text>
        </TouchableOpacity>
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
  },
  header: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  welcomeText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  farmerName: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  settingsButton: {
    padding: SPACING.sm,
  },
  scanCropCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  scanCropGradient: {
    padding: SPACING.lg,
    minHeight: 120,
  },
  scanCropContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  scanCropText: {
    flex: 1,
  },
  scanCropTitle: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  scanCropSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
    opacity: 0.9,
  },
  scanCropIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.round,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    alignItems: 'flex-start',
    ...SHADOWS.light,
  },
  featureIconContainer: {
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  featureTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  featureSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});

export default HomeScreen;