# 🌱 EcoTrack AI

## Proyecto Integrador Capstone: De la Idea a la Realidad con Vibe Coding

EcoTrack AI es un Producto Mínimo Viable (MVP) desarrollado como proyecto Capstone de **Vibe Coding**.

El objetivo del proyecto es demostrar cómo un desarrollador puede utilizar herramientas de Inteligencia Artificial para diseñar, construir, depurar y validar una aplicación funcional mediante instrucciones de lenguaje natural, concentrándose principalmente en la arquitectura, la intención del producto y la experiencia del usuario.

---

# 1. Enlace al Repositorio o Proyecto Vivo

Repositorio de GitHub:

https://github.com/t0masespitia/ecotrack-ai

---

# 2. Descripción del Proyecto

EcoTrack AI es una aplicación web diseñada para ayudar a pequeños negocios a calcular de forma simplificada una estimación de su huella de carbono.

En lugar de utilizar formularios técnicos complejos, el usuario puede describir sus actividades utilizando lenguaje natural.

Ejemplo:

> Hoy consumimos 200 kWh de electricidad y usamos 5 camionetas de reparto que recorrieron 40 km cada una.

EcoTrack AI analiza el texto, identifica las actividades relevantes y genera:

- estimación total de emisiones en kg CO₂e;
- desglose por categoría;
- porcentaje de impacto;
- explicación de resultados;
- recomendaciones ambientales.

---

# 3. Problema

Los pequeños negocios normalmente no cuentan con conocimientos especializados en sostenibilidad o cálculo de emisiones.

Las herramientas tradicionales pueden requerir:

- formularios complejos;
- conocimientos técnicos;
- factores de emisión;
- cálculos manuales;
- múltiples campos de entrada.

EcoTrack AI simplifica este proceso permitiendo utilizar lenguaje natural.

---

# 4. Usuario Objetivo

EcoTrack AI está dirigido principalmente a:

- pequeños negocios;
- restaurantes;
- tiendas;
- oficinas;
- comercios;
- empresas de domicilios;
- talleres;
- pequeñas empresas de servicios.

---

# 5. Objetivo del MVP

El usuario debe poder:

1. ingresar a EcoTrack AI;
2. describir las actividades de su negocio;
3. enviar el texto para análisis;
4. permitir que el sistema interprete la información;
5. convertir el texto en datos estructurados;
6. calcular emisiones estimadas;
7. visualizar la huella total;
8. visualizar el desglose;
9. recibir una explicación;
10. recibir recomendaciones.

---

# 6. Tecnologías Utilizadas

El proyecto utiliza:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Next.js App Router
- API Routes
- OpenAI Responses API
- JSON Schema / Structured Outputs
- Git
- GitHub
- Codex como agente de programación

---

# 7. Metodología de Vibe Coding

El proyecto fue desarrollado utilizando una metodología de **Vibe Coding**.

En lugar de programar manualmente cada línea, el proceso se centró en:

1. definir el problema;
2. definir la experiencia deseada;
3. escribir prompts detallados;
4. utilizar Codex como agente de desarrollo;
5. revisar las propuestas de arquitectura;
6. aprobar cada fase antes de continuar;
7. ejecutar pruebas;
8. utilizar IA para debugging;
9. iterar mediante lenguaje natural.

El flujo seguido fue:

```text
Idea
 ↓
Definición del producto
 ↓
Master Prompt
 ↓
Propuesta de arquitectura de Codex
 ↓
Revisión humana
 ↓
Implementación por fases
 ↓
Pruebas
 ↓
Debugging con IA
 ↓
MVP funcional
```

---

# 8. Arquitectura General

La aplicación utiliza una arquitectura sencilla y desacoplada.

```text
Usuario
   ↓
Frontend Next.js / React
   ↓
POST /api/analyze
   ↓
Validación de entrada
   ↓
Parser híbrido
   │
   ├── Parser mediante IA
   │
   └── Parser local como fallback
   ↓
Datos estructurados
   ↓
Motor de emisiones
   ↓
Explicaciones y recomendaciones
   ↓
Dashboard
```

