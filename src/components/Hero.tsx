'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { RoleInput } from './RoleInput'

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

export function Hero() {
  return (
    <main
      className="min-h-dvh flex flex-col items-center justify-center px-5 py-16"
      style={{ background: '#0B0E1A' }}
    >
      <motion.div
        className="w-full max-w-md flex flex-col gap-0"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Logo / brand */}
        <motion.div variants={item} className="mb-10">
          <span
            className="text-sm font-medium tracking-widest uppercase"
            style={{ color: '#8895B0', fontFamily: 'Space Grotesk, sans-serif' }}
          >
            AI Role Analyzer
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={item}
          className="mb-4 leading-tight"
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(2rem, 8vw, 2.75rem)',
            fontWeight: 700,
            color: '#E8ECF4',
            letterSpacing: '-0.02em',
          }}
        >
          ¿Cuál es tu{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #6E5CFF 0%, #22C088 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Perfil IA?
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={item}
          className="mb-10 text-lg leading-relaxed"
          style={{ color: '#8895B0', fontFamily: 'DM Sans, sans-serif' }}
        >
          Descubre cómo la IA amplifica tu rol profesional y cuánto puede multiplicarse tu
          productividad.
        </motion.p>

        {/* Input + CTA + Pills */}
        <motion.div variants={item}>
          <RoleInput />
        </motion.div>

        {/* Credibility footer */}
        <motion.div
          variants={item}
          className="mt-10 text-xs text-center leading-relaxed"
          style={{ color: 'rgba(136,149,176,0.6)', fontFamily: 'DM Sans, sans-serif' }}
        >
          Basado en datos de O*NET, Anthropic Economic Index y metodología Eloundou et al. (MIT/OpenAI)
          {' · '}
          <Link
            href="/metodologia"
            className="underline underline-offset-2 hover:opacity-80 transition-opacity"
            style={{ color: 'rgba(136,149,176,0.8)' }}
          >
            Ver metodología
          </Link>
        </motion.div>
      </motion.div>
    </main>
  )
}
