export const validationMessages = {
  empty:
    "Escribe una actividad para poder analizar tu impacto.",
  tooShort:
    "Describe un poco más la actividad. Incluye datos como kWh consumidos o kilómetros recorridos.",
  noData:
    "No pudimos identificar suficientes datos para realizar el cálculo. Intenta incluir información como consumo eléctrico en kWh o distancia recorrida por los vehículos.",
  unexpected:
    "Ocurrió un problema al analizar la actividad. Intenta nuevamente.",
} as const;

export function validateActivityText(text: unknown):
  | { valid: true; text: string }
  | { valid: false; message: string } {
  if (typeof text !== "string" || text.trim().length === 0) {
    return {
      valid: false,
      message: validationMessages.empty,
    };
  }

  const trimmedText = text.trim();

  if (trimmedText.length < 8) {
    return {
      valid: false,
      message: validationMessages.tooShort,
    };
  }

  return {
    valid: true,
    text: trimmedText.slice(0, 2000),
  };
}
