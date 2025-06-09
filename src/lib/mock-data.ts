
import type { BusMessage, EcuNode, SignalData, LearningModule, QuizQuestion, ChartDataPoint, CountData } from './types';

export const mockBusMessages: BusMessage[] = [
  { id: '1', timestamp: new Date(Date.now() - 5000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }), type: 'CAN', messageId: '0x1A0', sender: 'Engine ECU', data: ['01', '23', '45', '67', '89', 'AB', 'CD', 'EF'], dlc: 8 },
  { id: '2', timestamp: new Date(Date.now() - 4500).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }), type: 'LIN', messageId: '0x3C', sender: 'Climate Control', data: ['F0', 'E1'], dlc: 2 },
  { id: '3', timestamp: new Date(Date.now() - 4000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }), type: 'CAN', messageId: '0x2B1', sender: 'Brake ECU', data: ['11', '22', '33', '44'], dlc: 4 },
  { id: '4', timestamp: new Date(Date.now() - 3000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }), type: 'CAN', messageId: '0x1A0', sender: 'Engine ECU', data: ['01', '24', '45', '67', '89', 'AB', 'CD', 'EF'], dlc: 8 },
  { id: '5', timestamp: new Date(Date.now() - 2000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }), type: 'LIN', messageId: '0x3D', sender: 'Window Sensor', data: ['A5'], dlc: 1 },
  { id: '6', timestamp: new Date(Date.now() - 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }), type: 'CAN', messageId: '0x4F0', sender: 'Gateway', data: ['DE', 'AD', 'BE', 'EF', '00', '11', '22', '33'], dlc: 8 },
];

export const mockEcuNodes: EcuNode[] = [
  { id: 'ecu1', name: 'Engine Control Unit', type: 'Engine ECU', status: 'Running', sendsMessages: [{ messageId: '0x1A0', interval: 100, dataPattern: ['01', 'XX', '45', '67'] }, {messageId: '0x1A1', interval: 100, dataPattern: ['RPMH', 'RPML']}] },
  { id: 'ecu2', name: 'Braking System', type: 'Brake ECU', status: 'Simulating', sendsMessages: [{ messageId: '0x2B1', interval: 50, dataPattern: ['YY', '22'] }] },
  { id: 'ecu3', name: 'Proximity Sensor Array', type: 'Sensor Node', status: 'Stopped', sendsMessages: [{ messageId: '0x300', interval: 1000, dataPattern: ['S1', '00'] }] },
  { id: 'ecu4', name: 'Central Gateway', type: 'Gateway', status: 'Running', sendsMessages: [{ messageId: '0x4F0', interval: 250, dataPattern: ['DE', 'AD', 'BE', 'EF']}] },
  { id: 'ecu5', name: 'Body Control Module', type: 'Custom', status: 'Error', sendsMessages: [{ messageId: '0x500', interval: 500, dataPattern: ['00', '00']}] },
  { id: 'ecu6', name: 'ADAS Processor', type: 'Custom', status: 'Running', sendsMessages: [{ messageId: '0x6A0', interval: 100, dataPattern: ['AD', '01']}] },

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
    name: 'Vehicle Speed',
    unit: 'km/h',
    color: 'var(--color-chart-1)',
    data: generateTimeSeriesData(10, 50, 80),
  },
  {
    name: 'Coolant Temp',
    unit: '°C',
    color: 'var(--color-chart-2)',
    data: generateTimeSeriesData(10, 70, 95),
  },
  {
    name: 'Battery Voltage',
    unit: 'V',
    color: 'var(--color-chart-3)',
    data: generateTimeSeriesData(10, 12, 14).map(d => ({...d, value: parseFloat(d.value.toFixed(1))})),
  },
  {
    name: 'Engine Load',
    unit: '%',
    color: 'var(--color-chart-4)',
    data: generateTimeSeriesData(10, 20, 90),
  }
];

export const mockDashboardStats: CountData[] = [
    { name: 'Bus Load Avg', value: Math.floor(Math.random() * 30) + 40, unit: '%', fill: 'var(--color-chart-1)' },
    { name: 'Active Nodes', value: Math.floor(Math.random() * 5) + 8, unit: 'ECUs', fill: 'var(--color-chart-2)' },
    { name: 'Error Rate', value: Math.floor(Math.random() * 5), unit: '%', fill: 'var(--color-chart-4)' },
    { name: 'Network Health', value: 100 - (Math.floor(Math.random() * 5)), unit: '%', fill: 'var(--color-chart-3)' },
];


