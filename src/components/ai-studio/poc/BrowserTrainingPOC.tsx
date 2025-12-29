"use client";

/**
 * Proof of Concept: Browser-Based Model Training
 * 
 * This component demonstrates:
 * - TensorFlow.js integration
 * - Real-time training visualization
 * - Progress tracking
 * - Model evaluation
 * - Export capabilities
 */

import React, { useState, useCallback, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import { Play, Pause, Square, Download, TrendingUp } from "lucide-react";

interface TrainingState {
  status: "idle" | "training" | "paused" | "completed" | "error";
  epoch: number;
  totalEpochs: number;
  progress: number;
  metrics: {
    loss: number[];
    accuracy: number[];
    valLoss: number[];
    valAccuracy: number[];
  };
  currentMetrics: {
    loss: number;
    accuracy: number;
    valLoss: number;
    valAccuracy: number;
  };
}

export default function BrowserTrainingPOC() {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [trainingState, setTrainingState] = useState<TrainingState>({
    status: "idle",
    epoch: 0,
    totalEpochs: 50,
    progress: 0,
    metrics: {
      loss: [],
      accuracy: [],
      valLoss: [],
      valAccuracy: [],
    },
    currentMetrics: {
      loss: 0,
      accuracy: 0,
      valLoss: 0,
      valAccuracy: 0,
    },
  });

  const [isPaused, setIsPaused] = useState(false);
  const [trainingConfig, setTrainingConfig] = useState({
    learningRate: 0.001,
    batchSize: 32,
    epochs: 50,
    validationSplit: 0.2,
  });

  // Create a simple model for demonstration
  const createModel = useCallback(() => {
    const newModel = tf.sequential({
      layers: [
        tf.layers.dense({
          inputShape: [10],
          units: 64,
          activation: "relu",
          name: "dense1",
        }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({
          units: 32,
          activation: "relu",
          name: "dense2",
        }),
        tf.layers.dense({
          units: 1,
          activation: "sigmoid",
          name: "output",
        }),
      ],
    });

    newModel.compile({
      optimizer: tf.train.adam(trainingConfig.learningRate),
      loss: "binaryCrossentropy",
      metrics: ["accuracy"],
    });

    setModel(newModel);
    return newModel;
  }, [trainingConfig.learningRate]);

  // Generate synthetic data for demonstration
  const generateSyntheticData = useCallback(() => {
    const numSamples = 1000;
    const numFeatures = 10;

    const xs = tf.randomNormal([numSamples, numFeatures]);
    const ys = tf.randomUniform([numSamples, 1], 0, 2).floor();

    return { xs, ys };
  }, []);

  // Training function
  const trainModel = useCallback(async () => {
    if (!model) {
      const newModel = createModel();
      setModel(newModel);
      return;
    }

    setTrainingState((prev) => ({ ...prev, status: "training", epoch: 0 }));

    const { xs, ys } = generateSyntheticData();
    const splitIndex = Math.floor(xs.shape[0] * (1 - trainingConfig.validationSplit));
    const trainXs = xs.slice([0, 0], [splitIndex, -1]);
    const trainYs = ys.slice([0, 0], [splitIndex, -1]);
    const valXs = xs.slice([splitIndex, 0], [-1, -1]);
    const valYs = ys.slice([splitIndex, 0], [-1, -1]);

    try {
      for (let epoch = 0; epoch < trainingConfig.epochs; epoch++) {
        if (isPaused) {
          setTrainingState((prev) => ({ ...prev, status: "paused" }));
          await new Promise((resolve) => {
            const checkPause = setInterval(() => {
              if (!isPaused) {
                clearInterval(checkPause);
                resolve(null);
              }
            }, 100);
          });
          setTrainingState((prev) => ({ ...prev, status: "training" }));
        }

        const history = await model.fit(trainXs, trainYs, {
          epochs: 1,
          batchSize: trainingConfig.batchSize,
          validationData: [valXs, valYs],
          verbose: 0,
          callbacks: {
            onEpochEnd: (epochNum, logs) => {
              setTrainingState((prev) => ({
                ...prev,
                epoch: epoch + 1,
                progress: ((epoch + 1) / trainingConfig.epochs) * 100,
                metrics: {
                  loss: [...prev.metrics.loss, logs?.loss || 0],
                  accuracy: [...prev.metrics.accuracy, logs?.acc || 0],
                  valLoss: [...prev.metrics.valLoss, logs?.val_loss || 0],
                  valAccuracy: [...prev.metrics.valAccuracy, logs?.val_acc || 0],
                },
                currentMetrics: {
                  loss: logs?.loss || 0,
                  accuracy: logs?.acc || 0,
                  valLoss: logs?.val_loss || 0,
                  valAccuracy: logs?.val_acc || 0,
                },
              }));
            },
          },
        });

        // Small delay for visualization
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      setTrainingState((prev) => ({ ...prev, status: "completed" }));

      // Cleanup
      xs.dispose();
      ys.dispose();
      trainXs.dispose();
      trainYs.dispose();
      valXs.dispose();
      valYs.dispose();
    } catch (error) {
      console.error("Training error:", error);
      setTrainingState((prev) => ({ ...prev, status: "error" }));
    }
  }, [model, trainingConfig, isPaused, createModel, generateSyntheticData]);

  const handleStart = () => {
    if (trainingState.status === "paused") {
      setIsPaused(false);
    } else {
      trainModel();
    }
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleStop = () => {
    setIsPaused(false);
    setTrainingState({
      status: "idle",
      epoch: 0,
      totalEpochs: trainingConfig.epochs,
      progress: 0,
      metrics: {
        loss: [],
        accuracy: [],
        valLoss: [],
        valAccuracy: [],
      },
      currentMetrics: {
        loss: 0,
        accuracy: 0,
        valLoss: 0,
        valAccuracy: 0,
      },
    });
    if (model) {
      model.stopTraining = true;
    }
  };

  const handleExport = async () => {
    if (!model) return;

    try {
      // Export model as JSON + weights
      const saveResult = await model.save("downloads://my-model");
      console.log("Model exported:", saveResult);
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  useEffect(() => {
    // Initialize model on mount
    createModel();

    return () => {
      // Cleanup
      if (model) {
        model.dispose();
      }
    };
  }, []);

  return (
    <div className="space-y-6 p-6 bg-white rounded-2xl shadow-lg border border-slate-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Browser Training POC</h2>
          <p className="text-sm text-slate-600 mt-1">
            Train a neural network directly in your browser using TensorFlow.js
          </p>
        </div>
        <div className="flex items-center gap-2">
          {trainingState.status === "completed" && (
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Model
            </button>
          )}
        </div>
      </div>

      {/* Training Configuration */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
        <div>
          <label className="text-sm font-medium text-slate-700">Learning Rate</label>
          <input
            type="number"
            step="0.0001"
            value={trainingConfig.learningRate}
            onChange={(e) =>
              setTrainingConfig({ ...trainingConfig, learningRate: parseFloat(e.target.value) })
            }
            disabled={trainingState.status === "training"}
            className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Batch Size</label>
          <input
            type="number"
            value={trainingConfig.batchSize}
            onChange={(e) =>
              setTrainingConfig({ ...trainingConfig, batchSize: parseInt(e.target.value) })
            }
            disabled={trainingState.status === "training"}
            className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Epochs</label>
          <input
            type="number"
            value={trainingConfig.epochs}
            onChange={(e) =>
              setTrainingConfig({ ...trainingConfig, epochs: parseInt(e.target.value) })
            }
            disabled={trainingState.status === "training"}
            className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Training Controls */}
      <div className="flex items-center gap-3">
        {trainingState.status === "idle" || trainingState.status === "completed" ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
          >
            <Play className="w-5 h-5" />
            Start Training
          </button>
        ) : trainingState.status === "paused" ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
          >
            <Play className="w-5 h-5" />
            Resume
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-semibold"
          >
            <Pause className="w-5 h-5" />
            Pause
          </button>
        )}

        {trainingState.status === "training" && (
          <button
            onClick={handleStop}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
          >
            <Square className="w-5 h-5" />
            Stop
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {trainingState.status !== "idle" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">
              Epoch {trainingState.epoch} / {trainingConfig.epochs}
            </span>
            <span className="text-slate-600">{Math.round(trainingState.progress)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300"
              style={{ width: `${trainingState.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Current Metrics */}
      {trainingState.status === "training" && (
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="text-sm text-slate-600">Loss</div>
            <div className="text-2xl font-bold text-slate-900">
              {trainingState.currentMetrics.loss.toFixed(4)}
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="text-sm text-slate-600">Accuracy</div>
            <div className="text-2xl font-bold text-green-600">
              {(trainingState.currentMetrics.accuracy * 100).toFixed(2)}%
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="text-sm text-slate-600">Val Loss</div>
            <div className="text-2xl font-bold text-slate-900">
              {trainingState.currentMetrics.valLoss.toFixed(4)}
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="text-sm text-slate-600">Val Accuracy</div>
            <div className="text-2xl font-bold text-green-600">
              {(trainingState.currentMetrics.valAccuracy * 100).toFixed(2)}%
            </div>
          </div>
        </div>
      )}

      {/* Metrics Chart Placeholder */}
      {trainingState.metrics.loss.length > 0 && (
        <div className="p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-slate-900">Training Metrics</h3>
          </div>
          <div className="h-64 flex items-center justify-center text-slate-500">
            <p>Chart visualization would go here (using Recharts or similar)</p>
            <p className="text-xs mt-2">
              Loss: {trainingState.metrics.loss.length} points | Accuracy:{" "}
              {trainingState.metrics.accuracy.length} points
            </p>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {trainingState.status === "completed" && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">Training completed successfully!</p>
          <p className="text-sm text-green-700 mt-1">
            Final accuracy: {(trainingState.currentMetrics.accuracy * 100).toFixed(2)}%
          </p>
        </div>
      )}

      {trainingState.status === "error" && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">Training error occurred</p>
          <p className="text-sm text-red-700 mt-1">Please check the console for details.</p>
        </div>
      )}
    </div>
  );
}