---

# 9. Arquitectura de Carpetas

La estructura principal del proyecto es:

```text
app/
├── api/
│   └── analyze/
│       └── route.ts
├── layout.tsx
└── page.tsx

components/
├── InputForm.tsx
├── ResultsDashboard.tsx
├── EmissionCard.tsx
└── RecommendationCard.tsx

lib/
├── types.ts
├── parser.ts
├── ai-parser.ts
├── activity-parser.ts
├── emissions.ts
├── recommendations.ts
└── validation.ts

scripts/
├── verify-business-logic.ts
└── verify-hybrid-parser.ts
```

---

# 10. Funcionalidades Implementadas

EcoTrack AI incluye:

- entrada mediante lenguaje natural;
- reconocimiento de consumo eléctrico;
- reconocimiento de transporte;
- interpretación de cantidad de vehículos;
- interpretación de distancia;
- cálculo estimado de CO₂e;
- desglose de emisiones;
- porcentajes dinámicos;
- explicación automática;
- recomendaciones;
- validación de entradas;
- manejo de errores;
- parser local;
- arquitectura preparada para IA real;
- fallback automático;
- interfaz responsive.

---

# 11. Ejemplo de Funcionamiento

Entrada:

```text
Hoy consumimos 200 kWh de electricidad y usamos 5 camionetas que recorrieron 40 km cada una.
```

El sistema intenta interpretar:

```json
{
  "electricityKwh": 200,
  "vehicles": [
    {
      "type": "van",
      "quantity": 5,
      "distanceKmPerVehicle": 40
    }
  ]
}
```

Posteriormente el motor de emisiones realiza los cálculos utilizando factores centralizados.

---

# 12. Funcionalidad de Inteligencia Artificial Implementada

EcoTrack AI fue diseñado utilizando una arquitectura híbrida.

La Inteligencia Artificial NO realiza directamente el cálculo de emisiones.

Su responsabilidad es únicamente interpretar lenguaje natural y convertirlo en datos estructurados.

Ejemplo:

```text
"Utilizamos cinco camionetas y cada vehículo recorrió cuarenta kilómetros"
```

se transforma conceptualmente en:

```json
{
  "vehicles": [
    {
      "type": "van",
      "quantity": 5,
      "distanceKmPerVehicle": 40
    }
  ]
}
```

Después, el motor interno de EcoTrack AI realiza el cálculo de emisiones.

Esto permite separar:

```text
Interpretación mediante IA
        ↓
Datos estructurados
        ↓
Cálculo determinista
```

Esta decisión evita que el modelo de IA invente directamente valores de emisiones.

---

# 13. Arquitectura Híbrida y Fallback

EcoTrack AI puede utilizar dos estrategias de interpretación.

## Modo IA

Si existe una API Key válida y el servicio se encuentra disponible:

```text
Texto
 ↓
OpenAI
 ↓
Structured Output
 ↓
Validación
 ↓
Datos estructurados
```

## Modo Local

Si la IA no se encuentra disponible:

```text
Texto
 ↓
Parser local
 ↓
Datos estructurados
```

El fallback se activa cuando ocurre alguno de los siguientes casos:

- no existe API Key;
- timeout;
- error HTTP;
- respuesta inválida;
- estructura incorrecta;
- vehículo no soportado;
- error inesperado.

---

# 14. Parser Source

Para facilitar pruebas y documentación se implementó:

```text
parserSource
```

Puede tener los valores:

```text
"ai"
```

o:

```text
"local"
```

Esto permite identificar qué estrategia procesó la entrada.

---

# 15. Factores de Emisión

Los factores de emisión se encuentran centralizados.

Los cálculos siguen una lógica determinista.

## Electricidad

```text
Consumo kWh × Factor de electricidad
```

## Transporte

```text
Cantidad de vehículos
×
Distancia por vehículo
×
Factor del vehículo
```

