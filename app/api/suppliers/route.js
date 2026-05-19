export async function GET(request) {

  const { searchParams } = new URL(request.url);
  const part = searchParams.get("part");

  // -----------------------------
  // 🔍 PARSING AUTOMATICO
  // -----------------------------
  function parsePartNumber(part) {

    let standard = "Unknown";
    let material = "Steel";
    let basePrice = 7;

    if (!part) {
      return { standard, material, basePrice };
    }

    if (part.startsWith("LN")) {
      standard = "LN";
      material = "A286 Stainless Steel";
      basePrice = 8.5;
    } else if (part.startsWith("NAS")) {
      standard = "NAS";
      material = "Alloy Steel";
      basePrice = 7;
    } else if (part.startsWith("MS")) {
      standard = "MS";
      material = "Aluminum";
      basePrice = 2;
    }

    return { standard, material, basePrice };
  }

  const parsed = parsePartNumber(part);

  // -----------------------------
  // 🏭 SUPPLIERS
  // -----------------------------
  const baseSuppliers = [

    // EU
    { name: "Fabory", region: "EU", factor: 0.7, leadTime: 3 },
