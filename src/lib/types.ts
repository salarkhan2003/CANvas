
export interface BusMessage {
  id: string; // Unique identifier for the message row
  timestamp: string; // ISO string or formatted time
  type: 'CAN' | 'LIN';
  messageId: string; // CAN/LIN Message ID (hex)
  sender?: string; // ECU Name or Node ID
  data: string[]; // Array of hex bytes, e.g., ["0A", "FF", "12"]
  dlc: number; // Data Length Code
}

export interface EcuNode {
  id: string;
  name: string;
  type: 'Engine ECU' | 'Brake ECU' | 'Sensor Node' | 'Gateway' | 'Custom';
  status: 'Running' | 'Stopped' | 'Error' | 'Simulating';
  sendsMessages: { messageId: string; interval: number; dataPattern: string[] }[]; // e.g. [{ messageId: '0x1A0', interval: 100, dataPattern: ["AA", "BB"] }]
}

export type FaultType = 'bit_error' | 'bus_off' | 'recessive_dominant_flip' | 'timeout';

export interface Anomaly {
  timestamp: string;
  messageId: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface AnalysisReport {
  anomalies: Anomaly[];
  summary: string;
}

export interface ChartDataPoint {
  time?: string; // Formatted time or category for time-series
  name?: string; // For categorical data like message IDs or statuses
  value: number;
  fill?: string; // For individual bar/segment colors in some charts
  unit?: string; // Optional unit for tooltip display
}

export interface SignalData {
  name: 'Vehicle Speed' | 'Coolant Temp' | 'Battery Voltage' | 'Engine Load' | string; // Signal name
  unit: 'km/h' | '°C' | 'V' | '%' | string; // Signal unit
  data: ChartDataPoint[]; // Array of data points for the chart
  color?: string; // Optional color for the chart series
}

export interface LearningModule {
  id: string;
  title: string;
  content: string; // Can be markdown or HTML string
  type: 'explanation' | 'frame_component';
}

export interface QuizQuestion {
  id: string;
  question: string;
  frameData?: string; // Optional frame data for context
  options: string[];
  correctAnswer: string; // or index
  explanation: string;
}

export interface CountData {
  name: string;
  value: number;
  fill?: string;
  unit?: string; // Added unit for dashboard stats
}
