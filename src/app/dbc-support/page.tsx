
'use client';

import * as React from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileJson, UploadCloud, ListTree } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MockSignal {
  name: string;
  startBit: number;
  length: number;
  factor: number;
  offset: number;
  unit: string;
  messageId: string;
}

const mockParsedSignals: MockSignal[] = [
  { name: 'VehicleSpeed', startBit: 0, length: 16, factor: 0.01, offset: 0, unit: 'km/h', messageId: '0x1A0' },
  { name: 'EngineRPM', startBit: 16, length: 16, factor: 0.25, offset: 0, unit: 'rpm', messageId: '0x1A0' },
  { name: 'CoolantTemp', startBit: 8, length: 8, factor: 1, offset: -40, unit: '°C', messageId: '0x1B0' },
];

export default function DbcSupportPage() {
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [parsedSignals, setParsedSignals] = React.useState<MockSignal[]>([]);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.name.toLowerCase().endsWith('.dbc')) {
        setFileName(file.name);
        // Simulate parsing
        setTimeout(() => {
          setParsedSignals(mockParsedSignals);
          toast({ title: 'DBC File "Parsed"', description: `Successfully processed ${file.name} (mocked).` });
        }, 1000);
      } else {
        setFileName(null);
        setParsedSignals([]);
        toast({ title: 'Invalid File Type', description: 'Please upload a .dbc file.', variant: 'destructive' });
      }
    }
  };

  return (
    <div>
      <PageHeader
        title="DBC File Support"
        icon={FileJson}
        description="Upload and parse DBC (Data Base CAN) files to decode CAN signals into human-readable information."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-accent" /> Upload DBC File
          </CardTitle>
          <CardDescription>Select a .dbc file from your system to view its (mocked) signal definitions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="dbc-file">DBC File</Label>
            <Input id="dbc-file" type="file" accept=".dbc" onChange={handleFileChange} />
          </div>
          {fileName && <p className="mt-2 text-sm text-muted-foreground">Selected file: {fileName}</p>}
        </CardContent>
      </Card>

      {parsedSignals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <ListTree className="h-5 w-5 text-accent" /> Parsed Signals (Mock Data)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Signal Name</TableHead>
                  <TableHead>Message ID</TableHead>
                  <TableHead>Start Bit</TableHead>
                  <TableHead>Length</TableHead>
                  <TableHead>Factor</TableHead>
                  <TableHead>Offset</TableHead>
                  <TableHead>Unit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parsedSignals.map((signal) => (
                  <TableRow key={signal.name}>
                    <TableCell>{signal.name}</TableCell>
                    <TableCell className="font-code">{signal.messageId}</TableCell>
                    <TableCell>{signal.startBit}</TableCell>
                    <TableCell>{signal.length} bits</TableCell>
                    <TableCell>{signal.factor}</TableCell>
                    <TableCell>{signal.offset}</TableCell>
                    <TableCell>{signal.unit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
