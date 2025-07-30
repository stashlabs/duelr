"use client";

import { useState } from "react";
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
import Image from "next/image";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ComparisonResult | null>(null);

  const handleRunComparison = async () => {
    if (!prompt.trim() || selectedModels.length === 0) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          models: selectedModels,
          structuredOutput: false,
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
                !prompt.trim() || selectedModels.length === 0 || isLoading
              }
              className="bg-primary hover:bg-primary/90 text-white"
              size="lg"
            >
              {isLoading ? "Running Comparison..." : "Run Comparison"}
            </Button>
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
