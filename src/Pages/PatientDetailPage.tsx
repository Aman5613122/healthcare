import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft, Phone, Mail, Heart, Activity, Thermometer,
  Droplets, Calendar, MapPin, User, Pill, Tag,
  AlertTriangle, CheckCircle, Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_VITALS_HISTORY = [
  { time: '6h ago', hr: 82, spo2: 95, temp: 98.8 },
  { time: '5h ago', hr: 79, spo2: 96, temp: 98.6 },
  { time: '4h ago', hr: 85, spo2: 94, temp: 99.1 },
  { time: '3h ago', hr: 88, spo2: 93, temp: 99.4 },
  { time: '2h ago', hr: 92, spo2: 92, temp: 99.8 },
  { time: '1h ago', hr: 96, spo2: 91, temp: 100.2 },
  { time: 'Now', hr: 104, spo2: 91, temp: 101.2 },
];

export const PatientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state } = useApp();
  const navigate = useNavigate();

  const patient = state.patients.find(p => p.id === id);

  if (!patient) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 80 }}>
      <AlertTriangle size={48} style={{ color: '#f59e0b', marginBottom: 16 }} />
      <h2 style={{ color: '#fff', marginBottom: 8 }}>Patient Not Found</h2>
      <button onClick={() => navigate('/patients')} style={backBtnStyle}>← Back to Patients</button>
    </div>
  );

  const statusColors: Record<string, string> = {
    Critical: '#ef4444', Active: '#f59e0b', Stable: '#10b981', Discharged: '#6b7280'
  };

  return (
    <div style={styles.page}>
      {/* Back + Header */}
      <div style={styles.pageHeader}>
        <button onClick={() => navigate('/patients')} style={styles.backBtn}>
          <ArrowLeft size={16} /> Back to Patients
        </button>
      </div>

      {/* Hero Card */}
      <div style={styles.heroCard}>
        <div style={styles.heroLeft}>
          <div style={styles.bigAvatar}>{patient.avatar}</div>
          <div style={styles.heroInfo}>
            <div style={styles.heroName}>{patient.name}</div>
            <div style={styles.heroId}>{patient.id}</div>
            <div style={styles.heroBadges}>
              <span style={{ ...styles.statusBadge, color: statusColors[patient.status], background: `${statusColors[patient.status]}18` }}>
                {patient.status === 'Critical' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', display: 'inline-block', marginRight: 5, animation: 'pulse-dot 1.5s infinite' }} />}
                {patient.status}
              </span>
              <span style={styles.bloodBadge}>{patient.bloodType}</span>
            </div>
          </div>
        </div>

        <div style={styles.heroStats}>
          {[
            { label: 'Age', value: `${patient.age} yrs`, icon: <User size={16} /> },
            { label: 'Gender', value: patient.gender, icon: <User size={16} /> },
            { label: 'Ward', value: patient.ward, icon: <MapPin size={16} /> },
            { label: 'Doctor', value: patient.doctor, icon: <User size={16} /> },
            { label: 'Admitted', value: new Date(patient.admittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), icon: <Calendar size={16} /> },
            { label: 'Next Appt', value: new Date(patient.nextAppointment).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), icon: <Clock size={16} /> },
          ].map((s, i) => (
            <div key={i} style={styles.heroStat}>
              <span style={styles.heroStatIcon}>{s.icon}</span>
              <div>
                <div style={styles.heroStatLabel}>{s.label}</div>
                <div style={styles.heroStatValue}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.heroContact}>
          <a href={`tel:${patient.phone}`} style={styles.contactItem}>
            <Phone size={14} /> {patient.phone}
          </a>
          <a href={`mailto:${patient.email}`} style={styles.contactItem}>
            <Mail size={14} /> {patient.email}
          </a>
          <div style={styles.tagsWrap}>
            {patient.tags.map(t => (
              <span key={t} style={styles.tag}><Tag size={10} /> {t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Vitals Row */}
      <div style={styles.vitalsGrid}>
        {[
          { label: 'Heart Rate', value: patient.vitals.heartRate, unit: 'bpm', icon: <Heart size={20} />, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', normal: '60–100' },
          { label: 'Blood Pressure', value: patient.vitals.bloodPressure, unit: 'mmHg', icon: <Activity size={20} />, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)', normal: '<120/80' },
          { label: 'Temperature', value: patient.vitals.temperature, unit: '°F', icon: <Thermometer size={20} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', normal: '97–99' },
          { label: 'SpO₂', value: `${patient.vitals.oxygenSaturation}%`, unit: '', icon: <Droplets size={20} />, color: '#10b981', bg: 'rgba(16,185,129,0.1)', normal: '>95%' },
        ].map((v, i) => (
          <div key={i} style={styles.vitalCard}>
            <div style={{ ...styles.vitalIcon, color: v.color, background: v.bg }}>{v.icon}</div>
            <div style={{ ...styles.vitalValue, color: v.color }}>{v.value}<span style={styles.vitalUnit}>{v.unit}</span></div>
            <div style={styles.vitalLabel}>{v.label}</div>
            <div style={styles.vitalNormal}>Normal: {v.normal}</div>
          </div>
        ))}
      </div>

      {/* Charts + Meds */}
      <div style={styles.bottomGrid}>
        {/* Vitals Chart */}
        <div style={styles.chartCard}>
          <h3 style={styles.sectionTitle}>Vitals Trend (Last 6 Hours)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MOCK_VITALS_HISTORY} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#0e1e35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
              />
              <Line type="monotone" dataKey="hr" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 3 }} name="Heart Rate" />
              <Line type="monotone" dataKey="spo2" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} name="SpO₂" />
            </LineChart>
          </ResponsiveContainer>
          <div style={styles.chartLegend}>
            <span style={styles.legendItem}><span style={{ ...styles.legendDot, background: '#ef4444' }} />Heart Rate</span>
            <span style={styles.legendItem}><span style={{ ...styles.legendDot, background: '#10b981' }} />SpO₂</span>
          </div>
        </div>

        {/* Medications + Info */}
        <div style={styles.sideCards}>
          <div style={styles.medCard}>
            <h3 style={styles.sectionTitle}>
              <Pill size={16} style={{ color: '#8b5cf6' }} /> Current Medications
            </h3>
            <div style={styles.medList}>
              {patient.medications.map((med, i) => (
                <div key={i} style={styles.medItem}>
                  <div style={styles.medDot} />
                  <span style={styles.medName}>{med}</span>
                  <span style={styles.medStatus}>Active</span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.infoCard}>
            <h3 style={styles.sectionTitle}>Admission Notes</h3>
            <div style={styles.notesList}>
              <div style={styles.note}>
                <CheckCircle size={14} style={{ color: '#10b981', flexShrink: 0 }} />
                <span>Patient admitted on {new Date(patient.admittedDate).toLocaleDateString()} for {patient.condition}</span>
              </div>
              <div style={styles.note}>
                <Clock size={14} style={{ color: '#f59e0b', flexShrink: 0 }} />
                <span>Next appointment scheduled: {new Date(patient.nextAppointment).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              </div>
              {patient.status === 'Critical' && (
                <div style={{ ...styles.note, color: '#fca5a5' }}>
                  <AlertTriangle size={14} style={{ color: '#ef4444', flexShrink: 0 }} />
                  <span>Patient is in critical condition — continuous monitoring required</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const backBtnStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8, color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: '8px 16px', fontSize: 14,
};

const styles: Record<string, React.CSSProperties> = {
  page: { display: 'flex', flexDirection: 'column', gap: 20, fontFamily: "'DM Sans', sans-serif" },
  pageHeader: { display: 'flex', alignItems: 'center' },
  backBtn: {
    display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer', padding: '8px 16px', fontSize: 13, transition: 'all 0.2s',
  },
  heroCard: {
    background: '#0a1628', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 20, padding: '28px 32px', display: 'flex', gap: 40, flexWrap: 'wrap',
  },
  heroLeft: { display: 'flex', alignItems: 'flex-start', gap: 18, flexShrink: 0 },
  bigAvatar: {
    width: 72, height: 72, borderRadius: 18,
    background: 'linear-gradient(135deg, #1e3a5f, #06b6d4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontSize: 24, fontWeight: 700,
  },
  heroInfo: { display: 'flex', flexDirection: 'column', gap: 6 },
  heroName: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 26, color: '#fff' },
  heroId: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },
  heroBadges: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  statusBadge: { display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  bloodBadge: {
    background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
    borderRadius: 20, padding: '4px 12px', color: '#a78bfa', fontSize: 12, fontWeight: 600,
  },
  heroStats: { flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
  heroStat: { display: 'flex', alignItems: 'flex-start', gap: 10 },
  heroStatIcon: { color: '#06b6d4', marginTop: 2 },
  heroStatLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 },
  heroStatValue: { color: '#fff', fontSize: 14, fontWeight: 500, marginTop: 2 },
  heroContact: { display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center', flexShrink: 0 },
  contactItem: { display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none' },
  tagsWrap: { display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 },
  tag: {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: 6, padding: '2px 8px', color: '#818cf8', fontSize: 11,
  },
  vitalsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 },
  vitalCard: {
    background: '#0a1628', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16, padding: '20px', display: 'flex', flexDirection: 'column', gap: 6,
  },
  vitalIcon: { width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  vitalValue: { fontSize: 32, fontFamily: "'Syne', sans-serif", fontWeight: 700, marginTop: 4 },
  vitalUnit: { fontSize: 14, fontWeight: 400, marginLeft: 4, color: 'rgba(255,255,255,0.5)' },
  vitalLabel: { color: '#fff', fontSize: 14, fontWeight: 500 },
  vitalNormal: { color: 'rgba(255,255,255,0.3)', fontSize: 12 },
  bottomGrid: { display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16 },
  chartCard: {
    background: '#0a1628', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16, padding: '24px',
  },
  sectionTitle: { color: '#fff', fontWeight: 600, fontSize: 15, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 },
  chartLegend: { display: 'flex', gap: 16, marginTop: 12 },
  legendItem: { display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  legendDot: { width: 8, height: 8, borderRadius: '50%', display: 'inline-block' },
  sideCards: { display: 'flex', flexDirection: 'column', gap: 16 },
  medCard: {
    background: '#0a1628', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16, padding: '24px', flex: 1,
  },
  medList: { display: 'flex', flexDirection: 'column', gap: 10 },
  medItem: { display: 'flex', alignItems: 'center', gap: 10 },
  medDot: { width: 6, height: 6, borderRadius: '50%', background: '#8b5cf6', flexShrink: 0 },
  medName: { flex: 1, color: 'rgba(255,255,255,0.75)', fontSize: 14 },
  medStatus: {
    fontSize: 11, color: '#10b981',
    background: 'rgba(16,185,129,0.1)', borderRadius: 10, padding: '2px 8px',
  },
  infoCard: {
    background: '#0a1628', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16, padding: '24px',
  },
  notesList: { display: 'flex', flexDirection: 'column', gap: 12 },
  note: { display: 'flex', alignItems: 'flex-start', gap: 8, color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.5 },
};