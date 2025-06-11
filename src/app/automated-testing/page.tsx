
'use client';

import * as React from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { TestTubeDiagonal, Play, Loader2, CheckCircle2, XCircle, PieChart as PieChartIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent, ChartLegendContent } from '@/components/ui/chart';
import type { CountData } from '@/lib/types';

interface TestResult {
  id: string;
  description: string;
  status: 'PASS' | 'FAIL' | 'PENDING';
  details?: string;
}

const mockTestCases: TestResult[] = [
  { id: 'tc1', description: 'Verify Engine ECU sends 0x1A0 every 100ms', status: 'PENDING' },
  { id: 'tc2', description: 'Check Brake ECU response to fault injection', status: 'PENDING' },
  { id: 'tc3', description: 'Ensure speed signal matches simulated input within 500ms', status: 'PENDING' },
  { id: 'tc4', description: 'Gateway message routing integrity check', status: 'PENDING' },
  { id: 'tc5', description: 'LIN slave node response timing', status: 'PENDING' },
];

const TEST_STATUS_COLORS: Record<TestResult['status'], string> = {
  PASS: 'hsl(var(--chart-1))', // Greenish
  FAIL: 'hsl(var(--chart-4))', // Reddish
  PENDING: 'hsl(var(--chart-5))', // Bluish/Grayish
};

const initialChartConfig = {
  tests: { label: "Tests" },
  PASS: { label: "Pass", color: TEST_STATUS_COLORS.PASS },
  FAIL: { label: "Fail", color: TEST_STATUS_COLORS.FAIL },
  PENDING: { label: "Pending", color: TEST_STATUS_COLORS.PENDING },
} satisfies ChartConfig;

export default function AutomatedTestingPage() {
  const [testScript, setTestScript] = React.useState(
`// Example Mock Test Script
TEST_CASE("Engine ECU Heartbeat")
  EXPECT_MESSAGE_ID("0x1A0")
  WITH_INTERVAL(100, 10) // 100ms +/- 10ms
  FROM_NODE("Engine ECU")
END_CASE

TEST_CASE("Brake System Integrity Under Fault")
  INJECT_FAULT("bus_off", DURATION=500)
  EXPECT_NODE_STATUS("Brake ECU", "ErrorRecovery")
  EXPECT_MESSAGE_ID_ABSENT("0x2B1", TIMEOUT=1000)
END_CASE`
  );
  const [testResults, setTestResults] = React.useState<TestResult[]>(mockTestCases);
  const [isRunningTests, setIsRunningTests] = React.useState(false);
  const { toast } = useToast();

  const testStatusCounts = React.useMemo<CountData[]>(() => {
    const counts: Record<string, number> = { PASS: 0, FAIL: 0, PENDING: 0 };
    testResults.forEach(result => {
      counts[result.status] = (counts[result.status] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value, fill: TEST_STATUS_COLORS[name as TestResult['status']] }))
      .filter(item => item.value > 0);
  }, [testResults]);

  const handleRunTests = () => {
    setIsRunningTests(true);
    setTestResults(prev => prev.map(tc => ({...tc, status: 'PENDING', details: undefined}))); // Reset to pending
    toast({ title: 'Running Tests...', description: 'Simulating test execution (mocked).' });

    setTimeout(() => {
      setTestResults(prevResults => prevResults.map(tc => {
        const rand = Math.random();
        let status: TestResult['status'];
        let details: string | undefined;
        if (rand < 0.6) {
          status = 'PASS';
          details = 'All checks passed as expected.';
        } else if (rand < 0.9) {
          status = 'FAIL';
          details = tc.id === 'tc1' ? 'Message interval out of tolerance by 15ms.' : 'Node did not enter expected status after fault.';
        } else {
          status = 'PENDING'; // Some might remain pending to show in chart
          details = 'Test execution timed out or was skipped.';
        }
        return { ...tc, status, details };
      }));
      setIsRunningTests(false);
      toast({ title: 'Tests Complete!', description: 'Mock test run finished.' });
    }, 2000);
  };

  return (
    <div>
      <PageHeader
        title="Automated Testing"
        icon={TestTubeDiagonal}
        description="Define and run (mock) test scenarios to validate network behaviors and generate pass/fail reports."
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-headline">Define Test Script (Mock)</CardTitle>
            <CardDescription>Write your test scenario using a simplified script format.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={testScript}
              onChange={(e) => setTestScript(e.target.value)}
              rows={15}
              className="font-code"
              placeholder="// Define your test steps here..."
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleRunTests} disabled={isRunningTests} className="w-full">
              {isRunningTests ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
              Run Tests
            </Button>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Test Results</CardTitle>
            <CardDescription>Observe the outcomes of your simulated test run.</CardDescription>
          </CardHeader>
          <CardContent>
            {testStatusCounts.length > 0 && (
                <Card className="mb-6 p-4 items-center flex flex-col">
                    <h4 className="font-semibold mb-2 text-center text-lg flex items-center"><PieChartIcon className="mr-2 h-5 w-5 text-accent"/>Test Status Summary</h4>
                    <ChartContainer config={initialChartConfig} className="h-[200px] w-full max-w-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Tooltip content={<ChartTooltipContent hideLabel nameKey="name" />} />
                                <Pie data={testStatusCounts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} labelLine={false} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                                    {testStatusCounts.map((entry) => (
                                        <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Legend content={<ChartLegendContent />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </Card>
            )}
            {testResults.length === 0 && !isRunningTests && <p className="text-muted-foreground">No tests run yet.</p>}
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {testResults.map(result => (
                <Card key={result.id} className={`p-3 ${result.status === 'PENDING' ? 'bg-muted/30' : result.status === 'PASS' ? 'border-green-500/50' : 'border-red-500/50'}`}>
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-sm">{result.description}</h4>
                    {result.status === 'PASS' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                    {result.status === 'FAIL' && <XCircle className="h-5 w-5 text-red-500" />}
                    {result.status === 'PENDING' && <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />}
                  </div>
                  {result.details && <p className="text-xs text-muted-foreground mt-1">{result.details}</p>}
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
