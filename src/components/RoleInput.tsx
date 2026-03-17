'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
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
  'Diseñador UX',
  'Content Creator',
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

interface Suggestion {
  slug: string
  title: string
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export function RoleInput() {
  const [value, setValue] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [isFocused, setIsFocused] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debouncedValue = useDebounce(value, 200)

  // Rotate placeholder
  useEffect(() => {
    if (isFocused || value) return
    const interval = setInterval(() => {
      setPlaceholderIndex(i => (i + 1) % PLACEHOLDER_ROLES.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [isFocused, value])

  // Fetch suggestions
  useEffect(() => {
    if (debouncedValue.length < 2) {
      setSuggestions([])
      setActiveIndex(-1)
      return
    }
    let cancelled = false
    setLoading(true)
    fetch(`/api/suggestions?q=${encodeURIComponent(debouncedValue)}`)
      .then(r => r.json())
      .then((data: Suggestion[]) => {
        if (cancelled) return
        setSuggestions(data)
        setActiveIndex(-1)
      })
      .catch(() => {
        if (cancelled) return
        setSuggestions([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [debouncedValue])

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSuggestions([])
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSubmit = useCallback((role: string) => {
    const trimmed = role.trim()
    if (!trimmed || submitting) return
    setSuggestions([])
    setSubmitting(true)
    const slug = trimmed
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
    router.push(`/resultado/${slug}`)
  }, [router, submitting])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length === 0) {
      if (e.key === 'Enter') handleSubmit(value)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        handleSubmit(suggestions[activeIndex].title)
      } else {
        handleSubmit(value)
      }
    } else if (e.key === 'Escape') {
      setSuggestions([])
      setActiveIndex(-1)
    }
  }

  const showDropdown = isFocused && suggestions.length > 0

  return (
    <div className="w-full" ref={containerRef}>
      {/* Input + dropdown wrapper */}
      <div className="relative">
        <input
          ref={inputRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            // Delay to allow click on suggestion
            setTimeout(() => setIsFocused(false), 150)
          }}
          onKeyDown={handleKeyDown}
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

        {/* Loading dot */}
        {loading && value.length >= 2 && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
            style={{ background: '#6E5CFF', animation: 'pulse 1s infinite' }}
          />
        )}

        {/* Autocomplete dropdown */}
        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 top-full mt-1.5 rounded-2xl overflow-hidden z-50"
              style={{
                transformOrigin: 'top',
                background: '#131728',
                border: '1px solid rgba(110,92,255,0.25)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              {suggestions.map((s, i) => (
                <button
                  key={s.slug}
                  onMouseDown={() => handleSubmit(s.title)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className="w-full text-left px-4 py-3 text-sm transition-colors duration-100 cursor-pointer flex items-center gap-2"
                  style={{
                    background: i === activeIndex ? 'rgba(110,92,255,0.12)' : 'transparent',
                    color: i === activeIndex ? '#E8ECF4' : '#C0C8DC',
                    fontFamily: 'DM Sans, sans-serif',
                    borderBottom: i < suggestions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}
                >
                  <span style={{ color: '#6E5CFF', fontSize: '10px' }}>→</span>
                  {s.title}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA button */}
      <motion.button
        whileHover={submitting ? {} : { scale: 1.02 }}
        whileTap={submitting ? {} : { scale: 0.97 }}
        onClick={() => handleSubmit(value)}
        disabled={submitting}
        className="mt-3 w-full py-4 rounded-2xl font-semibold text-base transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
        style={{
          background: submitting
            ? 'linear-gradient(135deg, #5244CC 0%, #6B5BCC 100%)'
            : 'linear-gradient(135deg, #6E5CFF 0%, #8B7BFF 100%)',
          color: '#fff',
          fontFamily: 'Space Grotesk, sans-serif',
          letterSpacing: '0.01em',
          opacity: submitting ? 0.85 : 1,
        }}
      >
        {submitting ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 rounded-full inline-block"
              style={{ border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff' }}
            />
            Analizando...
          </>
        ) : (
          'Descubrir mi Perfil IA →'
        )}
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
