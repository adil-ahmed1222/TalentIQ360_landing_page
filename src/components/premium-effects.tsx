import { useEffect } from "react";

/** Global micro-interactions: card tilt/spotlight, magnetic + ripple buttons, scroll navbar, scroll reveals. */
export function PremiumEffects() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const narrow = window.matchMedia("(max-width: 1023px)").matches;
    let moveFrame = 0;

    const onMove = (e: PointerEvent) => {
      if (!fine || reduce || narrow) return;
      const t = e.target as HTMLElement | null;
      if (!t?.closest) return;
      const card = t.closest<HTMLElement>("main .glass-panel:not(button):not(a):not(header *)");
      if (!card || card.clientWidth >= 520) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      cancelAnimationFrame(moveFrame);
      moveFrame = requestAnimationFrame(() => {
        card.style.setProperty("--mx", `${x * 100}%`);
        card.style.setProperty("--my", `${y * 100}%`);
      });
    };
    const header = document.querySelector("header");
    const onScroll = () => header?.classList.toggle("nav-scrolled", window.scrollY > 24);

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    if (!narrow && !reduce) {
      document
        .querySelectorAll(
          "main section:not(:first-of-type) .section-wrap > *, main section .grid > .glass-panel",
        )
        .forEach((el, i) => {
          el.classList.add("reveal");
          (el as HTMLElement).style.setProperty("--d", `${(i % 6) * 40}ms`);
          io.observe(el);
        });
    }

    // Active nav link
    const links = [...document.querySelectorAll<HTMLAnchorElement>('header nav a[href^="#"]')];
    const navIo = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting)
            links.forEach((a) =>
              a.classList.toggle("nav-active", a.getAttribute("href") === `#${en.target.id}`),
            );
        }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    links.forEach((a) => {
      const s = document.querySelector(a.getAttribute("href")!);
      if (s) navIo.observe(s);
    });

    if (fine && !reduce && !narrow)
      document.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      cancelAnimationFrame(moveFrame);
      document.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      navIo.disconnect();
    };
  }, []);
  return null;
}

export function HeroAtmosphere() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <span className="orb orb-a" />
      <span className="orb orb-b" />
      <span className="orb orb-c" />
      {Array.from({ length: 8 }, (_, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: `${(i * 53) % 100}%`,
            animationDelay: `${(i * 0.7) % 9}s`,
            animationDuration: `${11 + (i % 4) * 2}s`,
          }}
        />
      ))}
    </div>
  );
}
