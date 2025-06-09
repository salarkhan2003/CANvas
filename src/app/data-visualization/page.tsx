'use client';

import * as React from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart as LucideLineChart, BarChart2, Settings2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, BarChart, XAxis, YAxis, Tooltip, Legend, Line, Bar, CartesianGrid } from 'recharts';
import type { SignalData } from '@/lib/types';
import { mockSignalData } from '@/lib/mock-data';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';

const initialChartConfig = {
  value: {
    label: "Value",
  },
} satisfies ChartConfig;


export default function DataVisualizationPage() {
  const [selectedSignal, setSelectedSignal] = React.useState<SignalData | null>(mockSignalData[0] || null);
  const [chartType, setChartType] = React.useState<'line' | 'bar'>('line');
  const [chartConfig, setChartConfig] = React.useState<ChartConfig>(initialChartConfig);


  React.useEffect(() => {
    if (selectedSignal) {
      setChartConfig({
        [selectedSignal.name]: {
          label: selectedSignal.name,
          color: selectedSignal.color || 'hsl(var(--chart-1))',
        }
      })
    }
  }, [selectedSignal]);


  const handleSignalChange = (signalName: string) => {
    const signal = mockSignalData.find(s => s.name === signalName);
    setSelectedSignal(signal || null);
  };

  return (
    <div>
      <PageHeader
        title="Graphical Data Visualization"
        icon={LucideLineChart}
        description="Visualize CAN/LIN payload data such as speed, temperature, and voltage with interactive charts."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-accent" />
            Chart Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select onValueChange={handleSignalChange} defaultValue={selectedSignal?.name}>
            <SelectTrigger>
              <SelectValue placeholder="Select Signal" />
            </SelectTrigger>
            <SelectContent>
              {mockSignalData.map(signal => (
                <SelectItem key={signal.name} value={signal.name}>
                  {signal.name} ({signal.unit})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={chartType} onValueChange={(value: 'line' | 'bar') => setChartType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Chart Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="bar">Bar Chart</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedSignal ? (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">{selectedSignal.name} Trend</CardTitle>
            <CardDescription>Showing {selectedSignal.name.toLowerCase()} over time. Unit: {selectedSignal.unit}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              {chartType === 'line' ? (
                <LineChart data={selectedSignal.data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" unit={selectedSignal.unit.startsWith('°') ? selectedSignal.unit : ` ${selectedSignal.unit}`} />
                  <Tooltip
                    content={<ChartTooltipContent indicator="dot" />}
                    cursor={{ stroke: "hsl(var(--accent))", strokeWidth: 2, strokeDasharray: "3 3" }}
                  />
                  <Legend content={<ChartLegendContent />} />
                  <Line type="monotone" dataKey="value" name={selectedSignal.name} stroke={selectedSignal.color || 'var(--color-value)'} strokeWidth={2} dot={{ r:4, fill: selectedSignal.color || 'var(--color-value)' }} activeDot={{ r: 6 }} />
                </LineChart>
              ) : (
                <BarChart data={selectedSignal.data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" unit={selectedSignal.unit.startsWith('°') ? selectedSignal.unit : ` ${selectedSignal.unit}`} />
                  <Tooltip
                    content={<ChartTooltipContent indicator="dot" />}
                    cursor={{ fill: "hsl(var(--accent), 0.3)" }}
                  />
                  <Legend content={<ChartLegendContent />} />
                  <Bar dataKey="value" name={selectedSignal.name} fill={selectedSignal.color || 'var(--color-value)'} radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ChartContainer>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="h-[400px] flex items-center justify-center">
            <div className="text-center">
              <BarChart2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Please select a signal to visualize its data.</p>
            </div>
          </CardContent>
        </