'use client';

import * as React from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { BookOpen, HelpCircle, Edit, PauseCircle, PlayCircle } from 'lucide-react';
import { mockLearningModules, mockQuizQuestions } from '@/lib/mock-data';
import type { LearningModule, QuizQuestion } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FramePart {
  name: string;
  value: string;
  bits: number;
  description: string;
}

export default function ProtocolLearningPage() {
  const [activeTab, setActiveTab] = React.useState('explanation');
  const [frameToInspect, setFrameToInspect] = React.useState('1A0#0123456789ABCDEF'); // Example: ID#Data
  const [inspectedParts, setInspectedParts] = React.useState<FramePart[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<string | null>(null);
  const [showAnswer, setShowAnswer] = React.useState(false);
  const { toast } = useToast();

  const currentQuestion = mockQuizQuestions[currentQuestionIndex];

  const inspectFrame = () => {
    // This is a very simplified parser for CAN frames (ID#DATA)
    // A real implementation would be much more complex and handle LIN, error frames etc.
    const parts = frameToInspect.split('#');
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      toast({ title: "Invalid Frame Format", description: "Use format: ID#DATA (e.g., 1A0#01234567)", variant: "destructive" });
      setInspectedParts([]);
      return;
    }
    const id = parts[0];
    const dataHex = parts[1];
    const dataBytes = dataHex.match(/.{1,2}/g) || [];
    const dlc = dataBytes.length;

    if (dlc > 8) {
       toast({ title: "Invalid Data Length", description: "CAN data field can be max 8 bytes.", variant: "destructive" });
       setInspectedParts([]);
       return;
    }

    const newInspectedParts: FramePart[] = [
      { name: 'Start of Frame (SOF)', value: 'Dominant', bits: 1, description: 'Marks the beginning of the frame.' },
      { name: 'Identifier (ID)', value: `0x${id}`, bits: 11, description: 'Message priority and identification.' }, // Assuming standard 11-bit ID
      { name: 'Remote Transmission Request (RTR)', value: 'Dominant', bits: 1, description: 'Usually dominant for data frames.' },
      { name: 'Identifier Extension (IDE)', value: 'Dominant', bits: 1, description: 'Dominant for standard CAN frames.' },
      { name: 'Reserved Bit (r0)', value: 'Dominant', bits: 1, description: 'Reserved, typically dominant.' },
      { name: 'Data Length Code (DLC)', value: dlc.toString(), bits: 4, description: `Indicates ${dlc} bytes of data.` },
      { name: 'Data Field', value: dataBytes.join(' '), bits: dlc * 8, description: 'The actual payload of the message.' },
      { name: 'CRC Sequence', value: 'Calculated', bits: 15, description: 'Cyclic Redundancy Check for error detection.' },
      { name: 'CRC Delimiter', value: 'Recessive', bits: 1, description: 'Separates CRC from ACK field.' },
      { name: 'Acknowledge Slot (ACK Slot)', value: 'Recessive/Dominant', bits: 1, description: 'Transmitter sends recessive, receiver pulls dominant if OK.' },
      { name: 'Acknowledge Delimiter (ACK Del)', value: 'Recessive', bits: 1, description: 'Separates ACK from EOF.' },
      { name: 'End of Frame (EOF)', value: 'Recessive', bits: 7, description: 'Marks the end of the frame.' },
    ];
    setInspectedParts(newInspectedParts);
    toast({ title: "Frame Inspected", description: "Parsed frame components displayed below." });
  };

  const handleQuizSubmit = () => {
    if (selectedAnswer === null) {
      toast({ title: "No Answer Selected", description: "Please select an option.", variant: "destructive" });
      return;
    }
    setShowAnswer(true);
    if (selectedAnswer === currentQuestion.correctAnswer) {
      toast({ title: "Correct!", description: "Well done!", className: "bg-green-500 text-white" });
    } else {
      toast({ title: "Incorrect", description: "Try the next one!", variant: "destructive" });
    }
  };

  const handleNextQuestion = () => {
    setShowAnswer(false);
    setSelectedAnswer(null);
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % mockQuizQuestions.length);
  };


  return (
    <div>
      <PageHeader
        title="Protocol Learning Mode"
        icon={BookOpen}
        description="Understand CAN/LIN frame structures, inspect messages, and test your knowledge."
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="explanation">Explanations</TabsTrigger>
          <TabsTrigger value="inspector">Frame Inspector</TabsTrigger>
          <TabsTrigger value="quiz">Quiz Mode</TabsTrigger>
        </TabsList>

        <TabsContent value="explanation">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">CAN & LIN Protocol Basics</CardTitle>
              <CardDescription>Learn about the fundamental concepts of Controller Area Network and Local Interconnect Network.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                {mockLearningModules.map((module: LearningModule) => (
                  <div key={module.id} className="mb-6 p-4 border rounded-lg bg-card">
                    <h2 className="font-headline text-2xl text-accent mb-2">{module.title}</h2>
                    <div className="prose prose-invert max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: module.content }} />
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inspector">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Inspect CAN/LIN Frame</CardTitle>
              <CardDescription>Enter a frame (e.g., ID#DATA for CAN) to see its components. This is a simplified view.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Enter frame data (e.g., 1A0#0123456789ABCDEF)"
                  value={frameToInspect}
                  onChange={(e) => setFrameToInspect(e.target.value)}
                  className="font-code flex-grow"
                />
                <Button onClick={inspectFrame}><Edit className="mr-2 h-4 w-4" /> Inspect</Button>
              </div>
              {inspectedParts.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h3 className="font-semibold text-lg font-headline">Frame Components:</h3>
                   <ScrollArea className="h-[400px] pr-4">
                    {inspectedParts.map((part, index) => (
                      <Card key={index} className="p-3 mb-2 bg-muted/30">
                        <p className="font-semibold text-accent">{part.name} ({part.bits} bits):</p>
                        <p className="font-code text-sm">{part.value}</p>
                        <p className="text-xs text-muted-foreground">{part.description}</p>
                      </Card>
                    ))}
                  </ScrollArea>
                </div>
              )}
               <div className="mt-6 flex items-center gap-4 p-4 border rounded-lg bg-card">
                  <PauseCircle className="h-10 w-10 text-accent"/>
                  <div>
                    <h4 className="font-headline text-lg">"Pause" and "Inspect" Simulation</h4>
                    <p className="text-sm text-muted-foreground">Imagine pausing a real-time bus monitor and selecting a frame. This tool simulates that inspection process. For deeper analysis, combine this with the Bus Monitor page.</p>
                  </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quiz">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Test Your Knowledge</CardTitle>
              <CardDescription>Answer questions to check your understanding of CAN/LIN protocols.</CardDescription>
            </CardHeader>
            <CardContent>
              {currentQuestion && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">{currentQuestionIndex + 1}. {currentQuestion.question}</h3>
                  {currentQuestion.frameData && (
                    <p className="font-code bg-muted/50 p-2 rounded-md mb-4 text-sm">Context Frame: {currentQuestion.frameData}</p>
                  )}
                  <RadioGroup value={selectedAnswer || undefined} onValueChange={setSelectedAnswer} disabled={showAnswer}>
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value={option} id={`q${currentQuestion.id}-opt${index}`} />
                        <Label htmlFor={`q${currentQuestion.id}-opt${index}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {showAnswer && (
                    <Card className={`mt-4 p-4 ${selectedAnswer === currentQuestion.correctAnswer ? 'border-green-500' : 'border-red-500'} bg-muted/20`}>
                      <p className="font-semibold">
                        {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect.'}
                        The correct answer is: <span className="text-accent">{currentQuestion.correctAnswer}</span>
                      </p>
                      <p className="text-sm mt-1">{currentQuestion.explanation}</p>
                    </Card>
                  )}
                  <div className="mt-6 flex gap-2">
                    <Button onClick={handleQuizSubmit} disabled={showAnswer || selectedAnswer === null}>Submit Answer</Button>
                    {showAnswer && <Button onClick={handleNextQuestion} variant="outline">Next Question <PlayCircle className="ml-2 h-4 w-4"/></Button>}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}