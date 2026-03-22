'use client'

import { useState, useEffect } from 'react'
import { track } from '@vercel/analytics'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { findRole } from '@/lib/catalog'
import type { FunctionalBlock, RoleProfile } from '@/lib/types'
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/lib/types'
import type { CompetencyPlan, PlanStep } from '@/app/api/plan/route'

interface Props {
  slug: string
}

const STEP_CONFIG = {
  entiende: { label: 'Entiende', icon: '👁', color: '#4A90D9', number: 1 },
  pruebalo: { label: 'Pruébalo', icon: '⚡', color: '#6E5CFF', number: 2 },
  dominalo: { label: 'Domínalo', icon: '🏆', color: '#E8A830', number: 3 },
} as const

function getPlatformUrl(platform: string, query: string): string {
  const q = encodeURIComponent(query)
  if (platform === 'Coursera') return `https://www.coursera.org/search?query=${q}`
  if (platform === 'Udemy') return `https://www.udemy.com/courses/search/?q=${q}`
  return `https://www.linkedin.com/learning/search?keywords=${q}`
}

function getToolUrl(tool: string): string {
  if (tool === 'ChatGPT') return 'https://chatgpt.com'
  if (tool === 'Perplexity') return 'https://www.perplexity.ai'
  if (tool === 'Midjourney') return 'https://www.midjourney.com'
  if (tool === 'Runway') return 'https://runwayml.com'
  if (tool === 'GitHub Copilot') return 'https://github.com/features/copilot'
  if (tool === 'Notion AI') return 'https://www.notion.so/product/ai'
  return 'https://claude.ai'
}

function getTopBlocks(blocks: FunctionalBlock[]): FunctionalBlock[] {
  return [...blocks].sort((a, b) => b.score - a.score).slice(0, 3)
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // silent fail
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="text-xs px-3 py-1 rounded-full cursor-pointer"
      style={{
        background: copied ? 'rgba(34,192,136,0.2)' : 'rgba(255,255,255,0.08)',
        color: copied ? '#22C088' : '#8895B0',
        border: `1px solid ${copied ? 'rgba(34,192,136,0.3)' : 'rgba(255,255,255,0.1)'}`,
        transition: 'all 0.2s',
      }}
    >
      {copied ? '✓ Copiado' : 'Copiar prompt'}
    </button>
  )
}

