# **App Name**: NetSpector

## Core Features:

- Real-time Bus Monitor: Display a real-time bus monitor, showing a visual timeline of all messages, filterable by ID, data content, or sender, with toggle between CAN and LIN logs.
- Simulated Node Dashboard: Provide a simulated node dashboard where users can create and simulate ECU nodes (e.g., Engine ECU, Brake ECU, Sensor Node), each sending predefined message types with simulated LIN master/slave timing.
- Fault Injection Engine: Implement a fault injection engine for manually injecting bit errors, bus-off conditions, recessive-dominant flips, and timeout scenarios to observe node behavior under stress.
- Graphical Data Visualization: Offer graphical data visualization with charts for speed, temperature, battery voltage, etc., sourced from CAN payload, including trend analysis.
- Protocol Learning Mode: Provide a protocol learning mode with step-by-step explanations of CAN/LIN frame structure, pause and inspect frame functionality, and a quiz mode for identifying errors in frames.
- Export & Logging: Enable exporting logs in industry-standard formats (.log, .blf, .asc) and real-time packet capture, simulating Wireshark functionality for CAN/LIN.
- AI-based Anomaly Detection: Employ an AI anomaly detection tool to identify and flag unusual patterns or anomalies in the CAN/LIN bus traffic in real-time.

## Style Guidelines:

- Primary color: Electric blue (#7DF9FF) for a techy, energetic feel.
- Background color: Dark grayish-blue (#282A3A) to provide a high contrast for data visualization and easy readability.
- Accent color: Neon purple (#BC13FE) to highlight actionable items and interactive elements.
- Body and headline font: 'Space Grotesk' sans-serif for a computerized, techy, scientific feel.
- Code font: 'Source Code Pro' monospaced font for displaying logs and code snippets.
- Use simplified, geometric icons to represent various functions and data points within the application.
- Subtle, non-distracting animations for real-time data updates and interactive elements to enhance user engagement.