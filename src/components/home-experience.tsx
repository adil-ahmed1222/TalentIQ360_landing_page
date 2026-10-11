import { Link } from '@tanstack/react-router';
import { lazy, Suspense, useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, ArrowUpRight, Check, ChevronDown, CircleDot, Github, Layers3, Menu, Sparkles, X, BrainCircuit, ChartNoAxesCombined, UsersRound, Target, HeartPulse, Gauge, TrendingUp, LayoutDashboard, Lightbulb, CalendarDays, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandMark } from '@/components/brand-mark';
import { supabase } from '@/integrations/supabase/client';
import { PremiumEffects, HeroAtmosphere } from '@/components/premium-effects';
import { Preloader } from '@/components/preloader';
import { WorkforceOverview } from '@/components/workforce-overview';
import { createZiinaCheckout } from '@/server/ziina.functions';

const HeroField = lazy(() => import('@/components/ui/hero-field'));
const fieldClass = 'mt-2 h-12 w-full min-w-0 rounded-xl border bg-surface px-4 text-base text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40';
const nav = [['Features','#features'],['Integrations','#integrations'],['Pricing','#pricing'],['Founding','#founding'],['Leadership','#leadership'],['Contact','#contact']];
const features = [
  ['Employee scoring', Gauge, 'A contextual view of work signals for human review. It is not a measure of a person\'s worth.'],
  ['Workforce intelligence', UsersRound, 'Patterns across teams, shown so leaders can interpret them.'],
  ['Talent matching', Target, 'Suggested matches between skills and opportunities, for people to decide.'],
  ['Hiring recommendations', Sparkles, 'Signals that may inform hiring discussions. They do not make the hiring decision.'],
  ['Promotion readiness', TrendingUp, 'Growth signals for discussion. This does not predict or decide promotions.'],
  ['Workload signals', HeartPulse, 'Workload patterns for managers to review. This is not a medical assessment.'],
  ['Capacity planning', Layers3, 'A view of availability across projects and people, within the data you connect.'],
  ['Performance analytics', ChartNoAxesCombined, 'Performance information organized for clearer conversations.'],
  ['Delivery outlook', CalendarDays, 'Early delivery-risk signals. Dates and outcomes are not guaranteed.'],
  ['Skills intelligence', BrainCircuit, 'A map of capabilities as your organization describes and connects them.'],
  ['Executive dashboards', LayoutDashboard, 'A leadership view of the signals in scope for your subscription.'],
  ['AI insights', Lightbulb, 'Suggested next steps from available data. People remain responsible for decisions.'],
] as const;
const integrations: { name: string; status: string }[] = [
  ['GitHub', 'Confirm during scoping'], ['Jira', 'Confirm during scoping'], ['ClickUp', 'Confirm during scoping'], ['LinkedIn', 'Custom scope'],
  ['Slack', 'Confirm during scoping'], ['Microsoft Teams', 'Confirm during scoping'], ['Google Workspace', 'Custom scope'], ['Azure DevOps', 'Custom scope'],
  ['GitLab', 'Custom scope'], ['Bitbucket', 'Custom scope'], ['Asana', 'Custom scope'], ['Monday.com', 'Custom scope'],
  ['Trello', 'Custom scope'], ['HubSpot', 'Custom scope'], ['Salesforce', 'Custom scope'], ['Notion', 'Custom scope'],
  ['Google Sheets', 'Custom scope'], ['Excel', 'Custom scope'], ['CSV Uploads', 'Custom scope'],
].map(([name, status]) => ({ name, status }));
const steps = ['Agree the scope', 'Authorize access', 'Review signals', 'Discuss insights', 'Decide with your team'];
const plans = [
  { name: 'Core Intelligence', audience: 'For smaller companies beginning their workforce intelligence journey.', price: 'AED 999', amount: '999', cadence: '/ month', employees: 'Up to 100 employees', integrations: 'Up to 3 supported integrations', support: 'Standard support', summary: 'Build a clearer understanding of your workforce with essential analytics and talent intelligence.', cta: 'Get Started', checkout: 'core', popular: false, note: '', features: ['Employee scoring and basic talent intelligence', 'Workforce dashboard', 'Performance analytics', 'Human review of insights'] },
  { name: 'Growth Intelligence', audience: 'For established HR, technology, and business teams that need deeper workforce insights.', price: 'AED 2,999', amount: '2999', cadence: '/ month', employees: 'Up to 300 employees', integrations: 'Up to 6 supported integrations', support: 'Priority support', summary: 'Turn workforce data into actionable insights that help leaders make more informed talent and performance decisions.', cta: 'Choose Growth', checkout: 'growth', popular: true, note: '', features: ['Advanced workforce analytics', 'Advanced performance analytics', 'Talent matching and skills intelligence', 'Promotion-readiness insights for discussion', 'Capacity-planning insights', 'Executive dashboards'] },
  { name: 'Workforce Intelligence Pro', audience: 'For larger, data-intensive organizations requiring broader analytics and workforce visibility.', price: 'AED 6,999', amount: '6999', cadence: '/ month', employees: 'Up to 750 employees', integrations: 'Expanded allowance, confirmed before purchase', support: 'Priority support', summary: 'Unlock broader workforce intelligence for complex teams, projects, and organizational decisions.', cta: 'Pay first month', checkout: 'pro', popular: false, note: '', features: ['Executive reporting', 'Workforce forecasting, where production-ready', 'Team and project capacity insights', 'Expanded AI analytics usage, with documented limits', 'Priority implementation'] },
  { name: 'Enterprise', audience: 'For organizations requiring a customized workforce intelligence deployment.', price: 'From AED 12,000', amount: '12000', cadence: '/ month', employees: 'Custom employee capacity', integrations: 'Custom integration scope', support: 'Dedicated support options, subject to the agreement', summary: 'Build a workforce intelligence solution aligned with your organization\'s scale, systems, governance, and operational needs.', cta: 'Contact Enterprise Sales', checkout: null, popular: false, note: 'Enterprise pricing depends on employee volume, integration requirements, deployment scope, usage, and support commitments.', features: ['Advanced reporting, where available', 'Custom deployment options, if supported', 'Security and technical reviews', 'Negotiated service commitments', 'Custom implementation and onboarding'] },
];
const ceoMessage = [
  'At Talent IQ 360, we believe that an organization\'s greatest asset is its people. Yet, in a world increasingly driven by data, many organizations still lack the visibility and intelligence needed to fully understand their workforce, recognize potential, and make confident talent decisions.',
  'We built Talent IQ 360 to change that.',
  'Our vision is to transform how organizations understand, develop, and empower their people by bringing workforce intelligence, performance insights, and AI-driven analytics together in one platform. By turning complex workforce data into meaningful, actionable insights, we aim to help leaders make more informed decisions, identify opportunities for growth, and build stronger, more capable teams.',
  'But we believe technology should do more than analyze data. It should empower people. AI should support better decisions, create opportunities for development, and help organizations recognize the potential that might otherwise go unnoticed.',
  'As we continue to build and evolve Talent IQ 360, our commitment remains clear: to make workforce intelligence more accessible, actionable, and meaningful for every organization we serve.',
  'The future of work will be shaped by how well we understand and develop human potential. At Talent IQ 360, we\'re building the intelligence to help make that future possible.',
  'Thank you for being part of our journey.',
];
const faqs = [
  ['What is TalentIQ360?', 'TalentIQ360 is a decision-support platform that helps leaders interpret workforce signals. It does not replace human judgment or measure a person\'s worth.'],
  ['How should AI insights be used?', 'Insights are inputs for people who know the context. Scores, workload signals, and delivery outlooks should be reviewed alongside manager feedback and individual circumstances.'],
  ['Which integrations are available?', 'Listed systems are candidates for connection. Availability, compatibility, and permissions are confirmed during scoping. A name on this page does not mean that connector is already live for every customer.'],
  ['How does pricing work in the UAE?', 'Plans are priced in AED per month and exclude applicable VAT. Employee limits, integration allowances, AI usage, onboarding, and support follow the subscription you agree.'],
  ['What is the Founding Partner Program?', 'A paid 90-day pilot at AED 2,500 per month (AED 7,500 total). Scope is agreed before it starts. Continuing afterward is a separate decision.'],
  ['Is my data secure?', 'Connect only data you are authorized to share. Ask us about access control, retention, and deletion before connecting workforce systems. We do not claim certifications that have not been completed.'],
  ['Do you support enterprise deployment?', 'Enterprise conversations cover employee volume, integrations, deployment options that the team can actually deliver, and support commitments. Private cloud or a contractual SLA is only offered if it is agreed in writing.'],
];
const pilotMonths = [
  ['MONTH 01 — DISCOVER & CONFIGURE', ['Define the organization\'s objectives.', 'Agree on the data sources and permissions.', 'Configure the agreed integrations.', 'Establish baseline measurements.']],
  ['MONTH 02 — ACTIVATE & EVALUATE', ['Use the agreed analytics and intelligence features.', 'Review insights with relevant stakeholders.', 'Identify data gaps and opportunities for improvement.', 'Conduct the second monthly review.']],
  ['MONTH 03 — MEASURE & PLAN', ['Review progress against agreed success criteria.', 'Document findings and limitations.', 'Deliver the final pilot report.', 'Recommend the next deployment stage.']],
] as const;
const brainSignals = ['Employee scoring', 'Skills intelligence', 'Promotion-readiness signals', 'Workload pattern signals', 'Team capacity view', 'Hiring discussion signals', 'Project staffing signals', 'Executive insights', 'Planning signals, where available', 'AI workforce analytics'];

