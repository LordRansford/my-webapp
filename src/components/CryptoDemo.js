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
    <section className="tool-block">
      <h2>Cryptographically secure random number</h2>
      <p>
        I lean on the browser&apos;s Web Crypto API here, never{" "}
        <code>Math.random()</code>, so you get a real cryptography-grade
        source.
      </p>
      <button className="button primary" onClick={generateRandom}>
        Generate random number
      </button>
      {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
      {randomNumber !== null && (
        <p>
          Random number: <strong>{randomNumber}</strong>
        </p>
      )}
    </section>
  );
}