function StepItem({ step, isLast }: { step: PlanStep; isLast: boolean }) {
  const config = STEP_CONFIG[step.type]

  return (
    <div className="relative flex gap-4">
      {/* Vertical connector line */}
      {!isLast && (
        <div
          className="absolute left-[18px] top-9 w-px"
          style={{ height: 'calc(100% + 16px)', background: 'rgba(255,255,255,0.06)' }}
        />
      )}

      {/* Step circle */}
      <div
        className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold z-10"
        style={{
          background: `${config.color}18`,
          border: `1.5px solid ${config.color}40`,
          color: config.color,
          fontFamily: 'Space Grotesk, sans-serif',
        }}
      >
        {config.number}
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-base">{config.icon}</span>
          <span
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: config.color, fontFamily: 'DM Sans, sans-serif' }}
          >
            {config.label}
          </span>
        </div>

        <h4
          className="text-sm font-semibold mb-1.5"
          style={{ color: '#E8ECF4', fontFamily: 'Space Grotesk, sans-serif' }}
        >
          {step.title}
        </h4>
        <p
          className="text-sm leading-relaxed mb-3"
          style={{ color: '#8895B0', fontFamily: 'DM Sans, sans-serif' }}
        >
          {step.description}
        </p>

        {/* Pruébalo: prompt box */}
        {step.type === 'pruebalo' && step.prompt && (
          <div
            className="rounded-xl p-3 mb-3"
            style={{
              background: 'rgba(110,92,255,0.06)',
              border: '1px solid rgba(110,92,255,0.15)',
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <p
                className="text-xs leading-relaxed flex-1"
                style={{ color: '#C0C8DC', fontFamily: 'DM Mono, monospace', fontStyle: 'italic' }}
              >
                &ldquo;{step.prompt}&rdquo;
              </p>
              <CopyButton text={step.prompt} />
            </div>
          </div>
        )}

        {/* CTA */}
        {step.type === 'pruebalo' && step.tool && (
          <a
            href={getToolUrl(step.tool)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('plan_tool_click', { tool: step.tool })}

            className="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full"
            style={{
              background: 'rgba(110,92,255,0.12)',
              border: '1px solid rgba(110,92,255,0.25)',
              color: '#A89BFF',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            Abrir {step.tool} →
          </a>
        )}

        {step.type === 'dominalo' && step.courseQuery && step.platform && (
          <a
            href={getPlatformUrl(step.platform, step.courseQuery)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('course_click', { platform: step.platform, query: step.courseQuery })}

            className="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full"
            style={{
              background: 'rgba(232,168,48,0.1)',
              border: '1px solid rgba(232,168,48,0.25)',
              color: '#F0C060',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            Buscar en {step.platform} →
          </a>
        )}
      </div>
    </div>
  )
}

function CompetencyCard({
  block,
  plan,
  index,
  error,
  onRetry,
}: {
  block: FunctionalBlock
  plan: CompetencyPlan | undefined
  index: number
  error?: boolean
  onRetry?: () => void
}) {
  const categoryColor = CATEGORY_COLORS[block.category]
  const categoryLabel = CATEGORY_LABELS[block.category]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: 0.1 + index * 0.15,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
      className="w-full rounded-3xl p-6 mb-4"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: `1px solid ${categoryColor}25`,
      }}
    >
      {/* Block header */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <h3
            className="text-base font-semibold mb-1"
            style={{ color: '#E8ECF4', fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {block.name}
          </h3>
          <span
            className="text-xs px-2.5 py-1 rounded-full"
            style={{
              background: `${categoryColor}14`,
              color: categoryColor,
              border: `1px solid ${categoryColor}30`,
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            {categoryLabel}
          </span>
        </div>

        {/* Score badge */}
        <div
          className="flex-shrink-0 text-center"
          style={{ minWidth: '52px' }}
        >
          <div
            className="text-2xl font-bold"
            style={{ color: categoryColor, fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {block.score}
          </div>
          <div className="text-xs" style={{ color: '#8895B0' }}>/ 100</div>
        </div>
      </div>

      {/* Steps */}
      {plan ? (
        <div>
          {plan.steps.map((step, i) => (
            <StepItem key={step.type} step={step} isLast={i === plan.steps.length - 1} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-6">
          <p className="text-sm mb-3" style={{ color: '#8895B0', fontFamily: 'DM Sans, sans-serif' }}>
            No se pudo generar el plan
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-xs font-medium px-4 py-2 rounded-full cursor-pointer"
              style={{
                background: 'rgba(110,92,255,0.12)',
                border: '1px solid rgba(110,92,255,0.25)',
                color: '#A89BFF',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              Reintentar
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="h-16 rounded-xl animate-pulse"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

export function PlanFlow({ slug }: Props) {
  const [profile, setProfile] = useState<RoleProfile | null>(null)
  const [plans, setPlans] = useState<CompetencyPlan[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [planError, setPlanError] = useState(false)

  const roleInput = slug.replace(/-/g, ' ')

  const fetchPlans = async (title: string, blocks: FunctionalBlock[]) => {
    setPlanError(false)
    setPlans(null)
    try {
      const planRes = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, blocks }),
      })
      if (!planRes.ok) throw new Error(`plan ${planRes.status}`)
      const planData = await planRes.json() as CompetencyPlan[]
      if (!Array.isArray(planData)) throw new Error('Invalid plan response')
      setPlans(planData)
    } catch {
      setPlanError(true)
    }
  }

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        // Step 1: get profile (cached in analyze API)
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role_input: roleInput }),
        })
        if (!res.ok) throw new Error('analyze failed')
        const data = await res.json() as RoleProfile
        if (cancelled) return

        setProfile(data)
        setLoading(false)

        // Step 2: generate plan for top 3 blocks
        const topBlocks = getTopBlocks(data.blocks)
        await fetchPlans(data.title, topBlocks)
      } catch {
        if (cancelled) return
        // Fallback to catalog
        const fallback = findRole(slug)
        setProfile(fallback)
        setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, roleInput])

  const topBlocks = profile ? getTopBlocks(profile.blocks) : []
  const potentialMultiplier = profile ? Math.min(profile.multiplier * 1.45, 5.0) : 0

  return (
    <div style={{ background: '#0B0E1A', minHeight: '100dvh' }}>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-dvh flex flex-col items-center justify-center gap-4"
          >
            {/* Spinner */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 rounded-full"
              style={{ border: '2px solid rgba(110,92,255,0.2)', borderTopColor: '#6E5CFF' }}
            />
            <p
              className="text-sm"
              style={{ color: '#8895B0', fontFamily: 'DM Sans, sans-serif' }}
            >
              Preparando tu plan de acción...
            </p>
          </motion.div>
        )}

        {!loading && profile && (
          <motion.main
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center px-5 py-10 pb-20"
          >
            <div className="w-full max-w-md">
              {/* Back */}
              <Link
                href={`/resultado/${slug}`}
                className="inline-flex items-center gap-1 text-xs font-medium mb-8"
                style={{ color: '#8895B0', fontFamily: 'DM Sans, sans-serif' }}
              >
                ← Volver al análisis
              </Link>

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
              >
                <p
                  className="text-xs font-semibold tracking-widest uppercase mb-2"
                  style={{ color: '#8895B0', fontFamily: 'DM Sans, sans-serif' }}
                >
                  Plan de Acción
                </p>
                <h1
                  className="text-2xl font-bold mb-3"
                  style={{ color: '#E8ECF4', fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {profile.title}
                </h1>

                {/* Multiplier progression */}
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <span className="text-sm font-semibold" style={{ color: '#E8A830' }}>
                    {profile.multiplier.toFixed(1)}×
                  </span>
                  <span className="text-xs" style={{ color: '#8895B0' }}>→</span>
                  <span className="text-sm font-semibold" style={{ color: '#22C088' }}>
                    {potentialMultiplier.toFixed(1)}×
                  </span>
                  <span className="text-xs" style={{ color: '#8895B0', fontFamily: 'DM Sans, sans-serif' }}>
                    potencial
                  </span>
                </div>
              </motion.div>

              {/* Section label */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xs font-semibold tracking-widest uppercase mb-5"
                style={{ color: '#8895B0', fontFamily: 'DM Sans, sans-serif' }}
              >
                Las 3 competencias clave a desarrollar
              </motion.p>

              {/* Competency cards */}
              {topBlocks.map((block, i) => {
                const plan = plans?.find(p => p.blockId === block.id)
                return (
                  <CompetencyCard
                    key={block.id}
                    block={block}
                    plan={plan}
                    index={i}
                    error={planError}
                    onRetry={() => fetchPlans(profile.title, topBlocks)}
                  />
                )
              })}

              {/* Bottom CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-6 text-center"
              >
                <Link
                  href={`/resultado/${slug}`}
                  className="inline-flex items-center gap-2 text-sm font-medium"
                  style={{ color: '#8895B0', fontFamily: 'DM Sans, sans-serif' }}
                >
                  ← Ver análisis completo
                </Link>
              </motion.div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  )
}
