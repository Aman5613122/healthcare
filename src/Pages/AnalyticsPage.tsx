import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, PieChart, Pie, Cell
} from 'recharts';
import { ANALYTICS_DATA, DEPARTMENT_STATS } from '../utils/mockData';
import { TrendingUp, TrendingDown, DollarSign, Users, Star, Activity } from 'lucide-react';

const SATISFACTION_DATA = [
  { subject: 'Communication', A: 88 }, { subject: 'Care Quality', A: 92 },
  { subject: 'Cleanliness', A: 85 }, { subject: 'Wait Time', A: 76 },
  { subject: 'Staff', A: 94 }, { subject: 'Facilities', A: 83 },
];

const ADMISSION_REASONS = [
  { name: 'Cardiovascular', value: 28, color: '#ef4444' },
  { name: 'Respiratory', value: 19, color: '#06b6d4' },
  { name: 'Orthopedic', value: 15, color: '#3b82f6' },
  { name: 'Oncology', value: 14, color: '#8b5cf6' },
  { name: 'Other', value: 24, color: '#6b7280' },
];

export const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '1y'>('6m');
  const latest = ANALYTICS_DATA[ANALYTICS_DATA.length - 1];
  const prev = ANALYTICS_DATA[ANALYTICS_DATA.length - 2];

  const kpis = [
    {
      label: 'Total Revenue', value: `$${(latest.revenue / 1000).toFixed(0)}K`,
      change: `+${(((latest.revenue - prev.revenue) / prev.revenue) * 100).toFixed(1)}%`,
      positive: true, icon: <DollarSign size={20} />, color: '#10b981', bg: 'rgba(16,185,129,0.1)',
    },
    {
      label: 'Monthly Admissions', value: latest.admissions,
      change: `+${latest.admissions - prev.admissions}`, positive: true,
      icon: <Users size={20} />, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)',
    },
    {
      label: 'Patient Satisfaction', value: `${latest.satisfaction}%`,
      change: `+${latest.satisfaction - prev.satisfaction}pts`, positive: true,
      icon: <Star size={20} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',
    },
    {
      label: 'Avg Length of Stay', value: '4.2 days',
      change: '-0.3 days', positive: true,
      icon: <Activity size={20} />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',
    },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Analytics</h1>
          <p style={styles.sub}>Performance metrics and clinical insights</p>
        </div>
        <div style={styles.timeButtons}>
          {(['3m', '6m', '1y'] as const).map(t => (
            <button key={t} onClick={() => setTimeRange(t)}
              style={{ ...styles.timeBtn, ...(timeRange === t ? styles.timeBtnActive : {}) }}>
              {t === '3m' ? '3 Months' : t === '6m' ? '6 Months' : '1 Year'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div style={styles.kpiGrid}>
        {kpis.map((k, i) => (
          <div key={i} style={styles.kpiCard}>
            <div style={styles.kpiTop}>
              <div style={{ ...styles.kpiIcon, color: k.color, background: k.bg }}>{k.icon}</div>
              <span style={{ ...styles.kpiChange, color: k.positive ? '#10b981' : '#ef4444' }}>
                {k.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {k.change}
              </span>
            </div>
            <div style={{ ...styles.kpiValue, color: k.color }}>{k.value}</div>
            <div style={styles.kpiLabel}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue + Admissions */}
      <div style={styles.row}>
        <div style={styles.bigCard}>
          <div style={styles.cardHead}>
            <div>
              <h3 style={styles.cardTitle}>Revenue & Admissions Trend</h3>
              <p style={styles.cardSub}>Monthly performance over selected period</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={ANALYTICS_DATA} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false}
                tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ background: '#0e1e35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                formatter={(v) => [`$${(Number(v) / 1000).toFixed(0)}K`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#revGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHead}>
            <div>
              <h3 style={styles.cardTitle}>Admission Reasons</h3>
              <p style={styles.cardSub}>Distribution by department</p>
            </div>
          </div>
          <div style={styles.pieWrapper}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={ADMISSION_REASONS} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                  dataKey="value" strokeWidth={0}>
                  {ADMISSION_REASONS.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#0e1e35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                  formatter={(value: string | number | readonly (string | number)[] | undefined) => {
                    const formattedValue = Array.isArray(value) ? value[0] : value;
                    return [`${formattedValue ?? 0}%`, ''];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={styles.pieLegend}>
              {ADMISSION_REASONS.map((item, i) => (
                <div key={i} style={styles.pieLegendItem}>
                  <span style={{ ...styles.pieDot, background: item.color }} />
                  <span style={styles.pieName}>{item.name}</span>
                  <span style={styles.pieVal}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Satisfaction + Dept bars */}
      <div style={styles.row}>
        <div style={styles.card}>
          <div style={styles.cardHead}>
            <div>
              <h3 style={styles.cardTitle}>Patient Satisfaction Score</h3>
              <p style={styles.cardSub}>Monthly trend</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={ANALYTICS_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} domain={[70, 100]} />
              <Tooltip
                contentStyle={{ background: '#0e1e35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
              />
              <Line type="monotone" dataKey="satisfaction" stroke="#f59e0b" strokeWidth={2.5}
                dot={{ fill: '#f59e0b', r: 4 }} name="Satisfaction %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.bigCard}>
          <div style={styles.cardHead}>
            <div>
              <h3 style={styles.cardTitle}>Department Performance</h3>
              <p style={styles.cardSub}>Patient volume by ward</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={DEPARTMENT_STATS} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#0e1e35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
              />
              <Bar dataKey="patients" radius={[4, 4, 0, 0]}>
                {DEPARTMENT_STATS.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
              <Bar dataKey="capacity" fill="rgba(255,255,255,0.06)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={styles.barLegend}>
            <span style={styles.legendItem}><span style={{ ...styles.legendDot, background: '#06b6d4' }} />Patients</span>
            <span style={styles.legendItem}><span style={{ ...styles.legendDot, background: 'rgba(255,255,255,0.15)' }} />Capacity</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: { display: 'flex', flexDirection: 'column', gap: 20, fontFamily: "'DM Sans', sans-serif" },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 28, color: '#fff', margin: 0 },
  sub: { color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 4 },
  timeButtons: { display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 3 },
  timeBtn: { padding: '6px 16px', borderRadius: 8, border: 'none', background: 'none', color: 'rgba(255,255,255,0.45)', cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'all 0.2s' },
  timeBtnActive: { background: 'rgba(6,182,212,0.15)', color: '#06b6d4' },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 },
  kpiCard: { background: '#0a1628', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px' },
  kpiTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  kpiIcon: { width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  kpiChange: { display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 600 },
  kpiValue: { fontSize: 34, fontFamily: "'Syne', sans-serif", fontWeight: 700 },
  kpiLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 3 },
  row: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 },
  bigCard: { background: '#0a1628', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px' },
  card: { background: '#0a1628', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px' },
  cardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  cardTitle: { color: '#fff', fontWeight: 600, fontSize: 16, margin: 0 },
  cardSub: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 3 },
  pieWrapper: { display: 'flex', gap: 12, alignItems: 'center' },
  pieLegend: { display: 'flex', flexDirection: 'column', gap: 8 },
  pieLegendItem: { display: 'flex', alignItems: 'center', gap: 8 },
  pieDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  pieName: { color: 'rgba(255,255,255,0.6)', fontSize: 12, flex: 1 },
  pieVal: { color: '#fff', fontSize: 12, fontWeight: 600 },
  barLegend: { display: 'flex', gap: 16, marginTop: 12 },
  legendItem: { display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  legendDot: { width: 8, height: 8, borderRadius: '50%', display: 'inline-block' },
};