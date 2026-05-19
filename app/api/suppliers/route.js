export async function GET(request) {

  const { searchParams } = new URL(request.url);
  const part = searchParams.get("part");

  // ✅ Dataset realistico LN29950J0614B
  const baseData = [

    // 🇪🇺 EUROPE
    { name: "Fabory", region: "EU", price: 6.0, leadTime: 3 },
    { name: "Accu", region: "EU", price: 7.0, leadTime: 4 },
    { name: "Würth", region: "EU", price: 7.8, leadTime: 5 },
    { name: "RS Components", region: "EU", price: 7.5, leadTime: 4 },
    { name: "Böllhoff", region: "EU", price: 8.5, leadTime: 5 },

    // 🌍 NON-EU
    { name: "SPS Technologies (US)", region: "non-EU", price: 9.5, leadTime: 6 },
    { name: "LISI Aerospace (US/FRA mix)", region: "non-EU", price: 10.5, leadTime: 6 },
    { name: "Precision Castparts (US)", region: "non-EU", price: 11.2, leadTime: 7 },
    { name: "Alcoa Fastening Systems (US)", region: "non-EU", price: 10.8, leadTime: 6 },
    { name: "MISUMI (JP)", region: "non-EU", price: 8.9, leadTime: 5 }
  ];

  // ✅ variabilità realistica prezzi
  const updated = baseData.map(s => {
    const price = s.price * (1 + (Math.random() - 0.5) * 0.12);

    return {
      ...s,
      price: price.toFixed(2)
    };
  });

  return Response.json(updated);
}
