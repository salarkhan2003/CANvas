
# CANvas - Advanced Automotive Network Studio

CANvas is a Next.js-based web application designed for comprehensive CAN/LIN bus simulation, real-time monitoring, data visualization, fault injection, and AI-powered analysis. It aims to be a versatile tool for engineers, developers, educators, and automotive enthusiasts.

## Current Core Features (Implemented or In Progress)

*   **Real-time Bus Monitor**: Display a visual timeline of all messages, filterable by ID, data content, or sender, with a toggle between CAN and LIN logs.
*   **Simulated Node Dashboard**: Create and simulate ECU nodes (e.g., Engine ECU, Brake ECU, Sensor Node), each sending predefined message types with simulated timing.
*   **Fault Injection Engine**: Manually inject bit errors, bus-off conditions (simulated), recessive-dominant flips (simulated), and timeout scenarios to observe node behavior under stress.
*   **Graphical Data Visualization**: Offer graphical charts for speed, temperature, battery voltage, etc., sourced from simulated CAN payload, including trend analysis.
*   **Protocol Learning Mode**: Provide step-by-step explanations of CAN/LIN frame structure, pause and inspect frame functionality, and a quiz mode.
*   **AI-based Anomaly Detection**: Employ Genkit AI to identify and flag unusual patterns or anomalies in CAN/LIN bus traffic in real-time.
*   **Export & Logging**: Basic framework for exporting logs (CSV, JSON planned).

## Vision: Future & Planned Features

CANvas aims to evolve into a comprehensive suite. The following outlines the broader vision:

### 🧠 Core Simulation & Monitoring Enhancements
*   **Advanced Virtual Node Emulation**: More sophisticated ECU behavior simulation.
*   **Automated Message Injection**: Scripted or scenario-based message sequences.
*   **Timestamped Message Logging**: High-precision logging with extensive filtering.
*   **Multi-Protocol Support (Conceptual)**: Framework to eventually incorporate data from CAN FD, FlexRay, and potentially I2C/SPI.
*   **Live Bus Monitoring & Visualization**:
    *   Real-time plotting of decoded data fields.
    *   **DBC File Parsing & Signal Decoding**: Upload and use DBC files to interpret raw CAN data into meaningful signals.
    *   Bit-level and byte-level display modes for granular analysis.
*   **Custom Node Script Engine (Conceptual for Web)**: Explore light, client-side scripting for node behavior if feasible, or integration with a backend for more complex scripting (e.g., Python-based).

### 🛠️ Engineering Tools
*   **Advanced Fault Injection System**:
    *   Simulate dropping, delaying, duplicating, and corrupting messages.
    *   Emulate bus-off states, short-circuits (conceptual), and CRC failures.
*   **Virtual Oscilloscope/Logic Analyzer (Simulated)**:
    *   Graph signal changes over time, visualizing transitions.
    *   Trigger-based capture for simulated data.
*   **Automated Test Suite**:
    *   Define test scenarios to validate network behaviors.
    *   Generate pass/fail reports based on simulations.

### 🔧 Developer/Diagnostics Tools
*   **Reverse Engineering Mode (Conceptual for Web)**:
    *   Tools for analyzing captured traffic to identify patterns and potential signal meanings.
*   **Live Scripting Console (Conceptual for Web)**:
    *   Potentially a JavaScript-based console for interacting with the simulation.
*   **Enhanced Error Frame & Anomaly Detection**:
    *   Highlight ID flooding, unusual DLCs, and frequent CRC errors (extending AI capabilities).

### 🌐 Integration & Extensibility
*   **UDP/TCP Bridge Support (Conceptual)**: Explore possibilities for connecting to external tools or simple network bridges.
*   **MQTT/ROS 2 Bridge (Conceptual)**: Future consideration for broader system integration.
*   **Enhanced Database Logger / Export**:
    *   Save logs to common formats (CSV, JSON, potentially others).
    *   Advanced filtering for export.

### 💻 UI & UX Goodies
*   **Drag-and-drop Node Setup**: For more intuitive configuration on the Node Simulator page.
*   **Tabbed Views**: Continue to use for organizing complex interfaces.
*   **Dashboard Themes**: Potential for customizable themes beyond dark mode.
*   **Multi-Bus View**: UI to manage and visualize multiple independent simulated buses.

### 🚗 Automotive-Specific Add-ons (Simulated)
*   **OBD-II Toolset**:
    *   Simulate sending/receiving OBD PIDs.
    *   Mock display of freeze frames, DTCs.
*   **UDS Tester**:
    *   GUI to simulate Unified Diagnostic Services (e.g., 0x10, 0x22) interactions.
*   **Vehicle Simulator Plugin**:
    *   Interactive sliders/knobs to simulate sensor data (speed, RPM, steering angle) feeding into the bus.

### 🧪 Experimental / AI Features
*   **AI CAN Decoder Assistant**:
    *   Use machine learning (Genkit) to help cluster messages or guess signal meanings from raw data.
*   **Voice Assistant for Bus Control (Inspired by Serena AI)**:
    *   Explore NLU (Genkit) for commands like "Start sending brake signal" or "Inject error at ID 0x200".

## Getting Started

This is a NextJS starter in Firebase Studio.
To get started, take a look at `src/app/page.tsx`.
The application uses NextJS, React, ShadCN UI, Tailwind CSS, and Genkit for AI features.

## Development

To run the development server:
\`\`\`bash
npm run dev
\`\`\`

If using AI features with Genkit locally, you might also need:
\`\`\`bash
npm run genkit:watch
\`\`\`
