export const MODEL_PROVIDER = {
  OpenAI: "OpenAI",
  Anthropic: "Anthropic",
};

export interface ModelProvider {
  id: string;
  name: string;
  provider: (typeof MODEL_PROVIDER)[keyof typeof MODEL_PROVIDER];
  model: string;
  pricePerToken?: number; // USD per 1M tokens
}

export interface ComparisonRequest {
  prompt: string;
  models: string[];
  structuredOutput?: boolean;
  jsonSchema?: string;
}

export interface ModelResponse {
  modelId: string;
  response: string;
  latency: number; // milliseconds
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number; // USD
  scores: ResponseScores;
  error?: string;
}

export interface ResponseScores {
  lengthSimplicity: number; // tokens ÷ sentences
  readability: number; // Flesch reading ease score
  jsonValidity: boolean | null; // for structured prompts
  validationErrors?: string[]; // JSON schema validation errors
}

export interface ComparisonResult {
  request: ComparisonRequest;
  responses: ModelResponse[];
  timestamp: string;
}

export interface PricingTable {
  [modelId: string]: number; // USD per 1M tokens
}

// Default pricing table
export const DEFAULT_PRICING: PricingTable = {
  "openai:gpt-4.1-mini": 0.4,
  "openai:gpt-4o": 2.5,
  "openai:gpt-4o-mini": 0.15,
  "anthropic:claude-haiku-3.5": 0.8,
  "anthropic:claude-sonnet-4": 3.0,
  "anthropic:claude-opus-4": 15.0,
};

// Available models configuration
export const AVAILABLE_MODELS: ModelProvider[] = [
  {
    id: "openai:gpt-4.1-mini",
    name: "GPT-4.1 Mini",
    provider: MODEL_PROVIDER.OpenAI,
    model: "gpt-4.1-mini",
    pricePerToken: DEFAULT_PRICING["openai:gpt-4.1-mini"],
  },
  {
    id: "openai:gpt-4o",
    name: "GPT-4o",
    provider: MODEL_PROVIDER.OpenAI,
    model: "gpt-4o",
    pricePerToken: DEFAULT_PRICING["openai:gpt-4o"],
  },
  {
    id: "openai:gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: MODEL_PROVIDER.OpenAI,
    model: "gpt-4o-mini",
    pricePerToken: DEFAULT_PRICING["openai:gpt-4o-mini"],
  },
  {
    id: "anthropic:claude-haiku-3.5",
    name: "Claude Haiku 3.5",
    provider: MODEL_PROVIDER.Anthropic,
    model: "claude-haiku-3.5",
    pricePerToken: DEFAULT_PRICING["anthropic:claude-haiku-3.5"],
  },
  {
    id: "anthropic:claude-sonnet-4",
    name: "Claude Sonnet 4",
    provider: MODEL_PROVIDER.Anthropic,
    model: "claude-sonnet-4",
    pricePerToken: DEFAULT_PRICING["anthropic:claude-sonnet-4"],
  },
  {
    id: "anthropic:claude-opus-4",
    name: "Claude Opus 4",
    provider: MODEL_PROVIDER.Anthropic,
    model: "claude-opus-4",
    pricePerToken: DEFAULT_PRICING["anthropic:claude-opus-4"],
  },
];
