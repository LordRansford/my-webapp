import React, { useEffect } from 'react';

export default function PythonPlayground() {
  // Load Runno only in the browser
  useEffect(() => {
    import('@runno/runtime');
  }, []);

  return (
    <section style={{ marginTop: '2rem' }}>
      <h2>Try Python in your browser</h2>
      <p>Edit the code and click run:</p>

      {/*
        <runno-run> is a custom element provided by Runno.
        runtime="python" tells it to use a Python interpreter compiled to WebAssembly.
      */}
      <runno-run runtime="python" editor controls>
print("Hello from Python in your browser!")
      </runno-run>
    </section>
  );
}
