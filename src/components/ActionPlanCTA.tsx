'use client'

import { motion } from 'framer-motion'

interface Props {
  currentMultiplier: number
  potentialMultiplier: number
  animate: boolean
  delay?: number
}

export function ActionPlanCTA({ currentMultiplier, potentialMultiplier, animate, delay = 3 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={animate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
      className="w-full mt-8 p-6 rounded-3xl text-center cursor-pointer"
      style={{
        background: 'linear-gradient(135deg, rgba(110,92,255,0.12) 0%, rgba(34,192,136,0.08) 100%)',
        border: '1px solid rgba(110,92,255,0.2)',
      }}
    >
      <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: '#8895B0' }}>
        Tu Plan de Acción
      </p>
      <h3
        className="text-xl font-bold mb-2"
        style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#E8ECF4' }}
      >
        Pasa de{' '}
        <span style={{ color: '#E8A830' }}>{currentMultiplier.toFixed(1)}×</span>
        {' '}a{' '}
        <span style={{ color: '#22C088' }}>{potentialMultiplier.toFixed(1)}×</span>
      </h3>
      <p className="text-sm leading-relaxed mb-5" style={{ color: '#8895B0', fontFamily: 'DM Sans, sans-serif' }}>
        Descubre las 3 competencias que más impacto tendrán en tu perfil
        y el itinerario para desarrollarlas.
      </p>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold"
        style={{
          background: 'linear-gradient(135deg, #6E5CFF 0%, #8B7BFF 100%)',
          color: '#fff',
          fontFamily: 'Space Grotesk, sans-serif',
        }}
      >
        Ver mi Plan de Acción →
      </motion.div>
    </motion.div>
  )
}
