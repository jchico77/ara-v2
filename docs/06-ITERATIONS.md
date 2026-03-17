# 06 — Plan de Iteraciones

## Filosofía
Cada iteración entrega algo funcional que se puede probar. El usuario (Javier)
prueba después de cada iteración y da feedback antes de continuar. No se
avanza a la siguiente iteración sin validación.

---

## Iteración 1: Skeleton funcional (Día 1)
**Objetivo:** App Next.js desplegada en Vercel con flujo completo hardcodeado.

### Tareas
1. Inicializar proyecto Next.js 15 con App Router + Tailwind CSS v4 + Framer Motion
2. Configurar estructura de archivos según 00-ARCHITECTURE.md
3. Crear layout raíz con tipografías y colores base (tema oscuro)
4. Implementar página landing (Hero + input de rol + botones de ejemplo)
5. Implementar página de resultado con datos HARDCODEADOS para 3 roles:
   - "Product Manager" (arquetipo: Orquestador, multiplier: 3.1)
   - "Abogado corporativo" (arquetipo: Estratega, multiplier: 2.2)
   - "Data Analyst" (arquetipo: Acelerado, multiplier: 4.1)
6. Implementar secuencia de loading animada (3 pasos)
7. Implementar revelación progresiva del resultado (arquetipo → multiplicador → bloques)
8. Implementar drawer de detalle de bloque (sin cursos aún)
9. Desplegar en Vercel

### Datos hardcodeados (para los 3 roles)
Incluir en un archivo `data/mock-catalog.json` con la estructura completa
definida en 02-RUNTIME-API.md. Usar datos inventados pero realistas,
siguiendo la lógica de arquetipos y multiplicadores de 00-ARCHITECTURE.md.
Los bloques deben tener 6 items con categorías mixtas (2 presión, 2 transformación, 2 ventaja).

### Criterio de validación
- [ ] Se puede escribir uno de los 3 roles y ver el resultado completo
- [ ] La animación de loading funciona y se siente como experiencia
- [ ] La revelación progresiva funciona (arquetipo → multiplicador → bloques)
- [ ] El drawer de detalle se abre y cierra correctamente
- [ ] Funciona en móvil (375px) y desktop (1200px)
- [ ] El diseño se siente moderno, editorial, y diferente a una app genérica

### PARAR AQUÍ para validación de Javier
Foco del feedback: ¿el diseño visual engancha? ¿La secuencia de revelación
funciona emocionalmente? ¿Los arquetipos se entienden y resultan atractivos?

---

## Iteración 2: API con LLM + catálogo mínimo (Día 2)
**Objetivo:** El usuario escribe cualquier rol y recibe un resultado real.

### Tareas
1. Crear catálogo precalculado con 30 roles (6 por arquetipo)
   - Descargar datos de O*NET para esos 30 roles
   - Cruzar con Anthropic Economic Index si hay datos
   - Calcular scores y asignar arquetipos manualmente con ayuda de LLM
   - Generar archivo data/catalog.json
2. Implementar API route POST /api/analyze:
   - Paso 1: Llamada a Claude Sonnet 4.6 para mapear input → rol del catálogo
   - Paso 2: Recuperar datos precalculados
   - Paso 3: Llamada a Claude Sonnet 4.6 para generar narrativas personalizadas
   - Paso 4: Calcular multiplicador y confirmar arquetipo
3. Conectar frontend con API real (reemplazar datos hardcodeados)
4. Implementar estado de error (si el rol no se puede mapear)
5. Implementar caché de resultados (si el mismo rol se consulta 2 veces, no recalcular)

### Criterio de validación
- [ ] Escribir 10 roles diferentes y obtener resultados coherentes
- [ ] El mapeo a roles del catálogo es sensato (verificar manualmente)
- [ ] Las narrativas generadas son específicas, no genéricas
- [ ] La latencia total es <5 segundos
- [ ] Roles no cubiertos dan un resultado razonable (match al más cercano)

### PARAR AQUÍ para validación de Javier
Foco: ¿los resultados son creíbles? ¿Las narrativas suenan a que conocen
el rol? ¿Los arquetipos asignados tienen sentido?

---

## Iteración 3: Sistema de share (Día 3)
**Objetivo:** El usuario puede compartir su Perfil IA en LinkedIn.

### Tareas
1. Implementar edge function GET /api/og/[slug] para generar imagen OG
   - Usar @vercel/og (Satori) para generar PNG
   - Diseñar card para LinkedIn (1200×627) con: arquetipo, multiplicador, rol, CTA
   - Diseñar card para Stories (1080×1920)
2. Añadir meta tags OG en la página de resultado
3. Implementar componente ShareButton con opciones:
   - LinkedIn (share dialog con URL + texto precargado)
   - WhatsApp (mensaje con link)
   - Copiar enlace
   - Descargar imagen
4. Implementar landing de share (cuando alguien abre un enlace compartido):
   - Muestra datos del share (arquetipo + multiplicador del autor)
   - CTA prominente para analizar el propio rol
