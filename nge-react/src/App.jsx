/**
 * App.jsx
 *
 * Sets up:
 * 1. Lenis smooth scroll (integrated with GSAP ticker)
 * 2. GSAP ScrollTrigger (synced to Lenis)
 * 3. Global scroll-progress bar
 * 4. Renders scene components + custom cursor
 */
import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

import Cursor         from './components/ui/Cursor'
import Navbar         from './components/Navbar'
import HeroParallax   from './components/scenes/HeroParallax'
import StickyPinned   from './components/scenes/StickyPinned'
import ScrollCanvas   from './components/scenes/ScrollCanvas'
import FeatureCards   from './components/scenes/FeatureCards'
import CtaSection     from './components/scenes/CtaSection'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    /* ── 1. Lenis smooth scroll ── */
    const lenis = new Lenis({
      duration:    1.25,
      easing:      t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    })

    /* ── 2. Sync Lenis ↔ GSAP ScrollTrigger ── */
    lenis.on('scroll', ScrollTrigger.update)
    const raf = time => { lenis.raf(time * 1000); }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    /* ── 3. Scroll progress bar ── */
    lenis.on('scroll', ({ progress }) => {
      const bar = document.getElementById('scroll-bar')
      if (bar) bar.style.width = (progress * 100) + '%'
    })

    return () => {
      lenis.destroy()
      gsap.ticker.remove(raf)
    }
  }, [])

  return (
    <>
      {/* Persistent UI */}
      <div id="scroll-bar" aria-hidden="true" />
      <Cursor />
      <Navbar />

      {/* Scenes */}
      <main>
        <HeroParallax />
        <StickyPinned />
        <ScrollCanvas />
        <FeatureCards />
        <CtaSection />
      </main>
    </>
  )
}
