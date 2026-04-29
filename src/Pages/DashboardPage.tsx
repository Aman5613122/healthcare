import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DEPARTMENT_STATS } from '../utils/mockData';
import {
  Users, Activity, TrendingUp, AlertTriangle,
  Heart, Clock, CheckCircle, ArrowUpRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ANALYTICS_DATA } from '../utils/mockData';

export const DashboardPage: React.FC = () => {
  const { state } = useApp();
  const navigate = useNavigate();

  const critical = state.patients.filter(p => p.status === 'Critical').length;
  const active = state.patients.filter(p => p.status === 'Active').length;
  const stable = state.patients.filter(p => p.status === 'Stable').length;
  const discharged = state.patients.filter(p => p.status === 'Discharged').length;

  const metrics = [
    { label: 'Total Patients', value: state.patients.length, icon: <Users size={20} />, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)', trend: '+12%', sub: 'vs last month' },
    { label: 'Critical Cases', value: critical, icon: <AlertTriangle size={20} />, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', trend: '-2', sub: 'from yesterday' },
    { label: 'Active Patients', value: active, icon: <Activity size={20} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', trend: '+5', sub: 'new today' },
    { label: 'Discharged Today', value: discharged, icon: <CheckCircle size={20} />, color: '#10b981', bg: 'rgba(16,185,129,0.1)', trend: '+3', sub: 'from target' },
  ];

  const recentPatients = state.patients.slice(0, 5);

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>
            Good morning, {state.user?.displayName?.split(' ')[0] || 'Admin'} — here's your facility overview
          </p>
        </div>
        <div style={styles.dateBadge}>
          <Clock size={14} />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={styles.metricsGrid}>
        {metrics.map((m, i) => (
          <div key={i} style={styles.metricCard}>
            <div style={styles.metricTop}>
              <div style={{ ...styles.metricIcon, background: m.bg, color: m.color }}>
                {m.icon}
              </div>
              <div style={{ ...styles.metricTrend, color: m.trend.startsWith('+') ? '#10b981' : '#ef4444' }}>
                <ArrowUpRight size={12} />
                {m.trend}
              </div>
            </div>
            <div style={{ ...styles.metricValue, color: m.color }}>{m.value}</div>
            <div style={styles.metricLabel}>{m.label}</div>
            <div style={styles.metricSub}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={styles.chartsRow}>
        {/* Admissions Chart */}
        <div style={styles.chartCard}>
          <div style={styles.cardHeader}>
            <div>
              <h3 style={styles.cardTitle}>Patient Admissions</h3>
              <p style={styles.cardSub}>6-month trend overview</p>
            </div>
            <TrendingUp size={18} style={{ color: '#06b6d4' }} />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={ANALYTICS_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="admGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="disGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#0e1e35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}
                labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
              />
              <Area type="monotone" dataKey="admissions" stroke="#06b6d4" fill="url(#admGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="discharges" stroke="#3b82f6" fill="url(#disGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div style={styles.chartLegend}>
            <span style={styles.legendItem}><span style={{ ...styles.legendDot, background: '#06b6d4' }} />Admissions</span>
            <span style={styles.legendItem}><span style={{ ...styles.legendDot, background: '#3b82f6' }} />Discharges</span>
          </div>
        </div>

        {/* Department capacity */}
        <div style={styles.chartCard}>
          <div style={styles.cardHeader}>
            <div>
              <h3 style={styles.cardTitle}>Ward Capacity</h3>
              <p style={styles.cardSub}>Current occupancy by department</p>
            </div>
            <Heart size={18} style={{ color: '#ef4444' }} />
          </div>
          <div style={styles.deptList}>
            {DEPARTMENT_STATS.map((dept, i) => {
              const pct = Math.round((dept.patients / dept.capacity) * 100);
              return (
                <div key={i} style={styles.deptRow}>
                  <div style={styles.deptInfo}>
                    <span style={styles.deptName}>{dept.name}</span>
                    <span style={styles.deptCount}>{dept.patients}/{dept.capacity}</span>
                  </div>
                  <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${pct}%`, background: dept.color, opacity: pct > 85 ? 1 : 0.7 }} />
                  </div>
                  <span style={{ ...styles.pctLabel, color: pct > 85 ? '#ef4444' : 'rgba(255,255,255,0.4)' }}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Patients */}
      <div style={styles.tableCard}>
        <div style={styles.cardHeader}>
          <div>
            <h3 style={styles.cardTitle}>Recent Patients</h3>
            <p style={styles.cardSub}>Latest admissions and updates</p>
          </div>
          <button onClick={() => navigate('/patients')} style={styles.viewAllBtn}>
            View All <ArrowUpRight size={14} />
          </button>
        </div>
        <div style={styles.table}>
          <div style={styles.tableHead}>
            {['Patient', 'Condition', 'Ward', 'Doctor', 'Status'].map(h => (
              <div key={h} style={styles.th}>{h}</div>
            ))}
          </div>
          {recentPatients.map(p => (
            <div key={p.id} style={styles.tableRow} onClick={() => navigate(`/patients/${p.id}`)}>
              <div style={styles.td}>
                <div style={styles.patientAvatar}>{p.avatar}</div>
                <div>
                  <div style={styles.patientName}>{p.name}</div>
                  <div style={styles.patientId}>{p.id} · {p.age}y</div>
                </div>
              </div>
              <div style={styles.td}><span style={styles.conditionText}>{p.condition}</span></div>
              <div style={styles.td}><span style={styles.wardBadge}>{p.ward}</span></div>
              <div style={styles.td}><span style={styles.doctorText}>{p.doctor}</span></div>
              <div style={styles.td}><StatusBadge status={p.status} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, [string, string]> = {
    Critical: ['#ef4444', 'rgba(239,68,68,0.12)'],
    Active: ['#f59e0b', 'rgba(245,158,11,0.12)'],
    Stable: ['#10b981', 'rgba(16,185,129,0.12)'],
    Discharged: ['#6b7280', 'rgba(107,114,128,0.12)'],
  };
  const [color, bg] = colors[status] || ['#6b7280', 'rgba(107,114,128,0.1)'];
  return (
    <span style={{ color, background: bg, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
      {status}
    </span>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: { display: 'flex', flexDirection: 'column', gap: 24, fontFamily: "'DM Sans', sans-serif" },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 28, color: '#fff', margin: 0 },
  subtitle: { color: 'rgba(255,255,255,0.45)', fontSize: 14, marginTop: 4 },
  dateBadge: {
    display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20, color: 'rgba(255,255,255,0.5)', fontSize: 13,
  },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 },
  metricCard: {
    background: '#0a1628', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16, padding: '20px', transition: 'border-color 0.2s',
  },
  metricTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  metricIcon: { width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  metricTrend: { display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 600 },
  metricValue: { fontSize: 36, fontFamily: "'Syne', sans-serif", fontWeight: 700 },
  metricLabel: { color: '#fff', fontSize: 14, fontWeight: 500, marginTop: 2 },
  metricSub: { color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 3 },
  chartsRow: { display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 },
  chartCard: {
    background: '#0a1628', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16, padding: '20px',
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  cardTitle: { color: '#fff', fontWeight: 600, fontSize: 16, margin: 0 },
  cardSub: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 3 },
  chartLegend: { display: 'flex', gap: 16, marginTop: 12 },
  legendItem: { display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  legendDot: { width: 8, height: 8, borderRadius: '50%', display: 'inline-block' },
  deptList: { display: 'flex', flexDirection: 'column', gap: 14 },
  deptRow: { display: 'flex', alignItems: 'center', gap: 12 },
  deptInfo: { width: 110, display: 'flex', justifyContent: 'space-between', flexShrink: 0 },
  deptName: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  deptCount: { color: 'rgba(255,255,255,0.35)', fontSize: 12 },
  progressBar: { flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3, transition: 'width 0.5s ease' },
  pctLabel: { width: 36, textAlign: 'right', fontSize: 12, fontWeight: 600 },
  tableCard: {
    background: '#0a1628', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16, padding: '20px',
  },
  viewAllBtn: {
    display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(6,182,212,0.1)',
    border: '1px solid rgba(6,182,212,0.2)', borderRadius: 8, color: '#06b6d4',
    fontSize: 13, fontWeight: 500, cursor: 'pointer', padding: '6px 14px',
  },
  table: { display: 'flex', flexDirection: 'column' },
  tableHead: {
    display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.2fr 1.5fr 1fr',
    padding: '8px 12px', marginBottom: 4,
  },
  th: { color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase' },
  tableRow: {
    display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.2fr 1.5fr 1fr',
    padding: '12px', borderRadius: 10, cursor: 'pointer', transition: 'background 0.15s',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  td: { display: 'flex', alignItems: 'center', gap: 10 },
  patientAvatar: {
    width: 34, height: 34, borderRadius: 8,
    background: 'linear-gradient(135deg, #1e3a5f, #06b6d4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0,
  },
  patientName: { color: '#fff', fontSize: 14, fontWeight: 500 },
  patientId: { color: 'rgba(255,255,255,0.35)', fontSize: 12 },
  conditionText: { color: 'rgba(255,255,255,0.65)', fontSize: 13 },
  wardBadge: {
    background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: 6, padding: '2px 8px', color: '#818cf8', fontSize: 12,
  },
  doctorText: { color: 'rgba(255,255,255,0.55)', fontSize: 13 },
};