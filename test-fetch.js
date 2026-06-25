async function main() {
  const buyerId = "user_3FbF4flWpP8DKQ0JXef4Bx9At6p";
  const url1 = `https://proyecto-c-seller-ellococasaca.vercel.app/api/orders?buyerId=${buyerId}`;
  const url2 = `https://proyecto-c-seller-ellococasaca.vercel.app/api/orders/buyer/${buyerId}`;

  console.log("Fetching from:", url1);
  try {
    const res1 = await fetch(url1);
    console.log("URL1 Status:", res1.status);
    if (res1.ok) {
      const data1 = await res1.json();
      console.log("URL1 Data count:", Array.isArray(data1) ? data1.length : typeof data1);
      console.log("URL1 Data sample:", JSON.stringify(data1.slice(0, 2), null, 2));
    }
  } catch (e) {
    console.error("URL1 Error:", e);
  }

  console.log("Fetching from:", url2);
  try {
    const res2 = await fetch(url2);
    console.log("URL2 Status:", res2.status);
    if (res2.ok) {
      const data2 = await res2.json();
      console.log("URL2 Data count:", Array.isArray(data2) ? data2.length : typeof data2);
      console.log("URL2 Data sample:", JSON.stringify(data2.slice(0, 2), null, 2));
    }
  } catch (e) {
    console.error("URL2 Error:", e);
  }
}

main();
