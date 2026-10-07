import type {
  ParsedActivity,
  ParserDebugInfo,
  ParserFallbackReason,
  VehicleActivity,
  VehicleType,
} from "./types";

export const OPENAI_ACTIVITY_MODEL =
  process.env.OPENAI_ACTIVITY_MODEL ?? "gpt-4.1-mini";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const AI_TIMEOUT_MS = 15000;

const activityExtractionSystemPrompt = [
  "Actuas como extractor de datos operativos para EcoTrack AI.",
  "Responde solo con JSON compatible con la estructura solicitada.",
  "No expliques, no calcules emisiones, no calcules porcentajes y no inventes datos faltantes.",
  "Si un dato no aparece en el texto, omitelo.",
  "Respeta cantidades y unidades reportadas por el usuario.",
  "Normaliza vehiculos soportados: car, van, motorcycle, bus.",
].join(" ");

const activityExtractionSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    electricityKwh: {
      type: "number",
      description: "Consumo electrico en kWh, si aparece en el texto.",
    },
    vehicles: {
      type: "array",
      description: "Vehiculos reportados con distancia por vehiculo.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          type: {
            type: "string",
            enum: ["car", "van", "motorcycle", "bus"],
          },
          quantity: {
            type: "number",
          },
          distanceKmPerVehicle: {
            type: "number",
          },
        },
        required: ["type", "quantity", "distanceKmPerVehicle"],
      },
    },
  },
};

type RawAiVehicle = {
  type?: unknown;
  quantity?: unknown;
  distanceKmPerVehicle?: unknown;
};

type RawAiActivity = {
  electricityKwh?: unknown;
  vehicles?: unknown;
};

type OpenAIResponse = {
  output_text?: unknown;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: unknown;
    }>;
  }>;
};

export type AiExtractionResult =
  | {
      ok: true;
      activity: unknown;
      debug: ParserDebugInfo;
    }
  | {
      ok: false;
      debug: ParserDebugInfo & { fallbackReason: ParserFallbackReason };
    };

export type AiNormalizationResult =
  | {
      ok: true;
      parsedActivity: ParsedActivity;
    }
  | {
      ok: false;
      fallbackReason: "invalid_response" | "unsupported_vehicle";
    };

export async function extractActivityWithAi(
  text: string,
): Promise<unknown | undefined> {
  const result = await extractActivityWithAiResult(text);

  return result.ok ? result.activity : undefined;
}

export async function extractActivityWithAiResult(
  text: string,
): Promise<AiExtractionResult> {
  const startTime = Date.now();
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      ok: false,
      debug: {
        fallbackReason: "no_api_key",
        durationMs: 0,
        model: OPENAI_ACTIVITY_MODEL,
      },
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_ACTIVITY_MODEL,
        input: [
          {
            role: "system",
            content: activityExtractionSystemPrompt,
          },
          {
            role: "user",
            content: text,
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "business_activity_extraction",
            description:
              "Datos estructurados de actividad diaria para EcoTrack AI.",
            schema: activityExtractionSchema,
            strict: false,
          },
        },
        max_output_tokens: 400,
        temperature: 0,
        store: false,
      }),
      signal: controller.signal,
    });

    const durationMs = Date.now() - startTime;

    if (!response.ok) {
      return {
        ok: false,
        debug: {
          fallbackReason: "http_error",
          durationMs,
          model: OPENAI_ACTIVITY_MODEL,
          httpStatus: response.status,
          errorMessage: await readSafeErrorMessage(response),
        },
      };
    }

    const payload = (await response.json()) as OpenAIResponse;
    const outputText = getOutputText(payload);

    if (!outputText) {
      return {
        ok: false,
        debug: {
          fallbackReason: "invalid_response",
          durationMs,
          model: OPENAI_ACTIVITY_MODEL,
          httpStatus: response.status,
          errorMessage: "missing_output_text",
        },
      };
    }

    try {
      return {
        ok: true,
        activity: JSON.parse(outputText) as unknown,
        debug: {
          durationMs,
          model: OPENAI_ACTIVITY_MODEL,
          httpStatus: response.status,
        },
      };
    } catch (error) {
      return {
        ok: false,
        debug: {
          fallbackReason: "invalid_response",
          durationMs,
          model: OPENAI_ACTIVITY_MODEL,
          httpStatus: response.status,
          errorName: getErrorName(error),
          errorMessage: "invalid_json",
        },
      };
    }
  } catch (error) {
    const durationMs = Date.now() - startTime;

    return {
      ok: false,
      debug: {
        fallbackReason: isAbortError(error) ? "timeout" : "unexpected_error",
        durationMs,
        model: OPENAI_ACTIVITY_MODEL,
        errorName: getErrorName(error),
        errorMessage: sanitizeErrorMessage(error),
      },
    };
  } finally {
    clearTimeout(timeout);
  }
}

