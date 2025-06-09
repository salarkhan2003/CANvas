
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Activity, Cpu, Wrench, LineChart, BookOpen, BrainCircuit, Settings, FileJson, SlidersHorizontal, TestTubeDiagonal, Download, SearchCode, Atom, Mic } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  disabled?: boolean;
  external?: boolean;
  children?: NavItem[];
}

export const sidebarNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Bus Monitor',
    href: '/bus-monitor',
    icon: Activity,
  },
  {
    title: 'Node Simulator',
    href: '/node-simulator',
    icon: Cpu,
  },
  {
    title: 'Fault Injection',
    href: '/fault-injection',
    icon: Wrench,
  },
  {
    title: 'Data Visualization',
    href: '/data-visualization',
    icon: LineChart,
  },
  {
    title: 'Protocol Learning',
    href: '/protocol-learning',
    icon: BookOpen,
  },
  {
    title: 'AI Anomaly Detection',
    href: '/ai-anomaly-detection',
    icon: BrainCircuit,
  },
  {
    title: 'DBC File Support',
    href: '/dbc-support',
    icon: FileJson,
  },
  {
    title: 'Vehicle Simulator',
    href: '/vehicle-simulator',
    icon: SlidersHorizontal,
  },
  {
    title: 'Automated Testing',
    href: '/automated-testing',
    icon: TestTubeDiagonal,
  },
  // Export Logs is part of Bus Monitor
  {
    title: 'Advanced Diagnostics',
    href: '/advanced-diagnostics',
    icon: SearchCode,
  },
  {
    title: 'AI Decoder Assistant',
    href: '/ai-decoder-assistant',
    icon: Atom,
  },
  {
    title: 'Voice Command Sim',
    href: '/voice-command-simulator',
    icon: Mic,
  },
];
