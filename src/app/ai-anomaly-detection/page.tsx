'use client';

import * as React from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { BrainCircuit, Lightbulb, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { Anomaly, AnalysisReport } from '@/lib/types'; // Use our defined types
import { performAnomalyDetection, type AnomalyDetectionResult } from './actions';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

export default function AiAnomalyDetectionPage() {
  const [logData, setLogData] = React.useState('');
  const [analysisResult, setAnalysisResult]