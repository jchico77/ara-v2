# AI Capability Map — Marzo 2026
# Documento de referencia para evaluación de exposición de tareas profesionales a IA
# Versión: 2026-Q1 | Última actualización: 2026-03-17

## Propósito
Este documento describe las capacidades demostradas de la IA a marzo de 2026,
organizadas por tipo de capacidad. Se usa como contexto inyectado al LLM
cuando evalúa la exposición de tareas profesionales. No es una lista de productos;
es un mapa de lo que la tecnología PUEDE hacer hoy con calidad profesional.

Actualizar trimestralmente. Cada capacidad incluye nivel de madurez:
- PRODUCCIÓN: calidad profesional, uso extendido en empresas
- AVANZADO: funcional y fiable, adopción creciente
- EMERGENTE: funcional pero con limitaciones, adopción temprana
- EXPERIMENTAL: demostraciones prometedoras, no fiable para producción

---

## 1. PROCESAMIENTO Y GENERACIÓN DE TEXTO

### 1.1 Redacción y edición profesional [PRODUCCIÓN]
- Genera texto de calidad publicable en cualquier formato: emails, informes,
  artículos, propuestas comerciales, contratos, presentaciones, posts.
- Adapta tono, registro, audiencia y longitud por instrucción.
- Edita, corrige, reformula y sintetiza textos existentes.
- Traduce entre idiomas principales con calidad cercana a traductor profesional.
- Limitación: puede generar contenido plausible pero incorrecto ("alucinaciones").
  Requiere supervisión humana para contenido factual crítico.

### 1.2 Análisis y síntesis de documentos [PRODUCCIÓN]
- Resume documentos de hasta 1M tokens (~700.000 palabras / ~1.500 páginas).
- Extrae datos estructurados de documentos no estructurados (PDFs, contratos,
  informes escaneados, facturas, formularios).
- Compara múltiples documentos identificando diferencias, inconsistencias y patrones.
- Responde preguntas sobre el contenido de documentos cargados.
- Procesa documentos en cualquier idioma principal.

### 1.3 Razonamiento y análisis [AVANZADO]
- Razonamiento multi-paso: descompone problemas complejos en pasos lógicos.
- Modelos "thinking" / "reasoning" que muestran cadena de pensamiento.
- Resuelve problemas matemáticos, lógicos y de optimización de complejidad media-alta.
- Evalúa argumentos, detecta falacias y genera contraargumentos.
- Limitación: puede fallar en razonamiento muy largo (>15 pasos encadenados)
  o en problemas que requieren conocimiento especializado no presente en el training.

---

## 2. PROGRAMACIÓN Y DESARROLLO DE SOFTWARE

