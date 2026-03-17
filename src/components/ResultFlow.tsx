'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { findRole } from '@/lib/catalog'
import type { FunctionalBlock, RoleProfile } from '@/lib/types'
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

type Phase = 'loading' | 'result' | 'error'

export function ResultFlow({ slug }: Props) {
  const [phase, setPhase] = useState<Phase>('loading')
  const [profile, setProfile] = useState<RoleProfile | null>(null)
  const [selectedBlock, setSelectedBlock] = useState<FunctionalBlock | null>(null)
  const [loadingDone, setLoadingDone] = useState(false)
  const apiDone = useRef(false)
  const apiResult = useRef<RoleProfile | null>(null)

  // Dehyphenate slug back to role text for the API call
  const roleInput = slug.replace(/-/g, ' ')

  // Call API in parallel with loading animation
  useEffect(() => {
    let cancelled = false

    async function fetchProfile() {
      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role_input: roleInput }),
        })

        if (!res.ok) throw new Error(`API error: ${res.status}`)

        const data = await res.json() as RoleProfile
        if (cancelled) return

        apiResult.current = data
        apiDone.current = true

        // If loading animation already finished, show result immediately
        if (loadingDone) {
          setProfile(data)
          setPhase('result')
        }
      } catch {
        if (cancelled) return
        // Fallback to local catalog
        const fallback = findRole(slug)
        apiResult.current = fallback
        apiDone.current = true

        if (loadingDone) {
          setProfile(fallback)
          setPhase('result')
        }
      }
    }

    fetchProfile()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, roleInput])

  const handleLoadingComplete = useCallback(() => {
    setLoadingDone(true)

    if (apiDone.current && apiResult.current) {
      // API already finished — show result
      setProfile(apiResult.current)
      setPhase('result')
    }
    // else: wait for API to complete (useEffect will trigger the transition)
  }, [])

  // Handle case where API finishes after loading animation
  useEffect(() => {
    if (loadingDone && apiDone.current && apiResult.current && !profile) {
      setProfile(apiResult.current)
      setPhase('result')
    }
  }, [loadingDone, profile])

  const potentialMultiplier = profile ? Math.min(profile.multiplier * 1.45, 5.0) : 0

  return (
    <div style={{ background: '#0B0E1A', minHeight: '100dvh' }}>
      <AnimatePresence mode="wait">
        {phase === 'loading' && (
          <motion.div key="loading" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <LoadingSequence onComplete={handleLoadingComplete} />
          </motion.div>
        )}

        {phase === 'result' && profile && (
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

              {/* Archetype + Multiplier + Summary */}
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
                slug={profile.slug}
                animate
                delay={1.5 + 0.1 * profile.blocks.length + 0.5}
              />

              {/* Share */}
              <ShareButton
                archetype={profile.archetype}
                multiplier={profile.multiplier}
                slug={profile.slug}
                title={profile.title}
                animate
                delay={1.5 + 0.1 * profile.blocks.length + 1.0}
              />
            </div>
          </motion.main>
        )}

        {phase === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-dvh flex flex-col items-center justify-center px-5 text-center"
            style={{ background: '#0B0E1A' }}
          >
            <p className="text-lg mb-4" style={{ color: '#E8ECF4', fontFamily: 'Space Grotesk, sans-serif' }}>
              Algo salió mal
            </p>
            <Link
              href="/"
              className="px-6 py-3 rounded-full text-sm font-medium"
              style={{ background: 'rgba(110,92,255,0.15)', border: '1px solid rgba(110,92,255,0.3)', color: '#A89BFF' }}
            >
              ← Volver al inicio
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Block detail drawer */}
      <BlockDetail block={selectedBlock} onClose={() => setSelectedBlock(null)} />
    </div>
  )
}
