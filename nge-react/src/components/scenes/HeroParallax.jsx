/**
 * HeroParallax.jsx — Scene 1
 *
 * TECHNIQUE: Parallax Effect
 * Three independent layers scroll at different speeds:
 *   • bgRef   (grid + radial)  → yPercent: −30  (moves UP slowest)
 *   • textRef (headline, copy) → yPercent:  20  (mid speed)
 *   • fgRef   (scroll hint)    → yPercent:  50  (moves fastest)
 *
 * On page load, a staggered reveal animation fires for the headline lines.
 */
import { useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function HeroParallax() {
  const section = useRef()
  const bgRef   = useRef()
  const textRef = useRef()
  const fgRef   = useRef()

  useGSAP(() => {
    const st = { trigger: section.current, start: 'top top', end: 'bottom top', scrub: true }

    // ── PARALLAX LAYERS ──────────────────────────────────
    gsap.to(bgRef.current,   { yPercent: -30, ease: 'none', scrollTrigger: st })
    gsap.to(textRef.current, { yPercent:  20, ease: 'none', scrollTrigger: st })
    gsap.to(fgRef.current,   { yPercent:  50, ease: 'none', scrollTrigger: st })

    // ── ENTRANCE ANIMATION ───────────────────────────────
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
    tl.from('.hero-line > span', { y: '105%', stagger: 0.14, duration: 1.1 }, 0.35)
      .from('.hero-sub',         { opacity: 0, y: 24, duration: 0.8 },         0.9)
      .from('.hero-stat',        { opacity: 0, y: 16, stagger: 0.1, duration: 0.6 }, 1.1)
      .from(fgRef.current,       { opacity: 0, duration: 0.6 },                 1.4)

  }, { scope: section })

  return (
    <section
      ref={section}
      id="parallax"
      className="relative h-screen overflow-hidden bg-c-bg"
    >
      {/* ── Technique badge ── */}
      <div className="technique-badge">
        <span>01 — Parallax Effect</span>
      </div>

      {/* ══════════════════════════════════
          LAYER 1: BACKGROUND  (slowest)
      ══════════════════════════════════ */}
      <div ref={bgRef} className="absolute inset-0 z-0">
        {/* Dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(45,184,216,0.045) 1px, transparent 1px),' +
              'linear-gradient(90deg, rgba(45,184,216,0.045) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        {/* Radial colour spills */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 58% 68% at 68% 42%, rgba(20,80,180,0.22) 0%, transparent 65%),' +
              'radial-gradient(ellipse 38% 48% at 18% 70%, rgba(10,40,100,0.26) 0%, transparent 60%)',
          }}
        />
        {/* Giant watermark number */}
        <div className="absolute inset-0 flex items-center justify-end pr-16 pointer-events-none select-none">
          <span
            className="font-serif font-light text-white/[0.018] leading-none"
            style={{ fontSize: 'clamp(180px, 30vw, 340px)' }}
          >
            01
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════
          LAYER 2: TEXT  (mid speed)
      ══════════════════════════════════ */}
      <div ref={textRef} className="relative z-10 flex flex-col justify-center h-full px-10 md:px-20">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-8">
          <span className="w-2 h-2 rounded-full bg-c-cy animate-pulse block" />
          <span className="font-mono text-[10px] tracking-tag uppercase text-c-cy">
            NGE · Scrollytelling · Scene 01
          </span>
        </div>

        {/* Headline — each line clipped so characters reveal upward */}
        <h1
          className="font-serif font-light leading-[0.92] tracking-[-0.03em] mb-8"
          style={{ fontSize: 'clamp(58px, 9vw, 128px)' }}
        >
          {['Precision.', 'At Every', 'Level.'].map((line, i) => (
            <span key={i} className="hero-line block overflow-hidden">
              <span className={`block${i === 2 ? ' italic text-c-cyb' : ''}`}>{line}</span>
            </span>
          ))}
        </h1>

        <p className="hero-sub font-light text-c-mut max-w-md leading-relaxed" style={{ fontSize: '15px' }}>
          Background moves at −30% · Text at +20% · Foreground at +50%.
          Three layers, three scroll speeds — one cinematic parallax.
        </p>

        {/* Stats row */}
        <div className="flex gap-10 mt-10 pt-8 border-t border-white/[0.07]">
          {[['24+', 'Compounds'], ['99%+', 'Purity'], ['3', 'Formats']].map(([n, l]) => (
            <div key={l} className="hero-stat">
              <div className="font-serif text-4xl font-light leading-none">
                <span className="text-c-cy">{n}</span>
              </div>
              <div className="font-mono text-[9px] tracking-xl uppercase text-c-mut mt-1.5">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════
          LAYER 3: FOREGROUND  (fastest)
      ══════════════════════════════════ */}
      <div
        ref={fgRef}
        className="absolute bottom-10 left-10 md:left-20 z-20 flex items-center gap-4"
      >
        <div className="flex flex-col gap-1">
          {[14, 10, 6].map((w, i) => (
            <span
              key={i}
              className="block h-px bg-c-mut/60"
              style={{ width: w, animation: `tickle 2s ease-in-out ${i * 0.14}s infinite` }}
            />
          ))}
        </div>
        <span className="font-mono text-[9px] tracking-xl uppercase text-c-mut">Scroll to explore</span>
      </div>

      {/* Speed annotation (bottom-right) */}
      <div className="absolute bottom-10 right-10 md:right-20 z-20 text-right hidden md:block">
        <p className="font-mono text-[8.5px] tracking-[0.18em] uppercase text-c-mut/40 leading-relaxed">
          BG layer: scrub −30%<br />Text layer: scrub +20%<br />FG layer: scrub +50%
        </p>
      </div>
    </section>
  )
}
