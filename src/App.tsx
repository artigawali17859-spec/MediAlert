/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AddMedicine from './components/AddMedicine';
import History from './components/History';
import Auth from './components/Auth';
import ReminderModal from './components/ReminderModal';
import { Medicine, MedicineLog, MedicineStatus, MedicineFrequency } from './types';
import { Toaster, toast } from 'sonner';
import { requestNotificationPermission, showNotification, playAlertSound } from './lib/notifications';
import { format, addMinutes, isAfter, parseISO } from 'date-fns';

export default function App() {
  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem('medialert_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    const saved = localStorage.getItem('medialert_medicines');
    return saved ? JSON.parse(saved) : [];
  });
  const [logs, setLogs] = useState<MedicineLog[]>(() => {
    const saved = localStorage.getItem('medialert_logs');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeReminder, setActiveReminder] = useState<MedicineLog | null>(null);
  const [isReminderOpen, setIsReminderOpen] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem('medialert_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('medialert_medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('medialert_logs', JSON.stringify(logs));
  }, [logs]);

  // Request notification permission
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Generate logs for today if they don't exist
  useEffect(() => {
    if (!user || medicines.length === 0) return;

    const today = format(new Date(), 'yyyy-MM-dd');
    const existingLogsToday = logs.filter(l => l.date === today);
    
    const newLogs: MedicineLog[] = [];
    medicines.forEach(med => {
      // Check if logs for this medicine exist for today
      const medLogsToday = existingLogsToday.filter(l => l.medicineId === med.id);
      
      if (medLogsToday.length === 0) {
        // Create logs for each scheduled time
        med.times.forEach(time => {
          newLogs.push({
            id: Math.random().toString(36).substr(2, 9),
            medicineId: med.id,
            userId: user.uid,
            date: today,
            scheduledTime: time,
            status: MedicineStatus.PENDING,
          });
        });
      }
    });

    if (newLogs.length > 0) {
      setLogs(prev => [...prev, ...newLogs]);
    }
  }, [user, medicines]);

  // Check for reminders
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = format(now, 'HH:mm');
      const todayDate = format(now, 'yyyy-MM-dd');

      const pendingReminders = logs.filter(log => 
        log.date === todayDate && 
        log.scheduledTime === currentTime && 
        log.status === MedicineStatus.PENDING
      );

      if (pendingReminders.length > 0 && !isReminderOpen) {
        const log = pendingReminders[0];
        setActiveReminder(log);
        setIsReminderOpen(true);
        playAlertSound();
        const med = medicines.find(m => m.id === log.medicineId);
        if (med) {
          showNotification("Medicine Reminder", `Time to take ${med.name} (${med.dosage})`);
        }
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [logs, medicines, isReminderOpen]);

  const handleLogin = (email: string, pass: string) => {
    setUser({ uid: '123', name: 'Aditya Gawali', email });
    toast.success('Logged in successfully');
  };

  const handleRegister = (name: string, email: string, pass: string) => {
    setUser({ uid: '123', name, email });
    toast.success('Account created successfully');
  };

  const handleLogout = () => {
    setUser(null);
    toast.info('Logged out');
  };

  const handleAddMedicine = (medData: any) => {
    const newMed: Medicine = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.uid,
      ...medData,
      createdAt: new Date().toISOString(),
    };

    setMedicines([...medicines, newMed]);
    
    // Create initial logs for today
    const today = format(new Date(), 'yyyy-MM-dd');
    const newLogs: MedicineLog[] = newMed.times.map(time => ({
      id: Math.random().toString(36).substr(2, 9),
      medicineId: newMed.id,
      userId: user.uid,
      date: today,
      scheduledTime: time,
      status: MedicineStatus.PENDING,
    }));

    setLogs([...logs, ...newLogs]);
    setActiveTab('dashboard');
    toast.success('Medicine added successfully');
  };

  const handleMarkAsTaken = (log: MedicineLog) => {
    const updatedLogs = logs.map(l => 
      l.id === log.id 
        ? { ...l, status: MedicineStatus.TAKEN, takenAt: new Date().toISOString() } 
        : l
    );
    setLogs(updatedLogs);
    setIsReminderOpen(false);
    setActiveReminder(null);
    toast.success('Marked as taken');
  };

  const handleSnooze = (log: MedicineLog) => {
    const snoozeTime = addMinutes(new Date(), 10);
    const updatedLogs = logs.map(l => 
      l.id === log.id 
        ? { ...l, scheduledTime: format(snoozeTime, 'HH:mm') } 
        : l
    );
    setLogs(updatedLogs);
    setIsReminderOpen(false);
    setActiveReminder(null);
    toast.info('Snoozed for 10 minutes');
  };

  if (!user) {
    return (
      <>
        <Auth onLogin={handleLogin} onRegister={handleRegister} />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab} 
      onLogout={handleLogout}
      userName={user.name}
    >
      {activeTab === 'dashboard' && (
        <Dashboard 
          medicines={medicines} 
          logs={logs} 
          onMarkAsTaken={handleMarkAsTaken}
          onSnooze={handleSnooze}
        />
      )}
      {activeTab === 'add' && (
        <AddMedicine 
          onAdd={handleAddMedicine} 
          onCancel={() => setActiveTab('dashboard')} 
        />
      )}
      {activeTab === 'history' && (
        <History medicines={medicines} logs={logs} />
      )}

      <ReminderModal 
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
        log={activeReminder}
        medicine={medicines.find(m => m.id === activeReminder?.medicineId) || null}
        onTake={() => activeReminder && handleMarkAsTaken(activeReminder)}
        onSnooze={() => activeReminder && handleSnooze(activeReminder)}
      />
      <Toaster position="top-right" />
    </Layout>
  );
}

