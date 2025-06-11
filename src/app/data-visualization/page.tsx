
'use client';

import * as React from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart as LucideLineChart } from 'lucide-react';
import { ResponsiveContainer, LineChart, BarChart, XAxis, YAxis, Tooltip, Legend, Line, Bar, CartesianGrid } from 'recharts';
import type { SignalData, ChartDataPoint } from '@/lib/types';
import { mockSignalData } from '@/lib/mock-data';
import { ChartConfig, ChartContainer, ChartTooltipContent, ChartLegendContent } from '@/components/ui/chart';

// Helper function to create chart config
const createChartConfig = (signal: SignalData): ChartConfig => ({
  [signal.name]: {
    label: signal.name,
    color: signal.color || 'hsl(var(--chart-1))',
  },
});

export default function DataVisualizationPage() {
  // We'll display the first 3-4 signals from mockSignalData
  const signalsToDisplay = mockSignalData.slice(0, 4);

  if (signalsToDisplay.length === 0) {
    return (
      <div>
        <PageHeader
          title="Graphical Data Visualization"
          icon={LucideLineChart}
          description="Visualize CAN/LIN payload data such as speed, temperature, and voltage with interactive charts."
        />
        <Card>
          <CardContent className="h-[400px] flex items-center justify-center">
            <p className="text-muted-foreground">No signal data available to display.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Graphical Data Visualization"
        icon={LucideLineChart}
        description="Visualize CAN/LIN payload data with interactive charts. Showing mock Speed, Temperature, Battery Voltage, and Engine Load."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {signalsToDisplay.map((signal, index) => {
          const chartConfig = createChartConfig(signal);
          // Alternate between Line and Bar chart for variety if more than 2 signals
          const ChartComponent = index % 2 === 0 || signalsToDisplay.length <= 2 ? LineChart : BarChart;
          const ChartPrimitive = index % 2 === 0 || signalsToDisplay.length <= 2 ? Line : Bar;

          return (
            <Card key={signal.name}>
              <CardHeader>
                <CardTitle className="font-headline">{signal.name} Trend</CardTitle>
                <CardDescription>Showing mock {signal.name.toLowerCase()} over time. Unit: {signal.unit}</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ChartComponent data={signal.data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" unit={signal.unit.startsWith('°') || signal.unit === '%' ? signal.unit : ` ${signal.unit}`} domain={['auto', 'auto']} />
                      <Tooltip
                        content={<ChartTooltipContent indicator="dot" />}
                        cursor={ChartComponent === LineChart ? { stroke: "hsl(var(--accent))", strokeWidth: 2, strokeDasharray: "3 3" } : { fill: "hsl(var(--accent), 0.3)"}}
                      />
                      <Legend content={<ChartLegendContent />} />
                      <ChartPrimitive 
                        dataKey="value" 
                        name={signal.name} 
                        stroke={signal.color || 'var(--color-value)'} 
                        fill={signal.color || 'var(--color-value)'}
                        strokeWidth={ChartComponent === LineChart ? 2 : undefined} 
                        dot={ChartComponent === LineChart ? { r:4, fill: signal.color || 'var(--color-value)' } : undefined} 
                        activeDot={ChartComponent === LineChart ? { r: 6 } : undefined}
                        radius={ChartComponent === BarChart ? [4, 4, 0, 0] : undefined}
                      />
                    </ChartComponent>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
