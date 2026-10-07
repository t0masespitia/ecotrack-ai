import {
  extractActivityWithAi,
  extractActivityWithAiResult,
  normalizeAiParsedActivity,
  normalizeAiParsedActivityResult,
} from "./ai-parser";
import { parseBusinessActivity } from "./parser";
import type { ParsedActivity, ParserDebugInfo, ParserSource } from "./types";

type AiActivityExtractor = (text: string) => Promise<unknown | undefined>;

type ParseActivityOptions = {
  aiExtractor?: AiActivityExtractor;
};

export type ParseActivityResult = {
  parsedActivity: ParsedActivity;
  parserSource: ParserSource;
  parserDebug?: ParserDebugInfo;
};

export async function parseActivity(
  text: string,
  options: ParseActivityOptions = {},
): Promise<ParseActivityResult> {
  if (options.aiExtractor) {
    return parseActivityWithInjectedExtractor(text, options.aiExtractor);
  }

  try {
    const aiResult = await extractActivityWithAiResult(text);

    if (aiResult.ok) {
      const normalized = normalizeAiParsedActivityResult(aiResult.activity);

      if (normalized.ok) {
        return {
          parsedActivity: normalized.parsedActivity,
          parserSource: "ai",
          parserDebug: aiResult.debug,
        };
      }

      return {
        parsedActivity: parseBusinessActivity(text),
        parserSource: "local",
        parserDebug: {
          ...aiResult.debug,
          fallbackReason: normalized.fallbackReason,
        },
      };
    }

    return {
      parsedActivity: parseBusinessActivity(text),
      parserSource: "local",
      parserDebug: aiResult.debug,
    };
  } catch {
    // Fallback local obligatorio: ningun error del proveedor debe llegar al usuario.
  }

  return {
    parsedActivity: parseBusinessActivity(text),
    parserSource: "local",
    parserDebug: {
      fallbackReason: "unexpected_error",
    },
  };
}

async function parseActivityWithInjectedExtractor(
  text: string,
  aiExtractor: AiActivityExtractor,
): Promise<ParseActivityResult> {
  try {
    const aiActivity = await aiExtractor(text);
    const parsedActivity = normalizeAiParsedActivity(aiActivity);

    if (parsedActivity) {
      return {
        parsedActivity,
        parserSource: "ai",
      };
    }
  } catch {
    // Fallback local obligatorio: ningun error del proveedor debe llegar al usuario.
  }

  return {
    parsedActivity: parseBusinessActivity(text),
    parserSource: "local",
  };
}
