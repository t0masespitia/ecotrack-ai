import { calculateEmissions } from "../lib/emissions";
import { hasRecognizedActivity, parseBusinessActivity } from "../lib/parser";

type VerificationCase = {
  name: string;
  text: string;
  expectElectricity: boolean;
  expectTransport: boolean;
  expectRecognized: boolean;
};

const cases: VerificationCase[] = [
  {
    name: "Caso 1 - electricidad",
    text: "Hoy consumimos 200 kWh de electricidad",
    expectElectricity: true,
    expectTransport: false,
    expectRecognized: true,
  },
  {
    name: "Caso 2 - transporte",
    text: "Usamos 5 camionetas y cada una recorrió 40 km",
    expectElectricity: false,
    expectTransport: true,
    expectRecognized: true,
  },
  {
    name: "Caso 3 - electricidad y transporte",
    text: "Hoy consumimos 200 kWh de electricidad y usamos 5 camionetas que recorrieron 40 km cada una",
    expectElectricity: true,
    expectTransport: true,
    expectRecognized: true,
  },
  {
    name: "Caso 4 - sin datos",
    text: "Hola, hoy trabajamos normalmente",
    expectElectricity: false,
    expectTransport: false,
    expectRecognized: false,
  },
  {
    name: "Caso 5 - texto vacío",
    text: "",
    expectElectricity: false,
    expectTransport: false,
    expectRecognized: false,
  },
];

for (const testCase of cases) {
  const parsedActivity = parseBusinessActivity(testCase.text);
  const calculation = calculateEmissions(parsedActivity);
  const hasElectricity = parsedActivity.electricityKwh !== undefined;
  const hasTransport = parsedActivity.vehicles.length > 0;
  const recognized = hasRecognizedActivity(parsedActivity);

  assertEqual(testCase.name, "electricidad", hasElectricity, testCase.expectElectricity);
  assertEqual(testCase.name, "transporte", hasTransport, testCase.expectTransport);
  assertEqual(testCase.name, "reconocimiento", recognized, testCase.expectRecognized);

  if (recognized && calculation.totalKgCO2e <= 0) {
    throw new Error(`${testCase.name}: esperaba emisiones mayores a cero.`);
  }
}

console.log("Verificaciones de lógica completadas correctamente.");

function assertEqual(
  caseName: string,
  field: string,
  actual: boolean,
  expected: boolean,
) {
  if (actual !== expected) {
    throw new Error(
      `${caseName}: ${field} esperado=${expected}, recibido=${actual}.`,
    );
  }
}