const description = 'AI-powered workforce intelligence for performance analytics, talent insights, skills intelligence, and workforce planning, including organizations in the UAE.';

export function homeHead() {
  return {
    meta: [
      { title: 'TalentIQ360 | AI-Powered Workforce Intelligence' },
      { name: 'description', content: description },
      { property: 'og:title', content: 'TalentIQ360 | AI-Powered Workforce Intelligence' },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://talent-iq-360-landing-page.vercel.app/' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [{ rel: 'canonical', href: 'https://talent-iq-360-landing-page.vercel.app/' }],
    scripts: [{
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'TalentIQ360',
        applicationCategory: 'BusinessApplication',
        description: 'AI-powered workforce intelligence platform for talent, performance, and planning decisions.',
        offers: plans.map((p) => ({
          '@type': 'Offer',
          name: p.name === 'Enterprise' ? 'Enterprise (starting price)' : p.name,
          price: p.amount,
          priceCurrency: 'AED',
          description: p.summary,
        })),
      }),
    }],
  };
}

function Brand() {
  return <a href="#top" className="brand-lockup" aria-label="TalentIQ360 home"><BrandMark /><span className="font-display font-extrabold leading-none text-lg min-[380px]:text-xl">Talent<span className="text-primary">IQ</span>360</span></a>;
}
function SectionHeading({ label, title, description, center = false }: { label: string; title: string; description?: string; center?: boolean }) {
  return <div className={`${center ? 'text-center mx-auto' : 'text-left'} max-w-3xl`}><p className="eyebrow mb-4">{label}</p><h2 className="font-display text-3xl md:text-5xl font-bold leading-tight text-balance">{title}</h2>{description && <p className="text-muted-foreground mt-5 text-base md:text-lg leading-relaxed">{description}</p>}</div>;
}

