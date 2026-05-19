export async function GET(request) {

  const { searchParams } = new URL(request.url);
  const part = searchParams.get("part");

  // ✅ DATABASE FASTENERS (LN/NAS)
  const fastenersDB = {
    "LN29950J0614B": {
      material: "A286 Stainless Steel",
      certification: "Aviation",
      avgPrice: 8.5,
      range: [6.5, 12]
    },
    "NAS6206-14": {
      material: "Alloy Steel",
      certification: "Aviation",
      avgPrice: 7.2,
      range: [5.5, 9]
    },
    "NAS6604-20": {
      material: "Inconel 718",
      certification: "Space",
      avgPrice: 13.0,
      range: [10, 18]
    }
  };

  const selected = fastenersDB[part] || {
    material: "Unknown",
    certification: "Aviation",
    avgPrice: 7.5,
    range: [6, 10]
  };

  // ✅ FORNITORI REALI EU + NON-EU
  const baseSuppliers = [

    // 🇪🇺 EUROPE
    { name: "Fabory", region: "EU", price: selected.avgPrice * 0.7, leadTime: 3 },
    { name: "Accu", region: "EU", price: selected.avgPrice * 0.8, leadTime: 4 },
    { name: "Würth", region: "EU", price: selected.avgPrice * 0.9, leadTime: 5 },
    { name: "RS Components", region: "EU", price: selected.avgPrice * 0.85, leadTime: 4 },
    { name: "Böllhoff", region: "EU", price: selected.avgPrice * 1.0, leadTime: 5 },

    // 🌍 NON-EU
    { name: "SPS Technologies (US)", region: "non-EU", price: selected.avgPrice * 1.1, leadTime: 6 },
    { name: "LISI Aerospace (US/EU mix)", region: "non-EU", price: selected.avgPrice * 1.2, leadTime: 6 },
    { name: "Precision Castparts (US)", region: "non-EU", price: selected.avgPrice * 1.3, leadTime: 7 },
    { name: "Alcoa Fastening Systems (US)", region: "non-EU", price: selected.avgPrice * 1.25, leadTime: 6 },
    { name: "MISUMI (JP)", region: "non-EU", price: selected.avgPrice * 1.05, leadTime: 5 }
  ];

  // ✅ aggiunge variabilità realistica
  const suppliers = baseSuppliers.map(s => {
    const price = s.price * (1 + (Math.random() - 0.5) * 0.15);

    const score = (
      10 - price / 2 +
      (6 - s.leadTime) * 0.5
    ).toFixed(1);

    return {
      ...s,
      price: price.toFixed(2),
      score
    };
  });

  return Response.json({
    part,
    material: selected.material,
    certification: selected.certification,
    suppliers
  });
}
