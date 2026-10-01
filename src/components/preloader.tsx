import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import logo from '@/assets/talentiq360-symbol.png.asset.json';

const MESSAGES = [
  'Initializing Talent Brain™',
  'Analyzing Workforce Intelligence',
  'Connecting Enterprise Data',
  'Syncing GitHub',
  'Syncing Jira',
  'Syncing ClickUp',
  'Preparing AI Insights',
  'Generating Executive Dashboard',
  'System Ready',
];
const METRICS = [
  { v: 50000, s: '+', l: 'Employees Analyzed' },
  { v: 1, s: 'M+', l: 'Tasks Processed' },
  { v: 99.9, s: '%', l: 'Platform Reliability' },
  { v: 250, s: 'M+', l: 'Workforce Events' },
];
const DURATION = 2600;
const KEY = 'tiq360-booted';

const NODES = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2;
  const r = i % 2 ? 120 : 92;
  return { x: 150 + Math.cos(a) * r, y: 150 + Math.sin(a) * r };
});
const PARTICLES = Array.from({ length: 22 }, (_, i) => {
  const a = (i / 22) * Math.PI * 2 + (i % 3);
  return { x: Math.cos(a) * 190, y: Math.sin(a) * 190, d: (i % 6) * 0.18 };
});

function fmt(v: number, target: number) {
  if (target === 99.9) return v.toFixed(1);
  return Math.round(v).toLocaleString('en-US');
}

export function Preloader() {
  const [show, setShow] = useState(true);
  const [p, setP] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (sessionStorage.getItem(KEY) || reduced) { setShow(false); return; }
    document.documentElement.style.overflow = 'hidden';
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / DURATION);
      setP(1 - Math.pow(1 - k, 2.2));
      if (k < 1) raf = requestAnimationFrame(tick);
      else { sessionStorage.setItem(KEY, '1'); setTimeout(() => setShow(false), 250); }
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); document.documentElement.style.overflow = ''; };
  }, []);

  useEffect(() => { if (!show) document.documentElement.style.overflow = ''; }, [show]);

  const msg = MESSAGES[Math.min(MESSAGES.length - 1, Math.floor(p * MESSAGES.length))];
  const C = 2 * Math.PI * 138;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="preloader"
          role="status"
          aria-live="polite"
          aria-label="Loading TalentIQ360"
          exit={{ opacity: 0, scale: 1.08, filter: 'blur(12px)' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="preloader-aurora" />
          <motion.div className="preloader-core" exit={{ scale: 2.4, opacity: 0 }} transition={{ duration: 0.7 }}>
            <svg viewBox="0 0 300 300" className="preloader-svg" aria-hidden="true">
              <defs>
                <linearGradient id="pl-g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="var(--accent)" />
                </linearGradient>
              </defs>
              {NODES.map((n, i) => (
                <motion.line key={i} x1={150} y1={150} x2={n.x} y2={n.y} stroke="url(#pl-g)" strokeWidth={0.8}
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.55 }}
                  transition={{ delay: 0.25 + i * 0.05, duration: 0.6 }} />
              ))}
              {NODES.map((n, i) => (
                <motion.circle key={`n${i}`} cx={n.x} cy={n.y} r={2.4} fill="var(--foreground)"
                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: [0, 1, 0.6] }}
                  transition={{ delay: 0.5 + i * 0.05, duration: 0.5 }} />
              ))}
              <g className="preloader-ring-a"><circle cx={150} cy={150} r={112} fill="none" stroke="url(#pl-g)" strokeWidth={1} strokeDasharray="4 10" opacity={0.6} /></g>
              <g className="preloader-ring-b"><circle cx={150} cy={150} r={126} fill="none" stroke="url(#pl-g)" strokeWidth={0.6} strokeDasharray="60 30 8 30" opacity={0.5} /></g>
              <circle cx={150} cy={150} r={138} fill="none" stroke="var(--border)" strokeWidth={2} />
              <circle cx={150} cy={150} r={138} fill="none" stroke="url(#pl-g)" strokeWidth={3} strokeLinecap="round"
                strokeDasharray={C} strokeDashoffset={C * (1 - p)} transform="rotate(-90 150 150)" className="preloader-progress" />
            </svg>
            {PARTICLES.map((q, i) => (
              <span key={i} className="preloader-particle" style={{ ['--x' as string]: `${q.x}px`, ['--y' as string]: `${q.y}px`, animationDelay: `${q.d}s` }} />
            ))}
            <motion.div className="preloader-logo"
              initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: [0.6, 1.06, 1] }} transition={{ duration: 0.9, ease: 'easeOut' }}>
              <span className="preloader-pulse" />
              <img src={logo.url} alt="" width={72} height={72} />
            </motion.div>
          </motion.div>

          <div className="preloader-text">
            <AnimatePresence mode="wait">
              <motion.p key={msg} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
                {msg}
              </motion.p>
            </AnimatePresence>
            <span className="preloader-pct">{Math.round(p * 100)}%</span>
          </div>

          <div className="preloader-metrics">
            {METRICS.map((m) => (
              <div key={m.l}>
                <strong>{fmt(m.v * p, m.v)}{m.s}</strong>
                <span>{m.l}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
