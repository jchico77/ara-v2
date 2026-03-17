/** The 5 professional AI archetypes */
export type Archetype =
  | 'orquestador'
  | 'estratega'
  | 'acelerado'
  | 'conector'
  | 'pionero'

/** Block impact category */
export type BlockCategory = 'presion' | 'transformacion' | 'ventaja'

/** Direction of AI impact on a functional block */
export type BlockDirection = 'automatizacion' | 'aumentacion'

/** A single functional block within a role profile */
export interface FunctionalBlock {
  id: string
  name: string
  category: BlockCategory
  direction: BlockDirection
  score: number          // 0–100: AI exposure/impact score
  brief: string          // Short, personal narrative (1-2 sentences)
  detail: string         // Expanded description for the drawer
  tasks: TaskDetail[]    // Individual tasks within this block
}

/** Individual task within a functional block */
export interface TaskDetail {
  name: string
  exposure: number       // 0–100
  direction: BlockDirection
}

/** Archetype metadata for display */
export interface ArchetypeInfo {
  id: Archetype
  name: string           // Display name: "El Orquestador"
  tagline: string        // 1-line identity statement
  color: string          // Hex color
  icon: string           // Emoji or icon identifier
}

/** Complete role profile from the catalog */
export interface RoleProfile {
  slug: string
  title: string
  archetype: Archetype
  multiplier: number     // e.g. 2.8
  summary: string        // Personalized summary sentence
  blocks: FunctionalBlock[]
}

/** Map of archetype metadata */
export const ARCHETYPES: Record<Archetype, ArchetypeInfo> = {
  orquestador: {
    id: 'orquestador',
    name: 'El Orquestador',
    tagline: 'Diriges equipos humano-IA. Eres el director de orquesta de agentes.',
    color: '#6E5CFF',
    icon: '🎭',
  },
  estratega: {
    id: 'estratega',
    name: 'El Estratega',
    tagline: 'Tu valor está en las decisiones que la IA no puede tomar.',
    color: '#0A66C2',
    icon: '♟️',
  },
  acelerado: {
    id: 'acelerado',
    name: 'El Acelerado',
    tagline: 'La IA multiplica tu productividad más que en casi ningún otro perfil.',
    color: '#22C088',
    icon: '⚡',
  },
  conector: {
    id: 'conector',
    name: 'El Conector',
    tagline: 'Conectas mundos que la IA no puede conectar.',
    color: '#E8A830',
    icon: '🔗',
  },
  pionero: {
    id: 'pionero',
    name: 'El Pionero',
    tagline: 'Tu profesión está en la frontera del cambio. Los que se adaptan primero ganan.',
    color: '#EF4060',
    icon: '🚀',
  },
}

/** Color map for block categories */
export const CATEGORY_COLORS: Record<BlockCategory, string> = {
  presion: '#EF4060',
  transformacion: '#E8A830',
  ventaja: '#22C088',
}

/** Display labels for block categories */
export const CATEGORY_LABELS: Record<BlockCategory, string> = {
  presion: 'Presión IA',
  transformacion: 'Zona de transformación',
  ventaja: 'Ventaja humana',
}
