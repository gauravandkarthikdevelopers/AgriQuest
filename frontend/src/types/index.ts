export interface Farmer {
  _id: string;
  name: string;
  village: string;
  region: string;
  xp: number;
  ecoScore: number;
  badges: string[];
  level?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Challenge {
  _id: string;
  title: string;
  description: string;
  xpReward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl?: string;
  criteria: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChallengeCompletion {
  _id: string;
  challengeId: string | Challenge;
  farmerId: string;
  imageUrl?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  xpAwarded: number;
  createdAt: string;
  updatedAt: string;
}

export interface MissionChoice {
  text: string;
  scoreImpact: number;
  desc: string;
}

export interface MissionNode {
  text: string;
  choices: MissionChoice[];
}

export interface Mission {
  _id: string;
  title: string;
  nodes: MissionNode[];
  xpReward: number;
  createdAt: string;
  updatedAt: string;
}

export interface CropScan {
  _id: string;
  farmerId: string;
  imageUrl: string;
  thumbnailUrl?: string;
  ecoScore: number;
  issues: string[];
  recommendations: string[];
  rawAnalysis?: any;
  confidence?: number;
  source: 'gemini' | 'fallback';
  createdAt: string;
  updatedAt: string;
}

export interface CropAnalysisResult {
  ecoScore: number;
  issues: string[];
  recommendations: string[];
  rawAnalysis?: any;
  confidence?: number;
  source: 'gemini' | 'fallback';
  imageUrl?: string;
  thumbnailUrl?: string;
}

export interface LeaderboardEntry {
  farmer: Farmer;
  rank: number;
  xp: number;
  ecoScore: number;
  badges: string[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface FarmerProgress {
  farmer: Farmer;
  metrics: {
    currentLevel: number;
    xpForNextLevel: number;
    progressToNextLevel: number;
    totalScans: number;
    totalCompletions: number;
    avgEcoScore: number;
    waterUsageEfficiency: number;
    soilHealthScore: number;
  };
  recentActivity: {
    scans: CropScan[];
    completions: ChallengeCompletion[];
  };
  achievements: {
    badges: string[];
    badgeDescriptions: Record<string, string>;
  };
}

export interface MissionResult {
  xpGained: number;
  ecoScoreChange: number;
  newBadges: string[];
  outcomeMessage: string;
  outcomeType: 'excellent' | 'good' | 'okay' | 'poor';
  totalScoreImpact: number;
  choicesSummary: Array<{
    nodeIndex: number;
    choiceIndex: number;
    choiceText: string;
    scoreImpact: number;
    description: string;
  }>;
}

export interface NavigationProps {
  navigation: any;
  route?: any;
}

export type RootStackParamList = {
  Home: undefined;
  ScanCrop: undefined;
  CropResult: { result: CropAnalysisResult };
  Challenges: undefined;
  ChallengeDetail: { challenge: Challenge };
  Missions: undefined;
  MissionPlayer: { mission: Mission };
  Leaderboard: undefined;
  Progress: undefined;
  Settings: undefined;
};

export type TabParamList = {
  HomeTab: undefined;
  ChallengesTab: undefined;
  ScanTab: undefined;
  LeaderboardTab: undefined;
  ProgressTab: undefined;
};
