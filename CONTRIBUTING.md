# Contributing to Duelr

Thank you for your interest in contributing to Duelr! We welcome contributions from the community and are grateful for any help you can provide.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and what behavior you expected**
- **Include screenshots or GIFs if applicable**
- **Include your environment details** (OS, Node.js version, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the enhancement**
- **Describe the current behavior and explain the expected behavior**
- **Explain why this enhancement would be useful**

### Your First Code Contribution

Unsure where to begin? You can start by looking through `good-first-issue` and `help-wanted` issues:

- **Good first issues** - issues which should only require a few lines of code
- **Help wanted issues** - issues which are more involved

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the coding standards** outlined below
3. **Add tests** if you've added code that should be tested
4. **Ensure the test suite passes** by running `npm test`
5. **Make sure your code lints** by running `npm run lint`
6. **Update documentation** as needed
7. **Create a pull request** with a clear description and title with an issue ID

## Development Process

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Setup

1. Fork and clone the repository:

   ```bash
   git clone https://github.com/your-username/duelr.git
   cd duelr
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   # Add your API keys to .env.local
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Making Changes

1. Create a new branch for your feature or fix:

   ```bash
   git checkout -b your-branch-name
   ```

2. Make your changes following our coding standards

3. Test your changes thoroughly

4. Commit your changes with **THE PROPER COMMIT MESSAGE FORMAT**:
   ```bash
   git commit -m "feat: add new feature description"
   ```

### Coding Standards

- **TypeScript**: All new code should be written in TypeScript
- **ESLint**: Follow the existing ESLint configuration
- **Formatting**: Use Prettier for code formatting
- **Naming**: Use descriptive names for variables, functions, and components
- **Components**: Follow React best practices and use functional components with hooks
- **File Structure**: Follow the existing project structure

### Commit Message Guidelines

We follow [Conventional Commits](https://conventionalcommits.org/) specification:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

Examples:

```
feat: add support for Groq LLM provider
fix: resolve token counting issue for Claude models
docs: update installation instructions
refactor: improve the query performance
```

## Adding New LLM Providers

To add support for a new LLM provider:

1. Create a new provider file in `lib/providers/`
2. Implement the required interface with these methods:
   - `generateResponse(prompt: string, config: ModelConfig): Promise<LLMResponse>`
3. Add the provider to the types in `lib/types.ts`
4. Update the API route in `app/api/compare/route.ts`
5. Add pricing information to the pricing table
6. Update documentation

### Provider Implementation Example

```typescript
// lib/providers/your-provider.ts
import { LLMResponse, ModelConfig } from "../types";

export async function generateResponse(
  prompt: string,
  config: ModelConfig,
): Promise<LLMResponse> {
  // Implementation here
  return {
    response: "Generated response",
    latency: 1500,
    tokens: {
      prompt: 100,
      completion: 200,
      total: 300,
    },
    cost: 0.001,
    provider: "your-provider",
    model: config.model,
  };
}
```

## Documentation

- Update the README.md if you change functionality
- Add JSDoc comments to new functions
- Update inline code comments as needed

## Questions?

If you have questions about contributing, please:

- Check existing issues
- Create a new issue with the `question` label

Thank you for contributing to Duelr!
