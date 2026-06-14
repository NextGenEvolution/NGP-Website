/**
 * ScrollCanvas.jsx — Scene 3
 *
 * TECHNIQUE: Scroll-Driven Animation (video scrubbing simulation)
 * • A 500vh-tall section pins a <canvas> at the top.
 * • GSAP ScrollTrigger tracks scroll progress (0 → 1).
 * • A requestAnimationFrame loop reads that progress and draws the
 *   current "frame" of a molecular assembly animation.
 * • This replicates exactly what Apple does with iPhone product pages
 *   (swap canvas.drawImage() with product image frames for the real effect).
 *
 * Phases driven by scroll progress:
 *  0.00 → 0.15  Ambient glow pulses in
 *  0.12 → 0.28  Center atom materialises
 *  0.25 → 0.50  Inner-ring nodes appear + bond lines draw
 *  0.45 → 0.70  Outer-ring nodes + outer bonds
 *  0.65 → 0.88  Electron cloud renders
 *  0.85 → 1.00  Full molecular glow, text labels pop in
 */
import { useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* Labels that float in at specific scroll progress thresholds */
const LABELS = [
  { p: 0.15, text: 'Centre atom · NH₂ group',          side: 'right' },
  { p: 0.35, text: 'Inner ring · 6 bonded residues',   side: 'left'  },
  { p: 0.55, text: 'Outer scaffold · Peptide backbone', side: 'right' },
  { p: 0.75, text: 'Electron cloud · Orbital density',  side: 'left'  },
  { p: 0.92, text: 'Full peptide chain assembled',      side: 'right' },
]

/* Eased progress helper for a sub-range */
function rng(start, end, p) {
  return Math.max(0, Math.min(1, (p - start) / (end - start)))
}

export default function ScrollCanvas() {
  const section      = useRef()
  const canvasRef    = useRef()
  const progressRef  = useRef(0)     // updated by ScrollTrigger onUpdate
  const rafRef       = useRef(null)

  /* ── Canvas draw function (called every RAF frame) ── */
  function draw(canvas, time) {
    const ctx = canvas.getContext('2d')
    const W   = canvas.width
    const H   = canvas.height
    const cx  = W / 2
    const cy  = H / 2
    const p   = progressRef.current

    ctx.clearRect(0, 0, W, H)

    /* ── 0: Ambient background radial glow ── */
    const p0 = rng(0, 0.15, p)
    if (p0 > 0) {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.55)
      g.addColorStop(0, `rgba(45,184,216,${0.09 * p0})`)
      g.addColorStop(1, 'rgba(45,184,216,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, W, H)
    }

    /* ── 1: Orbit rings ── */
    const p1 = rng(0.12, 0.35, p)
    if (p1 > 0) {
      [75, 130, 185].forEach((r, i) => {
        const rp = rng(i * 0.12, i * 0.12 + 0.25, p1)
        if (rp <= 0) return
        ctx.beginPath()
        ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * rp)
        ctx.strokeStyle = `rgba(45,184,216,${0.07 * rp})`
        ctx.lineWidth   = 1
        ctx.stroke()
      })
    }

    /* ── 2: Inner-ring nodes (6) + bonds to center ── */
    const p2  = rng(0.25, 0.52, p)
    const R2  = 130
    const n2  = 6
    const nodes2 = Array.from({ length: n2 }, (_, i) => {
      const a = (i / n2) * Math.PI * 2 - Math.PI / 2
      return { x: cx + Math.cos(a) * R2, y: cy + Math.sin(a) * R2 }
    })

    if (p2 > 0) {
      nodes2.forEach((nd, i) => {
        const np = rng(i * 0.1, i * 0.1 + 0.3, p2)
        if (np <= 0) return

        /* Bond line (partial draw) */
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(cx + (nd.x - cx) * np, cy + (nd.y - cy) * np)
        ctx.strokeStyle = `rgba(45,184,216,${0.45 * np})`
        ctx.lineWidth   = 1.2
        ctx.stroke()

        /* Node circle */
        ctx.beginPath()
        ctx.arc(nd.x, nd.y, 14 * np, 0, Math.PI * 2)
        ctx.fillStyle   = `rgba(45,184,216,${0.18 * np})`
        ctx.strokeStyle = `rgba(45,184,216,${0.6 * np})`
        ctx.lineWidth   = 1.5
        ctx.fill()
        ctx.stroke()
      })
    }

    /* ── 3: Outer-ring nodes (6) + outer bonds ── */
    const p3  = rng(0.45, 0.72, p)
    const R3  = 185
    const nodes3 = Array.from({ length: n2 }, (_, i) => {
      const a = (i / n2) * Math.PI * 2 - Math.PI / 2 + Math.PI / n2
      return { x: cx + Math.cos(a) * R3, y: cy + Math.sin(a) * R3 }
    })

    if (p3 > 0) {
      nodes3.forEach((nd, i) => {
        const np  = rng(i * 0.1, i * 0.1 + 0.35, p3)
        const src = nodes2[i]
        if (np <= 0) return

        /* Outer bond from inner node */
        ctx.beginPath()
        ctx.moveTo(src.x, src.y)
        ctx.lineTo(src.x + (nd.x - src.x) * np, src.y + (nd.y - src.y) * np)
        ctx.strokeStyle = `rgba(45,184,216,${0.28 * np})`
        ctx.lineWidth   = 0.9
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(nd.x, nd.y, 9 * np, 0, Math.PI * 2)
        ctx.fillStyle   = `rgba(45,184,216,${0.12 * np})`
        ctx.strokeStyle = `rgba(45,184,216,${0.4 * np})`
        ctx.lineWidth   = 1
        ctx.fill()
        ctx.stroke()
      })
    }

    /* ── 4: Electron cloud dots (orbit the inner ring) ── */
    const p4 = rng(0.65, 0.88, p)
    if (p4 > 0) {
      for (let i = 0; i < n2; i++) {
        const a  = time * 0.6 + (i / n2) * Math.PI * 2
        const ex = cx + Math.cos(a) * R2
        const ey = cy + Math.sin(a) * R2
        ctx.beginPath()
        ctx.arc(ex, ey, 3.2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(93,232,255,${0.75 * p4})`
        ctx.fill()
        /* Tail */
        const ex2 = cx + Math.cos(a - 0.3) * R2
        const ey2 = cy + Math.sin(a - 0.3) * R2
        ctx.beginPath()
        ctx.moveTo(ex, ey)
        ctx.lineTo(ex2, ey2)
        ctx.strokeStyle = `rgba(93,232,255,${0.25 * p4})`
        ctx.lineWidth   = 1
        ctx.stroke()
      }
    }

    /* ── 5: Centre node ── */
    const p5 = rng(0.12, 0.28, p)
    if (p5 > 0) {
      /* Glow halo */
      const gh = ctx.createRadialGradient(cx, cy, 0, cx, cy, 58)
      gh.addColorStop(0, `rgba(45,184,216,${0.22 * p5})`)
      gh.addColorStop(1, 'rgba(45,184,216,0)')
      ctx.beginPath(); ctx.arc(cx, cy, 58, 0, Math.PI * 2)
      ctx.fillStyle = gh; ctx.fill()

      /* Node body */
      const gn = ctx.createRadialGradient(cx - 7, cy - 7, 0, cx, cy, 30 * p5)
      gn.addColorStop(0, '#88eeff')
      gn.addColorStop(0.55, '#2db8d8')
      gn.addColorStop(1, '#0a5870')
      ctx.beginPath(); ctx.arc(cx, cy, 30 * p5, 0, Math.PI * 2)
      ctx.fillStyle = gn; ctx.fill()
      ctx.strokeStyle = `rgba(93,232,255,${0.55 * p5})`
      ctx.lineWidth   = 1.5; ctx.stroke()

      /* NH₂ label */
      if (p5 > 0.7) {
        ctx.font        = `700 ${10 * p5}px "Space Mono", monospace`
        ctx.fillStyle   = `rgba(255,255,255,${p5})`
        ctx.textAlign   = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('NH₂', cx, cy)
      }
    }

    /* ── 6: Full-intensity glow at p=1 ── */
    const p6 = rng(0.85, 1, p)
    if (p6 > 0) {
      const fg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.45)
      fg.addColorStop(0, `rgba(45,184,216,${0.12 * p6})`)
      fg.addColorStop(1, 'rgba(45,184,216,0)')
      ctx.fillStyle = fg; ctx.fillRect(0, 0, W, H)
    }
  }

  /* ── RAF loop ── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    function resize() {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    let t = 0
    function loop() {
      t += 0.016
      draw(canvas, t)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      ro.disconnect()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  /* ── GSAP ScrollTrigger: update progress ref on scroll ── */
  useGSAP(() => {
    ScrollTrigger.create({
      trigger: section.current,
      start:   'top top',
      end:     'bottom bottom',
      scrub:   1,
      onUpdate: self => {
        progressRef.current = self.progress
        /* Drive floating labels */
        LABELS.forEach(lb => {
          const el  = document.getElementById(`sc-lbl-${lb.p}`)
          const vis = self.progress >= lb.p && self.progress < lb.p + 0.18
          if (el) gsap.to(el, { opacity: vis ? 1 : 0, x: vis ? 0 : (lb.side === 'right' ? 20 : -20), duration: 0.4 })
        })
      },
    })
  }, { scope: section })

  return (
    <section
      ref={section}
      id="scrub"
      className="relative bg-c-bg border-t border-white/[0.06]"
      style={{ height: '500vh' }}
    >
      {/* Technique badge */}
      <div className="technique-badge"><span>03 — Scroll-Driven Animation</span></div>

      {/* Sticky canvas container */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">

        {/* Chapter heading (fades out after first scroll) */}
        <div className="absolute top-24 left-0 right-0 z-20 text-center px-4">
          <p className="font-mono text-[10px] tracking-tag uppercase text-c-cy mb-3">
            Scroll to scrub through the animation
          </p>
          <h2
            className="font-serif font-light"
            style={{ fontSize: 'clamp(28px, 4vw, 52px)', letterSpacing: '-0.02em' }}
          >
            Molecular assembly,<br />
            <em className="text-c-cyb">frame by frame.</em>
          </h2>
        </div>

        {/* Canvas fills the remaining height */}
        <canvas
          ref={canvasRef}
          id="scrub-canvas"
          className="w-full flex-1"
          style={{ display: 'block' }}
        />

        {/* Floating annotation labels */}
        {LABELS.map(lb => (
          <div
            key={lb.p}
            id={`sc-lbl-${lb.p}`}
            className="absolute z-30 pointer-events-none"
            style={{
              top:     '50%',
              [lb.side === 'right' ? 'right' : 'left']: '6%',
              transform: 'translateY(-50%)',
              opacity: 0,
            }}
          >
            <div
              className="flex items-center gap-3 px-4 py-2.5"
              style={{
                flexDirection: lb.side === 'right' ? 'row-reverse' : 'row',
                background:  'rgba(8,8,8,0.85)',
                border:      '1px solid rgba(45,184,216,0.2)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-c-cy flex-shrink-0" />
              <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-c-cy whitespace-nowrap">
                {lb.text}
              </span>
            </div>
          </div>
        ))}

        {/* Bottom progress readout */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20">
          <div
            className="flex items-center gap-4 px-5 py-2.5"
            style={{ background: 'rgba(8,8,8,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-c-mut">
              Scroll progress
            </span>
            <div className="w-32 h-px bg-white/10 relative overflow-hidden">
              <div
                id="scrub-bar"
                className="h-full bg-c-cy absolute left-0"
                style={{ width: '0%', transition: 'width 0.05s linear' }}
              />
            </div>
            <span
              id="scrub-pct"
              className="font-mono text-[9px] text-c-cy min-w-[36px]"
            >
              0%
            </span>
          </div>
        </div>
      </div>

      {/* Side script that wires the readout (runs after mount) */}
      <ProgressReadout progressRef={progressRef} />
    </section>
  )
}

/* ── Tiny helper to update the text readout every frame ── */
function ProgressReadout({ progressRef }) {
  useEffect(() => {
    let id
    function tick() {
      const bar = document.getElementById('scrub-bar')
      const pct = document.getElementById('scrub-pct')
      if (bar) bar.style.width = (progressRef.current * 100).toFixed(1) + '%'
      if (pct) pct.textContent  = (progressRef.current * 100).toFixed(0) + '%'
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [])
  return null
}