### 2.1 Generación de código [PRODUCCIÓN]
- Genera código funcional en todos los lenguajes principales (Python, JS/TS,
  Java, C#, Go, Rust, SQL, etc.) a partir de instrucciones en lenguaje natural.
- Genera aplicaciones completas (frontend + backend + base de datos) con guía mínima.
- Integrado en IDEs como asistente en tiempo real (autocompletado, sugerencias,
  refactoring, generación de tests).
- Genera scripts de automatización, pipelines de datos, y configuraciones de infra.

### 2.2 Debugging y mantenimiento [AVANZADO]
- Identifica y corrige bugs en código existente.
- Explica código ajeno y sugiere mejoras.
- Genera tests unitarios y de integración automáticamente.
- Revisa pull requests identificando problemas de seguridad, rendimiento y estilo.
- Limitación: en sistemas muy grandes o con estados complejos, puede perder contexto.

### 2.3 Agentes de coding autónomos [AVANZADO]
- Agentes que reciben una tarea ("implementa feature X") y generan código,
  ejecutan tests, iteran sobre errores, y entregan resultado funcional.
- Operan en sesiones de 30-60 minutos sin supervisión.
- Pueden coordinar múltiples sub-agentes para tareas paralelas.
- Limitación: requieren revisión humana del resultado. No son fiables para
  decisiones arquitectónicas o cambios que afectan múltiples sistemas.

---

## 3. DATOS Y ANÁLISIS

### 3.1 Análisis de datos tabulares [PRODUCCIÓN]
- Analiza hojas de cálculo y datasets mediante instrucciones en lenguaje natural.
- Genera fórmulas, pivots, filtros y transformaciones en Excel/Google Sheets.
- Integración nativa: plugins de IA en Excel y Google Sheets que operan
  directamente sobre los datos del usuario.
- Ejecuta código Python/R para análisis estadístico bajo demanda.

### 3.2 Visualización de datos [PRODUCCIÓN]
- Genera gráficos y dashboards a partir de datos + instrucciones en texto.
- Copilots en herramientas de BI (Power BI, Tableau) que crean visualizaciones
  por consulta en lenguaje natural.
- Genera informes visuales completos con narrativa integrada.

### 3.3 Modelado predictivo y ML [AVANZADO]
- AutoML: genera, entrena y evalúa modelos de machine learning con datos
  proporcionados por el usuario, con mínima configuración.
- Detecta patrones, anomalías y correlaciones en datasets grandes.
- Genera forecasts de series temporales.
- Limitación: la interpretación de resultados y la decisión de qué modelo
  usar para qué problema sigue requiriendo criterio humano experto.

---

## 4. BÚSQUEDA, INVESTIGACIÓN Y KNOWLEDGE MANAGEMENT

### 4.1 Búsqueda y síntesis de información [PRODUCCIÓN]
- Busca en internet en tiempo real y sintetiza resultados de múltiples fuentes.
- Deep research: investigaciones autónomas de 15-45 minutos que generan
  informes estructurados con fuentes citadas.
- Busca y sintetiza información en bases de conocimiento internas (documentos
  corporativos, wikis, emails, Slack).

### 4.2 RAG (Retrieval-Augmented Generation) [PRODUCCIÓN]
- Sistemas que combinan búsqueda en bases de datos/documentos propios con
  generación de respuestas contextualizadas.
- Permiten a la IA "conocer" información corporativa privada sin reentrenamiento.
- Integrados en chatbots de atención al cliente, asistentes internos, y
  herramientas de compliance.

---

## 5. IMAGEN, VÍDEO, AUDIO Y MULTIMODALIDAD

### 5.1 Generación de imágenes [PRODUCCIÓN]
- Genera imágenes fotorrealistas y artísticas a partir de texto.
- Estilos controlables: fotografía, ilustración, 3D, arquitectónico, médico, técnico.
- Edición de imágenes existentes por instrucción (inpainting, outpainting,
  cambio de estilo, eliminación de elementos).
- Genera variaciones, consistencia de personajes, y series de imágenes coherentes.
- Resolución profesional para impresión y publicación.

### 5.2 Generación y edición de vídeo [AVANZADO]
- Genera clips de vídeo (5-60 segundos) a partir de texto o imagen.
- Edición de vídeo por instrucciones: cortes, transiciones, corrección de color,
  eliminación de elementos, cambio de fondo.
- Genera vídeos explicativos con avatares sintéticos.
- Limitación: coherencia temporal en vídeos largos (>60s) sigue siendo imperfecta.
  No sustituye producción profesional completa pero acelera enormemente preproducción.

### 5.3 Audio y voz [PRODUCCIÓN]
- Text-to-speech con voces indistinguibles de humanas, en múltiples idiomas.
- Clonación de voz con pocos segundos de muestra.
- Transcripción de audio/vídeo con >95% precisión en idiomas principales.
- Generación de música y efectos de sonido por instrucción.
- Traducción simultánea en tiempo real con voz sintetizada.

### 5.4 Comprensión multimodal [AVANZADO]
- Los modelos procesan texto, imágenes, audio y vídeo como input simultáneo.
- Analizan capturas de pantalla, fotos de documentos, gráficos, planos, diagramas.
- Describen, clasifican y extraen información de contenido visual.
- Responden preguntas sobre contenido audiovisual.

---

## 6. AGENTES Y AUTOMATIZACIÓN

### 6.1 Agentes de navegación web [AVANZADO]
- Agentes que navegan sitios web, rellenan formularios, hacen búsquedas,
  extraen datos, y completan workflows multi-paso en el navegador.
- Usan visión (capturas de pantalla) + acción (clicks, texto) para operar
  interfaces diseñadas para humanos.
- Limitación: fiabilidad ~70-85% en tareas complejas. Requieren supervisión.

### 6.2 Computer use / Desktop agents [AVANZADO]
- Agentes que controlan el escritorio del usuario: abren aplicaciones,
  navegan menús, copian datos entre aplicaciones, ejecutan workflows.
- Operan sobre cualquier software que tenga interfaz gráfica.
- Limitación: más lentos que APIs directas. Útiles cuando no hay API disponible.

### 6.3 Agentes de workflow / orquestación [AVANZADO]
- Plataformas que permiten encadenar múltiples herramientas de IA en workflows:
  "cuando llega un email de tipo X, extraer datos, buscar en CRM, generar
  respuesta, enviar borrador para aprobación".
- Integración con herramientas empresariales (CRM, ERP, email, calendario,
  gestión de proyectos).
- Multi-agente: múltiples agentes especializados coordinados por un orquestador.
- Limitación: configuración no trivial. Los errores se propagan en cadena.

### 6.4 RPA inteligente [PRODUCCIÓN]
- Automatización de procesos repetitivos en aplicaciones empresariales
  potenciada por IA: procesamiento de facturas, reconciliación, data entry,
  generación de informes periódicos, compliance checks.
- Combina reglas fijas con IA para manejar excepciones y variaciones.

---

## 7. INTERACCIÓN Y COMUNICACIÓN

### 7.1 Chatbots y asistentes conversacionales [PRODUCCIÓN]
- Chatbots que resuelven consultas de clientes con calidad comparable a
  agentes humanos en L1/L2 (preguntas frecuentes, gestión de cuentas,
  troubleshooting guiado, procesamiento de solicitudes).
- Mantienen contexto en conversaciones multi-turno.
- Escalan a humanos cuando detectan complejidad o frustración.
- Multicanal: web, app, WhatsApp, teléfono (con voz sintetizada).

### 7.2 Asistentes de productividad integrados [PRODUCCIÓN]
- Copilots integrados en suites de oficina (Microsoft 365, Google Workspace):
  resumen emails, generan borradores de respuesta, crean presentaciones
  a partir de documentos, preparan reuniones, toman notas de llamadas.
- Integración con calendario, email, chat, documentos compartidos.
- Generan actas de reuniones con action items automáticamente.

### 7.3 Asistentes de voz [AVANZADO]
- Agentes que atienden llamadas telefónicas con voz natural.
- Gestionan reservas, citas, consultas y soporte básico por teléfono.
- Limitación: manejo de situaciones emocionales complejas o ambiguas
  sigue siendo inferior a humanos.

---

## 8. DOMINIOS ESPECIALIZADOS

### 8.1 Legal [AVANZADO]
- Revisión de contratos: identifica cláusulas de riesgo, compara con estándares,
  sugiere modificaciones.
- Investigación legal: busca jurisprudencia y normativa relevante.
- Due diligence automatizada.
- Limitación: no sustituye juicio legal ni firma profesional.
  Accountability sigue siendo humana.

### 8.2 Financiero [AVANZADO]
- Análisis financiero: ratios, valoraciones, modeling, comparables.
- Generación de informes financieros y reportes regulatorios.
- Detección de fraude y anomalías en transacciones.
- Limitación: decisiones de inversión, asesoramiento y firma siguen
  requiriendo profesional regulado.

### 8.3 Sanitario [EMERGENTE]
- Asistente de diagnóstico: sugiere diagnósticos diferenciales basados en síntomas.
- Análisis de imágenes médicas (radiología, dermatología, patología).
- Generación de informes clínicos y resúmenes de historial.
- Limitación: regulación estricta. No sustituye diagnóstico médico.
  Requiere validación clínica y responsabilidad profesional.

### 8.4 Educación y formación [AVANZADO]
- Tutores personalizados que adaptan contenido al nivel del alumno.
- Generación de material didáctico, exámenes, ejercicios.
- Corrección automática con feedback detallado.
- Simulaciones y role-play para formación profesional.

### 8.5 Diseño y creatividad [AVANZADO]
- Generación de conceptos visuales, mockups, wireframes, logos.
- Prototipado rápido de interfaces.
- Asistencia en diseño arquitectónico e industrial (renders, iteraciones).
- Generación de música, jingles y diseño sonoro.
- Limitación: dirección creativa, coherencia de marca y juicio estético
  siguen siendo humanos.

### 8.6 Ingeniería y ciencias [AVANZADO]
- Asistente en diseño CAD/CAE con sugerencias y optimización.
- Análisis y simulación de datos experimentales.
- Revisión de literatura científica y síntesis de estado del arte.
- Generación de código para simulaciones y modelado.
- Limitación: validación de resultados en ingeniería requiere
  firma profesional y responsabilidad legal.

---

## 9. BARRERAS TRANSVERSALES A LA AUTOMATIZACIÓN

Estas barreras reducen la exposición real de una tarea incluso cuando
la capacidad técnica existe:

### 9.1 Accountability / Responsabilidad legal
- Profesiones reguladas (medicina, derecho, ingeniería, auditoría,
  contabilidad) requieren firma y responsabilidad personal humana.
- El EU AI Act (2024) exige supervisión humana en sistemas de IA de alto riesgo.
- Efecto neto: convierte automatización potencial en aumentación obligada.

### 9.2 Confianza relacional
- Servicios de alto valor donde la relación personal es parte del producto
  (consultoría estratégica, banca privada, ventas B2B enterprise,
  terapia, coaching, gestión de conflictos).
- Estudios muestran que 64% de clientes prefiere no interactuar con IA
  en servicio al cliente (Gartner 2023).
- La empatía percibida como inauténtica puede reducir satisfacción.

### 9.3 Fisicalidad / Presencia
- Tareas que requieren presencia física, destreza manual, o interacción
  con el mundo físico (construcción, cirugía, hostelería, logística física).
- La robótica con IA avanza pero está lejos de la versatilidad humana
  en entornos no controlados.

### 9.4 Confidencialidad y compliance
- Restricciones regulatorias o contractuales sobre qué datos pueden
  procesarse con IA externa (GDPR, datos sanitarios, secreto profesional).
- Algunas organizaciones prohíben uso de IA para ciertos tipos de información.

### 9.5 Fiabilidad insuficiente
- Tareas donde el error tiene consecuencias graves e irreversibles y
  la IA aún no alcanza fiabilidad suficiente para operar sin supervisión.
- "Confidencialmente incorrecto": la IA produce outputs incorrectos con
  alta confianza aparente, especialmente en dominios especializados.

---

## NOTAS DE MANTENIMIENTO

- Este documento se actualiza trimestralmente (Q1: marzo, Q2: junio, Q3: sept, Q4: dic).
- Cada actualización debe reflejar:
  - Nuevas capacidades que pasan de EMERGENTE a AVANZADO o PRODUCCIÓN
  - Nuevas categorías de capacidad no cubiertas
  - Cambios en barreras regulatorias (nuevas leyes, sentencias relevantes)
- No incluir nombres de productos. Describir capacidades genéricas.
- Fuentes principales para actualización:
  - Anthropic Economic Index (trimestral)
  - State of AI Report (anual)
  - AI Index Report de Stanford HAI (anual)
  - Announcements de capacidades de los labs principales
