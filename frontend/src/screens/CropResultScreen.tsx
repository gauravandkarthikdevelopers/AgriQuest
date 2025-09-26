import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';

import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants';
import { NavigationProps } from '../types';

interface CropResultScreenProps extends NavigationProps {
  route: {
    params: {
      result: {
        ecoScore: number;
        issues: string[];
        recommendations: string[];
        confidence?: number;
        source: string;
      };
    };
  };
}

const CropResultScreen: React.FC<CropResultScreenProps> = ({ navigation, route }) => {
  const { result } = route.params || {};
  const [expandedSections, setExpandedSections] = useState({
    issues: true,
    recommendations: false,
  });
  const [quickTips, setQuickTips] = useState({
    pestMonitoring: false,
    wateringReminder: true,
  });

  const ecoScore = result?.ecoScore || 88;
  const issues = result?.issues || ['Minor Pest Activity', 'Slight Dehydration'];
  const recommendations = result?.recommendations || [
    'Monitor pest levels daily',
    'Increase watering frequency',
    'Apply organic pest control methods',
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return COLORS.success;
    if (score >= 60) return COLORS.warning;
    return COLORS.error;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  const getIssueIcon = (issue: string) => {
    if (issue.toLowerCase().includes('pest')) return 'bug-outline';
    if (issue.toLowerCase().includes('water') || issue.toLowerCase().includes('dehydration')) return 'water-outline';
    if (issue.toLowerCase().includes('disease')) return 'medical-outline';
    return 'warning-outline';
  };

  const getIssueColor = (issue: string) => {
    if (issue.toLowerCase().includes('pest')) return COLORS.warning;
    if (issue.toLowerCase().includes('water')) return COLORS.secondary;
    return COLORS.error;
  };

  const CircularProgress = ({ score }: { score: number }) => {
    const radius = 60;
    const strokeWidth = 8;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <View style={styles.circularProgressContainer}>
        <Svg height={radius * 2} width={radius * 2}>
          <Circle
            stroke={COLORS.lightGray}
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <Circle
            stroke={getScoreColor(score)}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            transform={`rotate(-90 ${radius} ${radius})`}
          />
        </Svg>
        <View style={styles.scoreTextContainer}>
          <Text style={[styles.scoreNumber, { color: getScoreColor(score) }]}>{score}</Text>
          <Text style={styles.scoreLabel}>{getScoreLabel(score)}</Text>
        </View>
      </View>
    );
  };

  const toggleSection = (section: 'issues' | 'recommendations') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crop Result</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* EcoScore Card */}
        <View style={styles.ecoScoreCard}>
          <Text style={styles.ecoScoreTitle}>EcoScore</Text>
          <CircularProgress score={ecoScore} />
          <Text style={styles.ecoScoreDescription}>
            Your crop's sustainability rating is {getScoreLabel(ecoScore).toLowerCase()}. Keep up the great work!
          </Text>
        </View>

        {/* Identified Issues */}
        <View style={styles.sectionCard}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('issues')}
          >
            <Text style={styles.sectionTitle}>Identified Issues</Text>
            <Ionicons
              name={expandedSections.issues ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>

          {expandedSections.issues && (
            <View style={styles.sectionContent}>
              {issues.map((issue, index) => (
                <View key={index} style={styles.issueItem}>
                  <View style={[styles.issueIcon, { backgroundColor: `${getIssueColor(issue)}20` }]}>
                    <Ionicons
                      name={getIssueIcon(issue) as any}
                      size={20}
                      color={getIssueColor(issue)}
                    />
                  </View>
                  <View style={styles.issueContent}>
                    <Text style={styles.issueTitle}>{issue}</Text>
                    <Text style={styles.issueDescription}>
                      {issue.includes('Pest') 
                        ? 'Low levels of aphids detected on lower leaves.'
                        : 'Soil moisture is slightly below optimal levels.'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Recommendations */}
        <View style={styles.sectionCard}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('recommendations')}
          >
            <Text style={styles.sectionTitle}>Recommendations</Text>
            <Ionicons
              name={expandedSections.recommendations ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>

          {expandedSections.recommendations && (
            <View style={styles.sectionContent}>
              {recommendations.map((recommendation, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <View style={styles.recommendationBullet} />
                  <Text style={styles.recommendationText}>{recommendation}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Quick Tips */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Quick Tips</Text>
          <View style={styles.sectionContent}>
            <View style={styles.tipItem}>
              <Text style={styles.tipText}>Enable daily pest monitoring</Text>
              <Switch
                value={quickTips.pestMonitoring}
                onValueChange={(value) =>
                  setQuickTips(prev => ({ ...prev, pestMonitoring: value }))
                }
                trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
                thumbColor={quickTips.pestMonitoring ? COLORS.white : COLORS.gray}
              />
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipText}>Smart watering reminder</Text>
              <Switch
                value={quickTips.wateringReminder}
                onValueChange={(value) =>
                  setQuickTips(prev => ({ ...prev, wateringReminder: value }))
                }
                trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
                thumbColor={quickTips.wateringReminder ? COLORS.white : COLORS.gray}
              />
            </View>
          </View>
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
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  ecoScoreCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.light,
  },
  ecoScoreTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  circularProgressContainer: {
    position: 'relative',
    marginBottom: SPACING.lg,
  },
  scoreTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  ecoScoreDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.light,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  sectionContent: {
    marginTop: SPACING.md,
  },
  issueItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  issueIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  issueContent: {
    flex: 1,
  },
  issueTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  issueDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  recommendationBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 8,
    marginRight: SPACING.sm,
  },
  recommendationText: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  tipItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  tipText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
  },
});

export default CropResultScreen;