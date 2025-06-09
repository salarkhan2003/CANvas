
'use client';

import * as React from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, Play, Pause, Filter, Trash2, Download, FileText, FileJson } from 'lucide-react';
import type { BusMessage } from '@/lib/types';
import { mockBusMessages, generateMockBusMessage } from '@/lib/mock-data';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function BusMonitorPage() {
  const [messages, setMessages] = React.useState<BusMessage[]>([]);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [filterId, setFilterId] = React.useState('');
  const [filterContent, setFilterContent] = React.useState('');
  const [filterSender, setFilterSender] = React.useState('');
  const [filterType, setFilterType] = React.useState<'ALL' | 'CAN' | 'LIN'>('ALL');
  const [autoScroll, setAutoScroll] = React.useState(true);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    setMessages(mockBusMessages);
  }, []);

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isPlaying) {
      intervalId = setInterval(() => {
        setMessages(prev => [...prev, generateMockBusMessage()].slice(-100)); 
      }, 1000); 
    }
    return () => clearInterval(intervalId);
  }, [isPlaying]);

  React.useEffect(() => {
    if (autoScroll && scrollAreaRef.current) {
      const scrollableViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollableViewport) {
        scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
      }
    }
  }, [messages, autoScroll]);

  const filteredMessages = messages.filter(msg => {
    const typeMatch = filterType === 'ALL' || msg.type === filterType;
    const idMatch = filterId === '' || msg.messageId.toLowerCase().includes(filterId.toLowerCase());
    const contentMatch = filterContent === '' || msg.data.join('').toLowerCase().includes(filterContent.toLowerCase());
    const senderMatch = filterSender === '' || (msg.sender && msg.sender.toLowerCase().includes(filterSender.toLowerCase()));
    return typeMatch && idMatch && contentMatch && senderMatch;
  });

  const clearMessages = () => setMessages([]);

  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: mimeType });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast({title: "Log Exported", description: `${filename} has been downloaded.`});
  };

  const handleExportCsv = () => {
    if (filteredMessages.length === 0) {
      toast({title: "No Data", description: "No messages to export.", variant: "destructive"});
      return;
    }
    const header = "Timestamp,Type,ID,Sender,DLC,Data\n";
    const csvContent = filteredMessages.map(msg => 
      `${msg.timestamp},${msg.type},${msg.messageId},${msg.sender || 'N/A'},${msg.dlc},"${msg.data.join(' ')}"`
    ).join('\n');
    downloadFile('canvas_log.csv', header + csvContent, 'text/csv;charset=utf-8;');
  };

  const handleExportJson = () => {
     if (filteredMessages.length === 0) {
      toast({title: "No Data", description: "No messages to export.", variant: "destructive"});
      return;
    }
    const jsonContent = JSON.stringify(filteredMessages, null, 2);
    downloadFile('canvas_log.json', jsonContent, 'application/json;charset=utf-8;');
  };


  return (
    <div>
      <PageHeader
        title="Real-time Bus Monitor"
        icon={Activity}
        description="Observe and filter CAN/LIN bus messages as they happen."
        actions={
          <>
            <Button onClick={() => setIsPlaying(!isPlaying)} variant="outline">
              {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button onClick={clearMessages} variant="destructive" className="bg-destructive hover:bg-destructive/90">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Log
            </Button>
          </>
        }
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Filter className="h-5 w-5 text-accent" />
            Filters & Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <Input placeholder="Filter by Message ID (e.g., 0x1A0)" value={filterId} onChange={e => setFilterId(e.target.value)} />
          <Input placeholder="Filter by Data Content (e.g., FF00)" value={filterContent} onChange={e => setFilterContent(e.target.value)} />
          <Input placeholder="Filter by Sender (e.g., Engine ECU)" value={filterSender} onChange={e => setFilterSender(e.target.value)} />
          <Select value={filterType} onValueChange={(value: 'ALL' | 'CAN' | 'LIN') => setFilterType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="CAN">CAN</SelectItem>
              <SelectItem value="LIN">LIN</SelectItem>
            </SelectContent>
          </Select>
          <div className="col-span-full sm:col-span-2 md:col-span-4 flex justify-end items-center gap-2 pt-2">
             <div className="flex items-center space-x-2 mr-auto">
                <Checkbox id="autoscroll" checked={autoScroll} onCheckedChange={(checked) => setAutoScroll(Boolean(checked))} />
                <Label htmlFor="autoscroll" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Auto-scroll
                </Label>
            </div>
            <Button onClick={handleExportCsv} variant="outline">
              <FileText className="mr-2 h-4 w-4" /> Export CSV
            </Button>
            <Button onClick={handleExportJson} variant="outline">
              <FileJson className="mr-2 h-4 w-4" /> Export JSON
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Message Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] w-full rounded-md border" ref={scrollAreaRef}>
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Sender</TableHead>
                  <TableHead>DLC</TableHead>
                  <TableHead>Data (Hex)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.map((msg) => (
                  <TableRow key={msg.id} className="font-code text-sm">
                    <TableCell>{msg.timestamp}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        msg.type === 'CAN' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                      }`}>
                        {msg.type}
                      </span>
                    </TableCell>
                    <TableCell>{msg.messageId}</TableCell>
                    <TableCell>{msg.sender || 'N/A'}</TableCell>
                    <TableCell>{msg.dlc}</TableCell>
                    <TableCell className="truncate max-w-xs">{msg.data.join(' ')}</TableCell>
                  </TableRow>
                ))}
                {filteredMessages.length === 0 && messages.length > 0 && ( 
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No messages match your filters.
                    </TableCell>
                  </TableRow>
                )}
                {messages.length === 0 && ( 
                   <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Log is empty or loading initial messages...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
