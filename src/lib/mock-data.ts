
import type { BusMessage, EcuNode, SignalData, LearningModule, QuizQuestion, ChartDataPoint } from './types';

export const mockBusMessages: BusMessage[] = [
  { id: '1', timestamp: new Date(Date.now() - 5000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }), type: 'CAN', messageId: '0x1A0', sender: 'Engine ECU', data: ['01', '23', '45', '67', '89', 'AB', 'CD', 'EF'], dlc: 8 },
  { id: '2', timestamp: new Date(Date.now() - 4500).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }), type: 'LIN', messageId: '0x3C', sender: 'Climate Control', data: ['F0', 'E1'], dlc: 2 },
  { id: '3', timestamp: new Date(Date.now() - 4000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }), type: 'CAN', messageId: '0x2B1', sender: 'Brake ECU', data: ['11', '22', '33', '44'], dlc: 4 },
  { id: '4', timestamp: new Date(Date.now() - 3000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }), type: 'CAN', messageId: '0x1A0', sender: 'Engine ECU', data: ['01', '24', '45', '67', '89', 'AB', 'CD', 'EF'], dlc: 8 },
  { id: '5', timestamp: new Date(Date.now() - 2000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }), type: 'LIN', messageId: '0x3D', sender: 'Window Sensor', data: ['A5'], dlc: 1 },
  { id: '6', timestamp: new Date(Date.now() - 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }), type: 'CAN', messageId: '0x4F0', sender: 'Gateway', data: ['DE', 'AD', 'BE', 'EF', '00', '11', '22', '33'], dlc: 8 },
];

export const mockEcuNodes: EcuNode[] = [
  { id: 'ecu1', name: 'Engine ECU', type: 'Engine ECU', status: 'Running', sendsMessages: [{ messageId: '0x1A0', interval: 100, dataPattern: ['01', 'XX', '45', '67'] }] },
  { id: 'ecu2', name: 'Brake ECU', type: 'Brake ECU', status: 'Simulating', sendsMessages: [{ messageId: '0x2B1', interval: 50, dataPattern: ['YY', '22'] }] },
  { id: 'ecu3', name: 'Sensor Node A', type: 'Sensor Node', status: 'Stopped', sendsMessages: [{ messageId: '0x300', interval: 1000, dataPattern: ['S1', '00'] }] },
  { id: 'ecu4', name: 'Gateway', type: 'Gateway', status: 'Running', sendsMessages: [{ messageId: '0x4F0', interval: 250, dataPattern: ['DE', 'AD', 'BE', 'EF']}] },
  { id: 'ecu5', name: 'Body Control', type: 'Custom', status: 'Error', sendsMessages: [{ messageId: '0x500', interval: 500, dataPattern: ['00', '00']}] },
];

const generateTimeSeriesData = (numPoints: number, minVal: number, maxVal: number, startTime: number = 10): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  for (let i = 0; i < numPoints; i++) {
    data.push({
      time: `${String(startTime + i).padStart(2, '0')}:00`,
      value: Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal,
    });
  }
  return data;
};

export const mockSignalData: SignalData[] = [
  {
    name: 'Speed',
    unit: 'km/h',
    color: 'hsl(var(--chart-1))',
    data: generateTimeSeriesData(10, 50, 80),
  },
  {
    name: 'Temperature',
    unit: '°C',
    color: 'hsl(var(--chart-2))',
    data: generateTimeSeriesData(10, 15, 30),
  },
  {
    name: 'Battery Voltage',
    unit: 'V',
    color: 'hsl(var(--chart-3))',
    data: generateTimeSeriesData(10, 12, 14),
  },
  {
    name: 'Engine Load',
    unit: '%',
    color: 'hsl(var(--chart-4))',
    data: generateTimeSeriesData(10, 20, 90),
  }
];