export const mockLearningModules: LearningModule[] = [
  {
    id: 'can-intro',
    title: 'Introduction to CAN Bus',
    type: 'explanation',
    content: `
      <h3 class="font-headline text-xl mb-2 text-accent">What is CAN?</h3>
      <p class="mb-4">Controller Area Network (CAN) is a robust vehicle bus standard designed to allow microcontrollers and devices to communicate with each other's applications without a host computer. It is a message-based protocol, not address-based.</p>
      <h3 class="font-headline text-xl mb-2 text-accent">Key Features</h3>
      <ul class="list-disc pl-5 mb-4">
        <li>Message-based protocol, designed originally for multiplex electrical wiring within automobiles to save on copper, but is also used in many other contexts.</li>
        <li>Prioritization of messages using identifiers (lower ID means higher priority).</li>
        <li>Robust error detection (CRC, ACK, Form Error, Bit Error, Stuff Error) and fault confinement mechanisms.</li>
        <li>Multi-master capabilities, any node can transmit if the bus is free.</li>
        <li>Differential signaling for noise immunity.</li>
      </ul>
    `
  },
  {
    id: 'can-frame',
    title: 'CAN Frame Structure (Standard)',
    type: 'explanation',
    content: `
      <h3 class="font-headline text-xl mb-2 text-accent">Standard CAN Frame (11-bit ID)</h3>
      <p class="mb-4">A standard CAN frame consists of several fields:</p>
      <ul class="list-disc pl-5 mb-4 font-code">
        <li><strong>SOF (Start of Frame):</strong> 1 dominant bit. Marks the beginning of a message and allows synchronization.</li>
        <li><strong>Identifier (ID):</strong> 11 bits. Determines message priority; lower values have higher priority.</li>
        <li><strong>RTR (Remote Transmission Request):</strong> 1 bit. Dominant (0) for data frames, recessive (1) for remote frames (requesting data).</li>
        <li><strong>IDE (Identifier Extension):</strong> 1 bit. Dominant (0) for standard CAN (11-bit ID). Recessive (1) for extended CAN (29-bit ID).</li>
        <li><strong>r0 (Reserved Bit):</strong> 1 bit. Reserved, typically dominant (0).</li>
        <li><strong>DLC (Data Length Code):</strong> 4 bits. Number of data bytes (0-8). Values >8 are not standard for classical CAN.</li>
        <li><strong>Data Field:</strong> 0-8 bytes. The actual payload of the message.</li>
        <li><strong>CRC (Cyclic Redundancy Check):</strong> 15 bits for calculation + 1 recessive delimiter bit (CRC Delimiter). Used for error detection.</li>
        <li><strong>ACK (Acknowledge):</strong> 1 slot bit + 1 recessive delimiter bit (ACK Delimiter). Transmitter sends recessive, any receiving node can assert dominant if the frame was received correctly up to the CRC delimiter.</li>
        <li><strong>EOF (End of Frame):</strong> 7 recessive bits. Marks the end of the message.</li>
        <li><strong>IFS (Inter-Frame Space):</strong> Minimum of 3 recessive bits. Separates consecutive frames.</li>
      </ul>
      <p>Extended CAN frames use a 29-bit identifier, with an SRR (Substitute Remote Request) bit and a different IDE bit usage.</p>
    `
  },
   {
    id: 'lin-intro',
    title: 'Introduction to LIN Bus',
    type: 'explanation',
    content: `
      <h3 class="font-headline text-xl mb-2 text-accent">What is LIN?</h3>
      <p class="mb-4">Local Interconnect Network (LIN) is a serial network protocol used for communication between components in vehicles. It is a simpler, slower (up to 19.2 kbit/s, commonly 9.6 or 19.2), and cheaper alternative to CAN, typically used for less critical functions like sensor data (e.g., rain sensor, light sensor) or actuator control (e.g., window lifts, mirror adjustment) in comfort electronics.</p>
      <h3 class="font-headline text-xl mb-2 text-accent">Key Features</h3>
      <ul class="list-disc pl-5 mb-4">
        <li>Single master, multiple slaves (up to 15 slaves, plus the master).</li>
        <li>Low cost due to single-wire implementation (+ ground and power) and UART/SCI-based communication (common in microcontrollers).</li>
        <li>Deterministic signal transmission scheduled by the master.</li>
        <li>Self-synchronization without a crystal in slave nodes (slaves synchronize on the master's break field).</li>
        <li>Checksum for data integrity.</li>
      </ul>
       <h3 class="font-headline text-xl mb-2 text-accent">LIN Frame Structure</h3>
      <p class="mb-4">A LIN frame consists of a Header (sent by Master) and a Response (sent by a designated Slave or the Master itself):</p>
      <ul class="list-disc pl-5 mb-4 font-code">
        <li><strong>Header:</strong>
            <ul class="list-disc pl-5">
                <li><strong>Break Field:</strong> At least 13 dominant bits followed by a recessive delimiter. Signals start of frame.</li>
                <li><strong>Sync Byte:</strong> Fixed value 0x55. Allows slaves to measure bit time and synchronize.</li>
                <li><strong>Protected ID (PID):</strong> 6-bit identifier + 2 parity bits. Identifies the message content.</li>
            </ul>
        </li>
        <li><strong>Response:</strong>
             <ul class="list-disc pl-5">
                <li><strong>Data Bytes:</strong> 1 to 8 bytes of data.</li>
                <li><strong>Checksum:</strong> 1 byte. Calculated over data bytes (classic checksum) or data bytes + PID (enhanced checksum).</li>
            </ul>
        </li>
      </ul>
    `
  },
];

