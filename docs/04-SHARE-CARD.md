# 04 — Share Card: Sistema de Cards Compartibles

## Objetivo
Generar imágenes optimizadas para compartir en redes sociales que muestren
el Perfil IA del usuario de forma aspiracional y que generen curiosidad
en quien las vea.

---

## Contenido de la card

### Elementos
1. **Fondo:** gradiente oscuro con textura sutil (noise grain), acento con
   el color del arquetipo
2. **Icono del arquetipo:** en grande, con glow del color del arquetipo
3. **Nombre del arquetipo:** "EL CONECTOR" en caps, tipografía display
4. **Multiplicador:** "2.8×" grande y prominente
5. **Texto de potencial:** "de potencial de amplificación IA"
6. **Rol:** "Consultor Inmobiliario Senior"
7. **Mensaje de acción:** "Ya sé en qué áreas activar mi potencial."
8. **CTA:** "Descubre tu Perfil IA → airoleanalyzer.com"
9. **Badge de credibilidad (pequeño):** "Basado en datos de O*NET + MIT + Anthropic"

### Lo que NO incluye
- Score detallado por bloque
- Datos negativos o de presión
- Más de un número
- Terminología académica

---

## Formatos

### LinkedIn post (1200×627px)
```
┌──────────────────────────────────────────────┐
│                                              │
│  [Icono arquetipo]                           │
│                                              │
│  EL CONECTOR                    2.8×         │
│                          potencial IA        │
│  Conectas mundos que                         │
│  la IA no puede conectar                     │
│                                              │
│  ──────────────────────────────              │
│                                              │
│  Consultor Inmobiliario Senior               │
│                                              │
│  Ya sé en qué áreas activar mi potencial.   │
│  ¿Cuál es tu Perfil IA?                     │
│                                              │
│  airoleanalyzer.com          [O*NET + MIT]   │
│                                              │
└──────────────────────────────────────────────┘
```

### Instagram/WhatsApp Story (1080×1920px)
```
┌────────────────────┐
│                    │
│                    │
│   [Icono grande]   │
│                    │
│   EL CONECTOR      │
│                    │
│      2.8×          │
│   potencial IA     │
│                    │
│   ────────────     │
│                    │
│   Consultor        │
│   Inmobiliario     │
│   Senior           │
│                    │
│   Ya sé en qué     │
│   áreas activar    │
│   mi potencial.    │
│                    │
│   ¿Cuál es tu      │
│   Perfil IA?       │
│                    │
│   ▶ Desliza para   │
│   descubrir        │
│                    │
│   airoleanalyzer   │
│   .com             │
│                    │
└────────────────────┘
```

---

## Implementación técnica

### Tecnología: @vercel/og (Satori)
Edge function en Vercel que genera imágenes PNG a partir de JSX.
Es instantáneo (~50-200ms), cacheable, y no requiere headless browser.

### Endpoint: GET /api/og/[slug]
```typescript
// src/app/api/og/[slug]/route.ts
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request, { params }) {
  const { slug } = params;
  const { searchParams } = new URL(request.url);
  
  const role = searchParams.get('role') || 'Profesional';
  const archetype = searchParams.get('archetype') || 'accelerated';
  const multiplier = searchParams.get('multiplier') || '2.0';
  const format = searchParams.get('format') || 'linkedin';
  
  const width = format === 'story' ? 1080 : 1200;
  const height = format === 'story' ? 1920 : 627;
  
  // Cargar fuentes custom
  const fontDisplay = await fetch(new URL('/public/fonts/ClashDisplay-Bold.woff', import.meta.url))
    .then(res => res.arrayBuffer());
  
  return new ImageResponse(
    // JSX que define el layout de la card
    <ShareCardLayout
      role={role}
      archetype={archetype}
      multiplier={multiplier}
      format={format}
    />,
    {
      width,
      height,
      fonts: [{ name: 'ClashDisplay', data: fontDisplay, weight: 700 }],
      headers: { 'Cache-Control': 'public, max-age=86400' },
    }
  );
}
```

### Meta tags OG (en la página de resultado)
```html
<meta property="og:title" content="Mi Perfil IA: El Conector · 2.8×" />
<meta property="og:description" content="Ya sé en qué áreas activar mi potencial como Consultor Inmobiliario. ¿Cuál es tu Perfil IA?" />
<meta property="og:image" content="https://airoleanalyzer.com/api/og/consultor-inmobiliario-senior?role=Consultor+Inmobiliario+Senior&archetype=connector&multiplier=2.8" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="627" />
<meta name="twitter:card" content="summary_large_image" />
```

---

## Flujo de compartir

### 1. Usuario toca "Compartir mi Perfil IA"
### 2. Se muestra sheet con opciones:
- **LinkedIn:** Abre share dialog de LinkedIn con URL + texto precargado
  ```
  URL: https://airoleanalyzer.com/resultado/{slug}?ref=linkedin
  Texto: "Mi Perfil IA como {rol}: {arquetipo}, {multiplier}× de potencial 
  de amplificación. Ya sé en qué áreas activarlo. ¿Cuál es el tuyo? 
  👉 airoleanalyzer.com"
  ```
- **WhatsApp:** Abre WhatsApp con mensaje + link
- **X/Twitter:** Abre tweet con texto + link
- **Copiar enlace:** Copia URL al clipboard con toast de confirmación
- **Descargar imagen:** Descarga la card como PNG para subir manualmente

### 3. Tracking
Registrar evento de share con: plataforma, rol, arquetipo.
Medir: shares por resultado, clicks desde shares (ref parameter), conversión
de share-click a nuevo análisis.
