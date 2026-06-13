export interface ForensicFeature {
  name: string;
  status: 'Detected' | 'Not Detected' | 'Suspected';
  confidence: number;
  description: string;
}

export interface HeatmapPoint {
  x: number;     // Percent coordinate from left (0 - 100)
  y: number;     // Percent coordinate from top (0 - 100)
  radius: number;// Size of anomaly area (in percentage or px)
  severity: number; // 0 to 100 intensity of anomaly
  label: string; // Detail of what anomaly was noticed here
}

export interface ForensicReport {
  isAIGeneratedPercentage: number;
  manipulationScore: number;
  filterScore: number;
  authenticityScore: number;
  technicalReport: string;
  featuresDetected: ForensicFeature[];
  reconstructedDescription: string;
  metadata: {
    device?: string;
    software?: string;
    colorSpace?: string;
    resolution?: string;
    creationDate?: string;
    compressionLevel?: string;
    fileSize?: string;
    mimeType?: string;
    [key: string]: string | undefined;
  };
  heatmaps: HeatmapPoint[];
}

export type AnalysisStatus = 'idle' | 'uploading' | 'analyzing' | 'success' | 'error';
