"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AVAILABLE_MODELS } from "@/lib/types";
import { ComparisonResult } from "@/lib/types";
import { ModelSelector } from "@/components/model-selector";
import { ResultsGrid } from "@/components/results-grid";
import { detectJSONSchema } from "@/lib/utils";
import Image from "next/image";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ComparisonResult | null>(null);
  const [jsonSchema, setJsonSchema] = useState("");
  const [detectedSchema, setDetectedSchema] = useState<string | null>(null);
  const [enableJsonValidation, setEnableJsonValidation] = useState(false);

  // Detect JSON schema from prompt
  useEffect(() => {
    if (prompt) {
      const detected = detectJSONSchema(prompt);
      setDetectedSchema(detected);
      if (detected && !jsonSchema) {
        setJsonSchema(detected);
        setEnableJsonValidation(true);
      }
    } else {
      setJsonSchema("");
      setDetectedSchema(null);
      setEnableJsonValidation(false);
    }
  }, [prompt]);

  const handleRunComparison = async () => {
    if (!prompt.trim() || selectedModels.length === 0) return;

    setIsLoading(true);
    try {
      const finalSchema = enableJsonValidation
        ? jsonSchema || detectedSchema
        : undefined;

      const response = await fetch("/api/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          models: selectedModels,
          structuredOutput: enableJsonValidation,
          jsonSchema: finalSchema,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to run comparison");
      }

      const result = await response.json();
      setResults(result);
    } catch (error) {
      console.error("Error running comparison:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3">
            <Image
              src="/logo_full.svg"
              alt="Duelr Logo"
              width={120}
              height={34}
              className="cursor-pointer"
              onClick={() => window.location.reload()}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Compare LLM responses across models in one click
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Input Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Prompt Configuration</CardTitle>
            <CardDescription>
              Enter your prompt and select models to compare
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Prompt Text
              </label>
              <Textarea
                placeholder="Enter your prompt here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-32"
              />
            </div>
            {/* JSON Schema Validation Section */}
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableJsonValidation"
                  checked={enableJsonValidation}
                  onChange={(e) => setEnableJsonValidation(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label
                  htmlFor="enableJsonValidation"
                  className="text-sm font-medium"
                >
                  Enable JSON Schema Validation
                </label>
                {detectedSchema && (
                  <Badge variant="secondary" className="text-xs">
                    Schema detected in prompt
                  </Badge>
                )}
              </div>

              {enableJsonValidation && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    JSON Schema
                    {detectedSchema && (
                      <span className="text-xs text-muted-foreground ml-2">
                        (Auto-detected from prompt - modify in prompt to change)
                      </span>
                    )}
                  </label>
                  <Textarea
                    placeholder="Enter your JSON schema here... or include it in the prompt above"
                    value={detectedSchema || jsonSchema}
                    onChange={(e) => {
                      if (!detectedSchema) {
                        setJsonSchema(e.target.value);
                      }
                    }}
                    disabled={!!detectedSchema}
                    className={`min-h-32 font-mono text-sm ${
                      detectedSchema ? "bg-gray-50 text-gray-600" : ""
                    }`}
                  />
                  {detectedSchema && (
                    <p className="text-xs text-muted-foreground mt-1">
                      To modify this schema, edit it in the prompt text area
                      above.
                    </p>
                  )}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Models ({selectedModels.length} selected)
              </label>
              <ModelSelector
                availableModels={AVAILABLE_MODELS}
                selectedModels={selectedModels}
                onSelectionChange={setSelectedModels}
              />
            </div>
            <Button
              onClick={handleRunComparison}
              disabled={
                !prompt.trim() ||
                selectedModels.length === 0 ||
                isLoading ||
                (enableJsonValidation && !jsonSchema && !detectedSchema)
              }
              className="bg-primary hover:bg-primary/90 text-white my-2"
              size="lg"
            >
              {isLoading ? "Running Comparison..." : "Run Comparison"}
            </Button>
            {enableJsonValidation && !jsonSchema && !detectedSchema && (
              <p className="text-sm text-destructive pt-0">
                * Please provide a JSON schema or include one in your prompt.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {results && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Comparison Results</h2>
              <Badge variant="outline" className="text-xs">
                {new Date(results.timestamp).toLocaleString()}
              </Badge>
            </div>
            <ResultsGrid results={results} />
          </div>
        )}

        {/* Empty State */}
        {!results && !isLoading && (
          <Card className="py-12">
            <CardContent className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold mb-2">Ready to Compare</h3>
              <p className="text-muted-foreground">
                Enter a prompt and select models to see side-by-side comparisons
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
