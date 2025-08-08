import { ResponseScores } from "./types";
import { validateJSONSchema } from "./utils";

/**
 * Calculate length simplicity score (tokens ÷ sentences)
 * Lower scores indicate more concise responses
 */
export function calculateLengthSimplicity(
  text: string,
  tokens: number,
): number {
  const sentences = countSentences(text);
  if (sentences === 0) return tokens;
  return Number((tokens / sentences).toFixed(2));
}

/**
 * Calculate readability using simplified Flesch reading ease score
 * Higher scores indicate easier readability (0-100 scale)
 */
export function calculateReadability(text: string): number {
  try {
    // Simplified Flesch calculation: 206.835 - (1.015 × ASL) - (84.6 × ASW)
    // ASL = Average Sentence Length (words per sentence)
    // ASW = Average Syllables per Word

    const sentences = countSentences(text);
    const words = countWords(text);
    const syllables = countSyllables(text);

    if (sentences === 0 || words === 0) return 0;

    const asl = words / sentences;
    const asw = syllables / words;

    const score = 206.835 - 1.015 * asl - 84.6 * asw;
    return Number(Math.max(0, Math.min(100, score)).toFixed(1));
  } catch (error) {
    console.warn("Error calculating readability:", error);
    return 0;
  }
}

/**
 * Check if response is valid JSON
 */
export function isValidJSON(text: string): boolean {
  try {
    JSON.parse(text.trim());
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate JSON response against a provided schema
 */
export function validateJSONResponse(
  text: string,
  schema?: string,
): { valid: boolean; errors: string[] } {
  try {
    const parsed = JSON.parse(text.trim());

    if (!schema) {
      return { valid: true, errors: [] };
    }

    const parsedSchema = JSON.parse(schema);
    return validateJSONSchema(parsed, parsedSchema);
  } catch (error) {
    return {
      valid: false,
      errors: [error instanceof Error ? error.message : "Invalid JSON format"],
    };
  }
}

/**
 * Count sentences in text using basic punctuation
 */
function countSentences(text: string): number {
  // Remove extra whitespace and split by sentence-ending punctuation
  const sentences = text
    .trim()
    .split(/[.!?]+/)
    .filter((s) => s.trim().length > 0);

  return Math.max(1, sentences.length);
}

/**
 * Count words in text
 */
function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

/**
 * Count syllables in text (simplified estimation)
 */
function countSyllables(text: string): number {
  const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];

  return words.reduce((total, word) => {
    // Simple syllable counting heuristic
    let syllables = word.match(/[aeiouy]+/g)?.length || 1;

    // Adjust for common patterns
    if (word.endsWith("e")) syllables--;
    if (word.endsWith("le") && word.length > 2) syllables++;
    if (syllables < 1) syllables = 1;

    return total + syllables;
  }, 0);
}

/**
 * Calculate all scores for a response
 */
export function calculateScores(
  text: string,
  tokens: number,
  isStructuredPrompt: boolean,
  jsonSchema?: string,
): ResponseScores {
  let jsonValidity = null;
  let validationErrors: string[] | undefined = undefined;

  if (isStructuredPrompt) {
    if (jsonSchema) {
      // Validate against schema
      const validation = validateJSONResponse(text, jsonSchema);
      jsonValidity = validation.valid;
      if (!validation.valid) {
        validationErrors = validation.errors;
      }
    } else {
      // Just check if it's valid JSON
      jsonValidity = isValidJSON(text);
      if (!jsonValidity) {
        validationErrors = ["Invalid JSON format"];
      }
    }
  }

  return {
    lengthSimplicity: calculateLengthSimplicity(text, tokens),
    readability: calculateReadability(text),
    jsonValidity,
    validationErrors,
  };
}

/**
 * Get color coding for cost based on thresholds
 */
export function getCostColor(cost: number): "green" | "yellow" | "red" {
  if (cost < 0.0005) return "green";
  if (cost < 0.008) return "yellow";
  return "red";
}

/**
 * Format cost for display
 */
export function formatCost(cost: number): string {
  if (cost < 0.0001) {
    return `$${cost.toFixed(6)}`;
  } else if (cost < 0.01) {
    return `$${cost.toFixed(5)}`;
  } else if (cost < 1) {
    return `$${cost.toFixed(4)}`;
  } else {
    return `$${cost.toFixed(2)}`;
  }
}
