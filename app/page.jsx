import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";


// ✅ Simple UI components (no external deps)
const Card = ({ children }) => (
  <div className="border rounded-xl p-3 shadow bg-white">{children}</div>
);


const CardContent = ({ children, className }) => (
  <div className={className}>{children}</div>
);


const Button = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
  >
    {children}
  </button>
);


// ------------------ COST MODEL ------------------
function estimateCost({ material, quantity, certification }) {
  const materialBase = {
    A286: 1.5,
    Titanium: 4.0,
    Inconel: 5.5,
    Steel: 1.0
  };

  const base = materialBase[material] || 2.0;
  const machining = base * 0.4;
  const treatment = base * 0.2;

  const certMultiplier = {
    commercial: 1.0,
    aviation: 1.3,
    space: 2.0
  };

  let volumeDiscount = 1.0;
  if (quantity > 10000) volumeDiscount = 0.6;
  else if (quantity > 1000) volumeDiscount = 0.75;
  else if (quantity > 100) volumeDiscount = 0.9;

  const total = (base + machining + treatment) * certMultiplier[certification] * volumeDiscount;

  return { total, base, machining, treatment };
}

export default function Dashboard() {
  const [input, setInput] = useState({
    material: "Titanium",
    quantity: 1000,
    certification: "space"
  });

  const [result, setResult] = useState(null);
  const [certComparison, setCertComparison] = useState([]);
  const [breakdown, setBreakdown] = useState([]);

  const supplierRange = { min: 6.5, max: 10.8 };


  const supplierRanking = [
    { name: "LISI Aerospace", price: 8.5, leadTime: 6, score: 9.2 },
    { name: "Böllhoff", price: 7.8, leadTime: 5, score: 8.7 },
    { name: "Würth", price: 7.0, leadTime: 4, score: 8.0 },
    { name: "Fabory", price: 6.8, leadTime: 3, score: 7.5 }
  ];

  const materialTrends = [
    { material: "Steel", change: 5 },
    { material: "A286", change: 8 },
    { material: "Titanium", change: 15 },
    { material: "Inconel", change: 12 }
  ];

  const getAISuggestion = (material, certification, cost) => {
    if (material === "Titanium" && certification === "space") {
      return "Consider switching to A286: ~30% cost reduction.";
    }
    if (cost > 9) {
      return "High cost: evaluate cheaper supplier or increase batch.";
    }
    return "Configuration cost-efficient.";
  };

  const handleCalculate = () => {
    const res = estimateCost(input);
    setResult(res.total.toFixed(2));

    setCertComparison([
      { certification: "aviation", cost: estimateCost({ ...input, certification: "aviation" }).total },
      { certification: "space", cost: estimateCost({ ...input, certification: "space" }).total }
    ]);
    setBreakdown([
      {
        name: "Cost",
        material: res.base,
        machining: res.machining,
        treatment: res.treatment
      }
    ]);
  };

  return (
    <div className="p-6 grid gap-6">
      <Card>
        <CardContent className="grid gap-3">
          <h1 className="text-xl font-bold">Aerospace Cost Dashboard</h1>
          <select onChange={(e) => setInput({ ...input, material: e.target.value })}>
            <option>Titanium</option>
            <option>A286</option>
            <option>Inconel</option>
            <option>Steel</option>
          </select>

          <input
            type="number"
            value={input.quantity}
            onChange={(e) => setInput({ ...input, quantity: Number(e.target.value) })}
          />
          <select onChange={(e) => setInput({ ...input, certification: e.target.value })}>
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
            <p>€{result}</p>
            <p>Market range: €{supplierRange.min} – €{supplierRange.max}</p>
            <p style={{ color: "blue" }}>
              {getAISuggestion(input.material, input.certification, Number(result))}
            </p>
          </CardContent>
        </Card>
      )}

      {certComparison.length > 0 && (
        <Card>
          <CardContent>
            <h2>Certification Comparison</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={certComparison}>
                <XAxis dataKey="certification" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cost" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {breakdown.length > 0 && (
        <Card>
          <CardContent>
            <h2>Cost Breakdown</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={breakdown}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="material" stackId="a" />
                <Bar dataKey="machining" stackId="a" />
                <Bar dataKey="treatment" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <Card>        <CardContent>
          <h2>Supplier Ranking</h2>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Price</th>
                <th>Lead Time</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {supplierRanking.map((s, i) => (
                <tr key={i}>
                  <td>{s.name}</td>
                  <td>{s.price}</td>
                  <td>{s.leadTime}</td>
                  <td>{s.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
