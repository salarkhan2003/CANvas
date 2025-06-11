
'use client';

import * as React from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { BrainCircuit, Loader2, AlertTriangle, CheckCircle2, Search, XCircle, BarChartHorizontalBig } from 'lucide-react';
import { performAnomalyDetection, type AnomalyDetectionResult } from './actions';
import type { AnalyzeCanLinTrafficOutput, Anomaly } from '@/ai/flows/analyze-can-lin-traffic';
import type { CountData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, CartesianGrid, Cell } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';


const logPlaceholder = `Example CAN Log Lines (Timestamp ID#Data or (Time) Bus IDx Dx DLC Data..):
1609459200.000 1A0#0123456789ABCDEF
1609459200.100 2B1#AABBCCDD
(000.000000) 1 1A0x Dx 8 01 23 45 67 89 AB CD EF
(000.100000) 1 2B1x Dx 4 AA BB CC DD

Example LIN Log Lines (Timestamp LIN: Direction ID: id Data: data..):
(0.123456) LIN: Rx ID: 0x3c Data: 01 02 03 04
(0.234567) LIN: Tx ID: 0x1a Data: FF EE DD

Paste your log data here...`;

const SEVERITY_COLORS: Record<Anomaly['severity'], string> = {
  LOW: 'hsl(var(--chart-1))',
  MEDIUM: 'hsl(var(--chart-2))',
  HIGH: 'hsl(var(--chart-4))', // Using chart-4 for red-like color
};

const initialChartConfig: ChartConfig = {
  count: { label: 'Anomaly Count' },
  LOW: { label: 'Low Severity', color: SEVERITY_COLORS.LOW },
  MEDIUM: { label: 'Medium Severity', color: SEVERITY_COLORS.MEDIUM },
  HIGH: { label: 'High Severity', color: SEVERITY_COLORS.HIGH },
};


export default function AiAnomalyDetectionPage() {
  const [logData, setLogData] = React.useState('');
  const [analysisResult, setAnalysisResult] = React.useState<AnalyzeCanLinTrafficOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();

  const anomalySeverityCounts = React.useMemo<CountData[]>(() => {
    if (!analysisResult || !analysisResult.anomalies || analysisResult.anomalies.length === 0) {
      return [];
    }
    const counts: Record<Anomaly['severity'], number> = { LOW: 0, MEDIUM: 0, HIGH: 0 };
    analysisResult.anomalies.forEach(anomaly => {
      counts[anomaly.severity] = (counts[anomaly.severity] || 0) + 1;
    });
    return (Object.keys(counts) as Anomaly['severity'][])
      .map(key => ({
        name: key.charAt(0) + key.slice(1).toLowerCase(), // Capitalize first letter
        value: counts[key],
        fill: SEVERITY_COLORS[key],
      }))
      .filter(item => item.value > 0)
      .sort((a,b) => b.value - a.value);
  }, [analysisResult]);

  const handleSubmit = async () => {
    if (!logData.trim()) {
      toast({
        title: 'Input Required',
        description: 'Please paste or type CAN/LIN log data.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    const result: AnomalyDetectionResult = await performAnomalyDetection(logData);

    setIsLoading(false);
    if (result.success && result.data) {
      setAnalysisResult(result.data);
      toast({
        title: 'Analysis Complete',
        description: `Found ${result.data.anomalies.length} potential anomalies.`,
        className: 'bg-green-500 text-white',
      });
    } else {
      setError(result.error || 'An unknown error occurred.');
      toast({
        title: 'Analysis Failed',
        description: result.error || 'Could not analyze the provided data.',
        variant: 'destructive',
      });
    }
  };

  const getSeverityBadgeVariant = (severity: Anomaly['severity']) => {
    switch (severity) {
      case 'HIGH':
        return 'destructive';
      case 'MEDIUM':
        return 'secondary'; 
      case 'LOW':
      default:
        return 'outline';
    }
  };

  return (
    <div>
      <PageHeader
        title="AI Anomaly Detection"
        icon={BrainCircuit}
        description="Leverage AI to analyze CAN/LIN logs and identify potential anomalies or security threats."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-headline">Analyze Log Data</CardTitle>
          <CardDescription>
            Paste your CAN/LIN bus traffic log data below. The AI will analyze it for unusual patterns.
            Supported formats include raw text logs, .log, .blf, or .asc content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full gap-2">
            <Label htmlFor="log-data-textarea">CAN/LIN Log Data</Label>
            <Textarea
              id="log-data-textarea"
              placeholder={logPlaceholder}
              value={logData}
              onChange={(e) => setLogData(e.target.value)}
              rows={10}
              className="font-code"
              disabled={isLoading}
            />
            <div className="flex justify-end gap-2 pt-2">
                <Button onClick={() => { setLogData(''); setAnalysisResult(null); setError(null); }} variant="outline" disabled={isLoading || !logData}>
                    <XCircle className="mr-2 h-4 w-4" /> Clear
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading || !logData.trim()}>
                    {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                    <Search className="mr-2 h-4 w-4" />
                    )}
                    Analyze Data
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardContent className="pt-6 flex flex-col items-center justify-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Analyzing data, please wait...</p>
          </CardContent>
        </Card>
      )}

      {error && !isLoading && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive font-headline">
              <AlertTriangle /> Analysis Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {analysisResult && !isLoading && !error && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <CheckCircle2 className="text-green-500" /> Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2">
                    <h3 className="font-semibold text-lg mb-2">Summary:</h3>
                    <p className="mb-6 bg-muted/50 p-3 rounded-md text-sm">{analysisResult.summary}</p>
                </div>
                <div className="md:col-span-1">
                    <h3 className="font-semibold text-lg mb-2 flex items-center"><BarChartHorizontalBig className="mr-2 h-5 w-5 text-accent"/>Severity Distribution</h3>
                    {anomalySeverityCounts.length > 0 ? (
                         <ChartContainer config={initialChartConfig} className="h-[150px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={anomalySeverityCounts} layout="vertical" margin={{ left: 0, right: 10, top: 5, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                                    <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" width={70} className="text-xs" />
                                    <Tooltip content={<ChartTooltipContent indicator="dot" />} cursor={{ fill: "hsl(var(--accent), 0.3)" }} />
                                    <Bar dataKey="value" name="Count" radius={[0, 4, 4, 0]} barSize={15}>
                                        {anomalySeverityCounts.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    ): (
                        <p className="text-sm text-muted-foreground h-[150px] flex items-center justify-center">No anomalies with severity found.</p>
                    )}
                </div>
            </div>
            
            <h3 className="font-semibold text-lg mb-2">Detected Anomalies ({analysisResult.anomalies.length}):</h3>
            {analysisResult.anomalies.length > 0 ? (
              <ScrollArea className="h-[300px] rounded-md border">
                <Table>
                  <TableHeader className="sticky top-0 bg-card z-10">
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Message ID</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Severity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analysisResult.anomalies.map((anomaly, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-code text-xs">{anomaly.timestamp}</TableCell>
                        <TableCell className="font-code text-xs">{anomaly.messageId}</TableCell>
                        <TableCell className="text-xs">{anomaly.description}</TableCell>
                        <TableCell>
                          <Badge variant={getSeverityBadgeVariant(anomaly.severity)} className="text-xs">
                            {anomaly.severity}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            ) : (
              <p className="text-muted-foreground">No specific anomalies were flagged in this log.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
