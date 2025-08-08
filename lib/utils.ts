import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Detects and extracts JSON schema from text
 * Looks for JSON objects that appear to be schemas (containing "type", "properties", etc.)
 */
export function detectJSONSchema(text: string): string | null {
  try {
    // Common patterns that indicate a JSON schema
    const schemaPatterns = [
      /```json\s*(\{[\s\S]*?\})\s*```/gi,
      /```\s*(\{[\s\S]*?\})\s*```/gi,
      /(\{[\s\S]*?"type"[\s\S]*?\})/gi,
      /(\{[\s\S]*?"properties"[\s\S]*?\})/gi,
      /(\{[\s\S]*?"required"[\s\S]*?\})/gi,
    ];

    for (const pattern of schemaPatterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        const jsonCandidate = match[1];
        try {
          const parsed = JSON.parse(jsonCandidate);
          // Check if it looks like a JSON schema
          if (
            parsed &&
            typeof parsed === "object" &&
            (parsed.type ||
              parsed.properties ||
              parsed.required ||
              parsed.$schema)
          ) {
            return JSON.stringify(parsed, null, 2);
          }
        } catch {
          continue;
        }
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Validates JSON data against a JSON schema
 * Returns validation result with errors if any
 */
export function validateJSONSchema(
  data: any,
  schema: any,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  try {
    // Basic schema validation implementation
    if (schema.type) {
      const dataType = Array.isArray(data) ? "array" : typeof data;
      if (dataType !== schema.type) {
        errors.push(`Expected type ${schema.type}, got ${dataType}`);
      }
    }

    if (schema.properties && typeof data === "object" && data !== null) {
      for (const [key, propSchema] of Object.entries(schema.properties)) {
        if (data.hasOwnProperty(key)) {
          const propResult = validateJSONSchema(data[key], propSchema);
          errors.push(...propResult.errors.map((err) => `${key}: ${err}`));
        }
      }
    }

    if (schema.required && typeof data === "object" && data !== null) {
      for (const requiredField of schema.required) {
        if (!data.hasOwnProperty(requiredField)) {
          errors.push(`Missing required field: ${requiredField}`);
        }
      }
    }

    if (schema.items && Array.isArray(data)) {
      data.forEach((item, index) => {
        const itemResult = validateJSONSchema(item, schema.items);
        errors.push(...itemResult.errors.map((err) => `[${index}]: ${err}`));
      });
    }

    return { valid: errors.length === 0, errors };
  } catch (error) {
    return { valid: false, errors: [`Schema validation error: ${error}`] };
  }
}
