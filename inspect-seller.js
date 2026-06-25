const { sellerApi } = require("./src/lib/api-clients/seller");

async function main() {
  const userId = "user_3FbF4flWpP8DKQ0JXef4Bx9At6p";
  console.log("Fetching orders from Seller App for user:", userId);
  try {
    const orders = await sellerApi.getOrdersByBuyer(userId);
    console.log("Orders from Seller App:");
    console.log(JSON.stringify(orders, null, 2));
  } catch (e) {
    console.error("Error fetching from Seller App:", e);
  }
}

main();
