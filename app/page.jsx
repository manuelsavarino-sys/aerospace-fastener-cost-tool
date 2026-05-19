export async function GET(request) {

  const { searchParams } = new URL(request.url);
  const part = searchParams.get("part");

  function parsePartNumber(part) {
    if (!part) {
      return {
        standard: "Unknown",
        material: "Steel",
        basePrice: 7
      };
    }

    if (part.startsWith("LN")) {
      return {
        standard: "LN",
        material: "A286 Stainless Steel",
        basePrice: 8.5
      };
    }

    if (part.startsWith("NAS")) {
      return {
        standard: "NAS",
        material: "Alloy Steel",
        basePrice: 7
      };
    }

    return {
      standard: "Unknown",
      material: "Steel",
      basePrice: 7
    };
  }

  const parsed = parsePartNumber(part);

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
    const price =
      parsed.basePrice *
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
    parsed,
    suppliers,
    source: "live"
  });
}
