'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STEPS = [
  { text: 'Analizando tu rol...', duration: 1500 },
  { text: 'Cruzando con datos de 900+ ocupaciones y 19.000 tareas...', duration: 1500 },
  { text: 'Calculando tu Perfil IA...', duration: 1500 },
]

interface Props {
  onComplete: () => void
}

/** Animated orbs that move and merge during the loading sequence */
function Orbs({ step }: { step: number }) {
  // Number of orbs increases, spread decreases as we progress
  const orbCount = [5, 8, 12][step] ?? 8
  const spread = [120, 80, 30][step] ?? 80

  return (
    <div className="relative w-48 h-48">
      {Array.from({ length: orbCount }).map((_, i) => {
        const angle = (i / orbCount) * Math.PI * 2
        const radius = spread
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        const size = 6 + Math.random() * 6
        const colors = ['#6E5CFF', '#22C088', '#E8A830', '#EF4060', '#0A66C2']
        const color = colors[i % colors.length]

        return (
          <motion.div
            key={`${step}-${i}`}
            initial={{ x: (Math.random() - 0.5) * 200, y: (Math.random() - 0.5) * 200, opacity: 0, scale: 0 }}
            animate={{
              x,
              y,
              opacity: [0, 0.8, 0.6],
              scale: [0, 1.2, 1],
            }}
            transition={{
              duration: 1.2,
              delay: i * 0.06,
              ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
            }}
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: size,
              height: size,
              background: color,
              boxShadow: `0 0 ${size * 2}px ${color}40`,
              marginLeft: -size / 2,
              marginTop: -size / 2,
            }}
          />
        )
      })}
      {/* Central glow that intensifies */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.15 + step * 0.1, scale: 1 + step * 0.3 }}
        transition={{ duration: 0.8 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 80,
          height: 80,
          background: 'radial-gradient(circle, #6E5CFF 0%, transparent 70%)',
        }}
      />
    </div>
  )
}

export function LoadingSequence({ onComplete }: Props) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (step < STEPS.length) {
      const timer = setTimeout(() => {
        if (step === STEPS.length - 1) {
          onComplete()
        } else {
          setStep(s => s + 1)
        }
      }, STEPS[step].duration)
      return () => clearTimeout(timer)
    }
  }, [step, onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-dvh flex flex-col items-center justify-center px-5"
      style={{ background: '#0B0E1A' }}
    >
      {/* Animated orbs */}
      <div className="mb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Orbs step={step} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Step text */}
      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-center text-base max-w-xs"
          style={{ color: '#8895B0', fontFamily: 'DM Sans, sans-serif' }}
        >
          {STEPS[step].text}
        </motion.p>
      </AnimatePresence>

      {/* Step indicators */}
      <div className="flex gap-2 mt-8">
        {STEPS.map((_, i) => (
          <motion.div
            key={i}
            className="rounded-full"
            animate={{
              width: i === step ? 24 : 6,
              background: i === step ? '#6E5CFF' : 'rgba(255,255,255,0.15)',
            }}
            transition={{ duration: 0.3 }}
            style={{ height: 6 }}
          />
        ))}
      </div>
    </motion.div>
  )
}
