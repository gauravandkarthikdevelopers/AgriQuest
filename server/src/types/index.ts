export interface IFarmer {
  _id?: string;
  name: string;
  village: string;
  region: string;
  xp: number;
  ecoScore: number;
  badges: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IChallenge {
  _id?: string;
  title: string;
  description: string;
  xpReward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl?: string;
  criteria: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IChallengeCompletion {
  _id?: string;
  challengeId: string;
  farmerId: string;
  imageUrl?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  xpAwarded: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMissionChoice {
  text: string;
  scoreImpact: number;
  desc: string;
}

export interface IMissionNode {
  text: string;
  choices: IMissionChoice[];
}

export interface IMission {
  _id?: string;
  title: string;
  nodes: IMissionNode[];
  xpReward: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICropScan {
  _id?: string;
  farmerId: string;
  imageUrl: string;
  ecoScore: number;
  issues: string[];
  recommendations: string[];
  rawAnalysis?: any;
  confidence?: number;
  source: 'gemini' | 'fallback';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICropAnalysisResult {
  ecoScore: number;
  issues: string[];
  recommendations: string[];
  rawAnalysis?: any;
  confidence?: number;
  source: 'gemini' | 'fallback';
}

export interface ILeaderboardEntry {
  farmer: IFarmer;
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
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface LeaderboardQuery extends PaginationQuery {
  region?: string;
  village?: string;
}
