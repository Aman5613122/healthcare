import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { logout } from '../../services/authService';
import {
  LayoutDashboard, Users, BarChart3, Bell, Settings,
  LogOut, Menu, X, HeartPulse, ChevronRight, Search
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { to: '/patients', icon: <Users size={20} />, label: 'Patients' },
  { to: '/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const unread = state.notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    sessionStorage.removeItem('demoUser');
    await logout();
    dispatch({ type: 'SET_USER', payload: null });
    navigate('/login');
  };

  const sidebarOpen = state.sidebarOpen;

  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        .nav-link { display: flex; align-items: center; gap: 12px; padding: 10px 16px; border-radius: 10px; text-decoration: none; color: rgba(255,255,255,0.5); font-size: 14px; font-weight: 500; transition: all 0.2s; margin-bottom: 2px; }
        .nav-link:hover { color: rgba(255,255,255,0.85); background: rgba(255,255,255,0.05); }
        .nav-link.active { color: #fff; background: rgba(6,182,212,0.12); }
        .nav-link.active .nav-icon { color: #06b6d4; }
        .nav-icon { color: rgba(255,255,255,0.4); transition: color 0.2s; flex-shrink: 0; }
        @keyframes slideIn { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      {/* Sidebar */}
      <aside style={{
        ...styles.sidebar,
        width: sidebarOpen ? 240 : 68,
        transform: mobileOpen ? 'translateX(0)' : undefined,
      }}>
        {/* Logo */}
        <div style={styles.sidebarLogo}>
          <div style={styles.logoIcon}><HeartPulse size={20} color="#fff" /></div>
          {sidebarOpen && <span style={styles.logoText}>RAGA<span style={{ color: '#06b6d4' }}>.AI</span></span>}
        </div>

        {/* Toggle */}
        <button onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })} style={styles.toggleBtn}>
          {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
        </button>

        {/* Nav */}
        <nav style={styles.nav}>
          {sidebarOpen && <span style={styles.navSection}>MAIN MENU</span>}
          {NAV_ITEMS.map(item => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              title={!sidebarOpen ? item.label : undefined}>
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
              {sidebarOpen && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.3 }} />}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div style={styles.sidebarBottom}>
          {sidebarOpen && (
            <div style={styles.userCard}>
              <div style={styles.userAvatar}>
                {state.user?.displayName?.[0] || state.user?.email?.[0] || 'A'}
              </div>
              <div style={styles.userInfo}>
                <span style={styles.userName}>{state.user?.displayName || 'Admin'}</span>
                <span style={styles.userRole}>Administrator</span>
              </div>
            </div>
          )}
          <button onClick={handleLogout} style={styles.logoutBtn} title="Sign out">
            <LogOut size={18} />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && <div style={styles.overlay} onClick={() => setMobileOpen(false)} />}

      {/* Main */}
      <main style={{ ...styles.main, marginLeft: sidebarOpen ? 240 : 68 }}>
        {/* Header */}
        <header style={styles.header}>
          <button onClick={() => setMobileOpen(!mobileOpen)} style={styles.mobileMenuBtn}>
            <Menu size={20} />
          </button>

          <div style={styles.searchBar}>
            <Search size={16} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
            <input
              placeholder="Search patients, wards, doctors..."
              value={state.searchQuery}
              onChange={e => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.headerRight}>
            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setNotifOpen(!notifOpen)} style={styles.iconBtn}>
                <Bell size={20} />
                {unread > 0 && (
                  <span style={styles.badge}>{unread > 9 ? '9+' : unread}</span>
                )}
              </button>

              {notifOpen && (
                <div style={styles.notifPanel}>
                  <div style={styles.notifHeader}>
                    <span style={styles.notifTitle}>Notifications</span>
                    {unread > 0 && (
                      <button onClick={() => dispatch({ type: 'MARK_ALL_READ' })} style={styles.markAllBtn}>
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div style={styles.notifList}>
                    {state.notifications.slice(0, 6).map(n => (
                      <div key={n.id}
                        onClick={() => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: n.id })}
                        style={{ ...styles.notifItem, background: n.read ? 'transparent' : 'rgba(6,182,212,0.05)' }}>
                        <div style={{ ...styles.notifDot, background: notifColors[n.type] }} />
                        <div style={styles.notifContent}>
                          <div style={styles.notifItemTitle}>{n.title}</div>
                          <div style={styles.notifMsg}>{n.message}</div>
                          <div style={styles.notifTime}>{formatTime(n.timestamp)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Avatar */}
            <div style={styles.avatarBtn}>
              {state.user?.displayName?.[0] || 'A'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div style={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
};

const notifColors: Record<string, string> = {
  critical: '#ef4444', warning: '#f59e0b', info: '#06b6d4', success: '#10b981'
};

function formatTime(date: Date): string {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (diff < 1) return 'Just now';
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
}

const styles: Record<string, React.CSSProperties> = {
  root: { display: 'flex', minHeight: '100vh', background: '#070f1e', fontFamily: "'DM Sans', sans-serif" },
  sidebar: {
    position: 'fixed', left: 0, top: 0, height: '100vh',
    background: '#0a1628', borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex', flexDirection: 'column', transition: 'width 0.3s ease',
    zIndex: 100, overflow: 'hidden',
  },
  sidebarLogo: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '20px 16px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  logoIcon: {
    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
    background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  logoText: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: '#fff', whiteSpace: 'nowrap' },
  toggleBtn: {
    position: 'absolute', right: -1, top: 72, background: '#0a1628',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0 8px 8px 0',
    color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '6px 8px',
    transition: 'all 0.2s',
  },
  nav: { flex: 1, padding: '16px 10px', overflowY: 'auto' },
  navSection: {
    display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.25)', padding: '0 6px 8px', textTransform: 'uppercase',
  },
  sidebarBottom: { padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.05)' },
  userCard: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 6px 12px' },
  userAvatar: {
    width: 32, height: 32, borderRadius: 8,
    background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0,
  },
  userInfo: { display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  userName: { color: '#fff', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  userRole: { color: 'rgba(255,255,255,0.35)', fontSize: 11 },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 12px',
    background: 'none', border: 'none', borderRadius: 8, color: 'rgba(255,255,255,0.4)',
    cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'all 0.2s',
  },
  main: { flex: 1, display: 'flex', flexDirection: 'column', transition: 'margin-left 0.3s ease', minHeight: '100vh' },
  header: {
    display: 'flex', alignItems: 'center', gap: 16, padding: '0 28px',
    height: 64, background: '#070f1e',
    borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 50,
  },
  mobileMenuBtn: { display: 'none', background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: 4 },
  searchBar: {
    flex: 1, display: 'flex', alignItems: 'center', gap: 10,
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 10, padding: '0 14px', height: 38, maxWidth: 400,
  },
  searchInput: {
    flex: 1, background: 'none', border: 'none', outline: 'none',
    color: '#fff', fontSize: 14,
  },
  headerRight: { display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' },
  iconBtn: {
    position: 'relative', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10, padding: '8px 10px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: 'all 0.2s',
  },
  badge: {
    position: 'absolute', top: -4, right: -4, background: '#ef4444', color: '#fff',
    borderRadius: 10, fontSize: 10, fontWeight: 700, padding: '1px 5px', minWidth: 18,
    textAlign: 'center', border: '2px solid #070f1e',
  },
  notifPanel: {
    position: 'absolute', right: 0, top: 48, width: 380, maxHeight: 480,
    background: '#0e1e35', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    animation: 'fadeDown 0.2s ease', zIndex: 200, overflow: 'hidden',
  },
  notifHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  notifTitle: { color: '#fff', fontWeight: 600, fontSize: 15 },
  markAllBtn: { background: 'none', border: 'none', color: '#06b6d4', fontSize: 12, cursor: 'pointer' },
  notifList: { overflowY: 'auto', maxHeight: 400 },
  notifItem: {
    display: 'flex', gap: 12, padding: '12px 18px',
    borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', transition: 'background 0.15s',
  },
  notifDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 4 },
  notifContent: { flex: 1 },
  notifItemTitle: { color: '#fff', fontSize: 13, fontWeight: 600, marginBottom: 3 },
  notifMsg: { color: 'rgba(255,255,255,0.5)', fontSize: 12, lineHeight: 1.5 },
  notifTime: { color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 4 },
  avatarBtn: {
    width: 36, height: 36, borderRadius: 10,
    background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
  },
  content: { flex: 1, padding: '28px', overflowY: 'auto' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 },
};