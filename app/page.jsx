"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import jsPDF from "jspdf";

// ✅ dynamic charts (NO SSR bug)
const BarChart = dynamic(() => import("recharts").then(m => m.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then(m => m.Bar), { ssr: false });
const XAxis = dynamic(() => import("recharts").then(m => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then(m => m.YAxis), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then(m => m.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then(m => m.ResponsiveContainer), { ssr: false });

// UI
const Card = ({ children }) => (
  <div className="border rounded-xl p-4 shadow bg-white">
    {children}
  </div>
);

export default function Dashboard() {

  const [inputValue, setInputValue] = useState("");
  const [parts, setParts] = useState([]);
  const [results, setResults] = useState([]);

  // ✅ aggiungi vite alla lista
  const addPart = () => {
    if (!inputValue) return;
    setParts([...parts, inputValue]);
    setInputValue("");
  };

  // ✅ lancia analisi multipla
  const runAnalysis = async () => {
    const allResults = [];

    for (let part of parts) {
      const res = await fetch(`/api/suppliers?part=${part}`);
      const data = await res.json();
      allResults.push(data);
    }

    setResults(allResults);
  };

  // ✅ export PDF
  const exportPDF = () => {

    const doc = new jsPDF();

    let y = 10;

    results.forEach((r, index) => {
      doc.text(`Part: ${r.part}`, 10, y);
      y += 6;
      doc.text(`Material: ${r.parsed.material}`, 10, y);
      y += 6;

      r.suppliers.slice(0, 3).forEach(s => {
        doc.text(`${s.name} - €${s.price}`, 10, y);
        y += 6;
      });

      y += 10;
    });

    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, "-");

    const filename =
      parts.join("_") + "_" + timestamp + ".pdf";

    doc.save(filename);
  };

  // ✅ dati grafico
  const chartData = results.flatMap(r =>
    r.suppliers.map(s => ({
      name: s.name,
      price: s.price,
      part: r.part
    }))
  );

  return (
    <div className="p-6 grid gap-6 bg-gray-50 min-h-screen">

      <h1 className="text-2xl font-bold">
        🚀 Fastener Comparison Dashboard
      </h1>

      {/* INPUT */}
      <Card>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Insert part number"
          className="border p-2 rounded w-full"
        />

        <div className="flex gap-2 mt-2">
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
            onClick={exportPDF}
            className="bg-gray-700 text-white px-3 py-1 rounded"
          >
            Export PDF
          </button>
        </div>

        <p className="text-sm mt-2">
          Selected: {parts.join(", ")}
        </p>
      </Card>

      {/* CHART */}
      {results.length > 0 && (
        <Card>
          <h2>📊 Comparison Chart</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="price" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* RESULTS */}
      {results.map((r, idx) => {

        const best = r.suppliers.reduce((min, s) =>
          s.price < min.price ? s : min
        );

        return (
          <Card key={idx}>
            <h2>{r.part}</h2>

            <p>Material: {r.parsed.material}</p>
            <p>Standard: {r.parsed.standard}</p>

            <p className="text-green-600 font-bold">
              Best: {best.name} (€{best.price})
            </p>

            <ul>
              {r.suppliers.map(s => (
                <li key={s.name}>
                  {s.name} - €{s.price} ({s.leadTime}w)
                </li>
              ))}
            </ul>
          </Card>
        );
      })}

    </div>
  );
}
