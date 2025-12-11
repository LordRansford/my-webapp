import { useCallback, useMemo, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { Brain, Play } from "lucide-react";

const COLORS = ["#7ae7c7", "#7aa8ff"];

export default function TinyModel() {
  const [points, setPoints] = useState([]);
  const [label, setLabel] = useState(0);
  const [status, setStatus] = useState("Click on the canvas to add points, then train.");
  const [model, setModel] = useState(null);

  const canvasSize = 320;

  const addPoint = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = ((event.clientX || event.touches?.[0].clientX) - rect.left) / rect.width;
    const y = ((event.clientY || event.touches?.[0].clientY) - rect.top) / rect.height;
    setPoints((prev) => [...prev, { x, y, label }]);
  };

  const train = async () => {
    if (points.length < 4) {
      setStatus("Add at least four points to train.");
      return;
    }
    setStatus("Training...");

    const xs = tf.tensor2d(
      points.map((p) => [p.x, p.y]),
      [points.length, 2],
    );
    const ys = tf.tensor2d(
      points.map((p) => [p.label === 1 ? 1 : 0]),
      [points.length, 1],
    );

    const net = tf.sequential();
    net.add(tf.layers.dense({ units: 8, activation: "tanh", inputShape: [2] }));
    net.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));
    net.compile({ optimizer: tf.train.adam(0.05), loss: "binaryCrossentropy" });

    await net.fit(xs, ys, { epochs: 30, batchSize: 8, shuffle: true });
    setModel(net);
    tf.dispose([xs, ys]);
    setStatus("Model trained. Tap anywhere to classify.");
  };

  const predict = useCallback((x, y) => {
    if (!model) return null;
    const input = tf.tensor2d([[x, y]]);
    const output = model.predict(input);
    const value = output.dataSync()[0];
    tf.dispose([input, output]);
    return value > 0.5 ? 1 : 0;
  }, [model]);

  const grid = useMemo(() => {
    const cells = [];
    const step = 0.05;
    for (let x = 0; x <= 1; x += step) {
      for (let y = 0; y <= 1; y += step) {
        cells.push({ x, y, label: predict(x, y) });
      }
    }
    return cells;
  }, [predict]);

  return (
    <div className="panel game">
      <div className="panel__header">
        <div className="chip chip--accent">
          <Brain size={14} aria-hidden="true" />
          Train a tiny model
        </div>
        <p className="muted">Label points, train, then see how the classifier separates space.</p>
      </div>

      <div className="tiny-grid">
        <div className="tiny-canvas">
          <div
            className="canvas"
            style={{ width: canvasSize, height: canvasSize }}
            onClick={addPoint}
            onTouchStart={(event) => {
              event.preventDefault();
              addPoint(event);
            }}
          >
            {grid.map(
              (cell, idx) =>
                cell.label !== null && (
                  <div
                    key={idx}
                    className="cell"
                    style={{
                      left: `${cell.x * 100}%`,
                      top: `${cell.y * 100}%`,
                      background: cell.label === 1 ? `${COLORS[1]}33` : `${COLORS[0]}33`,
                    }}
                  />
                ),
            )}
            {points.map((p, idx) => (
              <div
                key={idx}
                className="point"
                style={{
                  left: `${p.x * 100}%`,
                  top: `${p.y * 100}%`,
                  background: COLORS[p.label],
                }}
              />
            ))}
          </div>
        </div>

        <div className="tiny-controls">
          <div className="control-row">
            <label className="control">
              Active label
              <div className="pill-row">
                {[0, 1].map((l) => (
                  <button
                    key={l}
                    className={`pill ${label === l ? "pill--accent" : ""}`}
                    onClick={() => setLabel(l)}
                  >
                    Class {l + 1}
                  </button>
                ))}
              </div>
            </label>
          </div>
          <button className="button primary" onClick={train}>
            <Play size={16} aria-hidden="true" />
            Train
          </button>
          <button
            className="button ghost"
            onClick={() => {
              setPoints([]);
              setModel(null);
              setStatus("Reset. Add points and train again.");
            }}
          >
            Reset
          </button>
          <div className="status status--ok">{status}</div>
          <p className="muted">All computation stays in your browser. No data leaves the page.</p>
        </div>
      </div>
    </div>
  );
}
