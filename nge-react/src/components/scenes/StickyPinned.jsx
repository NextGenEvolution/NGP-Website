/**
 * StickyPinned.jsx — Scene 2
 *
 * TECHNIQUE: Sticky Pinned Section
 * • Left column: three text panels, each min-height 100vh, scroll normally.
 * • Right column: position:sticky top-0, height 100vh — stays fixed while
 *   left text scrolls. Three product images are stacked on top of each other;
 *   GSAP ScrollTrigger crossfades between them as each text panel enters view.
 *
 * Images are loaded from the parent NGP Website folder via Vite's fs.allow.
 */
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ── Panel data ────────────────────────────────────────────── */
const PANELS = [
  {
    id:    'pen',
    tag:   '01 — Pre-Filled Pens',
    lines: ['Precision in', 'every click.'],
    body:  'Pharmaceutical-grade multidose pens pre-loaded with exact peptide doses. No mixing. No measuring. Click-dose accuracy delivered every time from a single pen.',
    bullets: ['Fixed dose-per-click accuracy', '28-day use window after first dose', 'Cold-chain maintained from manufacture'],
    img:   '../Xenotropin pen.jpeg',
    accent: '#2db8d8',
    stat:  { n: '10', l: 'Compounds' },
  },
  {
    id:    'vial',
    tag:   '02 — Self-Mix Vials',
    lines: ['Clinical', 'flexibility.'],
    body:  'Lyophilised peptide powder supplied with bacteriostatic water. Reconstitute on demand. Full clinical flexibility for custom-dose protocols and splitting.',
    bullets: ['Lyophilised for maximum stability', 'Paired with bacteriostatic water', 'Preferred by practitioners & researchers'],
    img:   '../Wolverine stack vial.jpeg',
    accent: '#c8a96e',
    stat:  { n: '9', l: 'Compounds' },
  },
  {
    id:    'nasal',
    tag:   '03 — Nasal Sprays',
    lines: ['No needles.', 'No limits.'],
    body:  'Trans-nasal peptide delivery for daily micro-dose protocols. Rapid mucosal absorption without any injection — ideal for nootropics and ongoing maintenance.',
    bullets: ['Zero-injection delivery system', 'Precise spray-per-dose metering', '10 ml bottles · 90-day use window'],
    img:   '../Semax Nasal.jpeg',
    accent: '#7fa8dc',
    stat:  { n: '5', l: 'Compounds' },
  },
]

