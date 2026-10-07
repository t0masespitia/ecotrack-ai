# EcoTrack AI

EcoTrack AI estima de forma educativa la huella de carbono diaria de un pequeno negocio a partir de una descripcion en lenguaje natural.

## Parser hibrido

La aplicacion usa `POST /api/analyze` como unico punto de entrada. El flujo es:

1. Valida el texto recibido.
2. Intenta interpretar la actividad con IA si `OPENAI_API_KEY` esta configurada.
3. Valida la salida estructurada de la IA.
4. Si la IA no esta disponible o devuelve datos invalidos, usa el parser local.
5. Calcula emisiones con la logica existente en `lib/emissions.ts`.
6. Genera explicacion y recomendaciones con la logica existente.

La IA solo extrae datos estructurados. No calcula emisiones, porcentajes, factores ni recomendaciones.

## Modo IA

Para activar interpretacion con IA, crea `.env.local`:

```bash
OPENAI_API_KEY=tu_clave
```

Luego ejecuta:

```bash
npm run dev
```

El modelo usado para extraccion esta centralizado en `lib/ai-parser.ts` como `OPENAI_ACTIVITY_MODEL`. Se puede cambiar con la variable opcional `OPENAI_ACTIVITY_MODEL`.

## Fallback local

La aplicacion funciona sin API externa. Si `OPENAI_API_KEY` no existe, el parser local existente interpreta el texto.

Tambien se usa fallback local cuando:

- el proveedor no responde;
- ocurre timeout;
- la respuesta no es JSON valido;
- la estructura devuelta es invalida;
- aparece un tipo de vehiculo no soportado;
- ocurre cualquier error inesperado durante la extraccion.

La respuesta de `/api/analyze` incluye `parserSource: "ai"` o `parserSource: "local"` dentro de `data` para fines academicos.

## Ejecutar sin API

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Ejecutar con API

```bash
cp .env.example .env.local
```

Edita `.env.local`, agrega `OPENAI_API_KEY` y ejecuta:

```bash
npm run dev
```

No uses variables `NEXT_PUBLIC_*` para secretos.

## Privacidad

EcoTrack AI no guarda textos enviados por usuarios y no implementa persistencia. Cuando el modo IA esta activo, el texto se envia al proveedor de IA solo para extraer datos estructurados.

## Nota sobre estimaciones

Los resultados son estimaciones educativas basadas en factores de emision simplificados. No sustituyen una auditoria ambiental profesional.

## Verificacion

```bash
npm run typecheck
npm run verify:logic
npm run build
```