function ContactForm({ reason = 'Inquiry', founding = false }: { reason?: string; founding?: boolean }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending');
    const form = new FormData(e.currentTarget);
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const company = String(form.get('company') || '').trim();
    let message = `[${reason}] ${String(form.get('message') || '').trim()}`;
    if (founding) {
      message = [
        '[Founding Partner Program]',
        `Role: ${String(form.get('role') || '').trim()}`,
        `Approximate employees: ${String(form.get('employees') || '').trim()}`,
        `Required integrations: ${String(form.get('integrations') || '').trim()}`,
        `Primary objective: ${String(form.get('objective') || '').trim()}`,
        'Consent: agreed to be contacted about the 90-day paid pilot. This inquiry is not a purchase or an automatic renewal.',
      ].join('\n');
    }
    if (message.length > 2900) { setState('error'); return; }
    try {
      const { error } = await supabase.from('contact_inquiries').insert({ name, email, company: company || null, message });
      setState(error ? 'error' : 'sent');
    } catch {
      setState('error');
    }
  }
  if (state === 'sent') {
    return <div role="status" className="glass-panel rounded-2xl p-8 text-center"><Check className="text-highlight mx-auto mb-4" /><h3 className="text-xl font-bold">{founding ? 'Application received.' : 'Thanks for reaching out.'}</h3><p className="text-muted-foreground mt-2">{founding ? 'We received your Founding Partner inquiry and will reply to your work email. This is not a confirmed pilot, a charge, or a subscription.' : 'Your message has been received. This is an inquiry, not a completed subscription.'}</p></div>;
  }
  return <form onSubmit={submit} className="grid gap-4" noValidate={false}>
    <div className="grid sm:grid-cols-2 gap-4">
      <label className="text-sm text-muted-foreground">Name<input required maxLength={120} name="name" autoComplete="name" className={fieldClass} placeholder="Your name" /></label>
      <label className="text-sm text-muted-foreground">Work email<input required type="email" maxLength={255} name="email" autoComplete="email" className={fieldClass} placeholder="you@company.com" /></label>
    </div>
    <label className="text-sm text-muted-foreground">Company<input required={founding} name="company" maxLength={120} autoComplete="organization" className={fieldClass} placeholder="Company name" /></label>
    {founding ? <>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="text-sm text-muted-foreground">Role<input required name="role" maxLength={80} autoComplete="organization-title" className={fieldClass} placeholder="HR Director, CTO, COO" /></label>
        <label className="text-sm text-muted-foreground">Approximate employees<input required name="employees" maxLength={40} inputMode="numeric" className={fieldClass} placeholder="150" /></label>
      </div>
      <label className="text-sm text-muted-foreground">Required integrations<textarea required name="integrations" maxLength={500} rows={3} className="mt-2 w-full min-w-0 rounded-xl border bg-surface p-4 text-base text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40" placeholder="Systems you want to discuss, such as GitHub or Jira" /></label>
      <label className="text-sm text-muted-foreground">Primary business objective<textarea required name="objective" maxLength={800} rows={3} className="mt-2 w-full min-w-0 rounded-xl border bg-surface p-4 text-base text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40" placeholder="What you want to learn during the 90-day pilot" /></label>
      <label className="flex items-start gap-3 text-sm text-muted-foreground"><input required type="checkbox" name="consent" className="mt-0.5 size-5 shrink-0 accent-[var(--primary)]" />I agree to be contacted about this pilot. Please do not include personal data about individual employees.</label>
    </> : <label className="text-sm text-muted-foreground">What would you like to explore?<textarea required name="message" maxLength={2500} rows={4} className="mt-2 w-full min-w-0 rounded-xl border bg-surface p-4 text-base text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40" placeholder="Tell us about your team and goals" /></label>}
    {state === 'error' && <p role="alert" className="text-destructive">We couldn&apos;t send your message. Please check the fields and try again.</p>}
    <Button variant="hero" size="lg" disabled={state === 'sending'} type="submit" className="w-full sm:w-fit h-auto min-h-11 whitespace-normal text-center leading-snug py-3">{state === 'sending' ? 'Sending...' : founding ? 'Apply for the Founding Partner Program' : 'Send message'} <ArrowRight /></Button>
    <p className="text-xs text-muted-foreground">Sending this form does not start a subscription or a charge. Pricing is confirmed in a separate agreement.</p>
  </form>;
}

