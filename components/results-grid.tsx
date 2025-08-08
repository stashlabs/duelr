"use client";

import { useState } from "react";
import { ComparisonResult, ModelResponse } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCost, getCostColor } from "@/lib/scoring";
import {
  Copy,
  Clock,
  Hash,
  CheckCircle,
  XCircle,
  CircleMinus,
} from "lucide-react";

interface ResultsGridProps {
  results: ComparisonResult;
}

export function ResultsGrid({ results }: ResultsGridProps) {
  const [copiedModelId, setCopiedModelId] = useState<string | null>(null);

  const copyToClipboard = async (text: string, modelId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedModelId(modelId);
      setTimeout(() => setCopiedModelId(null), 1000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const getCostBadgeColor = (cost: number) => {
    const color = getCostColor(cost);
    switch (color) {
      case "green":
        return "bg-green-100 text-green-800 border-green-200";
      case "yellow":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "red":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {results.responses.map((response: ModelResponse) => (
        <Card key={response.modelId} className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {response.modelId.split(":")[1]}
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {response.modelId.split(":")[0]}
              </Badge>
            </div>

            {response.error && (
              <div className="text-destructive text-sm bg-destructive/10 p-2 rounded">
                Error: {response.error}
              </div>
            )}
          </CardHeader>

          <CardContent className="flex-1 space-y-4">
            {/* Response Text */}
            <div className="relative group">
              <div className="bg-gray-50 rounded p-3 text-sm max-h-64 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-mono text-xs">
                  {response.response}
                </pre>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm shadow-lg"
                onClick={() =>
                  copyToClipboard(response.response, response.modelId)
                }
              >
                {copiedModelId === response.modelId ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-gray-500" />
                <span>{response.latency}ms</span>
              </div>

              <div
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs border ${getCostBadgeColor(
                  response.cost,
                )}`}
              >
                <span>{formatCost(response.cost)}</span>
              </div>

              <div className="flex items-center gap-1">
                <Hash className="h-3 w-3 text-gray-500" />
                <span>{response.totalTokens} tokens</span>
              </div>

              <div className="text-gray-600">
                {response.promptTokens}→{response.completionTokens}
              </div>
            </div>

            {/* Scores */}
            <div className="space-y-2 pt-2 border-t">
              <h4 className="text-xs font-medium text-gray-700">
                Quality Scores
              </h4>

              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Length Simplicity:</span>
                  <span className="font-mono">
                    {response.scores.lengthSimplicity}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Readability:</span>
                  <span className="font-mono">
                    {response.scores.readability}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">JSON Valid:</span>
                  {response.scores.jsonValidity === true ? (
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  ) : response.scores.jsonValidity === false ? (
                    <XCircle className="h-3 w-3 text-red-600" />
                  ) : (
                    <CircleMinus className="h-3 w-3 text-gray-600" />
                  )}
                </div>

                {/* Show validation errors if any */}
                {response.scores.validationErrors &&
                  response.scores.validationErrors.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs font-medium text-red-600 block mb-1">
                        Validation Errors:
                      </span>
                      <div className="bg-red-50 border border-red-200 rounded p-2 max-h-20 overflow-y-auto">
                        {response.scores.validationErrors.map(
                          (error, index) => (
                            <div key={index} className="text-xs text-red-700">
                              • {error}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
