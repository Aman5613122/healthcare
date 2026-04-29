import { Patient, AnalyticsData, DepartmentStat } from '../types';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'P001', name: 'Eleanor Voss', age: 54, gender: 'Female', bloodType: 'A+',
    condition: 'Hypertension', status: 'Stable', doctor: 'Dr. Marcus Reid',
    ward: 'Cardiology', admittedDate: '2024-01-15', nextAppointment: '2024-02-20',
    phone: '+1 (555) 234-5678', email: 'e.voss@email.com', avatar: 'EV',
    vitals: { heartRate: 78, bloodPressure: '130/85', temperature: 98.6, oxygenSaturation: 97 },
    medications: ['Lisinopril', 'Amlodipine'], tags: ['High Risk', 'Follow-up']
  },
  {
    id: 'P002', name: 'James Thornton', age: 67, gender: 'Male', bloodType: 'O-',
    condition: 'Diabetes Type 2', status: 'Active', doctor: 'Dr. Priya Sharma',
    ward: 'Endocrinology', admittedDate: '2024-01-20', nextAppointment: '2024-02-18',
    phone: '+1 (555) 345-6789', email: 'j.thornton@email.com', avatar: 'JT',
    vitals: { heartRate: 82, bloodPressure: '140/90', temperature: 98.4, oxygenSaturation: 96 },
    medications: ['Metformin', 'Glipizide', 'Insulin'], tags: ['Chronic', 'Diet Plan']
  },
  {
    id: 'P003', name: 'Sofia Mendez', age: 38, gender: 'Female', bloodType: 'B+',
    condition: 'Pneumonia', status: 'Critical', doctor: 'Dr. Alan Brooks',
    ward: 'Pulmonology', admittedDate: '2024-01-28', nextAppointment: '2024-02-10',
    phone: '+1 (555) 456-7890', email: 's.mendez@email.com', avatar: 'SM',
    vitals: { heartRate: 104, bloodPressure: '110/70', temperature: 101.2, oxygenSaturation: 91 },
    medications: ['Azithromycin', 'Prednisone', 'Albuterol'], tags: ['ICU Watch', 'Oxygen Therapy']
  },
  {
    id: 'P004', name: 'Robert Chen', age: 72, gender: 'Male', bloodType: 'AB+',
    condition: 'Post-Hip Replacement', status: 'Stable', doctor: 'Dr. Nina Patel',
    ward: 'Orthopedics', admittedDate: '2024-01-10', nextAppointment: '2024-02-25',
    phone: '+1 (555) 567-8901', email: 'r.chen@email.com', avatar: 'RC',
    vitals: { heartRate: 70, bloodPressure: '125/80', temperature: 98.8, oxygenSaturation: 98 },
    medications: ['Warfarin', 'Oxycodone', 'Calcium'], tags: ['Post-Op', 'Physical Therapy']
  },
  {
    id: 'P005', name: 'Amara Okafor', age: 29, gender: 'Female', bloodType: 'O+',
    condition: 'Appendectomy Recovery', status: 'Discharged', doctor: 'Dr. Marcus Reid',
    ward: 'General Surgery', admittedDate: '2024-01-25', nextAppointment: '2024-02-15',
    phone: '+1 (555) 678-9012', email: 'a.okafor@email.com', avatar: 'AO',
    vitals: { heartRate: 72, bloodPressure: '118/75', temperature: 98.2, oxygenSaturation: 99 },
    medications: ['Amoxicillin', 'Ibuprofen'], tags: ['Discharged', 'Outpatient Follow-up']
  },
  {
    id: 'P006', name: 'David Kowalski', age: 45, gender: 'Male', bloodType: 'A-',
    condition: 'Coronary Artery Disease', status: 'Critical', doctor: 'Dr. Sarah Kim',
    ward: 'Cardiology', admittedDate: '2024-01-29', nextAppointment: '2024-02-12',
    phone: '+1 (555) 789-0123', email: 'd.kowalski@email.com', avatar: 'DK',
    vitals: { heartRate: 95, bloodPressure: '155/100', temperature: 99.1, oxygenSaturation: 93 },
    medications: ['Aspirin', 'Atorvastatin', 'Metoprolol', 'Nitroglycerin'], tags: ['High Risk', 'Cardiac Monitor']
  },
  {
    id: 'P007', name: 'Lily Zhang', age: 61, gender: 'Female', bloodType: 'B-',
    condition: 'Breast Cancer Stage II', status: 'Active', doctor: 'Dr. Priya Sharma',
    ward: 'Oncology', admittedDate: '2024-01-05', nextAppointment: '2024-02-22',
    phone: '+1 (555) 890-1234', email: 'l.zhang@email.com', avatar: 'LZ',
    vitals: { heartRate: 76, bloodPressure: '122/78', temperature: 98.6, oxygenSaturation: 97 },
    medications: ['Tamoxifen', 'Zofran', 'Dexamethasone'], tags: ['Chemotherapy', 'Oncology']
  },
  {
    id: 'P008', name: 'Michael Torres', age: 33, gender: 'Male', bloodType: 'O+',
    condition: 'Kidney Stones', status: 'Active', doctor: 'Dr. Alan Brooks',
    ward: 'Nephrology', admittedDate: '2024-01-27', nextAppointment: '2024-02-14',
    phone: '+1 (555) 901-2345', email: 'm.torres@email.com', avatar: 'MT',
    vitals: { heartRate: 88, bloodPressure: '128/82', temperature: 98.9, oxygenSaturation: 98 },
    medications: ['Hydrocodone', 'Tamsulosin', 'Ketorolac'], tags: ['Pain Management', 'Urology']
  },
];

export const ANALYTICS_DATA: AnalyticsData[] = [
  { month: 'Aug', admissions: 245, discharges: 228, revenue: 485000, satisfaction: 87 },
  { month: 'Sep', admissions: 312, discharges: 298, revenue: 612000, satisfaction: 89 },
  { month: 'Oct', admissions: 289, discharges: 275, revenue: 571000, satisfaction: 85 },
  { month: 'Nov', admissions: 334, discharges: 321, revenue: 658000, satisfaction: 91 },
  { month: 'Dec', admissions: 278, discharges: 265, revenue: 549000, satisfaction: 88 },
  { month: 'Jan', admissions: 356, discharges: 341, revenue: 702000, satisfaction: 92 },
];

export const DEPARTMENT_STATS: DepartmentStat[] = [
  { name: 'Cardiology', patients: 48, capacity: 60, color: '#ef4444' },
  { name: 'Oncology', patients: 35, capacity: 40, color: '#8b5cf6' },
  { name: 'Orthopedics', patients: 29, capacity: 45, color: '#3b82f6' },
  { name: 'Pulmonology', patients: 22, capacity: 30, color: '#10b981' },
  { name: 'Neurology', patients: 31, capacity: 35, color: '#f59e0b' },
  { name: 'Nephrology', patients: 18, capacity: 25, color: '#ec4899' },
];