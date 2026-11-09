import { Link } from '@tanstack/react-router';
import { lazy, Suspense, useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandMark } from '@/components/brand-mark';
import { publicSiteUrl } from '@/lib/site-url';
import { supabase } from '@/integrations/supabase/client';
import { PremiumEffects, HeroAtmosphere } from '@/components/premium-effects';
import { Preloader } from '@/components/preloader';
import { WorkforceOverview } from '@/components/workforce-overview';
import { createZiinaCheckout } from '@/server/ziina.functions';

const HeroField = lazy(() => import('@/components/ui/hero-field'));
const fieldClass = 'mt-2 h-12 w-full min-w-0 rounded-xl border bg-surface px-4 text-base text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40';
const areaClass = 'mt-2 w-full min-w-0 rounded-xl border bg-surface p-4 text-base text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40';

const nav = [
  ['What it does', '#what'],
  ['How it works', '#how'],
  ['Benefits', '#features'],
  ['Pricing', '#pricing'],
  ['About', '#about'],
  ['Contact', '#contact'],
] as const;

const plans = [
  { name: 'Core Intelligence', audience: 'For smaller companies beginning their workforce intelligence journey.', price: 'AED 999', amount: '999', cadence: '/ month', employees: 'Up to 100 employees', integrations: 'Up to 3 supported integrations', support: 'Standard support', summary: 'Build a clearer understanding of your workforce with essential analytics and talent intelligence.', cta: 'Get Started', checkout: 'core', popular: false, note: '', features: ['Employee scoring and basic talent intelligence', 'Workforce dashboard', 'Performance analytics', 'Human review of insights'] },
  { name: 'Growth Intelligence', audience: 'For established HR, technology, and business teams that need deeper workforce insights.', price: 'AED 2,999', amount: '2999', cadence: '/ month', employees: 'Up to 300 employees', integrations: 'Up to 6 supported integrations', support: 'Priority support', summary: 'Turn workforce data into actionable insights that help leaders make more informed talent and performance decisions.', cta: 'Choose Growth', checkout: 'growth', popular: true, note: '', features: ['Advanced workforce analytics', 'Advanced performance analytics', 'Talent matching and skills intelligence', 'Promotion-readiness insights for discussion', 'Capacity-planning insights', 'Executive dashboards'] },
  { name: 'Workforce Intelligence Pro', audience: 'For larger, data-intensive organizations requiring broader analytics and workforce visibility.', price: 'AED 6,999', amount: '6999', cadence: '/ month', employees: 'Up to 750 employees', integrations: 'Expanded allowance, confirmed before purchase', support: 'Priority support', summary: 'Unlock broader workforce intelligence for complex teams, projects, and organizational decisions.', cta: 'Pay first month', checkout: 'pro', popular: false, note: '', features: ['Executive reporting', 'Workforce forecasting, where production-ready', 'Team and project capacity insights', 'Expanded AI analytics usage, with documented limits', 'Priority implementation'] },
  { name: 'Enterprise', audience: 'For organizations requiring a customized workforce intelligence deployment.', price: 'From AED 12,000', amount: '12000', cadence: '/ month', employees: 'Custom employee capacity', integrations: 'Custom integration scope', support: 'Dedicated support options, subject to the agreement', summary: 'Build a workforce intelligence solution aligned with your organization\'s scale, systems, governance, and operational needs.', cta: 'Contact Enterprise Sales', checkout: null, popular: false, note: 'Enterprise pricing depends on employee volume, integration requirements, deployment scope, usage, and support commitments.', features: ['Advanced reporting, where available', 'Custom deployment options, if supported', 'Security and technical reviews', 'Negotiated service commitments', 'Custom implementation and onboarding'] },
];

const problems = [
  ['Warehouse', 'Where is the stock, what is running low, and which site is busiest?'],
  ['Sales', 'Who is selling, which products bring in money, and what changed this month?'],
  ['Logistics', 'Which deliveries are moving, which are late, and when is a shipment expected?'],
  ['Procurement', 'Which suppliers still owe an order, and what should be reordered?'],
  ['Finance', 'What did we spend, which payments are open, and how does the month look?'],
  ['People', 'Which teams are keeping up, and where does a manager need to look?'],
] as const;

