import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Activity, Cpu, Wrench, LineChart, BookOpen, BrainCircuit, Settings } from 'lucide-react';

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
  // Example of a group with children
  // {
  //   title: 'Settings',
  //   href: '/settings',
  //   icon: Settings,
  //   children: [
  //     { title: 'Profile', href: '/settings/profile', icon: User },
  //     { title: 'Appearance', href: '/settings/appearance', icon: SunMoon },
  //   ]
  // },
];