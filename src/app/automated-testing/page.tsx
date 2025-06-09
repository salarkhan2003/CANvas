
'use client';

import * as React from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { TestTubeDiagonal, Play, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
];

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

  const handleRunTests = () => {
    setIsRunningTests(true);
    toast({ title: 'Running Tests...', description: 'Simulating test execution (mocked).' });

    // Simulate test execution
    setTimeout(() => {
      setTestResults(prevResults => prevResults.map(tc => ({
        ...tc,
        status: Math.random() > 0.3 ? 'PASS' : 'FAIL', // Randomly pass/fail
        details: Math.random() > 0.3 ? (tc.status === 'FAIL' ? 'Message interval out of tolerance.' : 'All checks passed.') : (tc.status === 'FAIL' ? 'Node did not enter expected status.' : undefined)
      })));
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
            {testResults.length === 0 && !isRunningTests && <p className="text-muted-foreground">No tests run yet.</p>}
            <div className="space-y-3">
              {testResults.map(result => (
                <Card key={result.id} className={`p-4 ${result.status === 'PENDING' ? 'bg-muted/30' : result.status === 'PASS' ? 'border-green-500' : 'border-red-500'}`}>
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">{result.description}</h4>
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
