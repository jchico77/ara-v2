'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const PLACEHOLDER_ROLES = [
  'Product Manager',
  'Abogado corporativo',
  'Director financiero',
  'Data Engineer',
  'Arquitecto',
  'Periodista',
  'Consultor de estrategia',
  'HRBP',
  'Sales Executive',
  'Médico especialista',
]

const POPULAR_ROLES = [
  'Product Manager',
  'Abogado',
  'CFO',
  'Periodista',
  'Data Analyst',
  'Arquitecto',
  'Consultor',
  'Developer',
]

export function RoleInput() {
  const [value, setValue] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isFocused || value) return
    const interval = setInterval(() => {
      setPlaceholderIndex(i => (i + 1) % PLACEHOLDER_ROLES.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [isFocused, value])

  const handleSubmit = (role: string) => {
    const trimmed = role.trim()
    if (!trimmed) return
    const slug = trimmed
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
    router.push(`/resultado/${slug}`)
  }

  return (
    <div className="w-full">
      {/* Input field */}
      <div className="relative">
        <input
          ref={inputRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit(value)}
          className="w-full px-5 py-4 rounded-2xl text-base outline-none transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: isFocused
              ? '1px solid rgba(110,92,255,0.6)'
              : '1px solid rgba(255,255,255,0.1)',
            color: '#E8ECF4',
            fontFamily: 'DM Sans, sans-serif',
            boxShadow: isFocused ? '0 0 0 3px rgba(110,92,255,0.15)' : 'none',
          }}
          autoComplete="off"
          spellCheck={false}
        />

        {/* Animated placeholder */}
        {!value && (
          <div className="absolute inset-0 flex items-center px-5 pointer-events-none select-none">
            {!isFocused ? (
              <AnimatePresence mode="wait">
                <motion.span
                  key={placeholderIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  style={{ color: '#8895B0', fontFamily: 'DM Sans, sans-serif' }}
                >
                  Ej: {PLACEHOLDER_ROLES[placeholderIndex]}
                </motion.span>
              </AnimatePresence>
            ) : (
              <span style={{ color: 'rgba(136,149,176,0.5)', fontFamily: 'DM Sans, sans-serif' }}>
                Escribe tu rol profesional...
              </span>
            )}
          </div>
        )}
      </div>

      {/* CTA button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => handleSubmit(value)}
        className="mt-3 w-full py-4 rounded-2xl font-semibold text-base transition-colors duration-200 cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #6E5CFF 0%, #8B7BFF 100%)',
          color: '#fff',
          fontFamily: 'Space Grotesk, sans-serif',
          letterSpacing: '0.01em',
        }}
      >
        Descubrir mi Perfil IA →
      </motion.button>

      {/* Popular roles */}
      <div className="mt-6">
        <p className="text-sm mb-3" style={{ color: '#8895B0', fontFamily: 'DM Sans, sans-serif' }}>
          Roles populares:
        </p>
        <div className="flex flex-wrap gap-2">
          {POPULAR_ROLES.map((role, i) => (
            <motion.button
              key={role}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i, duration: 0.2 }}
              whileHover={{ scale: 1.05, borderColor: 'rgba(110,92,255,0.5)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSubmit(role)}
              className="px-4 py-2 rounded-full text-sm transition-all duration-200 cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#E8ECF4',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              {role}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
