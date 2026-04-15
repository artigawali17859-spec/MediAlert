import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, AlertCircle, Pill } from 'lucide-react';
import { Medicine, MedicineLog, MedicineStatus } from '@/types';
import { format, isToday, parseISO } from 'date-fns';

interface DashboardProps {
  medicines: Medicine[];
  logs: MedicineLog[];
  onMarkAsTaken: (log: MedicineLog) => void;
  onSnooze: (log: MedicineLog) => void;
}

export default function Dashboard({ medicines, logs, onMarkAsTaken, onSnooze }: DashboardProps) {
  const todayLogs = logs.filter(log => isToday(parseISO(log.date)));
  
  const pending = todayLogs.filter(l => l.status === MedicineStatus.PENDING);
  const taken = todayLogs.filter(l => l.status === MedicineStatus.TAKEN);
  const missed = todayLogs.filter(l => l.status === MedicineStatus.MISSED);

  const getMedicineName = (id: string) => medicines.find(m => m.id === id)?.name || 'Unknown Medicine';
  const getMedicineDosage = (id: string) => medicines.find(m => m.id === id)?.dosage || '';

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Today's Schedule</h2>
        <p className="text-gray-500 mt-1">{format(new Date(), 'EEEE, MMMM do')}</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pending.length}</p>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                <Clock size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Taken</p>
                <p className="text-2xl font-bold text-gray-900">{taken.length}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                <CheckCircle2 size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Missed</p>
                <p className="text-2xl font-bold text-gray-900">{missed.length}</p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                <AlertCircle size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Reminders</h3>
        {todayLogs.length === 0 ? (
          <Card className="border-dashed border-2 bg-transparent">
            <CardContent className="py-12 flex flex-col items-center justify-center text-gray-500">
              <Pill size={48} className="mb-4 opacity-20" />
              <p>No medicines scheduled for today.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {todayLogs.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime)).map((log) => (
              <Card key={log.id} className="bg-white border-none shadow-sm overflow-hidden group">
                <div className="flex items-center p-4 gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    log.status === MedicineStatus.TAKEN ? "bg-emerald-50 text-emerald-600" :
                    log.status === MedicineStatus.MISSED ? "bg-red-50 text-red-600" :
                    "bg-blue-50 text-blue-600"
                  )}>
                    <Clock size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900 truncate">{getMedicineName(log.medicineId)}</h4>
                      <Badge variant={
                        log.status === MedicineStatus.TAKEN ? "success" :
                        log.status === MedicineStatus.MISSED ? "destructive" :
                        "secondary"
                      } className="text-[10px] uppercase tracking-wider">
                        {log.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{getMedicineDosage(log.medicineId)} • {log.scheduledTime}</p>
                  </div>
                  <div className="flex gap-2">
                    {log.status === MedicineStatus.PENDING && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-gray-600"
                          onClick={() => onSnooze(log)}
                        >
                          Snooze
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => onMarkAsTaken(log)}
                        >
                          Take Now
                        </Button>
                      </>
                    )}
                    {log.status === MedicineStatus.TAKEN && (
                      <div className="text-emerald-600 flex items-center gap-1 text-sm font-medium">
                        <CheckCircle2 size={16} />
                        Taken at {format(parseISO(log.takenAt!), 'HH:mm')}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper for conditional classes
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
