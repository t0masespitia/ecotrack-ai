import { parseActivity } from "../lib/activity-parser";
import { hasRecognizedActivity } from "../lib/parser";

async function main() {
  const previousApiKey = process.env.OPENAI_API_KEY;

  try {
    delete process.env.OPENAI_API_KEY;

    const localResult = await parseActivity(
      "Hoy consumimos 200 kWh de electricidad",
    );
    assertEqual("Caso A", "parserSource", localResult.parserSource, "local");
    assertEqual(
      "Caso A",
      "electricidad",
      localResult.parsedActivity.electricityKwh,
      200,
    );

    const aiResult = await parseActivity("Utilizamos cinco camionetas", {
      aiExtractor: async () => ({
        electricityKwh: 180,
        vehicles: [
          {
            type: "van",
            quantity: 5,
            distanceKmPerVehicle: 40,
          },
        ],
      }),
    });
    assertEqual("Caso B", "parserSource", aiResult.parserSource, "ai");
    assertEqual(
      "Caso B",
      "transporte",
      aiResult.parsedActivity.vehicles[0]?.totalDistanceKm,
      200,
    );

    const aiFailureResult = await parseActivity(
      "Usamos 3 motos que recorrieron 25 km cada una",
      {
        aiExtractor: async () => {
          throw new Error("Proveedor no disponible");
        },
      },
    );
    assertEqual(
      "Caso C",
      "parserSource",
      aiFailureResult.parserSource,
      "local",
    );
    assertEqual(
      "Caso C",
      "vehiculos",
      aiFailureResult.parsedActivity.vehicles.length,
      1,
    );

    const invalidAiResult = await parseActivity(
      "Hoy consumimos 180 kWh y 4 camionetas hicieron 50 km cada una",
      {
        aiExtractor: async () => ({
          vehicles: [
            {
              type: "truck",
              quantity: 4,
              distanceKmPerVehicle: 50,
            },
          ],
        }),
      },
    );
    assertEqual(
      "Caso D",
      "parserSource",
      invalidAiResult.parserSource,
      "local",
    );
    assertEqual(
      "Caso D",
      "electricidad",
      invalidAiResult.parsedActivity.electricityKwh,
      180,
    );

    const noDataResult = await parseActivity("Hola, hoy trabajamos normalmente", {
      aiExtractor: async () => ({}),
    });
    assertEqual("Caso E", "parserSource", noDataResult.parserSource, "ai");
    assertEqual(
      "Caso E",
      "reconocimiento",
      hasRecognizedActivity(noDataResult.parsedActivity),
      false,
    );

    console.log("Verificaciones de parser hibrido completadas correctamente.");
  } finally {
    if (previousApiKey === undefined) {
      delete process.env.OPENAI_API_KEY;
    } else {
      process.env.OPENAI_API_KEY = previousApiKey;
    }
  }
}

function assertEqual<T>(
  caseName: string,
  field: string,
  actual: T,
  expected: T,
) {
  if (actual !== expected) {
    throw new Error(
      `${caseName}: ${field} esperado=${String(expected)}, recibido=${String(
        actual,
      )}.`,
    );
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
