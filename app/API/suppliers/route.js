export async function GET() {

  const baseData = [
    { name: "Fabory", price: 5.8, leadTime: 3 },
    { name: "Accu", price: 6.9, leadTime: 4 },
    { name: "Würth", price: 7.5, leadTime: 5 },
    { name: "RS Components", price: 7.2, leadTime: 4 },
    { name: "Böllhoff", price: 8.2, leadTime: 5 },
    { name: "SPS Technologies", price: 9.0, leadTime: 6 },
    { name: "LISI Aerospace", price: 10.5, leadTime: 6 }
  ];

  const updated = baseData.map(s => {
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

  return Response.json(updated);
}
