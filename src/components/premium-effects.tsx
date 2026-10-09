import { useEffect } from 'react';

/** Global micro-interactions: card tilt/spotlight, magnetic + ripple buttons, scroll navbar, scroll reveals. */
export function PremiumEffects() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;

    const onMove = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t?.closest) return;
      const card = t.closest<HTMLElement>('main .glass-panel:not(button):not(a):not(header *)');
      if (card) {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', `${x * 100}%`);
        card.style.setProperty('--my', `${y * 100}%`);
        if (fine && !reduce && r.width < 520) card.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 6}deg) rotateY(${(x - 0.5) * 6}deg) translateY(-4px)`;
      }
    };
    const onOut = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const el = t?.closest?.<HTMLElement>('.glass-panel');
      if (el && !el.contains(e.relatedTarget as Node)) el.style.transform = '';
    };
    const header = document.querySelector('header');
    const onScroll = () => header?.classList.toggle('nav-scrolled', window.scrollY > 24);

    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('main section:not(:first-of-type) .section-wrap > *, main section .grid > .glass-panel').forEach((el, i) => {
      el.classList.add('reveal'); (el as HTMLElement).style.setProperty('--d', `${(i % 6) * 60}ms`); io.observe(el);
    });

    // Active nav link
    const links = [...document.querySelectorAll<HTMLAnchorElement>('header nav a[href^="#"]')];
    const navIo = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) links.forEach((a) => a.classList.toggle('nav-active', a.getAttribute('href') === `#${en.target.id}`));
    }), { rootMargin: '-45% 0px -50% 0px' });
    links.forEach((a) => { const s = document.querySelector(a.getAttribute('href')!); if (s) navIo.observe(s); });

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerout', onOut);
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    return () => {
      document.removeEventListener('pointermove', onMove); document.removeEventListener('pointerout', onOut);
      window.removeEventListener('scroll', onScroll);
      io.disconnect(); navIo.disconnect();
    };
  }, []);
  return null;
}

export function HeroAtmosphere() {
  return <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
    <span className="orb orb-a" /><span className="orb orb-b" /><span className="orb orb-c" />
    {Array.from({ length: 18 }, (_, i) => <span key={i} className="particle" style={{ left: `${(i * 53) % 100}%`, animationDelay: `${(i * 0.7) % 9}s`, animationDuration: `${9 + (i % 5) * 2}s` }} />)}
    <div className="hero-widget hidden lg:block right-[6%] top-[26%]"><span className="live-dot" /> Sample view<div className="mini-bars"><i /><i /><i /><i /><i /><i /></div></div>
    <div className="hero-widget hidden lg:block right-[14%] bottom-[18%] [animation-delay:1.5s]">Illustration only</div>
  </div>;
}