const steps = [
  ['Tell us the goal', 'We agree what you want to understand before anything is connected.'],
  ['Connect approved systems', 'Only the tools and files you are allowed to share are included.'],
  ['See it in one place', 'TalentIQ360 organizes that information so you are not hunting through separate reports.'],
  ['Ask in plain language', 'Owners and managers ask questions the way they would ask a colleague.'],
  ['Decide with your team', 'You get a clear summary. People still make the decision.'],
] as const;

const benefits = [
  ['Less time searching', 'Stop opening spreadsheets, inboxes, and several systems to answer one question.'],
  ['Problems show up earlier', 'Low stock, late work, or a quiet sales month can be seen before it grows.'],
  ['One conversation', 'Warehouse, sales, finance, and people questions can sit in the same place when those sources are included.'],
  ['No technical skills required', 'You do not build the reports. You read the view and ask a question.'],
  ['You stay in control', 'The assistant suggests. It does not hire, promote, or judge a person’s worth.'],
  ['Start small', 'You can begin with a few connections. You do not have to link every system on day one.'],
] as const;

const featureGroups = [
  ['Understand your people', ['A simple view of work and performance, for a person to review.', 'Skills your organization has already described.', 'Workload and capacity, within the data you connect.']],
  ['Support everyday decisions', ['Ideas for hiring conversations. A person still makes the hiring decision.', 'Growth and promotion topics for discussion. Nothing here decides a promotion.', 'Early signs that delivery dates may be at risk. Dates are not guaranteed.']],
  ['Give leaders a summary', ['Team and company views for the information in your plan.', 'Suggested next steps from the data you approved.', 'A place to match skills with open work, for people to decide.']],
] as const;

const integrations: { name: string; status: string }[] = [
  ['GitHub', 'Agreed during setup'], ['Jira', 'Agreed during setup'], ['ClickUp', 'Agreed during setup'], ['LinkedIn', 'Custom project'],
  ['Slack', 'Agreed during setup'], ['Microsoft Teams', 'Agreed during setup'], ['Google Workspace', 'Custom project'], ['Azure DevOps', 'Custom project'],
  ['GitLab', 'Custom project'], ['Bitbucket', 'Custom project'], ['Asana', 'Custom project'], ['Monday.com', 'Custom project'],
  ['Trello', 'Custom project'], ['HubSpot', 'Custom project'], ['Salesforce', 'Custom project'], ['Notion', 'Custom project'],
  ['Google Sheets', 'Custom project'], ['Excel', 'Custom project'], ['CSV uploads', 'Custom project'],
].map(([name, status]) => ({ name: name ?? '', status: status ?? '' }));

const faqs = [
  ['What exactly is TalentIQ360?', 'It is a place where owners and managers can see the business information they are allowed to share, notice issues, and ask questions in everyday language. It helps people decide. It does not decide for them.'],
  ['What problem does it solve?', 'Teams lose time jumping between spreadsheets, reports, and separate systems. TalentIQ360 brings the approved information together so a question is easier to answer.'],
  ['Do I need to be technical?', 'No. Day to day, you read the screen and ask a question. Connecting a system is done with your team, using access you approve.'],
  ['How does the assistant work?', 'You ask in normal English. It summarizes the information included in your setup. On this website, the demonstration uses sample data only. It cannot see your business. Answers are for review, not a final decision.'],
  ['Can it work across departments?', 'Yes. Warehouse, sales, logistics, buying, finance, and people can be reviewed together when those sources are part of your setup.'],
  ['Which systems can I connect?', 'The names on this page are systems we can discuss. A name is not a live connection. We confirm what works, and what you are allowed to share, before a purchase or a pilot. Core includes up to 3 supported connections. Growth includes up to 6.'],
  ['Is my information safe?', 'Connect only what you are allowed to share. Ask us about who can see it, how long it is kept, and how it can be deleted. We do not claim security certificates that have not been completed.'],
  ['How much does it cost?', 'Core is AED 999 per month, Growth is AED 2,999 per month, and Workforce Intelligence Pro is AED 6,999 per month. Enterprise starts from AED 12,000 per month. Prices exclude VAT. The online buttons pay the first month once and do not renew by themselves. Enterprise is agreed separately.'],
  ['What is the 90-day pilot?', 'A paid trial at AED 2,500 per month, AED 7,500 in total. We agree the goal and the sources first. It does not renew by itself. Staying on afterward is a separate decision.'],
  ['How do I start?', 'Book a conversation, or apply for the pilot if you want to try TalentIQ360 with an agreed set of your own sources. Sending a form does not start a subscription.'],
] as const;

