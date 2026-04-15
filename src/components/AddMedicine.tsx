import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MedicineFrequency } from '@/types';
import { Plus, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface AddMedicineProps {
  onAdd: (medicine: any) => void;
  onCancel: () => void;
}

export default function AddMedicine({ onAdd, onCancel }: AddMedicineProps) {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState<MedicineFrequency>(MedicineFrequency.ONCE_A_DAY);
  const [times, setTimes] = useState<string[]>(['08:00']);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [notes, setNotes] = useState('');

  const handleAddTime = () => {
    setTimes([...times, '12:00']);
  };

  const handleRemoveTime = (index: number) => {
    setTimes(times.filter((_, i) => i !== index));
  };

  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...times];
    newTimes[index] = value;
    setTimes(newTimes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name,
      dosage,
      frequency,
      times,
      startDate: startDate.toISOString(),
      endDate: endDate?.toISOString(),
      notes,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Add New Medicine</h2>
        <p className="text-gray-500 mt-1">Set up your medication schedule and reminders.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-white border-none shadow-sm">
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Medicine Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Paracetamol" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input 
                  id="dosage" 
                  placeholder="e.g. 500mg" 
                  value={dosage} 
                  onChange={(e) => setDosage(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select 
                value={frequency} 
                onValueChange={(val) => setFrequency(val as MedicineFrequency)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={MedicineFrequency.ONCE_A_DAY}>Once a day</SelectItem>
                  <SelectItem value={MedicineFrequency.TWICE_A_DAY}>Twice a day</SelectItem>
                  <SelectItem value={MedicineFrequency.CUSTOM}>Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Reminder Times</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {times.map((time, index) => (
                  <div key={index} className="flex gap-2">
                    <Input 
                      type="time" 
                      value={time} 
                      onChange={(e) => handleTimeChange(index, e.target.value)}
                      required 
                    />
                    {times.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleRemoveTime(index)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    )}
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  className="border-dashed border-gray-300 text-gray-500"
                  onClick={handleAddTime}
                >
                  <Plus size={18} className="mr-2" />
                  Add Time
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger render={
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  } />
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>End Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger render={
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span>No end date</span>}
                    </Button>
                  } />
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input 
                id="notes" 
                placeholder="e.g. Take after food" 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8">
            Save Medicine
          </Button>
        </div>
      </form>
    </div>
  );
}