/* ── Component ─────────────────────────────────────────────── */
export default function StickyPinned() {
  const section = useRef()

  useGSAP(() => {
    /* Cross-fade images when each text panel enters viewport center */
    PANELS.forEach((_, i) => {
      ScrollTrigger.create({
        trigger: `#sp-text-${i}`,
        start:   'top 52%',
        end:     'bottom 48%',
        onEnter:     () => activateSlide(i),
        onEnterBack: () => activateSlide(i),
      })
    })

    function activateSlide(active) {
      PANELS.forEach((_, i) => {
        /* Fade inactive images out, active image in */
        gsap.to(`#sp-img-${i}`, {
          opacity: i === active ? 1   : 0,
          scale:   i === active ? 1   : 1.05,
          duration: 0.75,
          ease: 'power2.out',
        })
        /* Progress indicator dots */
        gsap.to(`#sp-dot-${i}`, {
          scaleY:  i === active ? 1 : 0,
          opacity: i === active ? 1 : 0,
          duration: 0.4,
          ease: 'power2.out',
        })
      })
    }

    /* Text panel entrance animations */
    PANELS.forEach((_, i) => {
      gsap.from(`#sp-text-${i} .panel-inner`, {
        opacity: 0,
        y: 48,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: `#sp-text-${i}`,
          start:   'top 68%',
        },
      })
    })

  }, { scope: section })

  return (
    <section ref={section} id="sticky" className="relative bg-c-deep border-t border-white/[0.06]">
      {/* Technique badge */}
      <div className="technique-badge"><span>02 — Sticky Pinned Section</span></div>

      {/* ── Two-column grid ── */}
      <div className="sticky-grid flex">

        {/* ════════════════════════════════
            LEFT — scrolling text panels
        ════════════════════════════════ */}
        <div className="sticky-text-col w-full md:w-1/2">
          {PANELS.map((p, i) => (
            <div
              key={p.id}
              id={`sp-text-${i}`}
              className="min-h-screen flex flex-col justify-center
                         px-10 md:px-16 py-20 border-b border-white/[0.05]"
            >
              <div className="panel-inner max-w-lg">
                {/* Tag */}
                <div className="flex items-center gap-3 mb-7">
                  <span className="w-6 h-px" style={{ background: p.accent }} />
                  <span
                    className="font-mono text-[10px] tracking-[0.26em] uppercase"
                    style={{ color: p.accent }}
                  >
                    {p.tag}
                  </span>
                </div>

                {/* Headline */}
                <h2
                  className="font-serif font-light leading-[1.0] mb-7"
                  style={{ fontSize: 'clamp(38px, 5vw, 68px)', letterSpacing: '-0.02em' }}
                >
                  {p.lines.map((ln, j) => (
                    <span key={j} className="block">{ln}</span>
                  ))}
                </h2>

                <p className="text-c-mut font-light leading-relaxed mb-8" style={{ fontSize: '15px' }}>
                  {p.body}
                </p>

                {/* Bullet list */}
                <ul className="flex flex-col gap-3 mb-10">
                  {p.bullets.map(b => (
                    <li key={b} className="flex items-center gap-3 font-light text-sm text-c-mut">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: p.accent }} />
                      {b}
                    </li>
                  ))}
                </ul>

                {/* Stat pill */}
                <div
                  className="inline-block font-mono text-[10px] tracking-[0.2em] uppercase
                             px-4 py-2 border"
                  style={{ color: p.accent, borderColor: p.accent + '44' }}
                >
                  {p.stat.n} {p.stat.l}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ════════════════════════════════
            RIGHT — sticky pinned image
        ════════════════════════════════ */}
        <div className="sticky-img-col hidden md:block w-1/2 relative">
          <div className="sticky top-0 h-screen overflow-hidden bg-c-bg">

            {/* Stacked images — opacity controls which is visible */}
            {PANELS.map((p, i) => (
              <div
                key={p.id}
                id={`sp-img-${i}`}
                className="absolute inset-0"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                {/* Gradient vignette */}
                <div className="absolute inset-0 z-10"
                  style={{
                    background:
                      'linear-gradient(to right, rgba(15,15,15,0.5) 0%, transparent 30%),' +
                      'linear-gradient(to top, rgba(8,8,8,0.9) 0%, transparent 40%)',
                  }}
                />

                {/* Product image */}
                <img
                  src={p.img}
                  alt={p.tag}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700"
                  style={{ transform: 'scale(1.08)' }}
                  onError={e => {
                    /* Fallback: coloured gradient placeholder */
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.parentElement.style.background =
                      `radial-gradient(ellipse 70% 70% at 60% 40%, ${p.accent}22 0%, transparent 70%)`
                  }}
                />

                {/* Bottom label overlay */}
                <div className="absolute bottom-10 left-10 right-10 z-20">
                  <div
                    className="inline-flex items-center gap-3 px-4 py-2.5"
                    style={{
                      border: `1px solid ${p.accent}30`,
                      background: 'rgba(8,8,8,0.85)',
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ background: p.accent }} />
                    <span className="font-mono text-[9px] tracking-[0.2em] uppercase"
                      style={{ color: p.accent }}>
                      {p.tag}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Progress indicator — vertical dots on right edge */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-4">
              {PANELS.map((p, i) => (
                <div key={i} className="w-[2px] h-12 bg-white/10 overflow-hidden">
                  <div
                    id={`sp-dot-${i}`}
                    className="w-full h-full origin-top"
                    style={{
                      background: p.accent,
                      transform: i === 0 ? 'scaleY(1)' : 'scaleY(0)',
                      opacity:   i === 0 ? 1 : 0,
                    }}
                  />
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
