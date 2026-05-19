export async function GET(request) {

  const { searchParams } = new URL(request.url);
  const part = searchParams.get("part");

  // ✅ DATABASE LN + NAS (base reale)
  const fastenerDB = {
    "LN29950J0614B": {
      standard: "LN",
      material: "A286 Stainless Steel",
      type: "Bolt",
      equivalent: "NAS6206-14"
    },
    "NAS6206-14": {
      standard: "NAS",
      material: "Alloy Steel",
      type: "Bolt",
      equivalent: "LN29950J0614B"
    },
    "NAS6604-20": {
      standard: "NAS",
      material: "Inconel 718",
      type: "High-strength bolt",
      equivalent: "LN29675A08020"
    },
    "LN29675A08020": {
      standard: "LN",
      material: "Titanium",
      type: "Bolt",
      equivalent: "NAS6604-20"
    },
    "MS20426AD4-5": {
      standard: "MS",
      material: "Aluminum",
      type: "Rivet",
      equivalent: "No direct equivalent"
    }
  };

  const data = fastenerDB[part] || {
    standard: "Unknown",
    material: "Steel",
    type: "Unknown",
    equivalent: "No equivalent found"
  };

  // ✅ SUPPLIERS
  const baseSuppliers = [
    { name: "Fabory", region: "EU", factor: 0.7, leadTime: 3 },
    { name: "Accu", region: "EU", factor: 0.8, leadTime: 4 },
    { name: "Würth", region: "EU", factor: 0.9, leadTime: 5 },
    { name: "RS Components", region: "EU", factor: 0.85, leadTime: 4 },
    { name: "Böllhoff", region: "EU", factor: 1.0, leadTime: 5 },

    { name: "SPS Technologies", region: "non-EU", factor: 1.1, leadTime: 6 },
    { name: "LISI Aerospace", region: "non-EU", factor: 1.2, leadTime: 6 },
    { name: "Precision Castparts", region: "non-EU", factor: 1.3, leadTime: 7 },
    { name: "Alcoa Fastening", region: "non-EU", factor: 1.25, leadTime: 6 },
    { name: "MISUMI", region: "non-EU", factor: 1.05, leadTime: 5 }
  ];

  const suppliers = baseSuppliers.map(s => {
    const basePrice = 7.5;

    const price =
      basePrice *
      s.factor *
      (1 + (Math.random() - 0.5) * 0.15);

    return {
      name: s.name,
      region: s.region,
      price: Number(price.toFixed(2)),
      leadTime: s.leadTime
    };
  });

  return Response.json({
    part: part || "Unknown",
    parsed: {
      standard: data.standard,
      material: data.material,
      type: data.type
    },
    equivalent: data.equivalent,
    suppliers
  });
}
``
