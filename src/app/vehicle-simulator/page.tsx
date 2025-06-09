
'use client';

import * as React from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { SlidersHorizontal, Gauge, Thermometer, BatteryCharging, Play, StopCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface SimulatedMessage {
  id: string;
  timestamp: string;
  messageId: string;
  data: string[];
}

export default function VehicleSimulatorPage() {
  const [speed, setSpeed] = React.useState(60);
  const [rpm, setRpm] = React.useState(2000);
  const [temp, setTemp] = React.useState(90);
  const [voltage, setVoltage] = React.useState(12.5);
  const [generatedMessages, setGeneratedMessages] = React.useState<SimulatedMessage[]>([]);
  const [isSimulating, setIsSimulating] = React.useState(false);
  const { toast } = useToast();

  const generateMockMessages = React.useCallback(() => {
    const newMessages: SimulatedMessage[] = [];
    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 });

    // Speed message (mock)
    const speedHex = Math.round(speed / 0.01).toString(16).padStart(4, '0').toUpperCase();
    newMessages.push({ id: `msg-speed-${Date.now()}${Math.random()}`, timestamp: ts, messageId: '0x1A0', data: [speedHex.slice(0,2), speedHex.slice(2,4), 'S0', 'S1'] });

    // RPM message (mock)
    const rpmHex = Math.round(rpm / 0.25).toString(16).padStart(4, '0').toUpperCase();
    newMessages.push({ id: `msg-rpm-${Date.now()}${Math.random()}`, timestamp: ts, messageId: '0x1A1', data: [rpmHex.slice(0,2), rpmHex.slice(2,4), 'R0', 'R1'] });
    
    // Temperature message (mock)
    const tempHex = Math.round(temp + 40).toString(16).padStart(2, '0').toUpperCase();
    newMessages.push({ id: `msg-temp-${Date.now()}${Math.random()}`, timestamp: ts, messageId: '0x1B0', data: [tempHex, 'T0', 'T1', 'T2'] });

    // Voltage message (mock)
    const voltageHex = Math.round(voltage * 100).toString(16).padStart(4, '0').toUpperCase(); // Assuming 0.01V precision
    newMessages.push({ id: `msg-voltage-${Date.now()}${Math.random()}`, timestamp: ts, messageId: '0x1C0', data: [voltageHex.slice(0,2), voltageHex.slice(2,4), 'V0', 'V1'] });
    
    setGeneratedMessages(prev => [...newMessages, ...prev].slice(0, 50)); // Keep last 50
  }, [speed, rpm, temp, voltage]);

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    if (isSimulating) {
      generateMockMessages(); // Generate once immediately when started
      intervalId = setInterval(generateMockMessages, 1000); // Generate messages every second
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isSimulating, generateMockMessages]);

  const handleToggleSimulation = () => {
    setIsSimulating(prev => {
      const newSimulatingState = !prev;
      if (newSimulatingState) {
        toast({ title: 'Simulation Started', description: 'Generating mock CAN messages.' });
      } else {
        toast({ title: 'Simulation Stopped', description: 'Mock CAN message generation paused.' });
      }
      return newSimulatingState;
    });
  };

  return (
    <div>
      <PageHeader
        title="Vehicle Simulator"
        icon={SlidersHorizontal}
        description="Interactively simulate vehicle sensor data and observe generated CAN messages (mocked)."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Sensor Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="speed-slider" className="flex items-center"><Gauge className="mr-2 h-4 w-4 text-accent"/>Speed</Label>
                <span className="font-code text-sm">{speed} km/h</span>
              </div>
              <Slider id="speed-slider" defaultValue={[speed]} max={220} step={1} onValueChange={(value) => setSpeed(value[0])} disabled={isSimulating} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="rpm-slider" className="flex items-center"><Gauge className="mr-2 h-4 w-4 text-accent"/>Engine RPM</Label>
                <span className="font-code text-sm">{rpm} RPM</span>
              </div>
              <Slider id="rpm-slider" defaultValue={[rpm]} max={8000} step={50} onValueChange={(value) => setRpm(value[0])} disabled={isSimulating} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="temp-slider" className="flex items-center"><Thermometer className="mr-2 h-4 w-4 text-accent"/>Coolant Temperature</Label>
                <span className="font-code text-sm">{temp} °C</span>
              </div>
              <Slider id="temp-slider" defaultValue={[temp]} min={-20} max={130} step={1} onValueChange={(value) => setTemp(value[0])} disabled={isSimulating} />
            </div>
             <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="voltage-slider" className="flex items-center"><BatteryCharging className="mr-2 h-4 w-4 text-accent"/>Battery Voltage</Label>
                <span className="font-code text-sm">{voltage.toFixed(1)} V</span>
              </div>
              <Slider id="voltage-slider" defaultValue={[voltage]} min={9} max={16} step={0.1} onValueChange={(value) => setVoltage(value[0])} disabled={isSimulating} />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleToggleSimulation} className="w-full">
              {isSimulating ? <StopCircle className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Generated CAN Messages (Mock)</CardTitle>
            <CardDescription>
              {isSimulating ? "Live feed of simulated messages based on sensor inputs." : "Start simulation to see messages."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(16rem+52px)] rounded-md border p-2 bg-muted/30">
              {generatedMessages.length > 0 ? generatedMessages.map(msg => (
                <div key={msg.id} className="font-code text-xs p-1 border-b border-muted-foreground/20">
                  {msg.timestamp} ID: {msg.messageId} Data: {msg.data.join(' ')}
                </div>
              )) : <p className="text-sm text-muted-foreground p-2">{isSimulating ? "Generating first messages..." : "Simulation stopped. No messages to display."}</p>}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
