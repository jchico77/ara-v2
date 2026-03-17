'use client'

import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { findRole } from '@/lib/catalog'
import type { FunctionalBlock } from '@/lib/types'
import { LoadingSequence } from './LoadingSequence'
import { ProfileCard } from './ProfileCard'
import { BlockGrid } from './BlockGrid'
import { BlockDetail } from './BlockDetail'
import { ActionPlanCTA } from './ActionPlanCTA'
import { ShareButton } from './ShareButton'
import Link from 'next/link'

interface Props {
  slug: string
}

type Phase = 'loading' | 'result'

export function ResultFlow({ slug }: Props) {
  const [phase, setPhase] = useState<Phase>('loading')
  const [selectedBlock, setSelectedBlock] = useState<FunctionalBlock | null>(null)

  const profile = findRole(slug)
  const potentialMultiplier = Math.min(profile.multiplier * 1.45, 5.0)

  const handleLoadingComplete = useCallback(() => {
    setPhase('result')
  }, [])

  return (
    <div style={{ background: '#0B0E1A', minHeight: '100dvh' }}>
      <AnimatePresence mode="wait">
        {phase === 'loading' && (
          <motion.div key="loading" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <LoadingSequence onComplete={handleLoadingComplete} />
          </motion.div>
        )}

        {phase === 'result' && (
          <motion.main
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center px-5 py-10 pb-20"
            style={{ background: '#0B0E1A' }}
          >
            <div className="w-full max-w-md">
              {/* Back link */}
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-xs font-medium mb-8"
                style={{ color: '#8895B0', fontFamily: 'DM Sans, sans-serif' }}
              >
                ← Nuevo análisis
              </Link>

              {/* Role title */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-sm font-medium uppercase tracking-widest mb-6"
                style={{ color: '#8895B0', fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {profile.title}
              </motion.h1>

              {/* Archetype + Multiplier + Summary (progressive reveal) */}
              <ProfileCard
                archetype={profile.archetype}
                multiplier={profile.multiplier}
                summary={profile.summary}
                animate
              />

              {/* Functional blocks */}
              <BlockGrid
                blocks={profile.blocks}
                animate
                baseDelay={1.5}
                onBlockClick={setSelectedBlock}
              />

              {/* Action Plan CTA */}
              <ActionPlanCTA
                currentMultiplier={profile.multiplier}
                potentialMultiplier={potentialMultiplier}
                animate
                delay={1.5 + 0.1 * profile.blocks.length + 0.5}
              />

              {/* Share */}
              <ShareButton
                archetype={profile.archetype}
                multiplier={profile.multiplier}
                slug={profile.slug}
                animate
                delay={1.5 + 0.1 * profile.blocks.length + 1.0}
              />
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      {/* Block detail drawer */}
      <BlockDetail block={selectedBlock} onClose={() => setSelectedBlock(null)} />
    </div>
  )
}
