
# CANvas - Advanced Automotive Network Studio

CANvas is a Next.js-based web application designed for comprehensive CAN/LIN bus simulation, real-time monitoring, data visualization, fault injection, and AI-powered analysis. It aims to be a versatile tool for engineers, developers, educators, and automotive enthusiasts.

## 🧠 Core Features & Simulation Capabilities

*   **Real-time Bus Monitor**: Display a visual timeline of all messages, filterable by ID, data content, or sender, with a toggle between CAN and LIN logs.
*   **Simulated Node Dashboard**: Create and simulate ECU nodes (e.g., Engine ECU, Brake ECU, Sensor Node), each sending predefined message types with simulated timing.
*   **Fault Injection Engine**: Manually inject bit errors, bus-off conditions (simulated), recessive-dominant flips (simulated), and timeout scenarios to observe node behavior under stress.
*   **Graphical Data Visualization**: Offer graphical charts for speed, temperature, battery voltage, etc., sourced from simulated CAN payload, including trend analysis.
*   **Protocol Learning Mode**: Provide step-by-step explanations of CAN/LIN frame structure, pause and inspect frame functionality, and a quiz mode.
*   **AI-based Anomaly Detection**: Employ Genkit AI to identify and flag unusual patterns or anomalies in CAN/LIN bus traffic in real-time.
*   **DBC File Support**: Upload and parse DBC files to decode CAN signals (mock implementation).
*   **Vehicle Simulator**: Interactively simulate vehicle sensor data (speed, RPM, etc.) which can generate mock CAN messages.
*   **Timestamped Message Logging**: High-precision logging with extensive filtering (via Bus Monitor).
*   **Virtual Node Emulation**: Basic ECU behavior simulation via Node Simulator.
*   **Manual Message Injection**: Via future enhancements to Node Simulator or a dedicated tool.

## 🛠️ Engineering & Developer Tools

*   **Fault Injection System**: As described above, allowing simulation of common bus errors.
*   **Error Frame & Anomaly Detection**: Basic anomaly highlighting in AI tools; more advanced planned.
*   **Automated Test Suite**: Define and run mock test scenarios to validate network behaviors and generate pass/fail reports.
*   **Export & Logging**: Export filtered bus monitor logs to CSV and JSON.
*   **Advanced Diagnostics Tools**: Simulate OBD-II PID requests and UDS interactions (mock implementation).

## 🤖 AI & Experimental Features

*   **AI CAN Decoder Assistant**: Use AI (mocked) to help guess signal meanings from raw CAN data.
*   **Voice Command Simulator**: Simulate bus control via text-based "voice" commands.

## 🌐 Future Vision & Planned Enhancements (Beyond Current Scope)

While the current web application focuses on a subset of these, the broader vision for CANvas includes:

### Simulation & Monitoring Enhancements
*   **Advanced Virtual Node Emulation**: More sophisticated ECU behavior simulation.
*   **Automated Message Injection**: Scripted or scenario-based message sequences.
*   **Multi-Protocol Support (Conceptual)**: Framework to eventually incorporate data from CAN FD, FlexRay, and potentially I2C/SPI.
*   **Live Bus Monitoring & Visualization**:
    *   Bit-level and byte-level display modes for granular analysis.
*   **Custom Node Script Engine (Conceptual for Web/Backend)**: Explore light, client-side scripting or integration with a backend for more complex scripting (e.g., Python-based).

### Engineering Tools
*   **Advanced Fault Injection**: More granular control over dropping, delaying, duplicating messages.
*   **Virtual Oscilloscope/Logic Analyzer (Simulated)**:
    *   Graph signal changes over time, visualizing transitions.
    *   Trigger-based capture for simulated data.

### Developer/Diagnostics Tools
*   **Reverse Engineering Mode (Conceptual for Web)**:
    *   Tools for analyzing captured traffic to identify patterns.
*   **Live Scripting Console (Conceptual for Web/Backend)**:
    *   Potentially a JavaScript/Python-based console for interacting with the simulation.

### Integration & Extensibility
*   **UDP/TCP Bridge Support (Conceptual)**: Explore possibilities for connecting to external tools.
*   **MQTT/ROS 2 Bridge (Conceptual)**: Future consideration for broader system integration.
*   **Enhanced Database Logger**: Save logs to more formats or databases.

### UI & UX Goodies
*   **Drag-and-drop Node Setup**: For more intuitive configuration.
*   **Dashboard Themes**: Customizable themes beyond dark mode.
*   **Multi-Bus View**: UI to manage and visualize multiple independent simulated buses.

### Automotive-Specific Add-ons (Simulated - Deeper Implementation)
*   **Full OBD-II Toolset**: Simulate sending/receiving a wider range of OBD PIDs, freeze frames, DTCs.
*   **Full UDS Tester**: Comprehensive GUI for Unified Diagnostic Services.

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
