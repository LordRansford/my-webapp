import React, { useEffect, useState } from "react";

export default function PythonPlayground() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    import("@runno/runtime")
      .then(() => {
        if (isMounted) setReady(true);
      })
      .catch((error) => {
        console.error("Unable to load Runno runtime", error);
        if (isMounted) setReady(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="tool-block">
      <h2>Try Python in your browser</h2>
      <p>Edit the code and click run:</p>

      {ready ? (
        <runno-run runtime="python" editor controls>
          {`print("Hello from Python in your browser!")`}
        </runno-run>
      ) : (
        <p style={{ color: "#4b5563" }}>
          Loading the Python runtime in your browser&hellip;
        </p>
      )}
    </section>
  );
}
