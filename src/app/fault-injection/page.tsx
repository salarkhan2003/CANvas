
'use client';

import * as React from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Wrench, AlertTriangle, Zap, Clock, RotateCcw, BarChartHorizontalBig } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { FaultType, CountData } from '@/lib/types';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, CartesianGrid } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const FAULT_TYPE_DETAILS: Record<FaultType, { icon: React.ElementType, label: string, color: string }> = {
  'bit_error': { icon: Zap, label: 'Bit Error', color: 'hsl(var(--chart-1))' },
  'bus_off': { icon: AlertTriangle, label: 'Bus-Off', color: 'hsl(var(--chart-2))' },
  'recessive_dominant_flip': { icon: RotateCcw, label: 'R/D Flip', color: 'hsl(var(--chart-3))' },
  'timeout': { icon: Clock, label: 'Timeout', color: 'hsl(var(--chart-4))' },
};

interface FaultConfig {
  faultType: FaultType | '';
  targetMessageId?: string;
  targetNode?: string;
  bitPosition?: number;
  timeoutDuration?: number;
}

const initialFaultCounts: Record<FaultType, number> = {
  bit_error: 0,
  bus_off: 0,
  recessive_dominant_flip: 0,
  timeout: 0,
};

const initialChartConfig: ChartConfig = Object.fromEntries(
  Object.entries(FAULT_TYPE_DETAILS).map(([key, val]) => [key, { label: val.label, color: val.color }])
);
initialChartConfig['count'] = { label: 'Fault Count' };


