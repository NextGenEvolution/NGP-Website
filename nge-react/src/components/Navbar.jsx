/**
 * Navbar.jsx — Awwwards-style minimal nav
 *
 * • Transparent on load, gains bg on scroll
 * • Left: wordmark; Centre: links with animated underline; Right: CTA pill
 * • "SHOP" button has GSAP magnetic pull toward cursor
 */
import { useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

const LINKS = [
  { href: '#parallax', label: 'Parallax'   },
  { href: '#sticky',   label: 'Sticky'     },
  { href: '#scrub',    label: 'Scrub'      },
  { href: '#cards',    label: 'Cards'      },
]

export default function Navbar() {
  const nav    = useRef()
  const shopBtn = useRef()

  useGSAP(() => {
    /* Slide-down entrance */
    gsap.from(nav.current, { y: -80, opacity: 0, duration: 0.9, delay: 0.2, ease: 'power3.out' })

    /* Darken background on scroll */
    ScrollTrigger.create({
      start: 'top+=80 top',
      onEnter:     () => nav.current.classList.add('nav-scrolled'),
      onLeaveBack: () => nav.current.classList.remove('nav-scrolled'),
    })
  }, { scope: nav })

  /* Magnetic effect on SHOP button */
  useEffect(() => {
    const btn = shopBtn.current
    if (!btn) return
    const onMove = e => {
      const r  = btn.getBoundingClientRect()
      const dx = (e.clientX - (r.left + r.width  / 2)) * 0.38
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.38
      gsap.to(btn, { x: dx, y: dy, duration: 0.35, ease: 'power2.out' })
    }
    const onLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' })
    btn.addEventListener('mousemove', onMove)
    btn.addEventListener('mouseleave', onLeave)
    return () => { btn.removeEventListener('mousemove', onMove); btn.removeEventListener('mouseleave', onLeave) }
  }, [])

  return (
    <>
      <style>{`
        .nav-scrolled { background: rgba(10,10,10,0.9) !important; backdrop-filter: blur(20px); }
        .nav-link { position: relative; padding-bottom: 2px; }
        .nav-link::after {
          content: ''; position: absolute; bottom: 0; left: 0;
          width: 0%; height: 1px; background: var(--paper);
          transition: width 0.3s ease;
        }
        .nav-link:hover::after { width: 100%; }
      `}</style>
      <nav
        ref={nav}
        className="fixed top-0 left-0 right-0 z-[900]
                   flex items-center justify-between
                   px-8 md:px-14 h-[60px]
                   transition-all duration-500"
        style={{ background: 'transparent' }}
      >
        {/* Wordmark */}
        <a href="#parallax"
          className="font-mono font-bold tracking-[0.12em] text-[13px] text-paper">
          NGE
        </a>

        {/* Centre links */}
        <ul className="hide-mobile flex items-center gap-8 list-none">
          {LINKS.map(l => (
            <li key={l.href}>
              <a href={l.href}
                className="nav-link font-sans text-[11px] tracking-[0.1em] uppercase text-fog
                           hover:text-paper transition-colors duration-200">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA — magnetic */}
        <a href="../ngp-peptides.html" ref={shopBtn}
          className="font-mono text-[10px] tracking-tag uppercase
                     text-ink bg-paper px-5 py-2.5
                     hover:bg-cy transition-colors duration-200 inline-block">
          Shop →
        </a>
      </nav>
    </>
  )
}