Los valores son estimaciones educativas y pueden ser actualizados posteriormente utilizando fuentes oficiales.

---

# 16. Master Prompt Utilizado

El desarrollo comenzó utilizando un Master Prompt detallado.

Fragmento principal:

```text
Actúa como un ingeniero de software senior especializado en desarrollo web moderno,
arquitectura de aplicaciones, inteligencia artificial aplicada,
experiencia de usuario y construcción de MVPs.

Tu misión es construir un MVP funcional llamado EcoTrack AI.

EcoTrack AI es una aplicación web orientada a pequeños negocios.

Su objetivo es permitir que un usuario describa las actividades diarias de su
negocio mediante lenguaje natural y recibir una estimación simplificada de su
huella de carbono.

La aplicación debe utilizar:

- Next.js
- React
- TypeScript
- Tailwind CSS

Debe separar:

- interfaz;
- parsing;
- cálculo;
- tipos;
- configuración.

No debe implementar:

- autenticación;
- base de datos;
- pagos;
- microservicios;
- funcionalidades empresariales innecesarias.

Antes de escribir código:

1. resume lo que entendiste;
2. propone arquitectura;
3. estructura de carpetas;
4. tipos;
5. estrategia de parsing;
6. estrategia de cálculo;
7. riesgos técnicos;
8. mitigaciones.

No escribas código hasta recibir aprobación.
```

Este prompt permitió reducir errores y evitar sobrearquitectura.

---

# 17. Prompt Principal de Lógica de Negocio

Durante la segunda fase se utilizó un prompt enfocado únicamente en la lógica:

```text
Continúa con la FASE 2: implementación de lógica de negocio.

Implementa:

- tipos TypeScript;
- parser local;
- factores de emisión;
- cálculo;
- recomendaciones;
- validaciones;
- manejo de errores.

El parser debe reconocer electricidad y transporte.

No asumas valores que no aparezcan en el texto.

Si existe cantidad de vehículos pero no distancia, no calcular emisiones.

Si existe distancia pero no vehículo, no inventar uno.

La lógica no debe depender de React.

Antes de finalizar ejecutar:

npm run typecheck
npm run verify:logic
npm run build
```

---

# 18. Prompt Principal de Interfaz

Para el desarrollo visual se utilizó:

```text
Continúa con la FASE 3: construcción de la interfaz.

No modificar la lógica existente.

EcoTrack AI debe verse como un producto SaaS moderno orientado a sostenibilidad.

La interfaz debe incluir:

- header;
- hero;
- textarea;
- botón de análisis;
- estado de carga;
- dashboard;
- huella total;
- tarjetas por categoría;
- distribución porcentual;
- datos interpretados;
- análisis;
- recomendaciones;
- disclaimer.

Debe funcionar correctamente en móvil, tablet y escritorio.
```

---

# 19. Prompt Principal de Integración de IA

Para la integración híbrida se utilizó:

```text
Continúa con la FASE 4: integración de IA real.

La IA solo debe interpretar texto.

NO debe:

- calcular emisiones;
- decidir factores;
- generar porcentajes;
- calcular la huella total.

Debe existir un fallback local.

Si la IA falla, la aplicación debe continuar funcionando.

Usar OPENAI_API_KEY únicamente en servidor.

Validar la respuesta antes de enviarla al motor de emisiones.

Añadir parserSource: "ai" | "local".
```

---

# 20. Desarrollo Iterativo

El proyecto fue construido en diferentes fases.

## Fase 1 - Arquitectura

Se creó:

- estructura Next.js;
- App Router;
- TypeScript;
- Tailwind;
- API interna;
- componentes;
- tipos iniciales.

## Fase 2 - Lógica

Se implementó:

- parsing;
- cálculo;
- validaciones;
- recomendaciones;
- pruebas.

## Fase 3 - UI

Se implementó:

- interfaz SaaS;
- estados visuales;
- dashboard;
- responsive design.

## Fase 4 - IA

Se implementó:

