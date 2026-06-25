async function testUrl(url) {
  console.log("Testing URL:", url);
  try {
    const res = await fetch(url);
    console.log("Status:", res.status);
    if (res.ok) {
      const data = await res.json();
      console.log("Count:", data.length);
      console.log("Items:", data.map(p => ({ id: p.id, title: p.title, categoryId: p.categoryId, team: p.team })));
    } else {
      console.log("Error:", res.statusText);
    }
  } catch (e) {
    console.error("Fetch failed:", e);
  }
  console.log("------------------------");
}

async function main() {
  const baseUrl = "https://proyecto-c-seller-ellococasaca.vercel.app/api/products";
  await testUrl(`${baseUrl}`);
  await testUrl(`${baseUrl}?kind=CLUB`);
  await testUrl(`${baseUrl}?teamId=boca-juniors`);
}

main();
