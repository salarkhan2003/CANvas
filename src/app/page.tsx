
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, BarChart2, BrainCircuit, Cpu, HardDriveDownload, LayoutDashboard, Wrench, FileJson, Puzzle, Zap, SearchCode, Settings2, Palette, Columns, Car, Atom, Mic } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function DashboardPage() {
  const features = [
    { name: 'Bus Monitor', href: '/bus-monitor', icon: Activity, description: 'Real-time CAN/LIN message tracking.' },
    { name: 'Node Simulator', href: '/node-simulator', icon: Cpu, description: 'Simulate ECUs and network behavior.' },
    { name: 'Fault Injection', href: '/fault-injection', icon: Wrench, description: 'Inject errors and test system resilience.' },
    { name: 'Data Visualization', href: '/data-visualization', icon: BarChart2, description: 'Graphical representation of bus data.' },
    { name: 'AI Anomaly Detection', href: '/ai-anomaly-detection', icon: BrainCircuit, description: 'Identify unusual patterns with AI.' },
    { name: 'Protocol Learning', href: '/protocol-learning', icon: Puzzle, description: 'Understand CAN/LIN frame structures.' },
    { name: 'DBC File Support', href: '#', icon: FileJson, description: 'Parse DBC files for signal decoding. (Planned)', disabled: true },
    { name: 'Vehicle Simulator', href: '#', icon: Car, description: 'Simulate vehicle sensor data. (Planned)', disabled: true },
    { name: 'Automated Testing', href: '#', icon: Zap, description: 'Define and run test scenarios. (Planned)', disabled: true },
    { name: 'Export Logs', href: '#', icon: HardDriveDownload, description: 'Save captured data to various formats. (Planned)', disabled: true },
    { name: 'Advanced Diagnostics', href: '#', icon: SearchCode, description: 'Tools for UDS, OBD-II simulation. (Planned)', disabled: true },
    { name: 'UI Customization', href: '#', icon: Palette, description: 'Themes and multi-bus views. (Planned)', disabled: true },
    { name: 'AI Decoder Assistant', href: '#', icon: Atom, description: 'AI to help decode unknown signals. (Planned)', disabled: true },
    { name: 'Voice Control', href: '#', icon: Mic, description: 'Control simulations with voice commands. (Planned)', disabled: true },
  ];

  return (
    <div className="container mx-auto py-2">
      <PageHeader
        title="Welcome to CANvas"
        icon={LayoutDashboard}
        description="Your comprehensive studio for automotive network simulation, analysis, and development. Dive into CAN/LIN, visualize data, inject faults, and leverage AI."
      />

      <section className="mb-12">
        <Card className="shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-8 flex flex-col justify-center">
              <h2 className="font-headline text-3xl font-bold text-accent mb-4">Simulate. Analyze. Innovate.</h2>
              <p className="text-lg text-muted-foreground mb-6">
                CANvas empowers engineers, educators, and hobbyists to master automotive networks.
                Explore real-time traffic, model complex ECU interactions, test robustness with fault injection,
                and utilize AI for intelligent diagnostics and future-forward development.
              </p>
              <div className="flex gap-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href="/bus-monitor">Start Monitoring</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10">
                  <Link href="/protocol-learning">Learn Protocols</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 relative min-h-[250px] md:min-h-0">
               <Image 
                src="https://placehold.co/800x600/282A3A/7DF9FF.png?text=CANvas+Network+Diagram" 
                alt="CANvas Network Visualization" 
                layout="fill"
                objectFit="cover"
                data-ai-hint="network abstract"
              />
            </div>
          </div>
        </Card>
      </section>

      <section>
        <h2 className="font-headline text-2xl font-semibold mb-6 text-center">Core & Planned Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card key={feature.name} className="hover:shadow-accent/20 hover:shadow-md transition-shadow duration-300 flex flex-col">
              <CardHeader className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <feature.icon className="h-8 w-8 text-accent" />
                  <CardTitle className="font-headline text-xl">{feature.name}</CardTitle>
                </div>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full" disabled={feature.disabled}>
                  <Link href={feature.href}>
                    {feature.disabled ? 'Coming Soon' : `Explore ${feature.name.split(' ')[0]}`}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