5. Añadir tracking básico de eventos de share

### Criterio de validación
- [ ] Compartir en LinkedIn genera preview correcto con imagen
- [ ] La card es visualmente atractiva y legible en mobile
- [ ] El enlace compartido lleva a una landing que convierte
- [ ] WhatsApp muestra preview correcto
- [ ] La imagen descargada tiene calidad suficiente para subir manualmente

### PARAR AQUÍ para validación de Javier
Foco: ¿la card es algo que TÚ compartirías en LinkedIn?
¿El mensaje proyecta lo que queremos (proactividad, visión, no vulnerabilidad)?

---

## Iteración 4: Cursos y monetización (Día 4)
**Objetivo:** Cada bloque tiene cursos recomendados con enlaces de afiliados.

### Tareas
1. Crear catálogo inicial de ~50 cursos (data/courses.json)
   - 10 cursos transversales de IA
   - 40 cursos por sector/función
   - Con enlaces de afiliado (o placeholder si aún no hay cuenta)
2. Implementar lógica de matching bloque → cursos (lib/courses.ts)
3. Implementar componente CourseCard dentro del drawer de detalle
4. Implementar framing contextualizado (diferentes pitches según categoría del bloque)
5. Añadir tracking de course_impression y course_click

### Criterio de validación
- [ ] Cada bloque muestra 1-2 cursos relevantes
- [ ] El framing del curso se siente natural, no publicitario
- [ ] Los enlaces de afiliado funcionan y redirigen correctamente
- [ ] El tracking registra impresiones y clics

### PARAR AQUÍ para validación de Javier
Foco: ¿los cursos recomendados son relevantes? ¿El framing convence?
¿Harías clic?

---

## Iteración 5: Catálogo completo + pulido (Día 5-7)
**Objetivo:** 200 roles en el catálogo, UX pulida, listo para lanzar.

### Tareas
1. Expandir catálogo a 200 roles:
   - Script Python que descarga datos de O*NET en batch
   - Cruza con Anthropic Economic Index
   - LLM genera scores y asigna arquetipos para roles sin datos observacionales
   - Validación manual spot-check (20 roles)
2. Añadir autocomplete en el input (sugerencias del catálogo mientras escribes)
3. Implementar LinkedIn OAuth (opcional, para enriquecer análisis con perfil)
4. Pulir animaciones y transiciones
5. Pulir mobile: verificar en iPhone SE, iPhone 15, Samsung Galaxy S24
6. Optimizar rendimiento: lazy loading, image optimization, Lighthouse score >90
7. Añadir página de "metodología" (footer link, para credibilidad)
8. Configurar dominio custom
9. Configurar Vercel Analytics

### Criterio de validación
- [ ] 200 roles disponibles con resultados coherentes
- [ ] Autocomplete funciona y es rápido
- [ ] Lighthouse mobile score >90
- [ ] No hay errores en iOS Safari ni Chrome Android
- [ ] La experiencia completa (input → resultado → share) tarda <6 segundos

---

## Iteración 6: Lanzamiento y métricas (Día 8+)
**Objetivo:** Lanzar, medir, iterar.

### Tareas
1. Crear 3-5 posts de lanzamiento en LinkedIn (Javier los publica)
2. Monitorizar métricas:
   - Análisis completados por día
   - Tasa de share (shares / análisis)
   - Click-through rate en cursos
   - Roles más buscados (para priorizar expansión del catálogo)
   - Tasa de conversión de share-link → nuevo análisis
3. Basándose en datos, decidir:
   - ¿Expandir catálogo a 500 roles?
   - ¿Añadir más cursos por bloque?
   - ¿Cambiar framing de la card de share?
   - ¿Añadir funcionalidad de comparación entre roles?
   - ¿Añadir "evolución" (re-analizar en 3 meses y ver cómo ha cambiado)?

---

## Notas para el agente implementador

### Prioridades
1. **Diseño > Funcionalidad.** Prefiere una app bonita con pocos roles a una
   app fea con 500 roles. La primera impresión es TODO en B2C viral.
2. **Mobile > Desktop.** Si algo no funciona en mobile, no funciona.
3. **Velocidad > Completitud.** Si una feature tarda más de medio día,
   simplificarla y seguir. Se itera después.

### Dependencias de Javier
- Claves API: Anthropic API key, cuentas de afiliados (Udemy, Coursera)
- Dominio: elegir y configurar dominio
- LinkedIn OAuth: Client ID y Secret si se implementa login
- Contenido: validar arquetipos, multiplicadores y narrativas de prueba

### Lo que NO hacer
- No implementar backend persistente (no necesita Postgres, Redis, etc.)
- No implementar autenticación de usuarios (excepto LinkedIn OAuth opcional)
- No implementar sistema de pagos
- No implementar admin panel (editar catálogo editando JSON directamente)
- No sobreoptimizar el LLM prompt antes de tener datos de uso real
