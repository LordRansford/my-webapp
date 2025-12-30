"use client";

import React, { useState, useMemo } from "react";
import { Search, TrendingUp, DollarSign, Info, Check } from "lucide-react";

interface Model {
  id: string;
  name: string;
  description: string;
  useCases: string[];
  performance: {
    accuracy?: number;
    speed?: string;
    size?: string;
  };
  costEstimate: {
    training: string;
    inference: string;
  };
  recommended?: boolean;
}

interface ModelSelectorProps {
  models: Model[];
  selectedModel?: string;
  onSelect: (modelId: string) => void;
  useCase?: string;
}

const defaultModels: Model[] = [
  {
    id: "gpt-4",
    name: "GPT-4",
    description: "Advanced language model for complex reasoning and generation tasks",
    useCases: ["Text Generation", "Conversational AI", "Code Generation", "Analysis"],
    performance: {
      accuracy: 95,
      speed: "Fast",
      size: "Large",
    },
    costEstimate: {
      training: "High",
      inference: "$$$",
    },
    recommended: true,
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    description: "Fast and efficient model for most text tasks",
    useCases: ["Text Generation", "Summarization", "Translation"],
    performance: {
      accuracy: 85,
      speed: "Very Fast",
      size: "Medium",
    },
    costEstimate: {
      training: "Medium",
      inference: "$$",
    },
  },
  {
    id: "bert-base",
    name: "BERT Base",
    description: "Pre-trained transformer for classification and understanding",
    useCases: ["Classification", "Sentiment Analysis", "Question Answering"],
    performance: {
      accuracy: 88,
      speed: "Fast",
      size: "Medium",
    },
    costEstimate: {
      training: "Low",
      inference: "$",
    },
  },
  {
    id: "resnet-50",
    name: "ResNet-50",
    description: "Deep convolutional network for image classification",
    useCases: ["Image Classification", "Object Detection", "Feature Extraction"],
    performance: {
      accuracy: 92,
      speed: "Fast",
      size: "Large",
    },
    costEstimate: {
      training: "Medium",
      inference: "$$",
    },
  },
  {
    id: "mobilenet-v2",
    name: "MobileNet V2",
    description: "Lightweight model optimized for mobile and edge devices",
    useCases: ["Mobile Apps", "Edge Devices", "Real-time Inference"],
    performance: {
      accuracy: 80,
      speed: "Very Fast",
      size: "Small",
    },
    costEstimate: {
      training: "Low",
      inference: "$",
    },
  },
];

export default function ModelSelector({
  models = defaultModels,
  selectedModel,
  onSelect,
  useCase,
}: ModelSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredModels = useMemo(() => {
    let filtered = models;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.description.toLowerCase().includes(query) ||
          m.useCases.some((uc) => uc.toLowerCase().includes(query))
      );
    }

    if (useCase) {
      filtered = filtered.filter((m) =>
        m.useCases.some((uc) => uc.toLowerCase().includes(useCase.toLowerCase()))
      );
    }

    return filtered;
  }, [searchQuery, useCase, models]);

  const getCostColor = (cost: string) => {
    switch (cost) {
      case "$":
        return "text-green-600";
      case "$$":
        return "text-amber-600";
      case "$$$":
        return "text-red-600";
      default:
        return "text-slate-600";
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search models..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Model Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModels.map((model) => (
          <div
            key={model.id}
            onClick={() => onSelect(model.id)}
            className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
              selectedModel === model.id
                ? "border-purple-500 bg-purple-50 shadow-lg"
                : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
            }`}
          >
            {model.recommended && (
              <div className="absolute top-3 right-3 px-2 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
                Recommended
              </div>
            )}

            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-slate-900">{model.name}</h3>
              {selectedModel === model.id && (
                <div className="p-1 bg-purple-600 rounded-full">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <p className="text-sm text-slate-600 mb-4 line-clamp-2">{model.description}</p>

            {/* Use Cases */}
            <div className="flex flex-wrap gap-2 mb-4">
              {model.useCases.slice(0, 2).map((uc) => (
                <span
                  key={uc}
                  className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full"
                >
                  {uc}
                </span>
              ))}
              {model.useCases.length > 2 && (
                <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">
                  +{model.useCases.length - 2}
                </span>
              )}
            </div>

            {/* Performance */}
            <div className="space-y-2 mb-4">
              {model.performance.accuracy && (
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700">Accuracy: {model.performance.accuracy}%</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-700">Speed: {model.performance.speed}</span>
              </div>
            </div>

            {/* Cost */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">Inference: </span>
                <span className={`font-semibold ${getCostColor(model.costEstimate.inference)}`}>
                  {model.costEstimate.inference}
                </span>
              </div>
              <button className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                <Info className="w-4 h-4" />
                Learn more
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredModels.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <p>No models found matching your search.</p>
        </div>
      )}
    </div>
  );
}