- parser mediante IA;
- Structured Outputs;
- validación;
- timeout;
- fallback local;
- diagnóstico seguro.

---

# 21. Debugging con Inteligencia Artificial

Durante el desarrollo se presentaron problemas reales.

## Problema 1 - Vulnerabilidad en Next.js

Durante:

```bash
npm install
```

se detectó una vulnerabilidad crítica en la versión inicial de Next.js.

Codex ayudó a identificar el problema.

La solución fue actualizar Next.js a:

```text
Next.js 16.3.8
```

Posteriormente se ejecutó:

```bash
npm audit
```

y no quedaron vulnerabilidades críticas reportadas.

Después se verificó:

```bash
npm run typecheck
npm run verify:logic
npm run build
```

Resultado:

```text
OK
```

---

# 22. Debugging de la Integración de IA

Durante una prueba real de la API se observó:

```text
parserSource = "local"
```

y una duración aproximada de 6 segundos.

Inicialmente se sospechó un timeout.

Se agregó diagnóstico seguro.

La respuesta permitió identificar:

```json
{
  "fallbackReason": "http_error",
  "httpStatus": 429,
  "errorMessage": "You have no credits remaining."
}
```

La causa real fue falta de créditos disponibles en la API externa.

La arquitectura respondió correctamente utilizando el parser local.

Esto demostró que el fallback funciona correctamente.

Flujo observado:

```text
OpenAI API
 ↓
HTTP 429
 ↓
Fallback automático
 ↓
Parser local
 ↓
EcoTrack continúa funcionando
```

Este comportamiento evitó que una dependencia externa dejara inutilizable el MVP.

---

# 23. Pruebas Realizadas

Durante el desarrollo se ejecutaron:

```bash
npm run typecheck
```

Resultado:

```text
OK
```

```bash
npm run verify:logic
```

Resultado:

```text
OK
```

```bash
npm run build
```

Resultado:

```text
OK
```

---

# 24. Casos de Prueba

## Caso 1

```text
Hoy consumimos 200 kWh de electricidad.
```

Resultado:

- electricidad reconocida;
- cálculo ejecutado.

## Caso 2

```text
Usamos 5 camionetas y cada una recorrió 40 km.
```

Resultado:

- transporte reconocido;
- cantidad reconocida;
- distancia reconocida.

## Caso 3

```text
Hoy consumimos 200 kWh de electricidad y usamos 5 camionetas que recorrieron 40 km cada una.
```

Resultado:

- electricidad;
- transporte;
- cálculo combinado;
- porcentajes.

## Caso 4

```text
Hola, hoy trabajamos normalmente.
```

Resultado:

- mensaje de datos insuficientes.

## Caso 5

Entrada vacía.

Resultado:

- validation_error;
- mensaje amigable.

---

# 25. Manejo de Errores

La aplicación contempla:

- campo vacío;
- texto sin información suficiente;
- respuestas inválidas;
- fallos de la API;
- timeout;
- errores inesperados.

Los errores técnicos no son mostrados directamente al usuario.

---

# 26. Seguridad

EcoTrack AI sigue las siguientes medidas:

- API Key únicamente en servidor;
- `.env.local` excluido de Git;
- `.env.example` sin claves;
- no se exponen secretos con `NEXT_PUBLIC`;
- no se almacenan entradas del usuario;
- no existe persistencia de datos;
- validación antes del cálculo.

---

# 27. Variables de Entorno

El archivo:

```text
.env.local
```

puede contener:

```env
OPENAI_API_KEY=TU_API_KEY
```

Este archivo NO debe subirse al repositorio.

El repositorio incluye:

```text
.env.example
```

con:

```env
OPENAI_API_KEY=
```

---

# 28. Ejecución Local

Clonar:

```bash
git clone https://github.com/t0masespitia/ecotrack-ai.git
```

Entrar:

```bash
cd ecotrack-ai
```

Instalar:

```bash
npm install
```

Ejecutar:

```bash
npm run dev
```

