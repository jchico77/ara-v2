'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ARCHETYPES } from '@/lib/types'
import type { Archetype } from '@/lib/types'

interface Props {
  archetype: Archetype
  multiplier: number
  summary: string
  /** Controls when this component begins its reveal animation */
  animate: boolean
}

/** Animated count-up from 1.0 to target value */
function CountUp({ target, animate }: { target: number; animate: boolean }) {
  const [value, setValue] = useState(1.0)

  useEffect(() => {
    if (!animate) return
    const duration = 1200
    const startTime = performance.now()
    const startValue = 1.0

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // easeOutExpo curve
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setValue(startValue + (target - startValue) * eased)

      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  }, [target, animate])

  return <>{value.toFixed(1)}</>
}

export function ProfileCard({ archetype, multiplier, summary, animate }: Props) {
  const info = ARCHETYPES[archetype]

  return (
    <div className="w-full">
      {/* Archetype reveal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={animate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="p-6 rounded-3xl mb-6"
        style={{
          background: `linear-gradient(135deg, ${info.color}12 0%, ${info.color}06 100%)`,
          border: `1px solid ${info.color}25`,
        }}
      >
        {/* Icon */}
        <div className="text-4xl mb-4">{info.icon}</div>

        {/* Label */}
        <p className="text-xs font-medium tracking-widest uppercase mb-2" style={{ color: '#8895B0' }}>
          Tu Perfil IA
        </p>

        {/* Name */}
        <h2
          className="text-2xl font-bold uppercase tracking-wide mb-3"
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            color: info.color,
            letterSpacing: '0.05em',
          }}
        >
          {info.name}
        </h2>

        {/* Tagline */}
        <p
          className="text-base leading-relaxed"
          style={{ color: '#E8ECF4', fontFamily: 'DM Sans, sans-serif' }}
        >
          {info.tagline}
        </p>
      </motion.div>

      {/* Multiplier reveal (delayed) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={animate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{
          duration: 0.6,
          delay: 0.5,
          ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        }}
        className="text-center mb-6"
      >
        <div
          className="font-bold leading-none mb-2"
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(3rem, 12vw, 4.5rem)',
            color: '#E8ECF4',
            letterSpacing: '-0.03em',
          }}
        >
          <CountUp target={multiplier} animate={animate} />
          <span style={{ fontSize: '0.5em', color: '#8895B0' }}>×</span>
        </div>
        <p
          className="text-sm uppercase tracking-widest mb-4"
          style={{ color: '#8895B0', fontFamily: 'Space Grotesk, sans-serif' }}
        >
          potencial de amplificación
        </p>
      </motion.div>

      {/* Summary (delayed more) */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={animate ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{
          duration: 0.5,
          delay: 1.0,
          ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        }}
        className="text-center text-base leading-relaxed mb-8 px-2"
        style={{ color: '#8895B0', fontFamily: 'DM Sans, sans-serif' }}
      >
        &ldquo;{summary}&rdquo;
      </motion.p>
    </div>
  )
}