export function normalizeAiParsedActivity(
  rawActivity: unknown,
): ParsedActivity | undefined {
  const result = normalizeAiParsedActivityResult(rawActivity);

  return result.ok ? result.parsedActivity : undefined;
}

export function normalizeAiParsedActivityResult(
  rawActivity: unknown,
): AiNormalizationResult {
  if (!isRecord(rawActivity)) {
    return {
      ok: false,
      fallbackReason: "invalid_response",
    };
  }

  const raw = rawActivity as RawAiActivity;

  if (
    raw.electricityKwh !== undefined &&
    raw.electricityKwh !== null &&
    (!isFiniteNumber(raw.electricityKwh) || raw.electricityKwh < 0)
  ) {
    return {
      ok: false,
      fallbackReason: "invalid_response",
    };
  }

  const electricityKwh = normalizeElectricityKwh(raw.electricityKwh);
  const vehicles = normalizeVehicles(raw.vehicles);

  if (vehicles === undefined) {
    return {
      ok: false,
      fallbackReason: "unsupported_vehicle",
    };
  }

  const recognizedCategories: ParsedActivity["recognizedCategories"] = [];

  if (electricityKwh !== undefined) {
    recognizedCategories.push("electricity");
  }

  if (vehicles.length > 0) {
    recognizedCategories.push("transport");
  }

  return {
    ok: true,
    parsedActivity: {
      ...(electricityKwh !== undefined ? { electricityKwh } : {}),
      vehicles,
      recognizedCategories,
    },
  };
}

function normalizeElectricityKwh(value: unknown): number | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (!isFiniteNumber(value) || value < 0) {
    return undefined;
  }

  return value > 0 ? roundToTwo(value) : undefined;
}

function normalizeVehicles(value: unknown): VehicleActivity[] | undefined {
  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value)) {
    return undefined;
  }

  const vehicles: VehicleActivity[] = [];

  for (const item of value) {
    const vehicle = normalizeVehicle(item);

    if (!vehicle) {
      return undefined;
    }

    vehicles.push(vehicle);
  }

  return vehicles;
}

function normalizeVehicle(value: unknown): VehicleActivity | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const raw = value as RawAiVehicle;

  if (!isVehicleType(raw.type)) {
    return undefined;
  }

  if (
    !isFiniteNumber(raw.quantity) ||
    !Number.isInteger(raw.quantity) ||
    raw.quantity < 1 ||
    raw.quantity > 1000
  ) {
    return undefined;
  }

  if (
    !isFiniteNumber(raw.distanceKmPerVehicle) ||
    raw.distanceKmPerVehicle < 0 ||
    raw.distanceKmPerVehicle > 10000
  ) {
    return undefined;
  }

  if (raw.distanceKmPerVehicle === 0) {
    return undefined;
  }

  return {
    type: raw.type,
    label: vehicleLabels[raw.type],
    quantity: raw.quantity,
    distanceKmPerVehicle: roundToTwo(raw.distanceKmPerVehicle),
    totalDistanceKm: roundToTwo(raw.quantity * raw.distanceKmPerVehicle),
  };
}

function getOutputText(payload: OpenAIResponse): string | undefined {
  if (typeof payload.output_text === "string") {
    return payload.output_text;
  }

  for (const output of payload.output ?? []) {
    for (const content of output.content ?? []) {
      if (content.type === "output_text" && typeof content.text === "string") {
        return content.text;
      }
    }
  }

  return undefined;
}

async function readSafeErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as unknown;

    if (
      isRecord(body) &&
      isRecord(body.error) &&
      typeof body.error.message === "string"
    ) {
      return sanitizeMessage(body.error.message);
    }
  } catch {
    return response.statusText || "http_error";
  }

  return response.statusText || "http_error";
}

function isAbortError(error: unknown): boolean {
  return (
    isRecord(error) &&
    (error.name === "AbortError" ||
      error.name === "TimeoutError" ||
      error.code === "ABORT_ERR")
  );
}

function getErrorName(error: unknown): string | undefined {
  if (isRecord(error) && typeof error.name === "string") {
    return error.name;
  }

  return undefined;
}

function sanitizeErrorMessage(error: unknown): string | undefined {
  if (isRecord(error) && typeof error.message === "string") {
    return sanitizeMessage(error.message);
  }

  return undefined;
}

function sanitizeMessage(message: string): string {
  return message.replace(/sk-[A-Za-z0-9_-]+/g, "[redacted]").slice(0, 180);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isVehicleType(value: unknown): value is VehicleType {
  return (
    value === "car" ||
    value === "van" ||
    value === "motorcycle" ||
    value === "bus"
  );
}

function roundToTwo(value: number): number {
  return Math.round(value * 100) / 100;
}

const vehicleLabels: Record<VehicleType, string> = {
  car: "carro",
  van: "camioneta",
  motorcycle: "moto",
  bus: "bus",
};
