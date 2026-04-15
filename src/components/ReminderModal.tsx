import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bell, Pill, CheckCircle2, Clock } from 'lucide-react';
import { Medicine, MedicineLog } from '@/types';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: MedicineLog | null;
  medicine: Medicine | null;
  onTake: () => void;
  onSnooze: () => void;
}

export default function ReminderModal({ isOpen, onClose, log, medicine, onTake, onSnooze }: ReminderModalProps) {
  if (!log || !medicine) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-none shadow-2xl">
        <DialogHeader className="flex flex-col items-center text-center pt-4">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4 animate-bounce">
            <Bell size={40} />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900">Medicine Reminder</DialogTitle>
          <DialogDescription className="text-lg mt-2">
            It's time to take your medication.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gray-50 rounded-2xl p-6 my-4 flex items-center gap-4 border border-gray-100">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
            <Pill size={24} />
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900">{medicine.name}</h4>
            <p className="text-gray-500 font-medium">{medicine.dosage}</p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:space-x-3 pt-4">
          <Button 
            variant="outline" 
            className="flex-1 py-6 text-lg border-gray-200"
            onClick={onSnooze}
          >
            <Clock className="mr-2" size={20} />
            Snooze 10m
          </Button>
          <Button 
            className="flex-1 py-6 text-lg bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={onTake}
          >
            <CheckCircle2 className="mr-2" size={20} />
            Mark as Taken
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
