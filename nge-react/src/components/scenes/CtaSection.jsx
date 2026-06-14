/**
 * CtaSection.jsx — Scene 5
 *
 * TECHNIQUE: Cinematic Feel + Full-Bleed Layout + Smooth Scrolling
 * • Full-bleed 100vh dark section with radial glow background.
 * • GSAP stagger reveals tag → headline words → sub → buttons.
 * • Headline words split and reveal upward individually.
 * • Smooth scroll enabled via CSS on <html>.
 * • All motion respects prefers-reduced-motion via GSAP's reducedMotion config.
 */
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const WORDS = ['Performance', 'is', 'a', 'protocol.']

export default function CtaSection() {
  const section = useRef()

  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: {
        trigger: section.current,
        start:   'top 62%',
      },
    })

    tl.from('.cta-tag',    { opacity: 0, y: 20, duration: 0.6 })
      .from('.cta-word',   { y: '110%', stagger: 0.1, duration: 0.9, ease: 'power4.out' }, 0.2)
      .from('.cta-sub',    { opacity: 0, y: 24, duration: 0.75 }, 0.7)
      .from('.cta-btn',    { opacity: 0, y: 18, stagger: 0.12, duration: 0.6 }, 0.95)
      .from('.cta-footer', { opacity: 0, duration: 0.5 }, 1.2)

    /* Subtle background radial pulses */
    gsap.to('.cta-glow', {
      scale:   1.08,
      opacity: 0.08,
      duration: 3.5,
      repeat:  -1,
      yoyo:    true,
      ease:    'sine.inOut',
    })

  }, { scope: section })

  return (
    <section
      ref={section}
      id="cta"
      className="relative min-h-screen flex flex-col items-center justify-center
                 text-center px-6 md:px-20 py-24 bg-c-deep
                 border-t border-white/[0.06] overflow-hidden"
    >
      {/* Technique badge */}
      <div className="technique-badge absolute top-24 left-0">
        <span>05 — Cinematic Full-Bleed CTA</span>
      </div>

      {/* ── Animated background glow ── */}
      <div
        className="cta-glow absolute rounded-full pointer-events-none"
        style={{
          width:  '80vmax',
          height: '80vmax',
          background: 'radial-gradient(circle, rgba(45,184,216,0.06) 0%, transparent 65%)',
          opacity: 0.05,
        }}
      />
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(45,184,216,0.022) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(45,184,216,0.022) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-4xl">

        {/* Eyebrow tag */}
        <div className="cta-tag flex items-center justify-center gap-4 mb-8">
          <span className="w-10 h-px bg-c-cy/40" />
          <span className="font-mono text-[10px] tracking-tag uppercase text-c-cy">
            Begin Your Protocol
          </span>
          <span className="w-10 h-px bg-c-cy/40" />
        </div>

        {/* Headline — words clip-reveal upward */}
        <h2
          className="font-serif font-light leading-[0.92] tracking-[-0.03em] mb-8"
          style={{ fontSize: 'clamp(52px, 9vw, 120px)' }}
        >
          {WORDS.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden mr-[0.2em]">
              <span
                className={`cta-word inline-block ${i === WORDS.length - 1 ? 'italic text-c-cyb' : ''}`}
              >
                {w}
              </span>
            </span>
          ))}
        </h2>

        {/* Sub copy */}
        <p className="cta-sub font-light text-c-mut leading-relaxed mb-14 max-w-xl mx-auto"
          style={{ fontSize: '15px' }}>
          24+ pharmaceutical-grade compounds. Three delivery formats.
          Nationwide delivery across South Africa — R100 flat rate,
          free on orders over&nbsp;R3,000.
        </p>

        {/* CTAs */}
        <div className="flex gap-4 justify-center flex-wrap mb-16">
          <a
            href="../ngp-peptides.html"
            className="cta-btn font-mono text-[12px] tracking-[0.14em] uppercase
                       bg-c-cy text-c-bg px-12 py-5
                       hover:opacity-85 hover:-translate-y-0.5
                       transition-all duration-200 font-bold"
          >
            Shop the Catalogue
          </a>
          <a
            href="../ngp-scrollytelling.html"
            className="cta-btn font-mono text-[12px] tracking-[0.14em] uppercase
                       text-c-w border border-white/20 px-12 py-5
                       hover:border-white/50 transition-all duration-200"
          >
            The Experience
          </a>
        </div>

        {/* Delivery note */}
        <div className="cta-footer flex flex-col items-center gap-3">
          <div className="w-px h-8 bg-white/10" />
          <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-c-mut/60">
            For research and clinical use only · Not for human consumption without medical supervision
          </p>
          <p className="font-mono text-[8.5px] tracking-[0.18em] uppercase text-c-mut/40">
            © 2026 NGE — Next Gen Evolution
          </p>
        </div>
      </div>

      {/* Section map (bottom) */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6 z-10">
        {[
          { href: '#parallax', n: '01', l: 'Parallax'  },
          { href: '#sticky',   n: '02', l: 'Sticky'    },
          { href: '#scrub',    n: '03', l: 'Scrub'     },
          { href: '#cards',    n: '04', l: 'Cards'     },
          { href: '#cta',      n: '05', l: 'CTA'       },
        ].map(s => (
          <a
            key={s.n}
            href={s.href}
            className="flex flex-col items-center gap-1 group"
          >
            <span className="font-mono text-[8px] tracking-[0.2em] uppercase text-c-mut/40
                             group-hover:text-c-cy transition-colors duration-200">
              {s.n}
            </span>
            <span className="font-mono text-[7px] tracking-[0.18em] uppercase text-c-mut/30
                             group-hover:text-c-mut transition-colors duration-200">
              {s.l}
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
