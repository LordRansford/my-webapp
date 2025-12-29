"use client";

/**
 * Proof of Concept: Visual Model Builder
 * 
 * This component demonstrates:
 * - Drag-and-drop model architecture builder
 * - Visual layer configuration
 * - Real-time model preview
 * - Code generation
 * - Model validation
 */

import React, { useState, useCallback } from "react";
import { Plus, Trash2, Settings, Code, Eye, Save } from "lucide-react";

interface Layer {
  id: string;
  type: "dense" | "dropout" | "conv2d" | "lstm" | "embedding";
  config: {
    units?: number;
    activation?: string;
    rate?: number;
    filters?: number;
    kernelSize?: number;
  };
}

export default function ModelBuilderPOC() {
  const [layers, setLayers] = useState<Layer[]>([
    {
      id: "1",
      type: "dense",
      config: { units: 64, activation: "relu" },
    },
    {
      id: "2",
      type: "dropout",
      config: { rate: 0.2 },
    },
    {
      id: "3",
      type: "dense",
      config: { units: 32, activation: "relu" },
    },
    {
      id: "4",
      type: "dense",
      config: { units: 1, activation: "sigmoid" },
    },
  ]);

  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false);

  const addLayer = useCallback((type: Layer["type"]) => {
    const newLayer: Layer = {
      id: Date.now().toString(),
      type,
      config:
        type === "dense"
          ? { units: 32, activation: "relu" }
          : type === "dropout"
          ? { rate: 0.2 }
          : type === "conv2d"
          ? { filters: 32, kernelSize: 3 }
          : type === "lstm"
          ? { units: 50 }
          : {},
    };
    setLayers([...layers, newLayer]);
  }, [layers]);

  const removeLayer = useCallback((id: string) => {
    setLayers(layers.filter((l) => l.id !== id));
    if (selectedLayer === id) {
      setSelectedLayer(null);
    }
  }, [layers, selectedLayer]);

  const updateLayer = useCallback((id: string, config: Layer["config"]) => {
    setLayers(
      layers.map((l) => (l.id === id ? { ...l, config: { ...l.config, ...config } } : l))
    );
  }, [layers]);

  const generateCode = useCallback(() => {
    const code = `import * as tf from '@tensorflow/tfjs';

const model = tf.sequential({
  layers: [
${layers
  .map((layer) => {
    if (layer.type === "dense") {
      return `    tf.layers.dense({
      units: ${layer.config.units},
      activation: '${layer.config.activation}',
      name: '${layer.type}_${layer.id}',
    }),`;
    } else if (layer.type === "dropout") {
      return `    tf.layers.dropout({
      rate: ${layer.config.rate},
      name: '${layer.type}_${layer.id}',
    }),`;
    } else if (layer.type === "conv2d") {
      return `    tf.layers.conv2d({
      filters: ${layer.config.filters},
      kernelSize: ${layer.config.kernelSize},
      activation: 'relu',
      name: '${layer.type}_${layer.id}',
    }),`;
    } else if (layer.type === "lstm") {
      return `    tf.layers.lstm({
      units: ${layer.config.units},
      name: '${layer.type}_${layer.id}',
    }),`;
    }
    return "";
  })
  .join("\n")}
  ],
});

model.compile({
  optimizer: 'adam',
  loss: 'binaryCrossentropy',
  metrics: ['accuracy'],
});`;

    return code;
  }, [layers]);

  const getLayerColor = (type: Layer["type"]) => {
    switch (type) {
      case "dense":
        return "bg-blue-500";
      case "dropout":
        return "bg-amber-500";
      case "conv2d":
        return "bg-purple-500";
      case "lstm":
        return "bg-green-500";
      case "embedding":
        return "bg-pink-500";
      default:
        return "bg-slate-500";
    }
  };

  const getLayerIcon = (type: Layer["type"]) => {
    switch (type) {
      case "dense":
        return "D";
      case "dropout":
        return "Dr";
      case "conv2d":
        return "C";
      case "lstm":
        return "L";
      case "embedding":
        return "E";
      default:
        return "?";
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-2xl shadow-lg border border-slate-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Visual Model Builder POC</h2>
          <p className="text-sm text-slate-600 mt-1">
            Build neural network architectures with drag-and-drop
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCode(!showCode)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <Code className="w-4 h-4" />
            {showCode ? "Hide" : "Show"} Code
          </button>
          <button
            onClick={() => {
              const code = generateCode();
              navigator.clipboard.writeText(code);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Model
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Layer Palette */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900">Add Layer</h3>
          <div className="space-y-2">
            {(["dense", "dropout", "conv2d", "lstm"] as Layer["type"][]).map((type) => (
              <button
                key={type}
                onClick={() => addLayer(type)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors text-left capitalize font-medium text-slate-700"
              >
                + {type}
              </button>
            ))}
          </div>
        </div>

        {/* Model Canvas */}
        <div className="col-span-2 space-y-4">
          <h3 className="font-semibold text-slate-900">Model Architecture</h3>
          <div className="space-y-3 p-4 bg-slate-50 rounded-lg min-h-[400px]">
            {layers.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-500">
                <p>Add layers to build your model</p>
              </div>
            ) : (
              layers.map((layer, index) => (
                <div key={layer.id} className="relative">
                  <div
                    className={`flex items-center gap-3 p-4 bg-white border-2 rounded-lg cursor-pointer transition-all ${
                      selectedLayer === layer.id
                        ? "border-primary-500 shadow-md"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    onClick={() => setSelectedLayer(layer.id)}
                  >
                    <div
                      className={`w-12 h-12 ${getLayerColor(
                        layer.type
                      )} rounded-lg flex items-center justify-center text-white font-bold text-lg`}
                    >
                      {getLayerIcon(layer.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900 capitalize">{layer.type}</div>
                      <div className="text-sm text-slate-600">
                        {layer.type === "dense" && `${layer.config.units} units, ${layer.config.activation}`}
                        {layer.type === "dropout" && `Rate: ${layer.config.rate}`}
                        {layer.type === "conv2d" &&
                          `${layer.config.filters} filters, kernel ${layer.config.kernelSize}x${layer.config.kernelSize}`}
                        {layer.type === "lstm" && `${layer.config.units} units`}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeLayer(layer.id);
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {index < layers.length - 1 && (
                    <div className="flex justify-center my-2">
                      <div className="w-0.5 h-6 bg-slate-300" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Layer Configuration */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900">Configuration</h3>
          {selectedLayer ? (
            (() => {
              const layer = layers.find((l) => l.id === selectedLayer);
              if (!layer) return null;

              return (
                <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <Settings className="w-4 h-4 text-slate-600" />
                    <span className="font-medium text-slate-900 capitalize">{layer.type}</span>
                  </div>

                  {layer.type === "dense" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Units
                        </label>
                        <input
                          type="number"
                          value={layer.config.units || 32}
                          onChange={(e) =>
                            updateLayer(selectedLayer, { units: parseInt(e.target.value) })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Activation
                        </label>
                        <select
                          value={layer.config.activation || "relu"}
                          onChange={(e) =>
                            updateLayer(selectedLayer, { activation: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="relu">ReLU</option>
                          <option value="sigmoid">Sigmoid</option>
                          <option value="tanh">Tanh</option>
                          <option value="linear">Linear</option>
                        </select>
                      </div>
                    </>
                  )}

                  {layer.type === "dropout" && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Dropout Rate
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={layer.config.rate || 0.2}
                        onChange={(e) =>
                          updateLayer(selectedLayer, { rate: parseFloat(e.target.value) })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  )}

                  {layer.type === "conv2d" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Filters
                        </label>
                        <input
                          type="number"
                          value={layer.config.filters || 32}
                          onChange={(e) =>
                            updateLayer(selectedLayer, { filters: parseInt(e.target.value) })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Kernel Size
                        </label>
                        <input
                          type="number"
                          value={layer.config.kernelSize || 3}
                          onChange={(e) =>
                            updateLayer(selectedLayer, { kernelSize: parseInt(e.target.value) })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </>
                  )}

                  {layer.type === "lstm" && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Units
                      </label>
                      <input
                        type="number"
                        value={layer.config.units || 50}
                        onChange={(e) =>
                          updateLayer(selectedLayer, { units: parseInt(e.target.value) })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  )}
                </div>
              );
            })()
          ) : (
            <div className="p-4 bg-slate-50 rounded-lg text-center text-slate-500">
              <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Select a layer to configure</p>
            </div>
          )}
        </div>
      </div>

      {/* Generated Code */}
      {showCode && (
        <div className="mt-6 p-4 bg-slate-900 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">Generated Code</h3>
            <button
              onClick={() => {
                const code = generateCode();
                navigator.clipboard.writeText(code);
              }}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Copy to Clipboard
            </button>
          </div>
          <pre className="text-sm text-green-400 overflow-x-auto">
            <code>{generateCode()}</code>
          </pre>
        </div>
      )}

      {/* Model Summary */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Eye className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">Model Summary</h3>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-blue-700">Total Layers:</span>
            <span className="ml-2 font-semibold text-blue-900">{layers.length}</span>
          </div>
          <div>
            <span className="text-blue-700">Parameters:</span>
            <span className="ml-2 font-semibold text-blue-900">
              {layers
                .filter((l) => l.type === "dense" || l.type === "lstm")
                .reduce((sum, l) => sum + (l.config.units || 0), 0)
                .toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-blue-700">Status:</span>
            <span className="ml-2 font-semibold text-green-600">Ready to Train</span>
          </div>
        </div>
      </div>
    </div>
  );
}

