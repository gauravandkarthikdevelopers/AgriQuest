import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants';
import { NavigationProps } from '../types';
import { apiService } from '../services/api';

interface ScanCropScreenProps extends NavigationProps {}

const ScanCropScreen: React.FC<ScanCropScreenProps> = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const pickImage = async (useCamera: boolean) => {
    const { status } = useCamera 
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera/gallery access is needed to scan crops.');
      return;
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setAnalyzing(true);
    try {
      const result = await apiService.analyzeCrop(selectedImage);
      navigation.navigate('CropResult', { result });
    } catch (error: any) {
      // For demo purposes, create a mock result
      const mockResult = {
        ecoScore: 88,
        issues: ['Minor Pest Activity', 'Slight Dehydration'],
        recommendations: [
          'Monitor pest levels daily',
          'Increase watering frequency',
          'Apply organic pest control methods',
        ],
        confidence: 0.85,
        source: 'fallback' as const,
      };
      navigation.navigate('CropResult', { result: mockResult });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crop Scan</Text>
        <View style={styles.placeholder} />
      </View>

      {selectedImage ? (
        <View style={styles.imageContainer}>
          <View style={styles.imagePreview}>
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.retakeButton} onPress={() => setSelectedImage(null)}>
              <Ionicons name="refresh" size={20} color={COLORS.textSecondary} />
              <Text style={styles.retakeText}>Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.analyzeButton, analyzing && styles.analyzingButton]}
              onPress={analyzeImage}
              disabled={analyzing}
            >
              {analyzing ? (
                <Text style={styles.analyzeButtonText}>Analyzing...</Text>
              ) : (
                <Text style={styles.analyzeButtonText}>Analyze</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.scanContainer}>
          {/* Placeholder Image */}
          <View style={styles.placeholderContainer}>
            <View style={styles.placeholderImage}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
                }}
                style={styles.cropImage}
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.captureButtons}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={() => pickImage(true)}
              activeOpacity={0.8}
            >
              <View style={styles.captureIconContainer}>
                <Ionicons name="camera-outline" size={32} color={COLORS.primary} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={() => pickImage(false)}
              activeOpacity={0.8}
            >
              <View style={styles.captureIconContainer}>
                <Ionicons name="images-outline" size={32} color={COLORS.primary} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  scanContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContainer: {
    marginBottom: SPACING.xl,
  },
  placeholderImage: {
    width: 300,
    height: 200,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  cropImage: {
    width: '100%',
    height: '100%',
  },
  captureButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: SPACING.xl,
  },
  captureButton: {
    alignItems: 'center',
  },
  captureIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  imageContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
  },
  imagePreview: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  previewImage: {
    width: 300,
    height: 200,
    borderRadius: BORDER_RADIUS.xl,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  retakeText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  analyzeButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    minWidth: 120,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  analyzingButton: {
    backgroundColor: COLORS.gray,
  },
  analyzeButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default ScanCropScreen;