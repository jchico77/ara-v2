'use client'

import { motion } from 'framer-motion'
import type { Archetype } from '@/lib/types'
import { ARCHETYPES } from '@/lib/types'

interface Props {
  archetype: Archetype
  multiplier: number
  slug: string
  title: string
  animate: boolean
  delay?: number
}

export function ShareButton({ archetype, multiplier, slug, title, animate, delay = 3.5 }: Props) {
  const info = ARCHETYPES[archetype]

  const shareText = `Mi Perfil IA: ${info.name} · ${multiplier.toFixed(1)}× de potencial de amplificación. Ya sé en qué áreas activar mi potencial. ¿Has analizado el tuyo?`

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/resultado/${slug}?archetype=${archetype}&multiplier=${multiplier.toFixed(1)}&title=${encodeURIComponent(title)}&ref=share`
    : ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
    } catch {
      // Fallback: silent fail
    }
  }

  const handleLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank', 'width=600,height=500')
  }

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`
    window.open(url, '_blank')
  }

  const handleX = () => {
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank', 'width=600,height=500')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={animate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
      className="w-full mt-6 p-6 rounded-3xl text-center"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <p
        className="text-base font-semibold mb-1"
        style={{ color: '#E8ECF4', fontFamily: 'Space Grotesk, sans-serif' }}
      >
        Comparte tu Perfil IA
      </p>
      <p className="text-sm mb-5" style={{ color: '#8895B0', fontFamily: 'DM Sans, sans-serif' }}>
        Ya sé en qué áreas activar mi potencial. ¿Has analizado el tuyo?
      </p>

      <div className="flex justify-center gap-3 flex-wrap">
        {[
          { label: 'LinkedIn', handler: handleLinkedIn, bg: '#0A66C2' },
          { label: 'WhatsApp', handler: handleWhatsApp, bg: '#25D366' },
          { label: '𝕏', handler: handleX, bg: '#1DA1F2' },
          { label: 'Copiar', handler: handleCopy, bg: 'rgba(255,255,255,0.1)' },
        ].map(btn => (
          <motion.button
            key={btn.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={btn.handler}
            className="px-5 py-2.5 rounded-full text-sm font-medium text-white cursor-pointer"
            style={{ background: btn.bg, fontFamily: 'DM Sans, sans-serif' }}
          >
            {btn.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
