/**
 * FeatureCards.jsx — Scene 4
 *
 * TECHNIQUE: Sequential Reveal (Feature Cards)
 * Three cards animate in from below with a staggered delay
 * as the section enters the viewport.
 *
 * Implementation:
 * • gsap.from('.feat-card', { y, opacity, stagger }) with ScrollTrigger
 * • Each card also has an independent hover animation via GSAP (not CSS)
 *   to keep everything in one animation system.
 */
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CARDS = [
  {
    num:    '01',
    icon:   '◎',
    title:  'Targeted Results',
    body:   'Peptides bind receptor-specifically — triggering only the pathway they were designed for. No scatter. No systemic noise. Only the biological response you intended.',
    accent: '#2db8d8',
    stat:   { n: '99%+', l: 'Receptor specificity' },
    tags:   ['GLP-1 signalling', 'Cellular precision', 'Minimal off-target'],
  },
  {
    num:    '02',
    icon:   '↻',
    title:  'Faster Recovery',
    body:   'BPC-157 accelerates angiogenesis and tendon-to-bone healing. TB-500 drives actin polymerisation for tissue repair across the entire body. The Wolverine stack combines both.',
    accent: '#c8a96e',
    stat:   { n: '2×', l: 'Recovery acceleration' },
    tags:   ['BPC-157', 'TB-500', 'Wolverine Stack'],
  },
  {
    num:    '03',
    icon:   '∞',
    title:  'Longevity & Wellness',
    body:   'NAD+ restoration reverses mitochondrial senescence markers. GHK-Cu reactivates over 4,000 genes involved in tissue repair. MOTS-C drives cellular energy at the mitochondrial level.',
    accent: '#7fa8dc',
    stat:   { n: '4,000+', l: 'Genes reactivated' },
    tags:   ['NAD+', 'GHK-Cu', 'MOTS-C'],
  },
]

export default function FeatureCards() {
  const section = useRef()

  useGSAP(() => {
    /* ── Sequential reveal: cards fly in from below ── */
    gsap.from('.feat-card', {
      y:        80,
      opacity:  0,
      duration: 0.85,
      stagger:  0.18,          // 0.18 s between each card
      ease:     'power3.out',
      scrollTrigger: {
        trigger: '#cards-grid',
        start:   'top 75%',
      },
    })

    /* ── Section header reveal ── */
    gsap.from('.cards-hd > *', {
      y:        36,
      opacity:  0,
      duration: 0.8,
      stagger:  0.14,
      ease:     'power3.out',
      scrollTrigger: {
        trigger: '.cards-hd',
        start:   'top 78%',
      },
    })

    /* ── Hover: lift card + brighten border ── */
    document.querySelectorAll('.feat-card').forEach(card => {
      card.addEventListener('mouseenter', () =>
        gsap.to(card, { y: -8, duration: 0.3, ease: 'power2.out' })
      )
      card.addEventListener('mouseleave', () =>
        gsap.to(card, { y: 0,  duration: 0.4, ease: 'power2.out' })
      )
    })

  }, { scope: section })

  return (
    <section ref={section} id="cards" className="bg-c-deep border-t border-white/[0.06] py-36 px-10 md:px-20">
      {/* Technique badge */}
      <div className="technique-badge" style={{ marginBottom: '2rem' }}>
        <span>04 — Sequential Reveal</span>
      </div>

      {/* ── Section header ── */}
      <div className="cards-hd max-w-7xl mx-auto mb-20">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-7 h-px bg-c-cy" />
          <span className="font-mono text-[10px] tracking-tag uppercase text-c-cy">
            Chapter 04 — The Non-Negotiables
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <h2
            className="font-serif font-light leading-[1.0]"
            style={{ fontSize: 'clamp(36px, 5.5vw, 72px)', letterSpacing: '-0.02em' }}
          >
            Built on three<br />
            <em className="text-c-cyb">non-negotiables.</em>
          </h2>
          <p className="font-light text-c-mut max-w-sm leading-relaxed" style={{ fontSize: '14px' }}>
            Every compound in the NGE catalogue is formulated against these three principles.
            Cards reveal sequentially — 180 ms apart — as you scroll into view.
          </p>
        </div>
      </div>

      {/* ── Three feature cards ── */}
      <div
        id="cards-grid"
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06]"
      >
        {CARDS.map((c, i) => (
          <article
            key={c.num}
            className="feat-card bg-c-card px-9 py-12 cursor-default relative overflow-hidden"
            style={{ borderTop: `2px solid ${c.accent}` }}
          >
            {/* Big background number */}
            <span
              className="absolute top-3 right-5 font-serif font-light leading-none select-none pointer-events-none"
              style={{ fontSize: '7rem', color: c.accent + '08' }}
            >
              {c.num}
            </span>

            {/* Icon ring */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-lg mb-8 mt-2"
              style={{ border: `1px solid ${c.accent}33`, color: c.accent }}
            >
              {c.icon}
            </div>

            {/* Title */}
            <h3
              className="font-serif font-medium mb-4 leading-tight"
              style={{ fontSize: '1.85rem' }}
            >
              {c.title}
            </h3>

            {/* Body */}
            <p className="font-light text-c-mut leading-relaxed mb-8" style={{ fontSize: '13.5px' }}>
              {c.body}
            </p>

            {/* Tag pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {c.tags.map(t => (
                <span
                  key={t}
                  className="font-mono text-[9px] tracking-[0.14em] uppercase px-3 py-1"
                  style={{ color: c.accent, border: `1px solid ${c.accent}30`, background: c.accent + '0a' }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Stat */}
            <div className="pt-6 border-t border-white/[0.06]">
              <div
                className="font-serif font-light leading-none mb-1"
                style={{ fontSize: '2.6rem', color: c.accent }}
              >
                {c.stat.n}
              </div>
              <div className="font-mono text-[9px] tracking-[0.16em] uppercase text-c-mut">
                {c.stat.l}
              </div>
            </div>

            {/* Stagger index indicator (bottom right) */}
            <div
              className="absolute bottom-5 right-6 font-mono text-[8px] tracking-[0.2em] uppercase"
              style={{ color: c.accent + '55' }}
            >
              stagger {i * 180}ms
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
