import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_BASE_URL, ENDPOINTS } from '../constants';
import {
  ApiResponse,
  Farmer,
  Challenge,
  Mission,
  CropAnalysisResult,
  LeaderboardEntry,
  FarmerProgress,
  ChallengeCompletion,
  MissionResult,
  CropScan,
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('API Response Error:', error);
        
        // Handle specific error cases
        if (error.response?.status === 404) {
          throw new Error('Resource not found');
        } else if (error.response?.status === 429) {
          throw new Error('Too many requests. Please try again later.');
        } else if (error.response?.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (error.code === 'NETWORK_ERROR' || !error.response) {
          throw new Error('Network error. Please check your connection.');
        }
        
        throw new Error(error.response?.data?.error || 'An error occurred');
      }
    );
  }

  // Farmer endpoints
  async getDemoFarmer(): Promise<Farmer> {
    const response = await this.api.get<ApiResponse<Farmer>>(ENDPOINTS.FARMERS.DEMO);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to get demo farmer');
    }
    return response.data.data;
  }

  async getFarmerById(id: string): Promise<Farmer> {
    const response = await this.api.get<ApiResponse<Farmer>>(ENDPOINTS.FARMERS.BY_ID(id));
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to get farmer');
    }
    return response.data.data;
  }

  async getFarmerProgress(id: string): Promise<FarmerProgress> {
    const response = await this.api.get<ApiResponse<FarmerProgress>>(ENDPOINTS.FARMERS.PROGRESS(id));
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to get farmer progress');
    }
    return response.data.data;
  }

  async getLeaderboard(params?: {
    limit?: number;
    page?: number;
    region?: string;
    village?: string;
  }): Promise<{ entries: LeaderboardEntry[]; pagination: any }> {
    const response = await this.api.get<ApiResponse<LeaderboardEntry[]>>(
      ENDPOINTS.FARMERS.LEADERBOARD,
      { params }
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to get leaderboard');
    }
    return {
      entries: response.data.data,
      pagination: response.data.pagination,
    };
  }

  // Challenge endpoints
  async getChallenges(params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
  }): Promise<{ challenges: Challenge[]; pagination: any }> {
    const response = await this.api.get<ApiResponse<{ challenges: Challenge[]; pagination: any }>>(
      ENDPOINTS.CHALLENGES.LIST,
      { params }
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to get challenges');
    }
    return response.data.data;
  }

  async getChallengeById(id: string): Promise<Challenge> {
    const response = await this.api.get<ApiResponse<Challenge>>(ENDPOINTS.CHALLENGES.BY_ID(id));
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to get challenge');
    }
    return response.data.data;
  }

  async completeChallenge(
    challengeId: string,
    data: {
      farmerId: string;
      notes?: string;
      imageUri?: string;
    }
  ): Promise<{
    completion: ChallengeCompletion;
    farmer: Partial<Farmer>;
    xpGained: number;
    newBadges: string[];
  }> {
    const formData = new FormData();
    formData.append('farmerId', data.farmerId);
    
    if (data.notes) {
      formData.append('notes', data.notes);
    }

    if (data.imageUri) {
      const filename = data.imageUri.split('/').pop() || 'image.jpg';
      formData.append('image', {
        uri: data.imageUri,
        type: 'image/jpeg',
        name: filename,
      } as any);
    }

    const response = await this.api.post<ApiResponse>(
      ENDPOINTS.CHALLENGES.COMPLETE(challengeId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to complete challenge');
    }
    return response.data.data;
  }

  // Mission endpoints
  async getMissions(params?: {
    page?: number;
    limit?: number;
  }): Promise<{ missions: Mission[]; pagination: any }> {
    const response = await this.api.get<ApiResponse<{ missions: Mission[]; pagination: any }>>(
      ENDPOINTS.MISSIONS.LIST,
      { params }
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to get missions');
    }
    return response.data.data;
  }

  async getMissionById(id: string): Promise<Mission> {
    const response = await this.api.get<ApiResponse<Mission>>(ENDPOINTS.MISSIONS.BY_ID(id));
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to get mission');
    }
    return response.data.data;
  }

  async completeMission(
    missionId: string,
    data: {
      farmerId: string;
      choices: number[];
      totalScoreImpact: number;
    }
  ): Promise<{
    farmer: Partial<Farmer>;
    missionResult: MissionResult;
  }> {
    const response = await this.api.post<ApiResponse>(
      ENDPOINTS.MISSIONS.COMPLETE(missionId),
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to complete mission');
    }
    return response.data.data;
  }

  // Crop scan endpoints
  async analyzeCrop(
    imageUri: string,
    farmerId?: string
  ): Promise<CropAnalysisResult> {
    const formData = new FormData();
    
    const filename = imageUri.split('/').pop() || 'crop.jpg';
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: filename,
    } as any);

    if (farmerId) {
      formData.append('farmerId', farmerId);
    }

    const response = await this.api.post<ApiResponse<CropAnalysisResult>>(
      ENDPOINTS.CROP_SCAN.ANALYZE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 seconds for AI analysis
      }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to analyze crop');
    }
    return response.data.data;
  }

  async getCropScans(params?: {
    farmerId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ scans: CropScan[]; pagination: any }> {
    const response = await this.api.get<ApiResponse<{ scans: CropScan[]; pagination: any }>>(
      ENDPOINTS.CROP_SCAN.LIST,
      { params }
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to get crop scans');
    }
    return response.data.data;
  }

  // Health check
  async healthCheck(): Promise<any> {
    const response = await this.api.get<ApiResponse>(ENDPOINTS.HEALTH);
    return response.data;
  }

  // Utility method to check if API is available
  async isApiAvailable(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch (error) {
      console.error('API not available:', error);
      return false;
    }
  }
}

export const apiService = new ApiService();
export default apiService;
