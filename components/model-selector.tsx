"use client";

import { ModelProvider } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ModelSelectorProps {
  availableModels: ModelProvider[];
  selectedModels: string[];
  onSelectionChange: (selected: string[]) => void;
}

export function ModelSelector({
  availableModels,
  selectedModels,
  onSelectionChange,
}: ModelSelectorProps) {
  const toggleModel = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      onSelectionChange(selectedModels.filter((id) => id !== modelId));
    } else {
      onSelectionChange([...selectedModels, modelId]);
    }
  };

  const selectAll = () => {
    onSelectionChange(availableModels.map((model) => model.id));
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={selectAll}
          className="text-xs"
        >
          Select All
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={clearAll}
          className="text-xs"
        >
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {availableModels.map((model) => {
          const isSelected = selectedModels.includes(model.id);

          return (
            <div
              key={model.id}
              className={`
                border rounded-lg p-4 cursor-pointer transition-all
                ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }
              `}
              onClick={() => toggleModel(model.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{model.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{model.provider}</p>
                </div>
                {isSelected && (
                  <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>

              <div className="mt-3">
                <Badge variant="secondary" className="text-xs">
                  ${model.pricePerToken || 0} / 1M tokens
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
