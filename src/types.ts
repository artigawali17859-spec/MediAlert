export enum MedicineFrequency {
  ONCE_A_DAY = 'Once a day',
  TWICE_A_DAY = 'Twice a day',
  CUSTOM = 'Custom',
}

export enum MedicineStatus {
  TAKEN = 'Taken',
  PENDING = 'Pending',
  MISSED = 'Missed',
}

export interface Medicine {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  frequency: MedicineFrequency;
  times: string[]; // ISO time strings like "08:00"
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  notes?: string;
  createdAt: string;
}

export interface MedicineLog {
  id: string;
  medicineId: string;
  userId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  scheduledTime: string; // "08:00"
  status: MedicineStatus;
  takenAt?: string; // ISO timestamp
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
}
