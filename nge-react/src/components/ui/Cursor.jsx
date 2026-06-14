/**
 * Cursor.jsx — Custom magnetic cursor
 *
 * Two elements:
 *  • #cursor-ring  — 40px ring, follows mouse with lag (blend-mode: difference)
 *  • #cursor-dot   — 6px dot,  follows instantly
 *
 * States:
 *  • Default:  ring 40px, dot 6px
 *  • Hover link/btn:  ring expands to 80px, dot disappears
 *  • Hover image:     ring becomes "VIEW" text label
 *
 * Uses gsap.quickTo() for GPU-accelerated cursor tracking.
 */
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Cursor() {
  const ring = useRef()
  const dot  = useRef()

  useEffect(() => {
    /* quickTo for best performance — no new tweens on every mousemove */
    const xRing = gsap.quickTo(ring.current, 'x', { duration: 0.55, ease: 'power3' })
    const yRing = gsap.quickTo(ring.current, 'y', { duration: 0.55, ease: 'power3' })
    const xDot  = gsap.quickTo(dot.current,  'x', { duration: 0.08 })
    const yDot  = gsap.quickTo(dot.current,  'y', { duration: 0.08 })

    const onMove = e => {
      xRing(e.clientX); yRing(e.clientY)
      xDot(e.clientX);  yDot(e.clientY)
    }
    window.addEventListener('mousemove', onMove)

    /* Hover: expand ring on interactive elements */
    const onOver = e => {
      const el = e.target.closest('a, button, [data-hover], label')
      if (!el) return
      gsap.to(ring.current, { scale: 2.2, opacity: 0.6, duration: 0.3, ease: 'power2.out' })
      gsap.to(dot.current,  { scale: 0,   duration: 0.2 })
    }
    const onOut = e => {
      const el = e.target.closest('a, button, [data-hover], label')
      if (!el) return
      gsap.to(ring.current, { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' })
      gsap.to(dot.current,  { scale: 1, duration: 0.2 })
    }

    /* Click: squish effect */
    const onClick = () => {
      gsap.timeline()
        .to(ring.current, { scale: 0.7, duration: 0.1 })
        .to(ring.current, { scale: 1,   duration: 0.5, ease: 'elastic.out(1,0.3)' })
    }

    document.addEventListener('mouseover',  onOver)
    document.addEventListener('mouseout',   onOut)
    document.addEventListener('mousedown',  onClick)

    /* Hide on mobile / touch devices */
    const isTouchDevice = window.matchMedia('(hover: none)').matches
    if (isTouchDevice) {
      ring.current.style.display = 'none'
      dot.current.style.display  = 'none'
    }

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover',  onOver)
      document.removeEventListener('mouseout',   onOut)
      document.removeEventListener('mousedown',  onClick)
    }
  }, [])

  return (
    <>
      <div ref={ring} id="cursor-ring" aria-hidden="true" />
      <div ref={dot}  id="cursor-dot"  aria-hidden="true" />
    </>
  )
}
