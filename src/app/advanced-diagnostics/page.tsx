
'use client';

import * as React from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SearchCode, Wrench, ScanLine } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdvancedDiagnosticsPage() {
  const { toast } = useToast();
  // OBD-II State
  const [obdPid, setObdPid] = React.useState('010C'); // Example: Engine RPM
  const [obdResponse, setObdResponse] = React.useState('');

  // UDS State
  const [udsServiceId, setUdsServiceId] = React.useState('22'); // Example: Read Data By Identifier
  const [udsDid, setUdsDid] = React.useState('F190'); // Example: VIN
  const [udsRequestData, setUdsRequestData] = React.useState('');
  const [udsResponse, setUdsResponse] = React.useState('');

  const handleObdRequest = () => {
    toast({ title: 'OBD-II Request Sent (Mock)' });
    // Simulate response
    setTimeout(() => {
      if (obdPid === '010C') setObdResponse('41 0C 1A F0'); // Mock RPM data
      else if (obdPid === '010D') setObdResponse('41 0D 64'); // Mock Speed data (100 km/h)
      else setObdResponse('7F ' + obdPid.slice(0,2) + ' 12'); // Negative response: subFunctionNotSupported
    }, 500);
  };

  const handleUdsRequest = () => {
    toast({ title: 'UDS Request Sent (Mock)' });
    // Simulate response
    setTimeout(() => {
      if (udsServiceId === '22' && udsDid === 'F190') setUdsResponse('62 F1 90 57 49 4E 31 32 33 ...'); // Mock VIN. Corrected: was setObdResponse
      else if (udsServiceId === '10' && udsDid === '01') setUdsResponse('50 01 00 32 01 F4'); // Mock Diagnostic Session Control Positive Response
      else setUdsResponse('7F ' + udsServiceId + ' 11'); // Negative response: serviceNotSupported
    }, 500);
  };

  return (
    <div>
      <PageHeader
        title="Advanced Diagnostics Tools"
        icon={SearchCode}
        description="Simulate OBD-II PID requests and UDS (Unified Diagnostic Services) interactions (mocked)."
      />

      <Tabs defaultValue="obd-ii" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="obd-ii"><ScanLine className="mr-2 h-4 w-4"/>OBD-II Toolset</TabsTrigger>
          <TabsTrigger value="uds"><Wrench className="mr-2 h-4 w-4"/>UDS Tester</TabsTrigger>
        </TabsList>

        <TabsContent value="obd-ii">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">OBD-II PID Requestor</CardTitle>
              <CardDescription>Simulate sending OBD-II PID requests and view mock responses.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="obdPid">PID (e.g., 010C for RPM, 010D for Speed)</Label>
                <Input id="obdPid" value={obdPid} onChange={(e) => setObdPid(e.target.value)} className="font-code" placeholder="Enter PID (Mode + PID Hex)" />
              </div>
              <Button onClick={handleObdRequest}>Send OBD-II Request</Button>
              {obdResponse && (
                <div>
                  <Label>Mock Response:</Label>
                  <Textarea readOnly value={obdResponse} className="font-code h-24 bg-muted/30" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="uds">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">UDS Service Tester</CardTitle>
              <CardDescription>Simulate sending UDS requests and view mock responses.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="udsServiceId">Service ID (Hex, e.g., 10, 22, 2E)</Label>
                  <Input id="udsServiceId" value={udsServiceId} onChange={(e) => setUdsServiceId(e.target.value)} className="font-code" />
                </div>
                <div>
                  <Label htmlFor="udsDid">DID / Sub-function (Hex, e.g., F190, 01)</Label>
                  <Input id="udsDid" value={udsDid} onChange={(e) => setUdsDid(e.target.value)} className="font-code" />
                </div>
              </div>
              <div>
                <Label htmlFor="udsRequestData">Request Data (Hex, Optional, space-separated)</Label>
                <Input id="udsRequestData" value={udsRequestData} onChange={(e) => setUdsRequestData(e.target.value)} className="font-code" placeholder="e.g., AA BB CC" />
              </div>
              <Button onClick={handleUdsRequest}>Send UDS Request</Button>
              {udsResponse && (
                <div>
                  <Label>Mock Response:</Label>
                  <Textarea readOnly value={udsResponse} className="font-code h-24 bg-muted/30" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
