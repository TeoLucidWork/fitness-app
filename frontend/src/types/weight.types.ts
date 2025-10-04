export interface WeightEntry {
  id: number;
  userId: number;
  weight: number;
  notes?: string;
  createdAt: string;
  user: {
    id: number;
    firstName?: string;
    lastName?: string;
    username: string;
  };
}

export interface CreateWeightEntryDto {
  weight: number;
  notes?: string;
}

export interface UpdateWeightEntryDto {
  weight?: number;
  notes?: string;
}

export interface WeightStats {
  totalEntries: number;
  currentWeight: number | null;
  startingWeight: number | null;
  weightChange: number | null;
  lowestWeight: number | null;
  highestWeight: number | null;
  averageWeight: number | null;
  lastUpdated: string | null;
  trend: 'increasing' | 'decreasing' | 'stable' | null;
}

export interface WeightProgressEntry {
  id: number;
  weight: number;
  createdAt: string;
  notes?: string;
}