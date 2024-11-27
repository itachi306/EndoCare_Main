export interface DailySymptoms {
  periodPain: number;
  pelvicPain: number;
  periodFlow: 1 | 2 | 3;
  painDuringSex: number;
  fatigueLevel: number;
  constipation: number;
  diarrhea: number;
  painDuringBowelMovement: number;
  painDuringUrination: number;
  nausea: number;
  unexplainedBleeding: number;
}

export interface DailyData extends DailySymptoms {
  date: string;
  riskScore: number;
}

export interface WeeklyPrediction {
  weekStart: string;
  weekEnd: string;
  averageRiskScore: number;
  endometriosisLikelihood: number;
  symptoms: Partial<DailySymptoms>;
}