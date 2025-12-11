import React from "react";
import CryptoDemo from "@/components/CryptoDemo";
import PythonPlayground from "@/components/PythonPlayground";
import RsaPlayground from "@/components/RsaPlayground";

export default function Tools() {
  return (
    <div className="tool-grid">
      <PythonPlayground />
      <RsaPlayground />
      <CryptoDemo />
    </div>
  );
}
