import { useState } from "react";

export default function CryptoDemo() {
  const [randomNumber, setRandomNumber] = useState(null);
  const [error, setError] = useState(null);

  const generateRandom = () => {
    const cryptoApi = globalThis.crypto;

    if (!cryptoApi?.getRandomValues) {
      setError("Your browser doesn't expose the Web Crypto API.");
      return;
    }

    const array = new Uint32Array(1);
    cryptoApi.getRandomValues(array);

    setRandomNumber(array[0]);
    setError(null);
  };

  return (
    <section className="panel">
      <div className="panel__header">
        <p className="eyebrow">Entropy check</p>
        <p className="muted">
          Uses <code>crypto.getRandomValues</code> so the output is suitable for keys, tokens, and session
          secrets.
        </p>
      </div>
      <button className="button secondary" onClick={generateRandom}>
        Generate random number
      </button>
      {error && <p className="status status--warn">{error}</p>}
      {randomNumber !== null && (
        <p className="status status--ok">
          Random number: <strong>{randomNumber}</strong>
        </p>
      )}
    </section>
  );
}