const ceoMessage = [
  'At Talent IQ 360, we believe that an organization\'s greatest asset is its people. Yet, in a world increasingly driven by data, many organizations still lack the visibility and intelligence needed to fully understand their workforce, recognize potential, and make confident talent decisions.',
  'We built Talent IQ 360 to change that.',
  'Our vision is to transform how organizations understand, develop, and empower their people by bringing workforce intelligence, performance insights, and AI-driven analytics together in one platform. By turning complex workforce data into meaningful, actionable insights, we aim to help leaders make more informed decisions, identify opportunities for growth, and build stronger, more capable teams.',
  'But we believe technology should do more than analyze data. It should empower people. AI should support better decisions, create opportunities for development, and help organizations recognize the potential that might otherwise go unnoticed.',
  'As we continue to build and evolve Talent IQ 360, our commitment remains clear: to make workforce intelligence more accessible, actionable, and meaningful for every organization we serve.',
  'The future of work will be shaped by how well we understand and develop human potential. At Talent IQ 360, we\'re building the intelligence to help make that future possible.',
  'Thank you for being part of our journey.',
];

const description = 'TalentIQ360 helps owners and managers see their people and operations in one place, spot problems, and ask questions in everyday language.';

export function homeHead() {
  return {
    meta: [
      { title: 'TalentIQ360 | See your business in one place' },
      { name: 'description', content: description },
      { property: 'og:title', content: 'TalentIQ360 | See your business in one place' },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: `${publicSiteUrl()}/` },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [{ rel: 'canonical', href: `${publicSiteUrl()}/` }],
    scripts: [{
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'TalentIQ360',
        applicationCategory: 'BusinessApplication',
        description,
        offers: plans.map((plan) => ({
          '@type': 'Offer',
          name: plan.name === 'Enterprise' ? 'Enterprise (starting price)' : plan.name,
          price: plan.amount,
          priceCurrency: 'AED',
          description: plan.summary,
        })),
      }),
    }],
  };
}

function Brand() {
  return (
    <a href="#top" className="brand-lockup" aria-label="TalentIQ360 home">
      <BrandMark alt="" />
      <span className="font-display text-lg font-extrabold leading-none min-[380px]:text-xl">Talent<span className="text-primary">IQ</span>360</span>
    </a>
  );
}

