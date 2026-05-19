"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// UI
const Card = ({ children }) => (
  <div className="border rounded-xl p-4 shadow bg-white">
    {children}
  </div>
);

const Button = ({ children }) => (
  <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
    {children}
  </button>
);

export default function Dashboard() {

  const [partNumber, setPartNumber] = useState("LN29950J0614B");
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/suppliers?part=${partNumber}`)
      .then(res => res.json())
      .then(d => setData(d))
      .catch(err => console.error(err));
  }, [partNumber]);

  if (!data || !data.suppliers) {
    return <p className="p-6">Loading...</p>;
  }

  // ✅ best supplier
  const bestSupplier = data.suppliers.reduce((min, s) =>
    s.price < min.price ? s : min
  );

  return (
    <div className="p-6 grid gap-6 bg-gray-50 min-h-screen">

      <h1 className="text-2xl font-bold">
        🚀 Aerospace Fastener Dashboard
      </h1>

      {/* INPUT */}
      <Card>
        <input
          value={partNumber}
          onChange={(e) => setPartNumber(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </Card>

      {/* PART INFO */}
      <Card>
        <h2 className="font-semibold">Part Info</h2>
        <p>Part: {data.part}</p>
        <p>Material: {data.parsed.material}</p>
        <p>Standard: {data.parsed.standard}</p>
        <p className="text-sm text-green-600">LIVE DATA</p>
      </Card>

      {/* BEST SUPPLIER */}
      <Card>
        <h2 className="font-semibold">🏆 Best Supplier</h2>
        <p className="text-green-600 font-bold">{bestSupplier.name}</p>
        <p>€{bestSupplier.price} | {bestSupplier.leadTime} weeks</p>
      </Card>

      {/* CHART */}
      <Card>
        <h2 className="font-semibold">📊 Supplier Prices</h2>

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
        <h2 className="font-semibold">🏭 Suppliers</h2>

        <table className="w-full text-sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Lead</th>
            </tr>
          </thead>

          <tbody>
            {data.suppliers.map(s => {
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
