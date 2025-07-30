import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface LLMResponse {
  response: string;
  promptTokens: number;
  completionTokens: number;
}

export async function callOpenAI(
  model: string,
  prompt: string,
  structuredOutput: boolean = false,
): Promise<LLMResponse> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content || "";
    const promptTokens = completion.usage?.prompt_tokens || 0;
    const completionTokens = completion.usage?.completion_tokens || 0;

    return {
      response,
      promptTokens,
      completionTokens,
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error(
      `OpenAI API error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}
