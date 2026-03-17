'use client'

import { motion } from 'framer-motion'
import type { FunctionalBlock } from '@/lib/types'
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/lib/types'

interface Props {
  blocks: FunctionalBlock[]
  animate: boolean
  /** Delay (seconds) before the first block starts animating */
  baseDelay?: number
  onBlockClick: (block: FunctionalBlock) => void
}

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        className="h-full rounded-full"
        style={{ background: color }}
      />
    </div>
  )
}

export function BlockGrid({ blocks, animate, baseDelay = 1.5, onBlockClick }: Props) {
  return (
    <div className="w-full">
      {/* Section header */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={animate ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: baseDelay, duration: 0.4 }}
        className="text-xs font-medium tracking-widest uppercase mb-4"
        style={{ color: '#8895B0', fontFamily: 'Space Grotesk, sans-serif' }}
      >
        Tu día a día
      </motion.p>

      {/* Block cards */}
      <div className="flex flex-col gap-3">
        {blocks.map((block, i) => {
          const catColor = CATEGORY_COLORS[block.category]
          const catLabel = CATEGORY_LABELS[block.category]

          return (
            <motion.button
              key={block.id}
              initial={{ opacity: 0, y: 16 }}
              animate={animate ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{
                duration: 0.4,
                delay: baseDelay + 0.1 * (i + 1),
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
              }}
              whileHover={{ scale: 1.01, borderColor: `${catColor}40` }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onBlockClick(block)}
              className="w-full text-left p-4 rounded-2xl transition-colors duration-200 cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Header row: category dot + name + score */}
              <div className="flex items-start gap-3 mb-2">
                {/* Category dot */}
                <div
                  className="mt-1 w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: catColor, boxShadow: `0 0 8px ${catColor}50` }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3
                      className="text-base font-semibold truncate"
                      style={{ color: '#E8ECF4', fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      {block.name}
                    </h3>
                    <span
                      className="text-xs font-medium shrink-0 tabular-nums"
                      style={{ color: catColor }}
                    >
                      {block.score}
                    </span>
                  </div>

                  {/* Category label */}
                  <p className="text-xs mt-0.5 mb-2" style={{ color: catColor }}>
                    {catLabel}
                  </p>

                  {/* Score bar */}
                  <ScoreBar score={block.score} color={catColor} />

                  {/* Brief */}
                  <p
                    className="text-sm mt-2.5 leading-relaxed"
                    style={{ color: '#8895B0', fontFamily: 'DM Sans, sans-serif' }}
                  >
                    &ldquo;{block.brief}&rdquo;
                  </p>
                </div>
              </div>

              {/* Footer: "Ver →" */}
              <div className="flex justify-end mt-1">
                <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  Ver →
                </span>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
