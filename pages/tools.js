import React, { useState } from 'react';
import PythonPlayground from '../components/PythonPlayground';

export default function ToolsPage() {
  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem' }}>
      <h1>Interactive Tools</h1>
      <p>
        Experiment with Python and cryptography directly in your browser. Nothing
        runs on my server – it all runs on your device for safety.
      </p>

      <PythonPlayground />
      <CryptoDemo />
    </main>
  );
}

// Simple Web Crypto API demo
function CryptoDemo() {
  const [randomNumber, setRandomNumber] = useState(null);

  const generateRandom = () => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    setRandomNumber(array[0]);
  };

  return (
    <section style={{ marginTop: '2rem' }}>
      <h2>Cryptographically secure random number</h2>
      <p>
        This uses the browser&apos;s Web Crypto API, not Math.random(), so it is
        suitable for security demos.
      </p>
      <button onClick={generateRandom}>Generate random number</button>
      {randomNumber !== null && (
        <p>
          🎲 Random number: <strong>{randomNumber}</strong>
        </p>
      )}
    </section>
  );
}