export const mockQuizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What is the maximum number of data bytes in a standard CAN data frame?',
    options: ['4 bytes', '8 bytes', '16 bytes', '64 bytes'],
    correctAnswer: '8 bytes',
    explanation: 'A standard CAN frame (and extended CAN frame) can carry up to 8 bytes of data in its data field, as indicated by the DLC (Data Length Code).'
  },
  {
    id: 'q2',
    question: 'In a LIN network, which node initiates all communication frames by sending a header?',
    options: ['Any slave node', 'The master node', 'The node with highest priority ID', 'All nodes simultaneously'],
    correctAnswer: 'The master node',
    explanation: 'LIN is a master-slave protocol. The master node controls the bus and initiates all communication by sending a frame header.'
  },
  {
    id: 'q3',
    question: 'Consider the CAN frame data: ID=0x100, DLC=3, Data=01 02 03. Which field specifically indicates there are 3 bytes of data?',
    frameData: 'SOF-ID(0x100)-RTR-IDE-r0-DLC(3)-DATA(010203)-CRC-ACK-EOF',
    options: ['Identifier (ID)', 'Data Length Code (DLC)', 'Start of Frame (SOF)', 'Cyclic Redundancy Check (CRC)'],
    correctAnswer: 'Data Length Code (DLC)',
    explanation: 'The Data Length Code (DLC) field is a 4-bit field that specifies the number of bytes in the Data Field. A DLC value of 3 means 3 data bytes.'
  },
  {
    id: 'q4',
    question: 'What is the purpose of the Sync Byte (0x55) in a LIN frame header?',
    options: ['To carry actual data', 'To indicate message priority', 'To allow slave nodes to synchronize their baud rate with the master', 'To request data from a slave node'],
    correctAnswer: 'To allow slave nodes to synchronize their baud rate with the master',
    explanation: 'The Sync Byte in LIN, which is always 0x55, provides a known pattern of rising and falling edges that slave nodes use to measure the bit time and adjust their internal clocks for synchronization.'
  },
];

// Helper to get a new message for real-time simulation
let messageCounter = 0;
const ecuSenders = ['Engine ECU', 'Brake ECU', 'Dashboard', 'Infotainment', 'Gateway', 'Climate Control', 'ADAS Module', 'Steering Sensor'];
const canIds = ['0x1A0', '0x2B1', '0x3C2', '0x4D3', '0x5E4', '0x18DAF110', '0x7DF', '0x0F6', '0x123', '0x6A0'];
const linIds = ['0x10', '0x2A', '0x3F', '0x0C', '0x1B', '0x33'];

export function generateMockBusMessage(): BusMessage {
  messageCounter++;
  const type = Math.random() > 0.3 ? 'CAN' : 'LIN';
  const dlc = type === 'CAN' ? Math.floor(Math.random() * 8) + 1 : Math.floor(Math.random() * 8) + 1;
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
