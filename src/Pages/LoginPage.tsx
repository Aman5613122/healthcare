import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail } from '../services/authService';
import { useApp } from '../context/AppContext';
import { Activity, Eye, EyeOff, Shield, Zap, HeartPulse } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('demo@raga.ai');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { dispatch } = useApp();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email.'); return; }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await loginWithEmail(email, password);
      const user = {
        uid: (result as any).user.uid,
        email: (result as any).user.email,
        displayName: (result as any).user.displayName || 'Admin User',
        photoURL: (result as any).user.photoURL,
      };
      // Store demo session
      sessionStorage.setItem('demoUser', JSON.stringify(user));
      dispatch({ type: 'SET_USER', payload: user });
      navigate('/dashboard');
    } catch (err: any) {
      setError('Invalid credentials. Use demo@raga.ai / demo123');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Background grid */}
      <div style={styles.gridOverlay} />
      
      {/* Floating orbs */}
      <div style={{ ...styles.orb, ...styles.orb1 }} />
      <div style={{ ...styles.orb, ...styles.orb2 }} />
      <div style={{ ...styles.orb, ...styles.orb3 }} />

      <div style={styles.container}>
        {/* Left panel */}
        <div style={styles.leftPanel}>
          <div style={styles.logoWrap}>
            <div style={styles.logoIcon}>
              <HeartPulse size={28} color="#fff" />
            </div>
            <span style={styles.logoText}>RAGA<span style={styles.logoAccent}>.AI</span></span>
          </div>

          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>
              Healthcare<br />Intelligence<br />
              <span style={styles.heroAccent}>Platform</span>
            </h1>
            <p style={styles.heroSub}>
              Next-generation B2B SaaS powering smarter clinical decisions and patient outcomes.
            </p>
          </div>

          <div style={styles.featureList}>
            {[
              { icon: <Activity size={18} />, text: 'Real-time patient monitoring' },
              { icon: <Shield size={18} />, text: 'HIPAA compliant & secure' },
              { icon: <Zap size={18} />, text: 'AI-powered analytics' },
            ].map((f, i) => (
              <div key={i} style={styles.featureItem}>
                <span style={styles.featureIcon}>{f.icon}</span>
                <span style={styles.featureText}>{f.text}</span>
              </div>
            ))}
          </div>

          <div style={styles.statsRow}>
            {[['2,400+', 'Patients'], ['98.9%', 'Uptime'], ['47', 'Hospitals']].map(([val, label], i) => (
              <div key={i} style={styles.stat}>
                <span style={styles.statVal}>{val}</span>
                <span style={styles.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div style={styles.rightPanel}>
          <div style={styles.formCard}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>Welcome back</h2>
              <p style={styles.formSub}>Sign in to your workspace</p>
            </div>

            <div style={styles.demoHint}>
              <span style={styles.demoIcon}>💡</span>
              <span>Demo: <strong>demo@raga.ai</strong> / <strong>demo123</strong></span>
            </div>

            <form onSubmit={handleLogin} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={styles.input}
                  placeholder="you@hospital.com"
                  onFocus={e => { e.currentTarget.style.borderColor = '#06b6d4'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(6,182,212,0.15)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputWrap}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ ...styles.input, paddingRight: '44px' }}
                    placeholder="••••••••"
                    onFocus={e => { e.currentTarget.style.borderColor = '#06b6d4'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(6,182,212,0.15)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div style={styles.error}>
                  <span>⚠</span> {error}
                </div>
              )}

              <button type="submit" disabled={loading} style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}>
                {loading ? (
                  <span style={styles.spinnerWrap}>
                    <span style={styles.spinner} />
                    Signing in...
                  </span>
                ) : 'Sign In to Dashboard'}
              </button>
            </form>

            <p style={styles.footerNote}>
              Protected by enterprise-grade encryption & HIPAA compliance
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:0.4} 50%{transform:scale(1.1);opacity:0.6} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#050d1a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'DM Sans', sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },
  gridOverlay: {
    position: 'absolute', inset: 0,
    backgroundImage: 'linear-gradient(rgba(6,182,212,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.03) 1px, transparent 1px)',
    backgroundSize: '60px 60px',
    pointerEvents: 'none',
  },
  orb: { position: 'absolute', borderRadius: '50%', filter: 'blur(80px)', animation: 'pulse 8s ease-in-out infinite', pointerEvents: 'none' },
  orb1: { width: 500, height: 500, background: 'rgba(6,182,212,0.08)', top: -200, left: -200 },
  orb2: { width: 400, height: 400, background: 'rgba(99,102,241,0.08)', bottom: -150, right: -150, animationDelay: '-3s' },
  orb3: { width: 300, height: 300, background: 'rgba(16,185,129,0.06)', top: '50%', left: '40%', animationDelay: '-6s' },
  container: {
    display: 'flex', width: '100%', maxWidth: 1100, minHeight: '100vh',
    position: 'relative', zIndex: 1,
  },
  leftPanel: {
    flex: 1, padding: '60px 64px', display: 'flex', flexDirection: 'column',
    justifyContent: 'center', gap: 40,
  },
  logoWrap: { display: 'flex', alignItems: 'center', gap: 12 },
  logoIcon: {
    width: 48, height: 48, borderRadius: 12,
    background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  logoText: { fontSize: 24, fontFamily: "'Syne', sans-serif", fontWeight: 800, color: '#fff', letterSpacing: 2 },
  logoAccent: { color: '#06b6d4' },
  heroContent: {},
  heroTitle: {
    fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 52, lineHeight: 1.1,
    color: '#fff', margin: 0, letterSpacing: -1,
  },
  heroAccent: { color: '#06b6d4' },
  heroSub: { color: 'rgba(255,255,255,0.5)', fontSize: 16, lineHeight: 1.6, marginTop: 16, maxWidth: 380 },
  featureList: { display: 'flex', flexDirection: 'column', gap: 12 },
  featureItem: { display: 'flex', alignItems: 'center', gap: 12 },
  featureIcon: {
    width: 36, height: 36, borderRadius: 8,
    background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4',
    flexShrink: 0,
  },
  featureText: { color: 'rgba(255,255,255,0.7)', fontSize: 15 },
  statsRow: { display: 'flex', gap: 32 },
  stat: { display: 'flex', flexDirection: 'column', gap: 2 },
  statVal: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 28, color: '#06b6d4' },
  statLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },
  rightPanel: {
    width: 480, display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '60px 40px',
  },
  formCard: {
    width: '100%', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24,
    padding: '48px 40px', backdropFilter: 'blur(20px)',
  },
  formHeader: { marginBottom: 24 },
  formTitle: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 30, color: '#fff', margin: 0 },
  formSub: { color: 'rgba(255,255,255,0.45)', fontSize: 15, marginTop: 6 },
  demoHint: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
    background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)',
    borderRadius: 10, fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 28,
  },
  demoIcon: { fontSize: 16 },
  form: { display: 'flex', flexDirection: 'column', gap: 20 },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.6)', letterSpacing: 0.3 },
  input: {
    width: '100%', padding: '13px 16px', borderRadius: 10,
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box',
    transition: 'all 0.2s',
  },
  inputWrap: { position: 'relative' },
  eyeBtn: {
    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 4,
  },
  error: {
    padding: '10px 14px', borderRadius: 8,
    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
    color: '#fca5a5', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8,
  },
  submitBtn: {
    padding: '14px', borderRadius: 10, border: 'none',
    background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer',
    transition: 'all 0.2s', letterSpacing: 0.3, marginTop: 4,
  },
  spinnerWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
  spinner: {
    width: 16, height: 16, borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff', animation: 'spin 0.7s linear infinite',
    display: 'inline-block',
  },
  footerNote: {
    textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 12,
    marginTop: 24, lineHeight: 1.5,
  },
};