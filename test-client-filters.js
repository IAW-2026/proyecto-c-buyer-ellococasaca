// Mock process.env
process.env.USE_MOCKS = "false";
process.env.SELLER_API_URL = "https://proyecto-c-seller-ellococasaca.vercel.app";

const { sellerApi } = require("./src/lib/api-clients/seller");

async function testClient(filters) {
  console.log("Testing with filters:", JSON.stringify(filters));
  try {
    const products = await sellerApi.getProducts(filters);
    console.log("Count:", products.length);
    console.log("Items:", products.map(p => ({ id: p.id, title: p.title, category: p.category, team: p.team })));
  } catch (e) {
    console.error("Failed:", e);
  }
  console.log("------------------------");
}

async function main() {
  await testClient({});
  await testClient({ kind: "CLUB" });
  await testClient({ teamId: "boca-juniors" });
  await testClient({ search: "boca" });
}

main();
