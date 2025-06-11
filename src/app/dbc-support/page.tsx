
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
  { name: 'BatteryCurrent', startBit: 24, length: 12, factor: 0.05, offset: -100, unit: 'A', messageId: '0x1C2' },
  { name: 'SteeringAngle', startBit: 0, length: 16, factor: 0.1, offset: -780, unit: 'deg', messageId: '0x0F5' },
];

const ACCEPTED_FILE_TYPES = ".dbc,.pdf,.csv,.json,.txt,.xls,.xlsx";
const PARSABLE_EXTENSIONS_ARRAY = ['.dbc', '.pdf', '.csv', '.json', '.txt', '.xls', '.xlsx'];


export default function DbcSupportPage() {
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [parsedSignals, setParsedSignals] = React.useState<MockSignal[]>([]);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

      if (PARSABLE_EXTENSIONS_ARRAY.includes(fileExtension)) {
        setFileName(file.name);
        // Simulate parsing for all "accepted" types, but message appropriately
        toast({ title: 'Processing File...', description: `Attempting to process ${file.name} (mock operation).` });
        setTimeout(() => {
          setParsedSignals(mockParsedSignals); // Always show mock signals for demo
          if (fileExtension === '.dbc') {
            toast({ title: 'DBC File "Parsed"', description: `Successfully processed ${file.name} and displayed mock signal definitions.` });
          } else {
            toast({
              title: `File "${file.name}" Selected (Mock Behavior)`,
              description: `Displaying generic mock signal data. For actual CAN signal decoding, a valid .dbc file is required.`,
              duration: 7000 
            });
          }
        }, 1000);
      } else {
        setFileName(null);
        setParsedSignals([]);
        toast({
          title: 'Unsupported File Type',
          description: `File type "${fileExtension}" is not directly parsable for CAN signals. Please select a supported type (e.g. .dbc) or one of the demonstrative types: ${PARSABLE_EXTENSIONS_ARRAY.join(', ')}`,
          variant: 'destructive',
          duration: 8000
        });
      }
    } else {
      // Reset if no file is selected (e.g., user cancels file dialog)
      setFileName(null);
      setParsedSignals([]);
    }
  };

  return (
    <div>
      <PageHeader
        title="DBC File Support"
        icon={FileJson}
        description="Upload and parse DBC (Data Base CAN) files to decode CAN signals. Other document types can be selected for demonstration (mock parsing)."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-accent" /> Upload File
          </CardTitle>
          <CardDescription>Select a .dbc file for (mock) parsing, or other document types to see placeholder signal definitions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="dbc-file">Signal Definition File</Label>
            <Input id="dbc-file" type="file" accept={ACCEPTED_FILE_TYPES} onChange={handleFileChange} />
          </div>
          {fileName && <p className="mt-2 text-sm text-muted-foreground">Selected file: {fileName}</p>}
        </CardContent>
      </Card>

      {parsedSignals.length > 0 && fileName && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <ListTree className="h-5 w-5 text-accent" /> Parsed Signals (Mock Data for {fileName})
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
                  <TableRow key={signal.name + signal.messageId}>
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
