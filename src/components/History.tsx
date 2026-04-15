import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Medicine, MedicineLog, MedicineStatus } from '@/types';
import { format, parseISO } from 'date-fns';
import { Pill } from 'lucide-react';

interface HistoryProps {
  medicines: Medicine[];
  logs: MedicineLog[];
}

export default function History({ medicines, logs }: HistoryProps) {
  const getMedicineName = (id: string) => medicines.find(m => m.id === id)?.name || 'Unknown Medicine';

  const sortedLogs = [...logs].sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date);
    if (dateCompare !== 0) return dateCompare;
    return b.scheduledTime.localeCompare(a.scheduledTime);
  });

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Medicine History</h2>
        <p className="text-gray-500 mt-1">Track your medication adherence over time.</p>
      </header>

      <Card className="bg-white border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {sortedLogs.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-500">
              <Pill size={48} className="mb-4 opacity-20" />
              <p>No history records found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Medicine</TableHead>
                  <TableHead className="font-semibold">Scheduled</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Taken At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-medium text-gray-900">
                      {format(parseISO(log.date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-gray-700">{getMedicineName(log.medicineId)}</TableCell>
                    <TableCell className="text-gray-500">{log.scheduledTime}</TableCell>
                    <TableCell>
                      <Badge variant={
                        log.status === MedicineStatus.TAKEN ? "success" :
                        log.status === MedicineStatus.MISSED ? "destructive" :
                        "secondary"
                      } className="text-[10px] uppercase tracking-wider">
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {log.takenAt ? format(parseISO(log.takenAt), 'HH:mm') : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
