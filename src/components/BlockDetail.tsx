'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import type { FunctionalBlock } from '@/lib/types'
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/lib/types'

interface Props {
  block: FunctionalBlock | null
  onClose: () => void
}

export function BlockDetail({ block, onClose }: Props) {
  const [showTasks, setShowTasks] = useState(false)

  if (!block) return null

  const catColor = CATEGORY_COLORS[block.category]
  const catLabel = CATEGORY_LABELS[block.category]

  return (
    <AnimatePresence>
      {block && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-3xl p-6"
            style={{
              background: '#111526',
              borderTop: `1px solid ${catColor}30`,
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <span style={{ color: '#8895B0', fontSize: 18 }}>✕</span>
            </button>

            {/* Block name */}
            <h3
              className="text-xl font-bold mb-1"
              style={{ color: '#E8ECF4', fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {block.name}
            </h3>

            {/* Score bar inline */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className="h-full rounded-full" style={{ background: catColor, width: `${block.score}%` }} />
              </div>
              <span className="text-sm font-semibold tabular-nums" style={{ color: catColor }}>
                {block.score}
              </span>
            </div>

            {/* Category badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5"
              style={{ background: `${catColor}15`, color: catColor }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: catColor }} />
              {catLabel}
            </div>

            {/* Direction */}
            <p className="text-sm mb-4" style={{ color: '#8895B0', fontFamily: 'DM Sans, sans-serif' }}>
              {block.direction === 'aumentacion'
                ? '↑ La IA te potencia'
                : '↓ La IA automatiza'}
            </p>

            {/* Detail description */}
            <p
              className="text-base leading-relaxed mb-6"
              style={{ color: '#E8ECF4', fontFamily: 'DM Sans, sans-serif' }}
            >
              {block.detail}
            </p>

            {/* Separator */}
            <div className="h-px mb-5" style={{ background: 'rgba(255,255,255,0.06)' }} />

            {/* Tasks toggle */}
            <button
              onClick={() => setShowTasks(!showTasks)}
              className="w-full flex items-center justify-between py-2 cursor-pointer"
            >
              <span
                className="text-sm font-medium"
                style={{ color: '#E8ECF4', fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Detalle por actividades
              </span>
              <motion.span
                animate={{ rotate: showTasks ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ color: '#8895B0' }}
              >
                ▼
              </motion.span>
            </button>

            {/* Tasks list */}
            <AnimatePresence>
              {showTasks && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col gap-2 pt-3">
                    {block.tasks.map(task => (
                      <div
                        key={task.name}
                        className="flex items-center justify-between p-3 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.03)' }}
                      >
                        <span className="text-sm flex-1 mr-3" style={{ color: '#E8ECF4', fontFamily: 'DM Sans, sans-serif' }}>
                          {task.name}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${task.exposure}%`,
                                background: task.direction === 'automatizacion' ? '#EF4060' : '#22C088',
                              }}
                            />
                          </div>
                          <span className="text-xs tabular-nums w-6 text-right" style={{ color: '#8895B0' }}>
                            {task.exposure}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom padding for mobile */}
            <div className="h-8" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
