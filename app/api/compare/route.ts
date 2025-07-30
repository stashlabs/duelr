import { NextRequest, NextResponse } from "next/server";
import {
  ComparisonRequest,
  ComparisonResult,
  ModelResponse,
  AVAILABLE_MODELS,
  DEFAULT_PRICING,
  MODEL_PROVIDER,
} from "@/lib/types";
import { calculateScores } from "@/lib/scoring";
import { callOpenAI } from "@/lib/providers/openai";
import { callAnthropic } from "@/lib/providers/anthropic";

export async function POST(request: NextRequest) {
  try {
    const body: ComparisonRequest = await request.json();
    const { prompt, models, structuredOutput = false } = body;

    if (!prompt || !models || models.length === 0) {
      return NextResponse.json(
        { error: "Prompt and models are required" },
        { status: 400 },
      );
    }

    // Validate selected models
    const validModels = models.filter((modelId) =>
      AVAILABLE_MODELS.some((m) => m.id === modelId),
    );

    if (validModels.length === 0) {
      return NextResponse.json(
        { error: "No valid models selected" },
        { status: 400 },
      );
    }

    // Call all models in parallel
    const responses = await Promise.allSettled(
      validModels.map(async (modelId): Promise<ModelResponse> => {
        const model = AVAILABLE_MODELS.find((m) => m.id === modelId);
        if (!model) {
          throw new Error(`Model ${modelId} not found`);
        }

        const startTime = Date.now();

        try {
          let result;

          switch (model.provider) {
            case MODEL_PROVIDER.OpenAI:
              result = await callOpenAI(model.model, prompt, structuredOutput);
              break;
            case MODEL_PROVIDER.Anthropic:
              result = await callAnthropic(
                model.model,
                prompt,
                structuredOutput,
              );
              break;
            default:
              throw new Error(`Provider ${model.provider} not supported`);
          }

          const latency = Date.now() - startTime;
          const cost =
            ((result.promptTokens + result.completionTokens) / 1_000_000) *
            (DEFAULT_PRICING[modelId] || 0);
          const scores = calculateScores(
            result.response,
            result.completionTokens,
            structuredOutput,
          );

          return {
            modelId,
            response: result.response,
            latency,
            promptTokens: result.promptTokens,
            completionTokens: result.completionTokens,
            totalTokens: result.promptTokens + result.completionTokens,
            cost,
            scores,
          };
        } catch (error) {
          const latency = Date.now() - startTime;

          return {
            modelId,
            response: "",
            latency,
            promptTokens: 0,
            completionTokens: 0,
            totalTokens: 0,
            cost: 0,
            scores: {
              lengthSimplicity: 0,
              readability: 0,
              jsonValidity: false,
            },
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }),
    );

    // Process results
    const processedResponses = responses.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value;
      } else {
        const modelId = validModels[index];
        return {
          modelId,
          response: "",
          latency: 0,
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
          cost: 0,
          scores: { lengthSimplicity: 0, readability: 0, jsonValidity: false },
          error: result.reason?.message || "Failed to process request",
        };
      }
    });

    const result: ComparisonResult = {
      request: body,
      responses: processedResponses,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in comparison API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
