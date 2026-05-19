"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// ✅ Recharts safe
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

const Button = ({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
  >
    Search
  </button>
);

export default function Dashboard() {

  // ✅ input libero utente
  const [inputValue, setInputValue] = useState("LN29950J0614B");

  // ✅ valore effettivo della richiesta
  const [queryPart, setQueryPart] = useState("LN29950J0614B");

  const [data, setData] = useState(null);

  // ✅ fetch SOLO quando clicchi search
  useEffect(() => {
    fetch(`/api/suppliers?part=${queryPart}`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, [queryPart]);

  // ✅ loading
  if (!data || !data.suppliers) {
    return <p className="p-6">Loading...</p>;
  }

  const bestSupplier = data.suppliers.reduce((min, s) =>
    s.price < min.price ? s : min
  );

  return (
    <div className="p-6 grid gap-6 bg-gray-50 min-h-screen">

      <h1 className="text-2xl font-bold">
        🚀 Aerospace Fastener Dashboard
      </h1>

      {/* ✅ INPUT LIBERO */}
      <Card>
        <h2 className="font-semibold mb-2">Search Fastener</h2>

        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter LN / NAS / MS part number"
          className="border p-2 rounded w-full"
        />

        <Button onClick={() => setQueryPart(inputValue)}>
          Run Analysis
        </Button>
      </Card>

      {/* PART INFO */}
      <Card>
        <h2>Part Info</h2>
        <p><b>Part:</b> {data.part}</p>
        <p><b>Material:</b> {data.parsed.material}</p>
        <p><b>Standard:</b> {data.parsed.standard}</p>
      </Card>

      {/* BEST SUPPLIER */}
      <Card>
        <h2>🏆 Best Supplier</h2>
        <p className="text-green-600 font-bold">
          {bestSupplier.name}
        </p>
        <p>€{bestSupplier.price} | {bestSupplier.leadTime} weeks</p>
      </Card>

      {/* CHART */}
      <Card>
        <h2>📊 Supplier Prices</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.suppliers}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="price" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* TABLE */}
      <Card>
        <h2>🏭 Suppliers</h2>

        <table className="w-full text-sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Lead</th>
            </tr>
          </thead>

          <tbody>
            {data.suppliers.map((s) => {

              const color =
                s.price < 8 ? "text-green-600" :
                s.price < 10 ? "text-yellow-600" :
                "text-red-600";

              return (
                <tr
                  key={s.name}
                  className={
                    s.name === bestSupplier.name
                      ? "bg-green-100 font-bold"
                      : ""
                  }
                >
                  <td>{s.name}</td>
                  <td className={color}>€{s.price}</td>
                  <td>{s.leadTime} w</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

    </div>
  );
}
