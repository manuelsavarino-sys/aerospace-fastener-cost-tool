"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

// UI components
const Card = ({ children }) => (
  <div className="border rounded-xl p-4 shadow bg-white hover:shadow-lg transition">
    {children}
  </div>
);

const CardContent = ({ children, className }) => (
  <div className={className}>{children}</div>
);

const Button = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
  >
    {children}
  </button>
);

// COST MODEL
function estimateCost({ material, quantity, certification }) {
  const baseMap = {
    A286: 1.5,
    Titanium: 4.0,
    Inconel: 5.5,
    Steel: 1.0
  };

  const base = baseMap[material] || 2;
  const machining = base * 0.4;
  const treatment = base * 0.2;

  const cert = {
    aviation: 1.3,
    space: 2.0
  };

  let volume = 1;
  if (quantity > 10000) volume = 0.6;
  else if (quantity > 1000) volume = 0.75;
  else if (quantity > 100) volume = 0.9;

  return (base + machining + treatment) * cert[certification] * volume;
}

export default function Dashboard() {
  const [input, setInput] = useState({
    material: "Titanium",
    quantity: 1000,
    certification: "space"
  });

  const [result, setResult] = useState(null);
  const [supplierRanking, setSupplierRanking] = useState([]);

  useEffect(() => {
    fetch("/api/suppliers")
      .then(res => res.json())
      .then(setSupplierRanking);
  }, []);

  const handleCalculate = () => {
    const value = estimateCost(input);
    setResult(value.toFixed(2));
  };

  return (
    <div className="p-6 grid gap-6 bg-gray-50 min-h-screen">

      <h1 className="text-2xl font-bold">
        🚀 Aerospace Fastener Cost Intelligence
      </h1>

      <Card>
        <CardContent className="grid gap-3">
          <select onChange={e => setInput({...input, material: e.target.value})}>
            <option>Titanium</option>
            <option>A286</option>
            <option>Inconel</option>
            <option>Steel</option>
          </select>

          <input
            type="number"
            value={input.quantity}
            onChange={e => setInput({...input, quantity: Number(e.target.value)})}
          />

          <select onChange={e => setInput({...input, certification: e.target.value})}>
            <option value="aviation">Aviation</option>
            <option value="space">Space</option>
          </select>

          <Button onClick={handleCalculate}>Run Analysis</Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardContent>
            <h2>Estimated Cost</h2>
            <p>€{result} / unit</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <h2>🏭 Supplier Ranking (Real-time EU)</h2>

          {supplierRanking.length === 0 ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  <th>Supplier</th>
                  <th>Price</th>
                  <th>Lead</th>
                  <th>Score</th>
                </tr>
              </thead>

              <tbody>
                {supplierRanking.map((s, i) => (
                  <tr key={i}>
                    <td>{s.name}</td>
                    <td>€{s.price}</td>
                    <td>{s.leadTime}</td>
                    <td>{s.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