export default function FaultInjectionPage() {
  const [faultConfig, setFaultConfig] = React.useState<FaultConfig>({ faultType: '' });
  const [injectionLog, setInjectionLog] = React.useState<string[]>([]);
  const [faultCounts, setFaultCounts] = React.useState<Record<FaultType, number>>(initialFaultCounts);
  const { toast } = useToast();

  const faultCountChartData = React.useMemo<CountData[]>(() => {
    return (Object.keys(faultCounts) as FaultType[])
      .map(key => ({
        name: FAULT_TYPE_DETAILS[key].label,
        value: faultCounts[key],
        fill: FAULT_TYPE_DETAILS[key].color,
      }))
      .filter(item => item.value > 0) // Optionally, only show faults that have occurred
      .sort((a, b) => b.value - a.value);
  }, [faultCounts]);

  const handleInjectFault = () => {
    if (!faultConfig.faultType) {
      toast({ title: "Error", description: "Please select a fault type.", variant: "destructive" });
      return;
    }
    const faultType = faultConfig.faultType;
    const logMessage = `[${new Date().toLocaleTimeString()}] Injected fault: ${FAULT_TYPE_DETAILS[faultType].label}
    Target ID: ${faultConfig.targetMessageId || 'Any'}
    Target Node: ${faultConfig.targetNode || 'Any'}
    ${faultConfig.faultType === 'bit_error' ? `Bit Position: ${faultConfig.bitPosition || 'N/A'}` : ''}
    ${faultConfig.faultType === 'timeout' ? `Duration: ${faultConfig.timeoutDuration || 'N/A'}ms` : ''}`;
    
    setInjectionLog(prev => [logMessage, ...prev].slice(0, 20));
    setFaultCounts(prev => ({ ...prev, [faultType]: (prev[faultType] || 0) + 1 }));
    toast({ title: "Fault Injected!", description: `Successfully simulated ${FAULT_TYPE_DETAILS[faultType].label}.`});
  };

  const handleSelectChange = (name: keyof FaultConfig, value: string) => {
    setFaultConfig(prev => ({ ...prev, [name]: value as FaultType }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFaultConfig(prev => ({ ...prev, [name]: name === 'bitPosition' || name === 'timeoutDuration' ? parseInt(value) : value }));
  };

  return (
    <div>
      <PageHeader
        title="Fault Injection Engine"
        icon={Wrench}
        description="Manually inject faults into the virtual bus to observe system behavior under stress."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-headline">Configure Fault</CardTitle>
            <CardDescription>Select the type of fault and its parameters.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="faultType">Fault Type</Label>
              <Select value={faultConfig.faultType} onValueChange={(value) => handleSelectChange('faultType', value)}>
                <SelectTrigger id="faultType">
                  <SelectValue placeholder="Select fault type" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(FAULT_TYPE_DETAILS) as FaultType[]).map(ft => {
                    const Icon = FAULT_TYPE_DETAILS[ft].icon;
                    return (
                      <SelectItem key={ft} value={ft}>
                        <Icon className={`inline-block mr-2 h-4 w-4 text-[${FAULT_TYPE_DETAILS[ft].color}]`} />
                        {FAULT_TYPE_DETAILS[ft].label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="targetMessageId">Target Message ID (Optional)</Label>
              <Input 
                id="targetMessageId" 
                name="targetMessageId"
                placeholder="e.g., 0x1A0 or leave blank for any" 
                value={faultConfig.targetMessageId || ''}
                onChange={handleInputChange}
                className="font-code"
              />
            </div>

            <div>
              <Label htmlFor="targetNode">Target Node (Optional)</Label>
              <Input 
                id="targetNode" 
                name="targetNode"
                placeholder="e.g., EngineECU or leave blank for any" 
                value={faultConfig.targetNode || ''}
                onChange={handleInputChange}
              />
            </div>

            {faultConfig.faultType === 'bit_error' && (
              <div>
                <Label htmlFor="bitPosition">Bit Position (0-63 for 8 bytes)</Label>
                <Input 
                  id="bitPosition" 
                  name="bitPosition"
                  type="number" 
                  placeholder="e.g., 5" 
                  value={faultConfig.bitPosition || ''}
                  onChange={handleInputChange}
                />
              </div>
            )}

            {faultConfig.faultType === 'timeout' && (
              <div>
                <Label htmlFor="timeoutDuration">Timeout Duration (ms)</Label>
                <Input 
                  id="timeoutDuration" 
                  name="timeoutDuration"
                  type="number" 
                  placeholder="e.g., 100" 
                  value={faultConfig.timeoutDuration || ''}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleInjectFault} className="w-full" disabled={!faultConfig.faultType}>
              <Zap className="mr-2 h-4 w-4" /> Inject Fault
            </Button>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Injection Log & Observations</CardTitle>
            <CardDescription>Real-time feedback and observed effects of injected faults. (Simulation)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div>
                    <h3 className="font-semibold mb-2 flex items-center"><BarChartHorizontalBig className="mr-2 h-5 w-5 text-accent"/>Fault Type Frequency</h3>
                    {faultCountChartData.length > 0 ? (
                        <ChartContainer config={initialChartConfig} className="h-[150px] w-full">
                             <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={faultCountChartData} layout="vertical" margin={{ left: 0, right: 10, top: 5, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                                    <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" width={70} className="text-xs truncate" />
                                    <Tooltip content={<ChartTooltipContent indicator="dot" />} cursor={{ fill: "hsl(var(--accent), 0.3)" }} />
                                    <Bar dataKey="value" name="Count" radius={[0, 4, 4, 0]} barSize={15}>
                                      {faultCountChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                      ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    ) : (
                        <p className="text-sm text-muted-foreground h-[150px] flex items-center justify-center">No faults injected yet to display stats.</p>
                    )}
                </div>
                <Textarea
                  readOnly
                  value={injectionLog.length > 0 ? injectionLog.join('\n-----------------\n') : "No faults injected yet. Configure and inject a fault to see logs here."}
                  className="h-80 xl:h-[calc(150px+2.5rem)] font-code text-sm bg-muted/30" // Adjusted height
                  placeholder="Fault injection logs will appear here..."
                />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              <strong>Note:</strong> This is a simulated environment. In a real system, injected faults could have significant impact.
              The Bus Monitor and Node Simulator pages might show the effects of these simulated faults.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
