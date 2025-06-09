
'use client';

import * as React from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Cpu, PlusCircle, Play, StopCircle, Trash2, Edit3, PieChart as PieChartIcon } from 'lucide-react';
import type { EcuNode, CountData } from '@/lib/types';
import { mockEcuNodes } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent, ChartLegendContent } from '@/components/ui/chart';


const initialNodeFormState: Partial<EcuNode> = {
  name: '',
  type: 'Custom',
  sendsMessages: [{ messageId: '0x', interval: 100, dataPattern: ['00'] }],
};

const NODE_STATUS_COLORS: Record<EcuNode['status'], string> = {
  Running: 'hsl(var(--chart-1))',
  Simulating: 'hsl(var(--chart-2))',
  Stopped: 'hsl(var(--chart-3))',
  Error: 'hsl(var(--chart-4))',
};

const initialChartConfig = {
  nodes: { label: "Nodes" },
  Running: { label: "Running", color: NODE_STATUS_COLORS.Running },
  Simulating: { label: "Simulating", color: NODE_STATUS_COLORS.Simulating },
  Stopped: { label: "Stopped", color: NODE_STATUS_COLORS.Stopped },
  Error: { label: "Error", color: NODE_STATUS_COLORS.Error },
} satisfies ChartConfig;


export default function NodeSimulatorPage() {
  const [nodes, setNodes] = React.useState<EcuNode[]>(mockEcuNodes);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingNode, setEditingNode] = React.useState<EcuNode | null>(null);
  const [nodeForm, setNodeForm] = React.useState<Partial<EcuNode>>(initialNodeFormState);
  const { toast } = useToast();

  const nodeStatusCounts = React.useMemo(() => {
    const counts: Record<string, number> = { Running: 0, Simulating: 0, Stopped: 0, Error: 0 };
    nodes.forEach(node => {
      counts[node.status] = (counts[node.status] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value, fill: NODE_STATUS_COLORS[name as EcuNode['status']] }))
      .filter(item => item.value > 0);
  }, [nodes]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNodeForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof EcuNode, value: string) => {
    setNodeForm(prev => ({ ...prev, [name]: value }));
  };

  const handleMessageConfigChange = (index: number, field: string, value: string | number) => {
    const updatedMessages = [...(nodeForm.sendsMessages || [])];
    if (field === 'dataPattern') {
      updatedMessages[index] = { ...updatedMessages[index], [field]: value.toString().split(' ') };
    } else {
      updatedMessages[index] = { ...updatedMessages[index], [field]: value };
    }
    setNodeForm(prev => ({ ...prev, sendsMessages: updatedMessages }));
  };

  const addMessageConfig = () => {
    setNodeForm(prev => ({
      ...prev,
      sendsMessages: [...(prev.sendsMessages || []), { messageId: '0x', interval: 100, dataPattern: ['00'] }],
    }));
  };

  const removeMessageConfig = (index: number) => {
    setNodeForm(prev => ({
      ...prev,
      sendsMessages: (prev.sendsMessages || []).filter((_, i) => i !== index),
    }));
  };
  
  const handleSubmit = () => {
    if (!nodeForm.name || !nodeForm.type) {
      toast({ title: "Error", description: "Node name and type are required.", variant: "destructive" });
      return;
    }
    if (editingNode) {
      setNodes(nodes.map(n => n.id === editingNode.id ? { ...editingNode, ...nodeForm, id: editingNode.id, status: editingNode.status } as EcuNode : n));
      toast({ title: "Node Updated", description: `Node ${nodeForm.name} has been updated.` });
    } else {
      const newNode: EcuNode = {
        id: `node-${Date.now()}`,
        status: 'Stopped',
        ...nodeForm,
      } as EcuNode;
      setNodes([...nodes, newNode]);
      toast({ title: "Node Added", description: `Node ${newNode.name} has been added.` });
    }
    setEditingNode(null);
    setNodeForm(initialNodeFormState);
    setIsModalOpen(false);
  };

  const openAddModal = () => {
    setEditingNode(null);
    setNodeForm(initialNodeFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (node: EcuNode) => {
    setEditingNode(node);
    setNodeForm(node);
    setIsModalOpen(true);
  };

  const deleteNode = (nodeId: string) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    toast({ title: "Node Deleted", description: "Node has been removed." });
  };

  const toggleNodeStatus = (nodeId: string) => {
    setNodes(nodes.map(n => n.id === nodeId ? { ...n, status: n.status === 'Running' || n.status === 'Simulating' ? 'Stopped' : 'Running' } : n));
  };

  return (
    <div>
      <PageHeader
        title="Simulated Node Dashboard"
        icon={Cpu}
        description="Create, configure, and manage virtual ECUs and sensor nodes on the bus."
        actions={
          <Button onClick={openAddModal}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Node
          </Button>
        }
      />
      {nodes.length === 0 ? (
         <Card className="flex flex-col items-center justify-center py-12 text-center">
            <CardHeader>
              <Cpu className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="font-headline text-2xl">No Nodes Simulated Yet</CardTitle>
              <CardDescription>Click "Add New Node" to start building your virtual network.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={openAddModal}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Node
                </Button>
            </CardContent>
        </Card>
      ) : (
        <>
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-accent"/> Node Status Overview
                </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
                <ChartContainer config={initialChartConfig} className="h-[200px] w-full max-w-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Tooltip content={<ChartTooltipContent hideLabel />} />
                            <Pie data={nodeStatusCounts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                                {nodeStatusCounts.map((entry) => (
                                    <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Legend content={<ChartLegendContent />} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nodes.map((node) => (
            <Card key={node.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="font-headline">{node.name}</CardTitle>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    node.status === 'Running' || node.status === 'Simulating' ? 'bg-green-500/20 text-green-400' :
                    node.status === 'Stopped' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {node.status}
                  </span>
                </div>
                <CardDescription>{node.type}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground mb-1">Sends:</p>
                {node.sendsMessages && node.sendsMessages.length > 0 ? (
                  <ul className="list-disc pl-5 text-sm font-code">
                    {node.sendsMessages.slice(0,3).map((msg, idx) => (
                      <li key={idx}>{msg.messageId} @ {msg.interval}ms</li>
                    ))}
                    {node.sendsMessages.length > 3 && <li>...and {node.sendsMessages.length - 3} more</li>}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground font-code">No messages configured.</p>
                )}
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => toggleNodeStatus(node.id)}>
                  {node.status === 'Running' || node.status === 'Simulating' ? <StopCircle className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                  {node.status === 'Running' || node.status === 'Simulating' ? 'Stop' : 'Start'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => openEditModal(node)}><Edit3 className="mr-2 h-4 w-4" /> Edit</Button>
                <Button variant="ghost" size="sm" onClick={() => deleteNode(node.id)} className="text-destructive hover:text-destructive/80"><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        </>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingNode ? 'Edit Node' : 'Add New Node'}</DialogTitle>
            <DialogDescription>
              Configure the properties of your virtual ECU or sensor node.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" name="name" value={nodeForm.name || ''} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
              <Select value={nodeForm.type || ''} onValueChange={(value) => handleSelectChange('type', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select node type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Engine ECU">Engine ECU</SelectItem>
                  <SelectItem value="Brake ECU">Brake ECU</SelectItem>
                  <SelectItem value="Sensor Node">Sensor Node</SelectItem>
                  <SelectItem value="Gateway">Gateway</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="block mb-2">Messages to Send:</Label>
              {(nodeForm.sendsMessages || []).map((msgConfig, index) => (
                <Card key={index} className="mb-2 p-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                    <Input 
                      placeholder="Message ID (e.g., 0x1A0)" 
                      value={msgConfig.messageId} 
                      onChange={(e) => handleMessageConfigChange(index, 'messageId', e.target.value)}
                      className="font-code" 
                    />
                    <Input 
                      type="number"
                      placeholder="Interval (ms)" 
                      value={msgConfig.interval} 
                      onChange={(e) => handleMessageConfigChange(index, 'interval', parseInt(e.target.value))}
                      className="font-code"
                    />
                     <Input 
                      placeholder="Data Pattern (hex, space separated)" 
                      value={Array.isArray(msgConfig.dataPattern) ? msgConfig.dataPattern.join(' ') : msgConfig.dataPattern}
                      onChange={(e) => handleMessageConfigChange(index, 'dataPattern', e.target.value)}
                      className="font-code"
                    />
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeMessageConfig(index)} className="mt-1 text-destructive hover:text-destructive">Remove</Button>
                </Card>
              ))}
              <Button variant="outline" size="sm" onClick={addMessageConfig}>Add Message Config</Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingNode ? 'Save Changes' : 'Add Node'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
