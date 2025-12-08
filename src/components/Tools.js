import React from "react";
import CryptoDemo from "@/components/CryptoDemo";
import PythonPlayground from "@/components/PythonPlayground";

export default function Tools() {
  return (
    <div className="stack">
      <div className="card">
        <PythonPlayground />
      </div>
      <div className="card">
        <CryptoDemo />
      </div>
    </div>
  );
}
