import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  LayoutGrid, List, Search, Filter, ChevronRight,
  Phone, Mail, Heart, Activity, Thermometer, Droplets
} from 'lucide-react';

export const PatientsPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const { viewMode, searchQuery, selectedFilter } = state;

  const filters = ['All', 'Critical', 'Active', 'Stable', 'Discharged'];

  const filtered = useMemo(() => {
    return state.patients.filter(p => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q)
        || p.condition.toLowerCase().includes(q)
        || p.ward.toLowerCase().includes(q)
        || p.doctor.toLowerCase().includes(q)
        || p.id.toLowerCase().includes(q);
      const matchFilter = selectedFilter === 'All' || p.status === selectedFilter;
      return matchSearch && matchFilter;
    });
  }, [state.patients, searchQuery, selectedFilter]);

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Patient Management</h1>
          <p style={styles.sub}>{filtered.length} patients{selectedFilter !== 'All' ? ` · ${selectedFilter}` : ''}</p>
        </div>

        <div style={styles.controls}>
          {/* View Toggle */}
          <div style={styles.viewToggle}>
            <button
              onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: 'grid' })}
              style={{ ...styles.toggleBtn, ...(viewMode === 'grid' ? styles.toggleActive : {}) }}
              title="Grid View"
            >
              <LayoutGrid size={16} />
              <span>Grid</span>
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: 'list' })}
              style={{ ...styles.toggleBtn, ...(viewMode === 'list' ? styles.toggleActive : {}) }}
              title="List View"
            >
              <List size={16} />
              <span>List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filterBar}>
        <div style={styles.filterTabs}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => dispatch({ type: 'SET_FILTER', payload: f })}
              style={{ ...styles.filterTab, ...(selectedFilter === f ? styles.filterTabActive : {}) }}
            >
              {f}
              {f !== 'All' && (
                <span style={{ ...styles.filterCount, ...(selectedFilter === f ? styles.filterCountActive : {}) }}>
                  {state.patients.filter(p => p.status === f).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Patient list/grid */}
      {filtered.length === 0 ? (
        <div style={styles.empty}>
          <Search size={40} style={{ color: 'rgba(255,255,255,0.15)', marginBottom: 12 }} />
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>No patients match your search</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={styles.gridView}>
          {filtered.map(p => (
            <div key={p.id} style={styles.gridCard} onClick={() => navigate(`/patients/${p.id}`)}>
              <div style={styles.gridCardTop}>
                <div style={styles.gridAvatar}>{p.avatar}</div>
                <StatusBadge status={p.status} />
              </div>
              <h3 style={styles.gridName}>{p.name}</h3>
              <p style={styles.gridCondition}>{p.condition}</p>
              <div style={styles.gridMeta}>
                <span style={styles.gridMetaItem}>{p.age}y · {p.gender}</span>
                <span style={styles.gridMetaItem}>{p.bloodType}</span>
              </div>
              <div style={styles.gridWard}>{p.ward}</div>
              <div style={styles.gridDivider} />
              <div style={styles.vitalsRow}>
                <VitalChip icon={<Heart size={11} />} value={`${p.vitals.heartRate}`} label="bpm" color="#ef4444" />
                <VitalChip icon={<Activity size={11} />} value={p.vitals.bloodPressure} label="mmHg" color="#06b6d4" />
                <VitalChip icon={<Droplets size={11} />} value={`${p.vitals.oxygenSaturation}%`} label="SpO₂" color="#10b981" />
              </div>
              <div style={styles.gridFooter}>
                <span style={styles.gridDoctor}>{p.doctor}</span>
                <ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.listView}>
          <div style={styles.listHead}>
            {['Patient', 'Condition', 'Vitals', 'Ward / Doctor', 'Contact', 'Status', ''].map(h => (
              <div key={h} style={styles.listTh}>{h}</div>
            ))}
          </div>
          {filtered.map(p => (
            <div key={p.id} style={styles.listRow} onClick={() => navigate(`/patients/${p.id}`)}>
              <div style={styles.listTd}>
                <div style={styles.listAvatar}>{p.avatar}</div>
                <div>
                  <div style={styles.listName}>{p.name}</div>
                  <div style={styles.listId}>{p.id} · {p.age}y · {p.bloodType}</div>
                </div>
              </div>
              <div style={styles.listTd}>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{p.condition}</div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 2 }}>
                    Since {new Date(p.admittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
              <div style={styles.listTd}>
                <div style={styles.vitalsCompact}>
                  <span style={{ color: '#ef4444', fontSize: 12 }}><Heart size={10} style={{ display: 'inline' }} /> {p.vitals.heartRate}</span>
                  <span style={{ color: '#06b6d4', fontSize: 12 }}>{p.vitals.bloodPressure}</span>
                  <span style={{ color: '#10b981', fontSize: 12 }}>{p.vitals.oxygenSaturation}%</span>
                </div>
              </div>
              <div style={styles.listTd}>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{p.ward}</div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 2 }}>{p.doctor}</div>
                </div>
              </div>
              <div style={styles.listTd}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
                    <Phone size={11} /> {p.phone}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
                    <Mail size={11} /> {p.email}
                  </span>
                </div>
              </div>
              <div style={styles.listTd}><StatusBadge status={p.status} /></div>
              <div style={styles.listTd}>
                <ChevronRight size={16} style={{ color: 'rgba(255,255,255,0.25)' }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const VitalChip: React.FC<{ icon: React.ReactNode; value: string; label: string; color: string }> = ({ icon, value, label, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
    <span style={{ color }}>{icon}</span>
    <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>{value}</span>
    <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>{label}</span>
  </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, [string, string]> = {
    Critical: ['#ef4444', 'rgba(239,68,68,0.12)'],
    Active: ['#f59e0b', 'rgba(245,158,11,0.12)'],
    Stable: ['#10b981', 'rgba(16,185,129,0.12)'],
    Discharged: ['#6b7280', 'rgba(107,114,128,0.1)'],
  };
  const [color, bg] = map[status] || ['#6b7280', 'rgba(107,114,128,0.1)'];
  return (
    <span style={{ color, background: bg, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {status === 'Critical' && <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, animation: 'pulse-dot 1.5s infinite' }} />}
      {status}
    </span>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: { display: 'flex', flexDirection: 'column', gap: 20, fontFamily: "'DM Sans', sans-serif" },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 28, color: '#fff', margin: 0 },
  sub: { color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 4 },
  controls: { display: 'flex', alignItems: 'center', gap: 12 },
  viewToggle: {
    display: 'flex', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 3, gap: 3,
  },
  toggleBtn: {
    display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
    borderRadius: 8, border: 'none', background: 'none', color: 'rgba(255,255,255,0.45)',
    cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'all 0.2s',
  },
  toggleActive: { background: 'rgba(6,182,212,0.15)', color: '#06b6d4' },
  filterBar: { display: 'flex', alignItems: 'center', gap: 16 },
  filterTabs: { display: 'flex', gap: 6 },
  filterTab: {
    display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px',
    borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)',
    background: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
    fontSize: 13, fontWeight: 500, transition: 'all 0.2s',
  },
  filterTabActive: { background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', color: '#06b6d4' },
  filterCount: {
    background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '0 7px',
    fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)',
  },
  filterCountActive: { background: 'rgba(6,182,212,0.2)', color: '#06b6d4' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0' },
  // Grid
  gridView: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 },
  gridCard: {
    background: '#0a1628', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16, padding: '20px', cursor: 'pointer',
    transition: 'border-color 0.2s, transform 0.2s',
    display: 'flex', flexDirection: 'column', gap: 8,
  },
  gridCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  gridAvatar: {
    width: 48, height: 48, borderRadius: 12,
    background: 'linear-gradient(135deg, #1e3a5f, #06b6d4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontSize: 15, fontWeight: 700,
  },
  gridName: { color: '#fff', fontWeight: 600, fontSize: 16, margin: 0 },
  gridCondition: { color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: 0 },
  gridMeta: { display: 'flex', gap: 8 },
  gridMetaItem: {
    background: 'rgba(255,255,255,0.06)', borderRadius: 6,
    padding: '2px 8px', color: 'rgba(255,255,255,0.5)', fontSize: 12,
  },
  gridWard: { color: '#818cf8', fontSize: 12, fontWeight: 500 },
  gridDivider: { height: 1, background: 'rgba(255,255,255,0.05)', margin: '4px 0' },
  vitalsRow: { display: 'flex', justifyContent: 'space-between' },
  gridFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  gridDoctor: { color: 'rgba(255,255,255,0.4)', fontSize: 12 },
  // List
  listView: { background: '#0a1628', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' },
  listHead: {
    display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.2fr 1.5fr 1.5fr 1fr 0.3fr',
    padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  listTh: { color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase' },
  listRow: {
    display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.2fr 1.5fr 1.5fr 1fr 0.3fr',
    padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)',
    cursor: 'pointer', transition: 'background 0.15s', alignItems: 'center',
  },
  listTd: { display: 'flex', alignItems: 'center', gap: 10 },
  listAvatar: {
    width: 36, height: 36, borderRadius: 10,
    background: 'linear-gradient(135deg, #1e3a5f, #06b6d4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0,
  },
  listName: { color: '#fff', fontSize: 14, fontWeight: 500 },
  listId: { color: 'rgba(255,255,255,0.35)', fontSize: 12 },
  vitalsCompact: { display: 'flex', flexDirection: 'column', gap: 3 },
};