'use server';

import { analyzeCanLinTraffic, type AnalyzeCanLinTrafficInput, type AnalyzeCanLinTrafficOutput } from '@/ai/flows/analyze-can-lin-traffic';

export interface AnomalyDetectionResult {
  success: boolean;
  data?: AnalyzeCanLinTrafficOutput;
  error?: string;
}

export async function performAnomalyDetection(logData: string): Promise<AnomalyDetectionResult> {
  if (!logData || logData.trim() === '') {
    return { success: false, error: 'Log data cannot be empty.' };
  }

  const input: AnalyzeCanLinTrafficInput = {
    canLinLog: logData,
  };

  try {
    const output = await analyzeCanLinTraffic(input);
    return { success: true, data: output };
  } catch (error) {
    console.error('AI Anomaly Detection Error:', error);
    let errorMessage = 'An unexpected error occurred during analysis.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}