Abrir:

```text
http://localhost:3000
```

---

# 29. Capturas de Pantalla del Proceso

## Captura 1 - Desarrollo con Codex

Añadir aquí captura del agente generando o modificando el proyecto.

```text
docs/captura-codex.png
```

## Captura 2 - EcoTrack AI funcionando

Añadir captura de la aplicación con:

```text
200 kWh
5 camionetas
40 km
```

```text
docs/captura-resultado.png
```

## Captura 3 - Iteración / Debugging

Añadir captura del proceso donde Codex analiza un error o realiza una corrección.

```text
docs/captura-debugging.png
```

## Captura 4 - Vista responsive

Añadir captura de la aplicación en resolución móvil.

```text
docs/captura-mobile.png
```

---

# 30. Reflexión sobre Vibe Coding

El desarrollo de EcoTrack AI permitió experimentar un cambio importante respecto al desarrollo tradicional.

En lugar de concentrarme exclusivamente en escribir sintaxis, mi función principal fue:

- definir qué debía construirse;
- establecer restricciones;
- decidir la arquitectura;
- revisar propuestas;
- detectar inconsistencias;
- diseñar prompts;
- validar resultados;
- realizar pruebas.

La Inteligencia Artificial permitió acelerar considerablemente la construcción del MVP.

Sin embargo, el proyecto también demostró que el desarrollador sigue siendo responsable de:

- definir correctamente el problema;
- evaluar las decisiones técnicas;
- controlar el alcance;
- verificar los resultados;
- identificar errores;
- asegurar la calidad del producto.

Por lo tanto, Vibe Coding no elimina el rol del ingeniero de software, sino que transforma su función hacia la dirección y orquestación de agentes inteligentes.

---

# 31. Limitaciones del MVP

La versión actual presenta limitaciones intencionales:

- factores de emisión simplificados;
- parser local limitado a determinados patrones;
- no existe autenticación;
- no existe base de datos;
- no existe historial;
- no existe persistencia;
- no constituye una auditoría ambiental;
- la integración externa de IA requiere disponibilidad del proveedor y créditos API.

Estas limitaciones corresponden al alcance definido para un MVP académico.

---

# 32. Cumplimiento de la Rúbrica

## Ejecución Técnica y Vibe Coding

✅ Aplicación funcional.

✅ Next.js + React + TypeScript.

✅ Desarrollo mediante prompts.

✅ Codex utilizado como agente.

✅ Desarrollo por fases.

✅ Debugging con IA.

✅ Validaciones y pruebas.

---

## Integración de Funcionalidades de IA

✅ Procesamiento de lenguaje natural.

✅ Parser híbrido.

✅ Integración preparada con OpenAI Responses API.

✅ Structured Outputs.

✅ Validación de resultados de IA.

✅ Fallback local.

✅ Motor de emisiones separado de la IA.

---

## Pensamiento Crítico y Documentación

✅ Master Prompt documentado.

✅ Prompts principales documentados.

✅ Arquitectura explicada.

✅ Desafíos técnicos explicados.

✅ Debugging documentado.

✅ Limitaciones reconocidas.

✅ Reflexión sobre Vibe Coding.

✅ Espacios para capturas del proceso.

---

# 33. Conclusión

EcoTrack AI demuestra cómo la metodología de Vibe Coding permite transformar una idea en un MVP funcional utilizando agentes de Inteligencia Artificial como copilotos de desarrollo.

El proyecto combina:

- lenguaje natural;
- arquitectura web moderna;
- procesamiento inteligente;
- cálculos deterministas;
- fallback;
- validaciones;
- testing;
- diseño responsive.

El resultado es una aplicación funcional orientada a pequeños negocios que permite estimar de manera simplificada su impacto ambiental.

---

## ⚠️ Disclaimer

Los resultados generados por EcoTrack AI son estimaciones simplificadas con fines educativos y demostrativos.

No sustituyen una auditoría, certificación o evaluación profesional de emisiones.
