export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodType: string;
  condition: string;
  status: 'Active' | 'Critical' | 'Stable' | 'Discharged';
  doctor: string;
  ward: string;
  admittedDate: string;
  nextAppointment: string;
  phone: string;
  email: string;
  avatar: string;
  vitals: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    oxygenSaturation: number;
  };
  medications: string[];
  tags: string[];
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface NotificationInterface {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  timestamp: Date;
  read: boolean;
  patientId?: string;
}

export interface AnalyticsData {
  month: string;
  admissions: number;
  discharges: number;
  revenue: number;
  satisfaction: number;
}

export interface DepartmentStat {
  name: string;
  patients: number;
  capacity: number;
  color: string;
}