function SectionHeading({ label, title, description: copy, center = false }: { label: string; title: string; description?: string; center?: boolean }) {
  return (
    <div className={`${center ? 'mx-auto text-center' : 'text-left'} max-w-3xl`}>
      <p className="eyebrow mb-4">{label}</p>
      <h2 className="font-display text-3xl font-bold leading-tight text-balance md:text-5xl">{title}</h2>
      {copy && <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">{copy}</p>}
    </div>
  );
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
    return (
      <div role="status" className="glass-panel rounded-2xl p-8 text-center">
        <Check className="mx-auto mb-4 text-highlight" />
        <h3 className="text-xl font-bold">{founding ? 'Application received.' : 'Thanks for reaching out.'}</h3>
        <p className="mt-2 text-muted-foreground">{founding ? 'We received your Founding Partner inquiry and will reply to your work email. This is not a confirmed pilot, a charge, or a subscription.' : 'Your message has been received. This is an inquiry, not a completed subscription.'}</p>
      </div>
    );
  }
  return (
    <form onSubmit={submit} className="grid gap-4" noValidate={false}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-muted-foreground">Name<input required maxLength={120} name="name" autoComplete="name" className={fieldClass} placeholder="Your name" /></label>
        <label className="text-sm text-muted-foreground">Work email<input required type="email" maxLength={255} name="email" autoComplete="email" className={fieldClass} placeholder="you@company.com" /></label>
      </div>
      <label className="text-sm text-muted-foreground">Company<input required={founding} name="company" maxLength={120} autoComplete="organization" className={fieldClass} placeholder="Company name" /></label>
      {founding ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-muted-foreground">Your role<input required name="role" maxLength={80} autoComplete="organization-title" className={fieldClass} placeholder="Owner, HR lead, or operations manager" /></label>
            <label className="text-sm text-muted-foreground">Approximate employees<input required name="employees" maxLength={40} inputMode="numeric" className={fieldClass} placeholder="150" /></label>
          </div>
          <label className="text-sm text-muted-foreground">Systems you want to connect<textarea required name="integrations" maxLength={500} rows={3} className={areaClass} placeholder="For example Excel, Jira, or Slack" /></label>
          <label className="text-sm text-muted-foreground">What do you want to learn in 90 days?<textarea required name="objective" maxLength={800} rows={3} className={areaClass} placeholder="For example, which teams are overloaded, or where sales changed" /></label>
          <label className="flex items-start gap-3 text-sm text-muted-foreground"><input required type="checkbox" name="consent" className="mt-0.5 size-5 shrink-0 accent-[var(--primary)]" />I agree to be contacted about this pilot. Please do not include personal data about individual employees.</label>
        </>
      ) : (
        <label className="text-sm text-muted-foreground">What would you like to explore?<textarea required name="message" maxLength={2500} rows={4} className={areaClass} placeholder="Tell us about your company and what you want to understand" /></label>
      )}
      {state === 'error' && <p role="alert" className="text-destructive">We couldn&apos;t send your message. Please check the fields and try again.</p>}
      <Button variant="hero" size="lg" disabled={state === 'sending'} type="submit" className="h-auto min-h-11 w-full whitespace-normal py-3 text-center leading-snug sm:w-fit">{state === 'sending' ? 'Sending...' : founding ? 'Apply for the Founding Partner Program' : 'Send message'} <ArrowRight /></Button>
      <p className="text-xs text-muted-foreground">Sending this form does not start a subscription or a charge. Pricing is confirmed in a separate agreement.</p>
    </form>
  );
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

  return (
    <main id="top" className="overflow-x-clip">
      <Preloader />
      <PremiumEffects />
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="section-wrap flex min-h-[72px] items-center justify-between gap-3 py-2">
          <Brand />
          <nav aria-label="Main navigation" className="hidden items-center xl:flex">
            {nav.map(([text, href]) => <a key={text} href={href} className="nav-glass">{text}</a>)}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <Button variant="ghost" size="sm" className="h-auto min-h-11" asChild><Link to="/auth">Login</Link></Button>
            <Button variant="hero" size="sm" className="h-auto min-h-11" onClick={() => openContact('Free demo')}>Book a free demo <ArrowUpRight /></Button>
          </div>
          <Button variant="ghost" size="icon" className="nav-toggle xl:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
        </div>
        {menuOpen && (
          <nav aria-label="Mobile navigation" className="flex max-h-[calc(100dvh-4.5rem)] flex-col gap-2 overflow-y-auto overscroll-contain border-t border-border bg-background/80 px-4 pb-6 pt-3 backdrop-blur-xl sm:px-6 xl:hidden">
            {nav.map(([text, href]) => <a key={text} href={href} onClick={() => setMenuOpen(false)} className="nav-glass">{text}</a>)}
            <div className="flex gap-3 pt-3">
              <Button variant="glass" asChild><Link to="/auth">Login</Link></Button>
              <Button variant="hero" onClick={() => openContact('Free demo')}>Book a free demo</Button>
            </div>
          </nav>
        )}
      </header>

      <section className="relative flex min-h-[100svh] items-center border-b border-border bg-surface pb-16 pt-24 lg:min-h-[760px]">
        <Suspense fallback={null}><HeroField /></Suspense>
        <div className="hero-shade pointer-events-none absolute inset-0" />
        <HeroAtmosphere />
        <div className="section-wrap relative z-10">
          <div className="hero-copy max-w-3xl">
            <p className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-highlight"><span className="h-1.5 w-1.5 rounded-full bg-highlight" /> For owners and managers</p>
            <h1 className="font-display text-[clamp(2.4rem,6vw,4.75rem)] font-extrabold leading-[1.05] text-balance">See your people and your business in one place.</h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">TalentIQ360 gathers the information you are allowed to share, then helps you ask questions in everyday language. You still make the decisions.</p>
            <ul className="mt-6 grid gap-3 text-sm sm:text-base">
              {['Understand what is happening.', 'Notice problems before they grow.', 'Get answers without building a report.'].map((item) => (
                <li key={item} className="flex items-start gap-3"><Check className="mt-0.5 size-4 shrink-0 text-highlight" />{item}</li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button variant="hero" size="lg" onClick={() => openContact('Free demo')}>Book a free demo <ArrowRight /></Button>
              <Button variant="glass" size="lg" asChild><a href="#how">See how it works</a></Button>
            </div>
            <p className="mt-8 max-w-xl text-sm text-muted-foreground">Scores and suggestions are there for a person to review. They do not measure someone&apos;s worth, diagnose health, or guarantee a result.</p>
          </div>
        </div>
      </section>

      <section id="what" className="scroll-mt-24 py-24 md:py-32">
        <div className="section-wrap">
          <SectionHeading label="What it does" title="One short explanation." description="TalentIQ360 is an assistant for running the business. It puts approved information about your people and your operations in one view, so you can see the situation and ask a question." />
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['1', 'What it is', 'A single place to read what is happening in the parts of the business you connect.'],
              ['2', 'Who it is for', 'Owners, directors, and the managers who run warehouse, sales, finance, or people.'],
              ['3', 'What you do', 'Open the view, or ask a question in normal English.'],
              ['4', 'What you get', 'A clear summary you can discuss with your team. The decision stays with you.'],
            ].map(([step, title, text]) => (
              <article key={title} className="glass-panel rounded-2xl p-6">
                <p className="text-xs font-bold text-highlight">{step}</p>
                <h3 className="mt-3 font-display text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-divider bg-surface py-24 md:py-32">
        <div className="section-wrap">
          <SectionHeading label="The problem" title="Running the business should not mean chasing information." description="These are the questions managers already ask. TalentIQ360 is meant to make them easier to answer once the right systems are connected. A live number appears only when that source is included and you are allowed to use it." />
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {problems.map(([title, text]) => (
              <article key={title} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-display text-lg font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="section-divider scroll-mt-24 py-24 md:py-32">
        <div className="section-wrap">
          <SectionHeading label="How it works" title="Five steps. No technical setup on your side." />
          <ol className="mt-12 grid gap-3 md:grid-cols-5">
            {steps.map(([title, text], index) => (
              <li key={title} className="glass-panel flex min-h-44 flex-col rounded-2xl p-5">
                <span className="text-xs font-bold text-highlight">Step {index + 1}</span>
                <h3 className="mt-4 font-display text-lg font-bold leading-tight">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="features" className="section-divider scroll-mt-24 bg-surface py-24 md:py-32">
        <div className="section-wrap">
          <SectionHeading label="Why companies use it" title="Less searching. Clearer conversations." description="The benefit is simple: the people who run the company spend less time assembling information and more time deciding what to do." />
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map(([title, text]) => (
              <article key={title} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-display text-lg font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {featureGroups.map(([title, items]) => (
              <article key={title} className="glass-panel rounded-2xl p-6">
                <h3 className="font-display text-lg font-bold">{title}</h3>
                <ul className="mt-4 space-y-3">
                  {items.map((item) => <li key={item} className="flex items-start gap-3 text-sm leading-relaxed"><Check className="mt-0.5 size-4 shrink-0 text-highlight" />{item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="integrations" className="section-divider scroll-mt-24 py-24 md:py-32">
        <div className="section-wrap">
          <SectionHeading label="Your systems" title="Connect only what you approve." description="These are systems we can talk about. Seeing a name here does not mean it is already connected. We confirm fit, permissions, and your plan before a purchase or a pilot." />
          <div className="mt-12 grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {integrations.map((item) => (
              <div key={item.name} className="glass-panel flex min-h-24 items-center gap-3 rounded-2xl px-4 py-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-secondary font-display text-xs font-extrabold text-highlight">{item.name.slice(0, 2).toUpperCase()}</span>
                <span>
                  <span className="block text-sm font-semibold leading-tight">{item.name}</span>
                  <span className="mt-1 block text-[11px] text-muted-foreground">{item.status}</span>
                </span>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">Core includes up to 3 supported connections. Growth includes up to 6. Pro and Enterprise are confirmed before purchase. A pilot uses two or three agreed connections, if they are available.</p>
        </div>
      </section>

      <WorkforceOverview onConnect={() => openContact('Connect integrations')} />

      <section id="pricing" className="section-divider scroll-mt-24 bg-surface py-24 md:py-32">
        <div className="section-wrap">
          <SectionHeading label="Pricing" title="Four plans. The price is the monthly fee." description="Prices are in AED and exclude VAT. Core, Growth, and Pro open a one-time payment for the first month. Enterprise is agreed separately. Nothing renews by itself." center />
          <div className="mt-14 grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan) => (
              <article key={plan.name} id={plan.name === 'Enterprise' ? 'enterprise' : undefined} className={`flex min-w-0 flex-col rounded-2xl border p-6 ${plan.popular ? 'border-primary bg-primary/10 shadow-[0_0_0_1px_var(--primary)]' : 'border-border bg-card'}`}>
                <div className="h-6">{plan.popular && <span className="rounded-full bg-primary/20 px-2.5 py-1 text-[10px] font-bold text-highlight">MOST POPULAR</span>}</div>
                <h3 className="mt-4 font-display text-xl font-bold">{plan.name}</h3>
                <p className="mt-3 text-sm text-muted-foreground"><span className="font-semibold text-foreground">Who it is for. </span>{plan.audience}</p>
                <div className="mt-6"><strong className="font-display text-3xl font-bold">{plan.price}</strong><span className="text-sm text-muted-foreground">{plan.cadence}</span></div>
                <p className="mt-4 text-sm leading-relaxed">{plan.summary}</p>
                <dl className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
                  <div><dt className="text-muted-foreground">Employees</dt><dd className="font-medium">{plan.employees}</dd></div>
                  <div><dt className="text-muted-foreground">Connections included</dt><dd className="font-medium">{plan.integrations}</dd></div>
                  <div><dt className="text-muted-foreground">Support</dt><dd className="font-medium">{plan.support}</dd></div>
                </dl>
                <ul className="my-6 flex-1 space-y-3">
                  {plan.features.map((item) => <li key={item} className="flex items-start gap-3 text-sm"><Check className="mt-0.5 size-4 shrink-0 text-highlight" />{item}</li>)}
                </ul>
                {plan.note && <p className="mb-4 text-xs text-muted-foreground">{plan.note}</p>}
                <Button type="button" variant={plan.popular ? 'hero' : 'glass'} size="lg" disabled={checkoutBusy !== null} className="mt-auto h-auto min-h-11 w-full touch-manipulation whitespace-normal py-3 text-center leading-snug" onClick={() => { if (plan.checkout) { void pay(plan.checkout); return; } openContact(`${plan.name}: ${plan.cta}`); }}>
                  {plan.checkout && checkoutBusy === plan.checkout ? 'Opening Ziina...' : plan.cta} <ArrowRight />
                </Button>
                {checkoutError && checkoutTarget === plan.checkout && <p id={`checkout-${plan.checkout}`} role="alert" className="mt-3 text-sm text-destructive">{checkoutError}</p>}
              </article>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-4xl text-center text-sm leading-relaxed text-muted-foreground">All prices are in AED per month, excluding applicable VAT. What is included, which systems can connect, how much the assistant can be used, onboarding, and support all follow the agreement you sign. The payment buttons charge the first month once. They do not renew automatically.</p>
        </div>
      </section>

      <section id="founding" className="section-divider scroll-mt-24 py-24 md:py-32">
        <div className="section-wrap">
          <p className="eyebrow">90-day pilot</p>
          <h2 className="mt-4 max-w-4xl text-balance font-display text-3xl font-bold leading-tight md:text-5xl">Try TalentIQ360 with your own information.</h2>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">For three months we agree a goal, connect the sources you approve, and review what you learn. The pilot is AED 2,500 per month, AED 7,500 in total, excluding VAT. It does not renew by itself.</p>
          <div className="mt-12 grid items-start gap-6 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
            <article className="rounded-2xl border border-primary/40 bg-primary/10 p-6 md:p-8">
              <h3 className="font-display text-2xl font-bold">Founding Partner Pilot</h3>
              <p className="mt-6"><strong className="font-display text-4xl font-bold">AED 2,500</strong><span className="text-muted-foreground"> / month</span></p>
              <p className="mt-2 text-sm">90-day pilot</p>
              <p className="mt-1 text-sm font-semibold">Total pilot investment: AED 7,500</p>
              <p className="mt-2 text-sm text-muted-foreground">The payment button charges that full amount once through Ziina. It does not renew automatically and excludes VAT.</p>
              <ul className="mt-6 space-y-3 text-sm">
                {['Up to 150 employees.', 'Two or three agreed integrations, subject to availability and compatibility.', 'Access to relevant working workforce intelligence and analytics features.', 'Initial configuration and onboarding.', 'A dedicated review at the end of each month.', 'A final results report.', 'A rollout recommendation at the end of the pilot.', 'No separate setup fee, provided onboarding remains within the agreed scope.'].map((item) => (
                  <li key={item} className="flex gap-3"><Check className="mt-0.5 size-4 shrink-0 text-highlight" />{item}</li>
                ))}
              </ul>
              <div className="mt-6 flex min-w-0 flex-col gap-3">
                <Button variant="hero" size="lg" className="h-auto min-h-11 w-full whitespace-normal py-3" asChild><a href="#founding-apply">Apply for the Founding Partner Program</a></Button>
                <Button type="button" variant="hero" size="lg" className="h-auto min-h-11 w-full touch-manipulation whitespace-normal py-3" disabled={checkoutBusy !== null} onClick={() => { void pay('founding'); }}>{checkoutBusy === 'founding' ? 'Opening Ziina...' : 'Pay AED 7,500 for the 90-day pilot'}</Button>
                {checkoutError && checkoutTarget === 'founding' && <p id="checkout-founding" role="alert" className="text-sm text-destructive">{checkoutError}</p>}
                <Button variant="glass" size="lg" className="h-auto w-full whitespace-normal py-3" onClick={() => openContact('Free demo')}>Book a free demo</Button>
              </div>
            </article>
            <div id="founding-apply" className="glass-panel scroll-mt-24 rounded-2xl p-6 md:p-8">
              <h3 className="mb-2 font-display text-2xl font-bold">Apply for the pilot</h3>
              <p className="mb-6 text-sm text-muted-foreground">Tell us about your company. We reply by email. This form does not charge your card.</p>
              <ContactForm reason="Founding Partner Program" founding />
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ['Month 1', 'Agree the goal, the information you can share, and set up those connections. Record where you are starting.'],
              ['Month 2', 'Use the platform, review what you learn with the right people, and note any gaps.'],
              ['Month 3', 'Look at the results, receive the final report, and decide whether to continue.'],
            ].map(([title, text]) => (
              <article key={title} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-display text-lg font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">The goal, the systems, the permissions, and the onboarding are agreed before the pilot starts.</p>
          <div className="mt-8 rounded-2xl border border-border p-6 md:p-8">
            <h3 className="font-display text-xl font-bold">After the 90 days</h3>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">The pilot does not renew automatically and does not charge a later subscription on its own. After the review, you may choose one of these separate options:</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>Move to Growth Intelligence at AED 2,999/month, if eligible.</li>
              <li>Discuss Workforce Intelligence Pro or Enterprise pricing if your needs exceed Growth.</li>
              <li>Agree on an alternative scope if your requirements differ.</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="about" className="section-divider scroll-mt-24 bg-surface py-24 md:py-32">
        <div className="section-wrap">
          <SectionHeading label="About us" title="Built so leaders do not need a technical briefing." description="TalentIQ360 helps companies understand their people and their operations without living in spreadsheets. The letter below is from the CEO." />
          <article id="leadership" className="mt-12 rounded-3xl border border-primary/30 bg-gradient-to-b from-primary/15 to-card p-6 sm:p-10 md:p-14">
            <p className="eyebrow">From the CEO</p>
            <h3 className="mt-4 font-display text-3xl font-bold md:text-4xl">A message from the CEO</h3>
            <p className="mt-3 text-lg text-highlight">Building a smarter future for human potential</p>
            <div className="mt-8 max-w-3xl space-y-5 text-base leading-8">
              {ceoMessage.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <p className="mt-8 font-display text-lg font-bold">The CEO</p>
            <p className="text-sm text-muted-foreground">Talent IQ 360</p>
          </article>
        </div>
      </section>

      <section className="section-divider py-24 md:py-32">
        <div className="section-wrap grid gap-12 lg:grid-cols-[.4fr_.6fr]">
          <SectionHeading label="Questions" title="Plain answers." />
          <div className="divide-y divide-border border-y border-border">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold md:text-base">
                  {question}
                  <ChevronDown className="size-4 shrink-0 text-highlight transition-transform group-open:rotate-180" />
                </summary>
                <p className="max-w-xl pt-4 text-sm leading-relaxed text-muted-foreground">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="section-divider scroll-mt-24 py-24 md:py-32">
        <div className="section-wrap grid gap-12 lg:grid-cols-2 lg:gap-24">
          <div>
            <SectionHeading label="Contact" title="Tell us what you want to understand." description="Use this form for a general conversation. Choosing a plan or applying for the pilot uses its own button. None of these forms complete a purchase by themselves." />
            <p className="mt-8 text-sm text-muted-foreground"><a className="hover:text-foreground" href="mailto:mali@smsit.sa">mali@smsit.sa</a></p>
          </div>
          <ContactForm reason="Contact page" />
        </div>
      </section>

      <footer className="section-divider bg-surface pb-8 pt-16">
        <div className="section-wrap">
          <div className="grid gap-10 pb-16 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
            <div>
              <Brand />
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">One place to understand your people and your operations, then decide with your team.</p>
              <a href="mailto:mali@smsit.sa" className="mt-4 inline-flex text-sm text-muted-foreground hover:text-foreground">mali@smsit.sa</a>
            </div>
            <div>
              <h3 className="mb-5 text-sm font-bold">Product</h3>
              <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                <a href="#what">What it does</a>
                <a href="#how">How it works</a>
                <a href="#features">Benefits</a>
                <a href="#pricing">Pricing</a>
                <a href="#founding">90-day pilot</a>
              </div>
            </div>
            <div>
              <h3 className="mb-5 text-sm font-bold">Company</h3>
              <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
                <Button variant="link" className="h-auto w-fit p-0 text-muted-foreground" onClick={() => openContact('Privacy inquiry')}>Privacy inquiries</Button>
                <Button variant="link" className="h-auto w-fit p-0 text-muted-foreground" onClick={() => openContact('Terms inquiry')}>Terms inquiries</Button>
              </div>
            </div>
            <div>
              <h3 className="mb-5 text-sm font-bold">Account</h3>
              <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                <Link to="/auth">Login</Link>
                <a href="#pricing">View plans</a>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-between gap-4 border-t border-border pt-7 text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} TalentIQ360. All rights reserved.</span>
            <span>Prices in AED, excluding applicable VAT.</span>
          </div>
        </div>
      </footer>

      {contactOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-background/80 p-3 backdrop-blur-md sm:items-center sm:p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) setContactOpen(false); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="contact-title" className="glass-panel relative max-h-[calc(100dvh-1rem)] w-full max-w-lg overflow-y-auto overscroll-contain rounded-2xl p-5 sm:p-8">
            <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={() => setContactOpen(false)} aria-label="Close"><X /></Button>
            <p className="eyebrow mb-3">{contactReason}</p>
            <h2 id="contact-title" className="mb-2 pr-8 font-display text-2xl font-bold">{contactReason.toLowerCase().includes('demo') ? 'Book a free demo.' : 'Start a conversation.'}</h2>
            <p className="mb-6 text-sm text-muted-foreground">This sends a message. It does not buy a subscription.</p>
            <ContactForm reason={contactReason} />
          </div>
        </div>
      )}
    </main>
  );
}
