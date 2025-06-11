
'use client';

import * as React from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, BarChart2, BrainCircuit, Cpu, LayoutDashboard, Wrench, FileJson, Puzzle, Zap, SearchCode, Settings2, Palette, Columns, Car, Atom, Mic, TestTubeDiagonal, Database, Download, SlidersHorizontal, Network, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent, ChartLegendContent } from '@/components/ui/chart';
import { mockDashboardStats } from '@/lib/mock-data';
import type { CountData } from '@/lib/types';


const initialDashboardChartConfig: ChartConfig = {
  value: { label: 'Value' },
  'Bus Load Avg': { label: 'Bus Load (%)', color: 'hsl(var(--chart-1))' },
  'Active Nodes': { label: 'Active ECUs', color: 'hsl(var(--chart-2))' },
  'Error Rate': { label: 'Error Rate (%)', color: 'hsl(var(--chart-4))' },
  'Network Health': { label: 'Health Score (%)', color: 'hsl(var(--chart-3))' },
};


export default function DashboardPage() {
  const [dashboardData, setDashboardData] = React.useState<CountData[]>(mockDashboardStats);

   React.useEffect(() => {
    const intervalId = setInterval(() => {
      setDashboardData(prevData => prevData.map(item => {
        let newValue = item.value;
        if (item.name === 'Bus Load Avg') newValue = Math.max(20, Math.min(90, item.value + (Math.random() * 10 - 5)));
        else if (item.name === 'Active Nodes') newValue = item.value + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0);
        else if (item.name === 'Error Rate') newValue = Math.max(0, Math.min(10, item.value + (Math.random() * 2 - 1)));
        else if (item.name === 'Network Health') newValue = 100 - (prevData.find(d => d.name === 'Error Rate')?.value || 0) + (Math.random()*4-2) ;
        
        newValue = Math.round(newValue);
        if (item.name === 'Active Nodes') newValue = Math.max(5, Math.min(20, newValue)); // Cap active nodes
        if (item.name === 'Network Health') newValue = Math.max(80, Math.min(100, newValue));


        return { ...item, value: parseFloat(newValue.toFixed(1)) };
      }));
    }, 2500); // Update every 2.5 seconds

    return () => clearInterval(intervalId);
  }, []);


  const features = [
    { name: 'Bus Monitor', href: '/bus-monitor', icon: Activity, description: 'Real-time CAN/LIN message tracking & filtering.' },
    { name: 'Node Simulator', href: '/node-simulator', icon: Cpu, description: 'Simulate ECUs and define network behavior patterns.' },
    { name: 'Fault Injection', href: '/fault-injection', icon: Wrench, description: 'Inject errors, test system resilience under stress.' },
    { name: 'Data Visualization', href: '/data-visualization', icon: BarChart2, description: 'Graphical representation of various bus data signals.' },
    { name: 'AI Anomaly Detection', href: '/ai-anomaly-detection', icon: BrainCircuit, description: 'Identify unusual patterns in traffic using AI.' },
    { name: 'Protocol Learning', href: '/protocol-learning', icon: Puzzle, description: 'Understand CAN/LIN frame structures with guides & quizzes.' },
    { name: 'DBC File Support', href: '/dbc-support', icon: FileJson, description: 'Upload DBC files for (mock) CAN signal decoding.' },
    { name: 'Vehicle Simulator', href: '/vehicle-simulator', icon: SlidersHorizontal, description: 'Simulate vehicle sensor data with interactive controls.' },
    { name: 'Automated Testing', href: '/automated-testing', icon: TestTubeDiagonal, description: 'Define and run mock test scenarios for network validation.' },
    { name: 'Advanced Diagnostics', href: '/advanced-diagnostics', icon: SearchCode, description: 'Simulate UDS and OBD-II diagnostic interactions.' },
    { name: 'AI Decoder Assistant', href: '/ai-decoder-assistant', icon: Atom, description: 'AI to help guess meanings of unknown CAN signals.' },
    { name: 'Voice Command Sim', href: '/voice-command-simulator', icon: Mic, description: 'Simulate bus control via text-based "voice" commands.' },
  ];

  const overviewCards = [
    { title: "Network Status", value: "Optimal", icon: Network, trend: "+2% today", color: "text-green-400" },
    { title: "Data Throughput", value: "1.2 Mbps", icon: TrendingUp, trend: "Avg", color: "text-blue-400" },
    { title: "Critical Alerts", value: "0 Active", icon: AlertTriangle, trend: "Stable", color: "text-yellow-400" },
  ];


  return (
    <div className="container mx-auto py-2 px-4 md:px-6 lg:px-8">
      <PageHeader
        title="Welcome to CANvas"
        icon={LayoutDashboard}
        description="Your advanced studio for automotive network simulation, analysis, and development. Explore CAN/LIN, visualize data, inject faults, and leverage AI."
      />

      <section className="mb-12">
        <Card className="shadow-xl border-accent/30 overflow-hidden bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="font-headline text-2xl md:text-3xl text-accent flex items-center">
              <Network className="h-8 w-8 mr-3 text-primary" /> System Overview & Quick Actions
            </CardTitle>
             <CardDescription>Real-time mock network statistics and primary feature access.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <ChartContainer config={initialDashboardChartConfig} className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.5)" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" angle={-20} textAnchor="end" height={50} interval={0} tick={{fontSize: '0.75rem'}}/>
                    <YAxis stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                    <Tooltip
                        content={<ChartTooltipContent indicator="dot" nameKey="name" />}
                        cursor={{ fill: "hsl(var(--accent)/0.2)" }}
                    />
                    <Legend content={<ChartLegendContent />} wrapperStyle={{paddingTop: '10px'}}/>
                    <Bar dataKey="value" nameKey="name" radius={[4, 4, 0, 0]} >
                       {dashboardData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="md:col-span-1 flex flex-col justify-center gap-4">
                 {overviewCards.map(card => (
                    <Card key={card.title} className="bg-card/50 hover:bg-card/70 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-primary">{card.title}</CardTitle>
                            <card.icon className={`h-5 w-5 ${card.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{card.value}</div>
                            <p className="text-xs text-muted-foreground">{card.trend}</p>
                        </CardContent>
                    </Card>
                 ))}
                 <Button asChild size="lg" className="w-full mt-2 bg-primary hover:bg-primary/80 text-primary-foreground">
                    <Link href="/bus-monitor">Launch Bus Monitor</Link>
                 </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="font-headline text-2xl font-semibold mb-6 text-center text-primary">Core Features & Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {features.map((feature) => (
            <Card key={feature.name} className={`bg-card/70 hover:shadow-primary/20 hover:border-primary/50 border-border hover:shadow-lg transition-all duration-300 flex flex-col ${feature.disabled ? 'opacity-60' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-2">
                  <feature.icon className="h-7 w-7 text-accent" />
                  <CardTitle className="font-headline text-lg leading-tight">{feature.name}</CardTitle>
                </div>
                <CardDescription className="text-xs line-clamp-2">{feature.description}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto pt-3">
                <Button asChild variant="outline" size="sm" className="w-full border-primary/50 text-primary hover:bg-primary/10 hover:text-primary hover:border-primary" disabled={feature.disabled}>
                  <Link href={feature.href}>
                    {feature.disabled ? 'Planned' : `Explore`}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
