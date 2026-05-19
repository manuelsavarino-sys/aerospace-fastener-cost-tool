export async function GET() {
  // Simulated real-time variation
  const baseData = [
    { name: "Fabory", price: 6.2, leadTime: 3, score: 7.8 },
    { name: "Accu", price: 7.5, leadTime: 4, score: 8.3 },
    { name: "Würth", price: 7.9, leadTime: 5, score: 8.6 },
    { name: "LISI Aerospace", price: 9.8, leadTime: 6, score: 9.2 }
  ];

  // Add random fluctuation to simulate live market
  const updated = baseData.map(s => ({
    ...s,
    price: (s.price * (1 + (Math.random() - 0.5) * 0.1)).toFixed(2)
  }));

  return Response.json(updated);
}
