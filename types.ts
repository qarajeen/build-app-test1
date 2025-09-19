export type FindingType = 'Good' | 'Warning' | 'Critical';

export interface Finding {
  type: FindingType;
  title: string;
  description: string;
  recommendation?: string;
}

export interface ImageAnalysis {
  src: string;
  findings: Finding[];
}

export interface AnalysisReport {
  score: number;
  summary: string;
  imageBreakdown: ImageAnalysis[];
}
