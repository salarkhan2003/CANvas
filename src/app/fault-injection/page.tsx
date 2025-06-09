'use client';

import * as React from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Wrench, AlertTriangle, Zap, Clock, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type FaultType = 'bit_error' | 'bus_off' | 'recessive_dominant_flip' | 'timeout';

interface FaultConfig {
  faultType: FaultType | '';
  targetMessageId?: string;
  targetNode?: string;
  bitPosition?: number; // For bit error
  timeoutDuration?: number; // For timeout
}

export default function FaultInjectionPage() {
  const [faultConfig, setFaultConfig] = React.useState<FaultConfig>({ faultType: '' });
  const [injectionLog, setInjectionLog] = React.useState<string[]>([]);
  const { toast } = useToast();

  const handleInjectFault = () => {
    if (!faultConfig.faultType) {
      toast({ title: "Error", description: "Please select a fault type.", variant: "destructive" });
      return;
    }
    const logMessage = `[${new Date().toLocaleTimeString()}] Injected fault: ${faultConfig.faultType}
    Target ID: ${faultConfig.targetMessageId || 'Any'}
    Target Node: ${faultConfig.targetNode || 'Any'}
    ${faultConfig.faultType === 'bit_error' ? `Bit Position: ${faultConfig.bitPosition || 'N/A'}` : ''}
    ${faultConfig.faultType === 'timeout' ? `Duration: ${faultConfig.timeoutDuration || 'N/A'}ms` : ''}`;
    
    setInjectionLog(prev => [logMessage, ...prev].slice(0, 20)); // Keep last 20 logs
    toast({ title: "Fault Injected!", description: `Successfully simulated ${faultConfig.faultType}.`});
    // Actual fault injection logic would go here
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
                  <SelectItem value="bit_error"><Zap className="inline-block mr-2 h-4 w-4 text-yellow-400" />Bit Error</SelectItem>
                  <SelectItem value="bus_off"><AlertTriangle className="inline-block mr-2 h-4 w-4 text-red-400" />Bus-Off Condition</SelectItem>
                  <SelectItem value="recessive_dominant_flip"><RotateCcw className="inline-block mr-2 h-4 w-4 text-blue-400" />Recessive/Dominant Flip</SelectItem>
                  <SelectItem value="timeout"><Clock className="inline-block mr-2 h-4 w-4 text-orange-400" />Timeout Scenario</SelectItem>
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
            <Button onClick={handleInjectFault} className="w-full">
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
            <Textarea
              readOnly
              value={injectionLog.length > 0 ? injectionLog.join('\n-----------------\n') : "No faults injected yet. Configure and inject a fault to see logs here."}
              className="h-80 font-code text-sm bg-muted/30"
              placeholder="Fault injection logs will appear here..."
            />
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