import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface LLMResponse {
  response: string;
  promptTokens: number;
  completionTokens: number;
}

export async function callAnthropic(
  model: string,
  prompt: string,
  structuredOutput: boolean = false,
): Promise<LLMResponse> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("Anthropic API key not configured");
  }

  try {
    const message = await anthropic.messages.create({
      model,
      max_tokens: 1000,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Extract text content from the response
    const response = message.content
      .filter((block) => block.type === "text")
      .map((block) => (block as any).text) // eslint-disable-line @typescript-eslint/no-explicit-any
      .join("");

    const promptTokens = message.usage.input_tokens;
    const completionTokens = message.usage.output_tokens;

    return {
      response,
      promptTokens,
      completionTokens,
    };
  } catch (error) {
    console.error("Anthropic API error:", error);
    throw new Error(
      `Anthropic API error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}
