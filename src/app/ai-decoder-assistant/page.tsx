
'use client';

import * as React from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Atom, Loader2, Wand2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { AiDecoderAssistantOutput } from '@/ai/flows/decode-can-signals-flow'; // Will create this type
import { askAiToDecodeCanMessages, type AiDecoderResult } from './actions'; // Will create this action

export default function AiDecoderAssistantPage() {
  const [canMessages, setCanMessages] = React.useState(
`0x1A0#0123456789ABCDEF
0x1A0#0124456789ABCDEF
0x2B1#AABBCCDD
0x3C0#FFFF000011223344`
  );
  const [analysisResult, setAnalysisResult] = React.useState<AiDecoderAssistantOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!canMessages.trim()) {
      toast({
        title: 'Input Required',
        description: 'Please paste some CAN messages.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    const result: AiDecoderResult = await askAiToDecodeCanMessages(canMessages);

    setIsLoading(false);
    if (result.success && result.data) {
      setAnalysisResult(result.data);
      toast({
        title: 'AI Analysis Complete',
        description: `Received ${result.data.suggestions.length} suggestions.`,
        className: 'bg-green-500 text-white',
      });
    } else {
      setError(result.error || 'An unknown error occurred during AI analysis.');
      toast({
        title: 'AI Analysis Failed',
        description: result.error || 'Could not get suggestions from AI.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      <PageHeader
        title="AI CAN Decoder Assistant"
        icon={Atom}
        description="Use AI (mocked) to help guess signal meanings from raw CAN data."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-headline">Analyze Raw CAN Messages</CardTitle>
          <CardDescription>
            Paste raw CAN messages (e.g., ID#DATA format, one per line). The AI will attempt to provide insights.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="0x18FEF100#0102030405060708..."
            value={canMessages}
            onChange={(e) => setCanMessages(e.target.value)}
            rows={8}
            className="font-code"
            disabled={isLoading}
          />
          <Button onClick={handleSubmit} disabled={isLoading || !canMessages.trim()} className="mt-4">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Ask AI to Decode
          </Button>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardContent className="pt-6 flex flex-col items-center justify-center h-40">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
            <p className="text-muted-foreground">AI is thinking...</p>
          </CardContent>
        </Card>
      )}

      {error && !isLoading && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle /> AI Analysis Error
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
            <CardTitle className="font-headline">AI Suggestions (Mock)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="bg-muted/50 p-3 rounded-md">{analysisResult.overallSummary}</p>
            {analysisResult.suggestions.map((suggestion, index) => (
              <Card key={index} className="p-3 bg-card">
                <p className="font-semibold text-accent font-code">Message ID: {suggestion.messageIdHint}</p>
                <p className="text-sm">{suggestion.potentialMeaning}</p>
                <p className="text-xs text-muted-foreground mt-1">Confidence: {suggestion.confidence}</p>
                {suggestion.notes && <p className="text-xs text-muted-foreground italic mt-1">Notes: {suggestion.notes}</p>}
              </Card>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
