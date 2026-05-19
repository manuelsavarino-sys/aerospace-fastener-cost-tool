"use client";

import React, { useState, useEffect } from "react";

// UI
const Card = ({ children }) => (
  <div className="border rounded-xl p-4 shadow bg-white">{children}</div>
);

const Button = ({ children, onClick }) => (
  <button onClick={onClick} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
    {children}
  </button>
);

// MODEL
function estimateCost({ material }) {
  const baseMap = {
    Titanium: 4,
    A286: 1.5,
    Inconel: 5.5,
    Steel: 1
  };

  return baseMap[material] || 2;
}

export default function Dashboard() {

  const [partNumber, setPartNumber] = useState("LN29950J0614B");
  const [data, setData] = useState(null);
  const [result, setResult] = useState(null);

  // API call
  useEffect(() => {
    fetch(`/api/suppliers?part=${partNumber}`)
      .then(res => res.json())
      .then(setData);
  }, [partNumber]);

  const handleCalculate = () => {
    const value = estimateCost({ material: "Titanium" });
    setResult(value.toFixed(2));
  };

  return (
    <div className="p-6 grid gap-6 bg-gray-50 min-h-screen">

      <h1 className="text-2xl font-bold">🚀 Aerospace Fastener Tool</h1>

      {/* INPUT */}
      <Card>
        <input
          value={partNumber}
          onChange={(e) => setPartNumber(e.target.value)}
        />
        <Button onClick={handleCalculate}>Run Analysis</Button>
      </Card>

      {/* INFO PART */}
      {data && (
        <Card>
          <h2>Part Info</h2>
          <p>Part: {data.part}</p>
          <p>Material: {data.material}</p>
          <p>Certification: {data.certification}</p>
        </Card>
      )}

      {/* COST */}
      {result && (
        <Card>
          <h2>Cost Estimate</h2>
          <p>€{result}</p>
        </Card>
      )}

      {/* SUPPLIERS */}
      {data && (
        <Card>
          <h2>EU Suppliers</h2>
          {data.suppliers
            .filter(s => s.region === "EU")
            .map(s => (
              <p key={s.name}>
                {s.name} → €{s.price} | {s.leadTime} weeks
              </p>
            ))}

          <h2 className="mt-4">Non-EU Suppliers</h2>
          {data.suppliers
            .filter(s => s.region === "non-EU")
            .map(s => (
              <p key={s.name}>
                {s.name} → €{s.price} | {s.leadTime} weeks
              </p>
            ))}
        </Card>
      )}

    </div>
  );
}
