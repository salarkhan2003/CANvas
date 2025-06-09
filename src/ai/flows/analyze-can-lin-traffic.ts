// src/ai/flows/analyze-can-lin-traffic.ts
'use server';
/**
 * @fileOverview An AI agent for analyzing CAN/LIN bus traffic and identifying anomalies.
 *
 * - analyzeCanLinTraffic - A function that analyzes CAN/LIN bus traffic for anomalies.
 * - AnalyzeCanLinTrafficInput - The input type for the analyzeCanLinTraffic function.
 * - AnalyzeCanLinTrafficOutput - The return type for the analyzeCanLinTraffic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCanLinTrafficInputSchema = z.object({
  canLinLog: z
    .string()
    .describe(
      'A string containing the CAN/LIN bus traffic log data in a standard format like .log, .blf, or .asc.'
    ),
});
export type AnalyzeCanLinTrafficInput = z.infer<typeof AnalyzeCanLinTrafficInputSchema>;

const AnomalySchema = z.object({
  timestamp: z.string().describe('Timestamp of the anomaly.'),
  messageId: z.string().describe('The ID of the CAN/LIN message.'),
  description: z.string().describe('Description of the anomaly detected.'),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH']).describe('Severity level of the anomaly.'),
});

const AnalyzeCanLinTrafficOutputSchema = z.object({
  anomalies: z.array(AnomalySchema).describe('List of anomalies detected in the CAN/LIN bus traffic.'),
  summary: z.string().describe('A summary of the analysis, including the number of anomalies found and overall health of the network.'),
});
export type AnalyzeCanLinTrafficOutput = z.infer<typeof AnalyzeCanLinTrafficOutputSchema>;

export async function analyzeCanLinTraffic(input: AnalyzeCanLinTrafficInput): Promise<AnalyzeCanLinTrafficOutput> {
  return analyzeCanLinTrafficFlow(input);
}

const analyzeCanLinTrafficPrompt = ai.definePrompt({
  name: 'analyzeCanLinTrafficPrompt',
  input: {schema: AnalyzeCanLinTrafficInputSchema},
  output: {schema: AnalyzeCanLinTrafficOutputSchema},
  prompt: `You are an expert in analyzing CAN/LIN bus traffic for anomalies and potential security threats.

  Analyze the provided CAN/LIN bus traffic log data and identify any anomalies or unusual patterns.
  Anomalies can include unexpected message IDs, data content deviations, timing issues, or any other irregularities.

  Provide a detailed description of each anomaly, including its timestamp, message ID, severity (LOW, MEDIUM, HIGH), and potential impact on the network.

  Also, provide a summary of the analysis, including the total number of anomalies found and an overall assessment of the CAN/LIN network's health.

  CAN/LIN Bus Traffic Log Data:
  {{canLinLog}}`,
});

const analyzeCanLinTrafficFlow = ai.defineFlow(
  {
    name: 'analyzeCanLinTrafficFlow',
    inputSchema: AnalyzeCanLinTrafficInputSchema,
    outputSchema: AnalyzeCanLinTrafficOutputSchema,
  },
  async input => {
    const {output} = await analyzeCanLinTrafficPrompt(input);
    return output!;
  }
);
