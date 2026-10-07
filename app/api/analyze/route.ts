import { NextResponse } from "next/server";
import { parseActivity } from "@/lib/activity-parser";
import { calculateEmissions } from "@/lib/emissions";
import { hasRecognizedActivity } from "@/lib/parser";
import {
  generateExplanation,
  generateRecommendations,
} from "@/lib/recommendations";
import type { AnalyzeResponse } from "@/lib/types";
import { validateActivityText, validationMessages } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const text = getTextFromBody(body);
    const validation = validateActivityText(text);

    if (!validation.valid) {
      return NextResponse.json<AnalyzeResponse>(
        {
          status: "validation_error",
          message: validation.message,
        },
        { status: 400 },
      );
    }

    const { parsedActivity, parserSource, parserDebug } = await parseActivity(
      validation.text,
    );

    if (!hasRecognizedActivity(parsedActivity)) {
      return NextResponse.json<AnalyzeResponse>(
        {
          status: "no_data",
          message: validationMessages.noData,
        },
        { status: 200 },
      );
    }

    const calculation = calculateEmissions(parsedActivity);

    return NextResponse.json<AnalyzeResponse>({
      status: "success",
      data: {
        ...calculation,
        parsedActivity,
        parserSource,
        ...(process.env.NODE_ENV === "development" && parserDebug
          ? { parserDebug }
          : {}),
        explanation: generateExplanation(calculation),
        recommendations: generateRecommendations(calculation),
      },
    });
  } catch (error) {
    console.error("EcoTrack AI analyze error:", error);

    return NextResponse.json<AnalyzeResponse>(
      {
        status: "error",
        message: validationMessages.unexpected,
      },
      { status: 500 },
    );
  }
}

function getTextFromBody(body: unknown): unknown {
  if (typeof body !== "object" || body === null || !("text" in body)) {
    return undefined;
  }

  return (body as { text: unknown }).text;
}