export const mockLearningModules: LearningModule[] = [
  {
    id: 'can-intro',
    title: 'Introduction to CAN Bus',
    type: 'explanation',
    content: `
      <h3 class="font-headline text-xl mb-2 text-accent">What is CAN?</h3>
      <p class="mb-4">Controller Area Network (CAN) is a robust vehicle bus standard designed to allow microcontrollers and devices to communicate with each other's applications without a host computer.</p>
      <h3 class="font-headline text-xl mb-2 text-accent">Key Features</h3>
      <ul class="list-disc pl-5 mb-4">
        <li>Message-based protocol, designed originally for multiplex electrical wiring within automobiles to save on copper, but is also used in many other contexts.</li>
        <li>Prioritization of messages using identifiers.</li>
        <li>Robust error detection and handling.</li>
      </ul>
    `
  },
  {
    id: 'can-frame',
    title: 'CAN Frame Structure',
    type: 'explanation',
    content: `
      <h3 class="font-headline text-xl mb-2 text-accent">Standard CAN Frame (11-bit ID)</h3>
      <p class="mb-4">A standard CAN frame consists of several fields:</p>
      <ul class="list-disc pl-5 mb-4 font-code">
        <li><strong>SOF (Start of Frame):</strong> 1 dominant bit. Marks the beginning of a message.</li>
        <li><strong>Identifier (ID):</strong> 11 bits. Determines message priority.</li>
        <li><strong>RTR (Remote Transmission Request):</strong> 1 bit. Dominant for data frames, recessive for remote frames.</li>
        <li><strong>IDE (Identifier Extension):</strong> 1 bit. Dominant for standard CAN.</li>
        <li><strong>DLC (Data Length Code):</strong> 4 bits. Number of data bytes (0-8).</li>
        <li><strong>Data Field:</strong> 0-8 bytes. The actual data being transmitted.</li>
        <li><strong>CRC (Cyclic Redundancy Check):</strong> 15 bits + 1 recessive delimiter bit. For error detection.</li>
        <li><strong>ACK (Acknowledge):</strong> 1 slot bit + 1 recessive delimiter bit. Transmitter sends recessive, receiver sends dominant if frame received correctly.</li>
        <li><strong>EOF (End of Frame):</strong> 7 recessive bits. Marks the end of the message.</li>
      </ul>
      <p>Extended CAN frames use a 29-bit identifier.</p>
    `
  },
   {
    id: 'lin-intro',
    title: 'Introduction to LIN Bus',
    type: 'explanation',
    content: `
      <h3 class="font-headline text-xl mb-2 text-accent">What is LIN?</h3>
      <p class="mb-4">Local Interconnect Network (LIN) is a serial network protocol used for communication between components in vehicles. It is a simpler, slower, and cheaper alternative to CAN, typically used for less critical functions like sensor data or actuator control in comfort electronics.</p>
      <h3 class="font-headline text-xl mb-2 text-accent">Key Features</h3>
      <ul class="list-disc pl-5 mb-4">
        <li>Single master, multiple slaves (up to 15).</li>
        <li>Low cost due to single-wire implementation and UART-based communication.</li>
        <li>Deterministic signal transmission.</li>
        <li>Self-synchronization without a crystal in slave nodes.</li>
      </ul>
    `
  },
];

export const mockQuizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What is the maximum number of data bytes in a standard CAN frame?',
    options: ['4 bytes', '8 bytes', '16 bytes', '64 bytes'],
    correctAnswer: '8 bytes',
    explanation: 'A standard CAN frame (and extended CAN frame) can carry up to 8 bytes of data in its data field, as indicated by the DLC.'
  },
  {
    id: 'q2',
    question: 'In a LIN network, which node initiates communication?',
    options: ['Any slave node', 'The master node', 'The node with highest priority', 'All nodes simultaneously'],
    correctAnswer: 'The master node',
    explanation: 'LIN is a master-slave protocol. The master node controls the bus and initiates all communication by sending a header.'
  },
  {
    id: 'q3',
    question: 'Consider the CAN frame data: ID=0x100, DLC=3, Data=01 02 03. Which field indicates there are 3 bytes of data?',
    frameData: 'SOF-ID(0x100)-RTR-IDE-DLC(3)-DATA(010203)-CRC-ACK-EOF',
    options: ['Identifier (ID)', 'Data Length Code (DLC)', 'Start of Frame (SOF)', 'Cyclic Redundancy Check (CRC)'],
    correctAnswer: 'Data Length Code (DLC)',
    explanation: 'The Data Length Code (DLC) field specifies the number of bytes in the Data Field. A DLC of 3 means 3 data bytes.'
  },
];

// Helper to get a new message for real-time simulation
let messageCounter = 0;
const ecuSenders = ['Engine ECU', 'Brake ECU', 'Dashboard', 'Infotainment', 'Gateway', 'Climate Control'];
const canIds = ['0x1A0', '0x2B1', '0x3C2', '0x4D3', '0x5E4', '0x18DAF110', '0x7DF'];
const linIds = ['0x10', '0x2A', '0x3F', '0x0C'];

export function generateMockBusMessage(): BusMessage {
  messageCounter++;
  const type = Math.random() > 0.3 ? 'CAN' : 'LIN';
  const dlc = type === 'CAN' ? Math.floor(Math.random() * 8) + 1 : Math.floor(Math.random() * 8) + 1; // LIN can also have up to 8
  const data: string[] = [];
  for (let i = 0; i < dlc; i++) {
    data.push(Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase());
  }

  return {
    id: Date.now().toString() + messageCounter,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }),
    type,
    messageId: type === 'CAN' ? canIds[Math.floor(Math.random() * canIds.length)] : linIds[Math.floor(Math.random() * linIds.length)],
    sender: ecuSenders[Math.floor(Math.random() * ecuSenders.length)],
    data,
    dlc,
  };
}
