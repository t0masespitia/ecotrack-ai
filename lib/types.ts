export type VehicleType = "car" | "van" | "motorcycle" | "bus";

export type EmissionCategory = "electricity" | "transport";

export type AnalysisStatus =
  | "success"
  | "no_data"
  | "validation_error"
  | "error";

export type ParserSource = "ai" | "local";

export type ParserFallbackReason =
  | "no_api_key"
  | "timeout"
  | "http_error"
  | "invalid_response"
  | "unsupported_vehicle"
  | "unexpected_error";

export type ParserDebugInfo = {
  fallbackReason?: ParserFallbackReason;
  durationMs?: number;
  model?: string;
  httpStatus?: number;
  errorName?: string;
  errorMessage?: string;
};

export type VehicleActivity = {
  type: VehicleType;
  label: string;
  quantity: number;
  distanceKmPerVehicle: number;
  totalDistanceKm: number;
};

export type ParsedActivity = {
  electricityKwh?: number;
  vehicles: VehicleActivity[];
  recognizedCategories: EmissionCategory[];
};

export type EmissionBreakdownItem = {
  category: EmissionCategory;
  label: string;
  kgCO2e: number;
  percentage: number;
};

export type Recommendation = {
  title: string;
  description: string;
};

export type EmissionCalculation = {
  totalKgCO2e: number;
  breakdown: EmissionBreakdownItem[];
};

export type EmissionResult = EmissionCalculation & {
  parsedActivity: ParsedActivity;
  parserSource: ParserSource;
  parserDebug?: ParserDebugInfo;
  explanation: string;
  recommendations: Recommendation[];
};

export type AnalyzeSuccessResponse = {
  status: "success";
  data: EmissionResult;
};

export type AnalyzeMessageResponse = {
  status: Exclude<AnalysisStatus, "success">;
  message: string;
};

export type AnalyzeResponse = AnalyzeSuccessResponse | AnalyzeMessageResponse;
