"use client";

import React, { useState } from "react";

// UI
const Card = ({ children }) => (
  <div className="border rounded-xl p-4 shadow bg-white mb-4">
    {children}
  </div>
);

export default function Dashboard() {

  const [inputValue, setInputValue] = useState("");
  const [parts, setParts] = useState([]);
  const [results, setResults] = useState([]);

  // ✅ aggiunta vite
  const addPart = () => {
    if (!inputValue) return;
    setParts([...parts, inputValue]);
    setInputValue("");
  };

  // ✅ analisi multipla
  const runAnalysis = async () => {
    const allResults = [];

    for (let part of parts) {
      const res = await fetch(`/api/suppliers?part=${part}`);
      const data = await res.json();
      allResults.push(data);
    }

    setResults(allResults);
  };

  // ✅ reset
  const handleReset = () => {
    setParts([]);
    setResults([]);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-2xl font-bold mb-4">
        🚀 Fastener Intelligence Tool
      </h1>

      {/* INPUT */}
      <Card>

        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Insert LN / NAS / MS part number"
          className="border p-2 rounded w-full"
        />

        <div className="flex gap-2 mt-3">

          <button
            onClick={addPart}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            Add
          </button>

          <button
            onClick={runAnalysis}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Run Analysis
          </button>

          <button
            onClick={handleReset}
            className="bg-gray-500 text-white px-3 py-1 rounded"
          >
            Reset
          </button>

        </div>

        <p className="mt-2 text-sm text-gray-600">
          Selected: {parts.join(", ")}
        </p>

      </Card>

      {/* RESULTS */}
      {results.map((r, idx) => {

        const best = r.suppliers.reduce((min, s) =>
          s.price < min.price ? s : min
        );

        return (
          <Card key={idx}>

            {/* 🔵 PART NUMBER */}
            <h2 className="text-xl font-bold text-blue-700">
              {r.part}
            </h2>

            <p><b>Material:</b> {r.parsed.material}</p>
            <p><b>Standard:</b> {r.parsed.standard}</p>

            {/* 🟣 EQUIVALENTE */}
            <p className="text-purple-600 mt-1">
              🔄 Equivalent: {r.equivalent}
            </p>

            {/* 🟢 BEST SUPPLIER */}
            <p className="text-green-600 font-bold mt-2">
              ✅ Best Supplier: {best.name} (€{best.price})
            </p>

            {/* LISTA FORNITORI */}
            <div className="mt-2">
              {r.suppliers.map(s => {

                const color =
                  s.price < 8 ? "text-green-600" :
                  s.price < 10 ? "text-yellow-600" :
                  "text-red-600";

                return (
                  <div key={s.name}>
                    <span className="font-semibold">{s.name}</span> →
                    <span className={color}> €{s.price}</span>
                    {" "}({s.leadTime} w)
                  </div>
                );
              })}
            </div>

          </Card>
        );
      })}

    </div>
  );
}
