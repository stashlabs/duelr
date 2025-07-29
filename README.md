# Duelr

**Compare LLMs in one click** - An open-source tool to evaluate and compare Large Language Model responses across different providers with latency, cost, and quality metrics.

![Duelr Demo](https://github.com/user-attachments/assets/3c892af1-e7ea-4d8e-ac66-3dd22ee5f128)

## Features

- **Parallel Comparison**: Test multiple LLM models simultaneously
- **Comprehensive Metrics**: Track latency, token usage, and cost
- **Quality Scoring**: Built-in scoring for length simplicity, readability, and JSON validity
- **Cost Transparency**: Real-time pricing comparison across providers
- **Extensible**: Easy to add new LLM providers

## Get Started

### Prerequisites

- Node.js 18+
- npm/yarn
- API keys for LLM providers (OpenAI, Anthropic)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/duelr.git
   cd duelr
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Add your API keys to `.env.local`:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**<br/>
   Navigate to [http://localhost:3000](http://localhost:3000)

## How to Use

1. **Enter your prompt** in the text area
2. **Select models** you want to compare (OpenAI GPT-4o, Claude Sonnet 4, etc.)
3. **Click "Run Comparison"** to execute parallel requests
4. **Review results** in side-by-side cards showing:
   - Response text with copy button
   - Latency measurements
   - Token usage and costs
   - Quality scores (simplicity, readability, JSON validity)

## Architecture

### Core Components

- **Frontend**: Next.js 15 with React 19, Tailwind CSS, Shadcn/ui
- **API Routes**: Next.js API routes for LLM integrations
- **Providers**: Modular provider system (OpenAI, Anthropic)
- **Scoring**: Built-in heuristic algorithms for response evaluation

### Supported Providers

- ✅ **OpenAI**: GPT-4o, GPT-4o-mini, GPT-4.1-mini
- ✅ **Anthropic**: Claude Haiku 3.5, Claude Sonnet 4, Claude Opus 4
- 🚧 **Groq**: Coming soon
- 🚧 **Mistral**: Coming soon

### Quality Metrics

1. **Length Simplicity**: `tokens ÷ sentences` - measures verbosity
2. **Readability**: [Flesch](https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests) reading ease score - proxy for clarity
3. **JSON Validity**: For structured output prompts

## Configuration

### Adding New Providers

1. Create a new provider file in `lib/providers/`
2. Implement the `LLMResponse` interface
3. Add provider configuration to `lib/types.ts`
4. Update the API route in `app/api/compare/route.ts`

### Custom Pricing

Update the pricing table in `lib/types.ts`:

```typescript
export const DEFAULT_PRICING: PricingTable = {
  "your-provider:model-name": 0.001, // USD per 1M tokens
  // ... other models
};
```

## Metrics Explained

### Cost Calculation

`Cost = (prompt_tokens + completion_tokens) / 1_000_000 * price_per_1M_tokens`

### Traffic Light System

- 🟢 **Green**: < $0.001 per request
- 🟡 **Yellow**: $0.001 - $0.01 per request
- 🔴 **Red**: > $0.01 per request

### Quality Scores

- **Length Simplicity**: Lower = more concise
- **Readability**: Higher = easier to read (0-100 scale)
- **JSON Validity**: Pass/fail for structured outputs

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## ⭐ Show Your Support

If you find Duelr useful, please consider:

- Starring the repository
- Reporting bugs and issues
- Suggesting new features
- Contributing code improvements

---

**Built with ❤️ by the open source community**
