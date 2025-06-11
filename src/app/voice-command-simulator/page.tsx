
'use client';

import * as React from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Send, Terminal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function VoiceCommandSimulatorPage() {
  const [command, setCommand] = React.useState('');
  const [commandLog, setCommandLog] = React.useState<string[]>([]);
  const { toast } = useToast();

  const handleSendCommand = () => {
    if (!command.trim()) {
      toast({ title: 'No Command', description: 'Please enter a command.', variant: 'destructive' });
      return;
    }

    const timestamp = new Date().toLocaleTimeString();
    let response = `[${timestamp}] Command received: "${command}"`;

    // Mock command processing
    if (command.toLowerCase().includes('start sending brake signal')) {
      response += `\n  -> Simulating: Started sending mock brake signal (ID 0x2B1, Data: FF00FF00).`;
    } else if (command.toLowerCase().match(/inject error.*id 0x([0-9a-fA-F]+)/)) {
      const match = command.toLowerCase().match(/inject error.*id 0x([0-9a-fA-F]+)/);
      response += `\n  -> Simulating: Injected mock bit error into messages with ID 0x${match ? match[1] : 'UNKNOWN'}.`;
    } else if (command.toLowerCase().includes('set speed to')) {
        const speedMatch = command.toLowerCase().match(/set speed to (\d+)/);
        const speedValue = speedMatch ? speedMatch[1] : "N/A";
        response += `\n  -> Simulating: Vehicle speed set to ${speedValue} km/h via Vehicle Simulator.`;
    }
    else {
      response += `\n  -> Simulating: Command recognized, but no specific mock action defined.`;
    }
    
    setCommandLog(prev => [response, ...prev].slice(0, 10));
    setCommand('');
    toast({ title: 'Command Processed (Mock)', description: `Simulated action for: ${command}` });
  };

  return (
    <div>
      <PageHeader
        title="Voice Command Simulator"
        icon={Mic}
        description="Simulate controlling the bus or application features via text-based 'voice' commands (mocked)."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-headline">Enter Command</CardTitle>
          <CardDescription>
            Type a command as if you were speaking to a voice assistant.
            Examples: "Start sending brake signal", "Inject error at ID 0x200", "Set speed to 80".
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Start sending RPM signal"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendCommand()}
            />
            <Button onClick={handleSendCommand}><Send className="mr-2 h-4 w-4" />Send</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Terminal className="h-5 w-5 text-accent" /> Command Log (Mock Responses)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {commandLog.length > 0 ? (
            <Textarea
              readOnly
              value={commandLog.join('\n-----------------\n')}
              className="h-60 font-code text-sm bg-muted/30"
            />
          ) : (
            <p className="text-muted-foreground">No commands issued yet. Type a command above and press Send.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