export function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactReason, setContactReason] = useState('Inquiry');
  const [checkoutBusy, setCheckoutBusy] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutTarget, setCheckoutTarget] = useState('');
  function openContact(reason: string) { setContactReason(reason); setContactOpen(true); setMenuOpen(false); }
  async function pay(planId: string) {
    setCheckoutBusy(planId);
    setCheckoutTarget(planId);
    setCheckoutError('');
    try {
      const result = await createZiinaCheckout({ data: { planId, origin: window.location.origin } });
      if (!result.redirectUrl) {
        setCheckoutError(result.error ?? 'Payment could not be started. You have not been charged.');
        setCheckoutBusy(null);
        window.setTimeout(() => document.getElementById(`checkout-${planId}`)?.scrollIntoView({ block: 'nearest' }), 50);
        return;
      }
      window.location.assign(result.redirectUrl);
    } catch {
      setCheckoutError('Payment could not be started. You have not been charged.');
      setCheckoutBusy(null);
      window.setTimeout(() => document.getElementById(`checkout-${planId}`)?.scrollIntoView({ block: 'nearest' }), 50);
    }
  }
  useEffect(() => {
    if (!contactOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setContactOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [contactOpen]);

  return <main id="top" className="overflow-x-clip"><Preloader /><PremiumEffects />
    <header className="fixed z-50 inset-x-0 top-0 border-b border-border bg-background/80 backdrop-blur-xl"><div className="section-wrap min-h-[72px] py-2 flex items-center justify-between gap-3"><Brand /><nav aria-label="Main navigation" className="hidden xl:flex items-center">{nav.map(([text, href]) => <a key={text} href={href} className="nav-glass">{text}</a>)}</nav><div className="hidden md:flex items-center gap-3"><Button variant="ghost" size="sm" className="h-auto min-h-11" asChild><Link to="/auth">Login</Link></Button><Button variant="hero" size="sm" className="h-auto min-h-11" asChild><a href="#pricing">View plans <ArrowUpRight /></a></Button></div><Button variant="ghost" size="icon" className="nav-toggle xl:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button></div>{menuOpen && <nav aria-label="Mobile navigation" className="xl:hidden max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain border-t border-border bg-background/80 backdrop-blur-xl px-4 sm:px-6 pb-6 pt-3 flex flex-col gap-2">{nav.map(([text, href]) => <a key={text} href={href} onClick={() => setMenuOpen(false)} className="nav-glass">{text}</a>)}<div className="flex gap-3 pt-3"><Button variant="glass" asChild><Link to="/auth">Login</Link></Button><Button variant="hero" asChild><a href="#pricing" onClick={() => setMenuOpen(false)}>View plans</a></Button></div></nav>}</header>

    <section className="relative min-h-[100svh] lg:min-h-[760px] flex items-center pt-24 pb-16 border-b border-border bg-surface"><Suspense fallback={null}><HeroField /></Suspense><div className="hero-shade absolute inset-0 pointer-events-none" /><HeroAtmosphere /><div className="section-wrap relative z-10"><div className="max-w-3xl hero-copy"><div className="inline-flex max-w-full items-center gap-2 border border-primary/35 bg-primary/10 rounded-full px-3 py-1.5 text-xs font-semibold leading-snug text-highlight mb-8 whitespace-normal"><span className="h-1.5 w-1.5 rounded-full bg-highlight" /> THE INTELLIGENCE LAYER FOR YOUR WORKFORCE</div><h1 className="font-display text-[clamp(2.25rem,10.5vw,7.5rem)] leading-[1.02] font-extrabold text-balance">Talent<span className="text-primary">IQ</span>360</h1><p className="font-display text-xl md:text-3xl font-semibold mt-6 text-balance">AI-Powered Workforce<br className="hidden sm:block" /> Intelligence Platform</p><p className="text-muted-foreground text-base md:text-lg max-w-2xl mt-6 leading-relaxed">TalentIQ360 helps leaders interpret authorized workforce signals and have clearer conversations about performance, skills, and planning. It is decision support for human leaders, including teams in the UAE. Integration availability is confirmed before a subscription or pilot.</p><div className="flex flex-wrap gap-3 mt-9"><Button variant="hero" size="lg" asChild><a href="#pricing">View plans <ArrowRight /></a></Button><Button variant="glass" size="lg" onClick={() => openContact('Discovery call')}>Book a Discovery Call <ArrowUpRight /></Button></div><p className="mt-8 text-sm text-muted-foreground max-w-xl">Scores and recommendations support review. They do not measure a person&apos;s worth, diagnose health, or guarantee an outcome.</p></div></div></section>

    <section className="border-b border-border bg-background py-6"><div className="section-wrap flex flex-wrap items-center justify-between gap-5 text-muted-foreground"><span className="text-xs uppercase font-semibold">Systems we can discuss</span><div className="flex flex-wrap gap-x-8 gap-y-3 items-center text-sm font-bold"><span className="flex items-center gap-1"><Github className="size-4" /> GitHub</span><span>Jira</span><span>ClickUp</span><span>Slack</span><span>Teams</span><span>Notion</span></div></div><p className="section-wrap text-xs text-muted-foreground pb-2">Names on this page are candidates. A listing is not a live connector until it is confirmed for your organization.</p></section>

    <section id="features" className="scroll-mt-20 py-24 md:py-32"><div className="section-wrap"><div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12"><SectionHeading label="A clearer view of your people" title="Signals for better workforce decisions." description="TalentIQ360 organizes workforce information so people can review it. Connect only data you are authorized to share, and keep a human in the decision." /><p className="max-w-xs text-sm text-muted-foreground md:text-right">From individual context to organization-wide planning.</p></div><div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">{features.map(([title, Icon, text], i) => <div key={title} className="feature-tile glass-panel rounded-2xl min-h-52 p-6 flex flex-col"><span className="h-10 w-10 rounded-xl bg-primary/15 text-highlight grid place-items-center mb-auto"><Icon className="size-5" /></span><div className="mt-7"><span className="text-xs text-muted-foreground">{String(i + 1).padStart(2, '0')} / 12</span><h3 className="font-display text-base font-bold mt-2">{title}</h3><p className="text-sm text-muted-foreground leading-relaxed mt-2">{text}</p></div></div>)}</div></div></section>

    <section id="talent-brain" className="scroll-mt-20 section-divider bg-surface py-24 md:py-32 overflow-hidden"><div className="section-wrap grid lg:grid-cols-2 gap-14 items-center"><div><SectionHeading label="Decision support" title="Insights people can review." description="Talent Brain is the name for this insight layer. It is designed to organize signals you authorize so leaders can discuss them. It does not rank a person's worth, diagnose burnout, or guarantee promotions, hiring outcomes, or delivery dates." /><div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 mt-10">{brainSignals.map((t) => <div key={t} className="flex items-start gap-2 text-sm"><CircleDot className="size-4 shrink-0 mt-0.5 text-highlight" />{t}</div>)}</div><Button variant="glass" size="lg" className="mt-10" onClick={() => openContact('Talent Brain inquiry')}>Discuss Talent Brain <ArrowRight /></Button></div><div className="relative h-[400px] md:h-[530px] grid place-items-center" aria-hidden="true"><div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(72%,290px)] aspect-square sm:w-[min(64%,340px)] md:w-[min(78%,460px)] brain-ring" /><div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(54%,220px)] aspect-square sm:w-[min(48%,260px)] md:w-[min(60%,360px)] brain-ring" /><div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(42%,185px)] aspect-square md:w-[min(42%,250px)] brain-ring" /><div className="brain-core relative z-10 h-36 w-36 md:h-44 md:w-44 rounded-full border border-primary/60 bg-primary/15 grid place-items-center flex-col text-center"><BrainCircuit className="size-9 text-highlight" /><strong className="font-display mt-2 text-sm">TALENT BRAIN</strong><span className="text-[10px] text-muted-foreground mt-1">Decision support</span></div><span className="absolute left-0 top-10 glass-panel p-3 rounded-xl text-xs float-slow">Skills intelligence</span><span className="absolute right-0 bottom-12 glass-panel p-3 rounded-xl text-xs float-slow">Planning signals</span></div></div></section>

    <section id="integrations" className="scroll-mt-20 section-divider py-24 md:py-32"><div className="section-wrap"><SectionHeading label="Integrations" title="Connect the systems you are authorized to use." description="Each integration is confirmed for compatibility, permissions, and plan limits before purchase or a pilot. Custom-scope systems need a discovery conversation." /><div className="mt-12 grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">{integrations.map((item) => <div key={item.name} className="glass-panel rounded-2xl min-h-24 flex items-center gap-3 px-4 py-3"><span className="h-8 w-8 shrink-0 rounded-lg bg-secondary grid place-items-center text-highlight font-display text-xs font-extrabold">{item.name.slice(0, 2).toUpperCase()}</span><span><span className="block text-sm font-semibold leading-tight">{item.name}</span><span className="block text-[11px] text-muted-foreground mt-1">{item.status}</span></span></div>)}</div><p className="text-sm text-muted-foreground mt-6 max-w-3xl">Core includes up to 3 supported integrations. Growth includes up to 6. Pro and Enterprise allowances are confirmed before purchase. Founding Partner pilots use two or three agreed integrations, subject to availability.</p></div></section>

    <section className="section-divider bg-surface py-24 md:py-32"><div className="section-wrap"><SectionHeading label="How it works" title="From an agreed scope to a human decision." /><div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-14">{steps.map((step, i) => <div key={step} className="relative glass-panel feature-tile rounded-2xl p-5 min-h-36 flex flex-col justify-between"><span className="text-xs text-highlight font-bold">0{i + 1}</span><div className="flex items-end justify-between gap-2"><strong className="text-sm leading-tight">{step}</strong>{i < steps.length - 1 && <ArrowRight className="size-4 shrink-0 text-primary" />}</div></div>)}</div></div></section>

    <WorkforceOverview onConnect={() => openContact('Connect integrations')} />

    <section id="pricing" className="scroll-mt-20 section-divider bg-surface py-24 md:py-32"><div className="section-wrap"><SectionHeading label="UAE pricing" title="Four ways to start workforce intelligence." description="Monthly prices in AED, excluding VAT. Core, Growth, and Pro open a one-time Ziina payment for the first month. Enterprise is agreed separately. Nothing renews automatically." center /><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-14 items-stretch min-w-0">{plans.map((p) => <article key={p.name} id={p.name === 'Enterprise' ? 'enterprise' : undefined} className={`min-w-0 rounded-2xl border p-6 flex flex-col ${p.popular ? 'border-primary bg-primary/10 shadow-[0_0_0_1px_var(--primary)]' : 'border-border bg-card'}`}><div className="h-6">{p.popular && <span className="rounded-full bg-primary/20 text-highlight px-2.5 py-1 text-[10px] font-bold">MOST POPULAR</span>}</div><h3 className="font-display text-xl font-bold mt-4">{p.name}</h3><p className="text-sm text-muted-foreground mt-3 min-h-16">{p.audience}</p><div className="mt-6"><strong className="font-display text-3xl font-bold">{p.price}</strong><span className="text-muted-foreground text-sm">{p.cadence}</span></div><p className="text-sm mt-4 leading-relaxed">{p.summary}</p><dl className="mt-6 space-y-3 text-sm border-t border-border pt-5"><div><dt className="text-muted-foreground">Employees</dt><dd className="font-medium">{p.employees}</dd></div><div><dt className="text-muted-foreground">Integrations</dt><dd className="font-medium">{p.integrations}</dd></div><div><dt className="text-muted-foreground">Support</dt><dd className="font-medium">{p.support}</dd></div></dl><ul className="my-6 space-y-3 flex-1">{p.features.map((b) => <li key={b} className="flex gap-3 items-start text-sm"><Check className="size-4 text-highlight shrink-0 mt-0.5" />{b}</li>)}</ul>{p.note && <p className="text-xs text-muted-foreground mb-4">{p.note}</p>}<Button type="button" variant={p.popular ? 'hero' : 'glass'} size="lg" onClick={() => { if (p.checkout) { void pay(p.checkout); return; } openContact(`${p.name}: ${p.cta}`); }} disabled={checkoutBusy !== null} className="w-full mt-auto h-auto min-h-11 whitespace-normal text-center leading-snug py-3 touch-manipulation">{p.checkout && checkoutBusy === p.checkout ? 'Opening Ziina...' : p.cta} <ArrowRight /></Button>{checkoutError && checkoutTarget === p.checkout && <p id={`checkout-${p.checkout}`} role="alert" className="text-sm text-destructive mt-3">{checkoutError}</p>}</article>)}</div><div className="mt-8 grid gap-3 lg:hidden">{plans.map((plan) => <article key={plan.name} className="min-w-0 rounded-2xl border border-border bg-card p-4"><h3 className="font-display text-lg font-bold">{plan.name}</h3><p className="mt-1 text-sm">{plan.price}<span className="text-muted-foreground">{plan.cadence}</span></p><dl className="mt-3 grid gap-2 text-sm"><div className="flex justify-between gap-3"><dt className="text-muted-foreground">Employees</dt><dd className="text-right">{plan.employees}</dd></div><div className="flex justify-between gap-3"><dt className="text-muted-foreground">Integrations</dt><dd className="text-right">{plan.integrations}</dd></div><div className="flex justify-between gap-3"><dt className="text-muted-foreground">Support</dt><dd className="text-right">{plan.support}</dd></div></dl></article>)}</div><div className="mt-8 hidden lg:block max-w-full overflow-x-auto rounded-2xl border border-border"><table className="w-full min-w-[760px] text-sm text-left"><caption className="sr-only">Subscription comparison in AED per month, excluding VAT</caption><thead className="bg-card text-muted-foreground"><tr><th className="p-4 font-medium">Plan</th><th className="p-4 font-medium">Price</th><th className="p-4 font-medium">Employees</th><th className="p-4 font-medium">Integrations</th><th className="p-4 font-medium">Support</th></tr></thead><tbody>{plans.map((p) => <tr key={p.name} className="border-t border-border"><th className="p-4 font-semibold text-left">{p.name}</th><td className="p-4">{p.price}{p.cadence}</td><td className="p-4">{p.employees}</td><td className="p-4">{p.integrations}</td><td className="p-4">{p.support}</td></tr>)}</tbody></table></div><p className="text-sm text-muted-foreground mt-6 max-w-4xl mx-auto text-center leading-relaxed">All prices are in AED per month, excluding applicable VAT. Feature availability, integration compatibility, AI usage, onboarding scope, and support commitments are subject to the agreed subscription and contract.</p></div></section>

    <section id="founding" className="scroll-mt-20 section-divider py-24 md:py-32"><div className="section-wrap"><p className="eyebrow">FOUNDING PARTNER PROGRAM</p><h2 className="font-display text-3xl md:text-5xl font-bold leading-tight mt-4 max-w-4xl text-balance">Be Among the First to Build the Future of Workforce Intelligence</h2><p className="text-muted-foreground text-base md:text-lg mt-5 max-w-3xl leading-relaxed">Partner with Talent IQ 360 to explore how workforce intelligence can help your organization understand performance, discover potential, and make more informed talent decisions.</p><div className="mt-12 grid lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] gap-6 items-start min-w-0"><article className="min-w-0 max-w-full rounded-2xl border border-primary/40 bg-primary/10 p-6 md:p-8"><h3 className="font-display text-2xl font-bold">Founding Partner Pilot</h3><p className="mt-6"><strong className="font-display text-4xl font-bold">AED 2,500</strong><span className="text-muted-foreground"> / month</span></p><p className="mt-2 text-sm">90-day pilot</p><p className="mt-1 text-sm font-semibold">Total pilot investment: AED 7,500</p><p className="mt-2 text-sm text-muted-foreground">The payment button charges that full amount once through Ziina. It does not renew automatically and excludes VAT.</p><ul className="mt-6 space-y-3 text-sm">{['Up to 150 employees.','Two or three agreed integrations, subject to availability and compatibility.','Access to relevant working workforce intelligence and analytics features.','Initial configuration and onboarding.','A dedicated review at the end of each month.','A final results report.','A rollout recommendation at the end of the pilot.','No separate setup fee, provided onboarding remains within the agreed scope.'].map((item) => <li key={item} className="flex gap-3"><Check className="size-4 text-highlight shrink-0 mt-0.5" />{item}</li>)}</ul><p className="text-sm text-muted-foreground mt-6 leading-relaxed">Work closely with our team during a structured 90-day pilot. Define your workforce intelligence goals, evaluate relevant capabilities, and review the results before deciding on a wider rollout.</p><div className="flex flex-col gap-3 mt-6 min-w-0"><Button variant="hero" size="lg" className="w-full max-w-full h-auto min-h-10 whitespace-normal text-center leading-snug py-3" asChild><a href="#founding-apply">Apply for the Founding Partner Program</a></Button><Button type="button" variant="hero" size="lg" className="w-full max-w-full h-auto min-h-11 whitespace-normal text-center leading-snug py-3 touch-manipulation" disabled={checkoutBusy !== null} onClick={() => { void pay('founding'); }}>{checkoutBusy === 'founding' ? 'Opening Ziina...' : 'Pay AED 7,500 for the 90-day pilot'}</Button>{checkoutError && checkoutTarget === 'founding' && <p id="checkout-founding" role="alert" className="text-sm text-destructive">{checkoutError}</p>}<Button variant="glass" size="lg" className="w-full max-w-full h-auto min-h-10 whitespace-normal py-3" onClick={() => openContact('Discovery call')}>Book a Discovery Call</Button></div></article><div id="founding-apply" className="scroll-mt-24 glass-panel rounded-2xl p-6 md:p-8 min-w-0 max-w-full"><h3 className="font-display text-2xl font-bold mb-2">Apply for the Founding Partner Program</h3><p className="text-sm text-muted-foreground mb-6">Tell us about your organization. We reply by email after the form is saved.</p><ContactForm reason="Founding Partner Program" founding /></div></div><div className="grid md:grid-cols-3 gap-4 mt-8">{pilotMonths.map(([title, items]) => <article key={title} className="rounded-2xl border border-border bg-card p-6"><h3 className="text-sm font-bold tracking-wide">{title}</h3><ul className="mt-4 space-y-3 text-sm text-muted-foreground">{items.map((item) => <li key={item} className="flex gap-2"><span className="text-highlight">·</span>{item}</li>)}</ul></article>)}</div><p className="text-sm text-muted-foreground mt-6">Pilot scope, integration availability, data permissions, success criteria, and onboarding requirements will be agreed before commencement.</p><div className="mt-8 rounded-2xl border border-border p-6 md:p-8"><h3 className="font-display text-xl font-bold">After the 90 days</h3><p className="text-sm text-muted-foreground mt-3 max-w-3xl leading-relaxed">The pilot does not renew automatically and does not charge a later subscription on its own. After the review, you may choose one of these separate options:</p><ul className="mt-4 space-y-2 text-sm"><li>Move to Growth Intelligence at AED 2,999/month, if eligible.</li><li>Discuss Workforce Intelligence Pro or Enterprise pricing if your needs exceed Growth.</li><li>Agree on an alternative scope if your requirements differ.</li></ul></div></div></section>

    <section id="leadership" className="scroll-mt-20 section-divider bg-surface py-24 md:py-32"><div className="section-wrap"><article className="rounded-3xl border border-primary/30 bg-gradient-to-b from-primary/15 to-card p-6 sm:p-10 md:p-14"><p className="eyebrow">LEADERSHIP · OUR VISION</p><h2 className="font-display text-3xl md:text-5xl font-bold mt-4">A Message from the CEO</h2><p className="text-lg md:text-xl text-highlight mt-3">Building a Smarter Future for Human Potential</p><div className="mt-8 h-px bg-border max-w-xs" /><div className="max-w-3xl mt-8 space-y-5 text-base md:text-[1.05rem] leading-8 text-foreground/90">{ceoMessage.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><div className="mt-10 h-px bg-border max-w-xs" /><p className="mt-6 font-display text-lg font-bold">The CEO</p><p className="text-sm text-muted-foreground">Talent IQ 360</p></article></div></section>

    <section className="section-divider py-24 md:py-32"><div className="section-wrap grid lg:grid-cols-[.4fr_.6fr] gap-12"><SectionHeading label="FAQs" title="Good questions. Clear answers." /><div className="divide-y divide-border border-y border-border">{faqs.map(([q, a]) => <details key={q} className="group py-5"><summary className="list-none cursor-pointer flex items-center justify-between gap-3 font-semibold text-sm md:text-base">{q}<ChevronDown className="size-4 shrink-0 text-highlight transition-transform group-open:rotate-180" /></summary><p className="text-sm text-muted-foreground leading-relaxed pt-4 max-w-xl">{a}</p></details>)}</div></div></section>

    <section id="contact" className="scroll-mt-20 section-divider py-24 md:py-32"><div className="section-wrap grid lg:grid-cols-2 gap-12 lg:gap-24"><div><SectionHeading label="Let's talk" title="Ask about a plan, a pilot, or your systems." description="Use this form for a general conversation. Plan buttons and the Founding Partner application send their own inquiries. None of them complete a purchase." /><div className="mt-10 flex items-center gap-3 text-sm text-muted-foreground"><Mail className="size-4 text-highlight" /> We reply to the work email you provide</div></div><ContactForm reason="Contact page" /></div></section>

    <footer className="section-divider bg-surface pt-16 pb-8"><div className="section-wrap"><div className="grid sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 pb-16"><div><Brand /><p className="text-muted-foreground text-sm mt-5 max-w-xs leading-relaxed">Workforce intelligence that keeps human judgment at the center of talent decisions.</p></div><div><h3 className="font-bold text-sm mb-5">Product</h3><div className="flex flex-col gap-3 text-sm text-muted-foreground"><a href="#features">Features</a><a href="#pricing">Pricing</a><a href="#founding">Founding Partner</a><a href="#integrations">Integrations</a></div></div><div><h3 className="font-bold text-sm mb-5">Company</h3><div className="flex flex-col gap-3 text-sm text-muted-foreground"><a href="#leadership">Leadership</a><a href="#contact">Contact</a><Button variant="link" className="w-fit h-auto p-0 text-muted-foreground" onClick={() => openContact('Privacy inquiry')}>Privacy inquiries</Button><Button variant="link" className="w-fit h-auto p-0 text-muted-foreground" onClick={() => openContact('Terms inquiry')}>Terms inquiries</Button></div></div><div><h3 className="font-bold text-sm mb-5">Account</h3><div className="flex flex-col gap-3 text-sm text-muted-foreground"><Link to="/auth">Login</Link><a href="#pricing">View plans</a></div></div></div><div className="border-t border-border pt-7 flex flex-wrap justify-between gap-4 text-xs text-muted-foreground"><span>© {new Date().getFullYear()} TalentIQ360. All rights reserved.</span><span>Prices in AED, excluding applicable VAT.</span></div></div></footer>

    {contactOpen && <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-md" onMouseDown={(e) => { if (e.target === e.currentTarget) setContactOpen(false); }}><div role="dialog" aria-modal="true" aria-labelledby="contact-title" className="glass-panel rounded-2xl p-5 sm:p-8 w-full max-w-lg max-h-[calc(100dvh-1rem)] overflow-y-auto overscroll-contain relative"><Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={() => setContactOpen(false)} aria-label="Close"><X /></Button><p className="eyebrow mb-3">{contactReason}</p><h2 id="contact-title" className="font-display text-2xl font-bold mb-2 pr-8">Start a conversation.</h2><p className="text-sm text-muted-foreground mb-6">This sends an inquiry. It does not purchase a subscription.</p><ContactForm reason={contactReason} /></div></div>}
  </main>;
}
