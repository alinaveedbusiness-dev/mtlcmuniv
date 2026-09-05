async function test() {
  console.log("=== 1. Checking GET / (Public Portal HTML) ===");
  const resHome = await fetch("http://localhost:3000/");
  const html = await resHome.text();
  
  console.log("Status:", resHome.status);
  console.log("Contains 'MTLC MUN IV':", html.includes("MTLC MUN IV"));
  console.log("Contains 'Legacy Edition':", html.includes("Legacy Edition"));
  console.log("Contains 'DIALOGUE. DIPLOMACY. IMPACT.':", html.includes("DIALOGUE. DIPLOMACY. IMPACT."));
  console.log("Contains 'max-w-[620px]':", html.includes("max-w-[620px]"));
  console.log("Contains nav bar links (should be false):", html.includes("<nav") || html.includes("About Us") || html.includes("Committees"));
  console.log("Contains '/admin' link in public view (should be false):", html.includes('href="/admin"') || html.includes("href='/admin'"));

  console.log("\n=== 2. Testing Registration API (POST /api/register) ===");
  const form = new FormData();
  form.append("fullName", "Sophia Montgomery");
  form.append("email", "sophia.montgomery@oxford.edu");
  form.append("phone", "+44 7911 123456");
  form.append("committee", "UNSC");
  
  // Dummy PNG blob
  const dummyBlob = new Blob([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])], { type: "image/png" });
  form.append("paymentProof", dummyBlob, "receipt_sophia.png");

  const regRes = await fetch("http://localhost:3000/api/register", {
    method: "POST",
    body: form,
  });
  const regJson = await regRes.json();
  console.log("Registration Status:", regRes.status);
  console.log("Registered Delegate ID:", regJson.delegate?.id);
  console.log("Initial Delegate Status:", regJson.delegate?.status);

  console.log("\n=== 3. Testing Admin Login (POST /api/admin/login) ===");
  const loginRes = await fetch("http://localhost:3000/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: "legacy2026" }),
  });
  console.log("Login HTTP Status:", loginRes.status);
  const cookie = loginRes.headers.get("set-cookie");
  console.log("Session Cookie Received:", !!cookie);

  console.log("\n=== 4. Updating Dynamic Conference Dates via Inline Settings API ===");
  const newDate = "November 20 - 22, 2026";
  const putRes = await fetch("http://localhost:3000/api/settings", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie || "",
    },
    body: JSON.stringify({ eventDates: newDate }),
  });
  const putJson = await putRes.json();
  console.log("PUT /api/settings Status:", putRes.status);
  console.log("Updated eventDates:", putJson.settings?.eventDates);

  console.log("\n=== 5. Checking GET / Reflects Dynamic Conference Dates ===");
  const resHomeAfter = await fetch("http://localhost:3000/");
  const htmlAfter = await resHomeAfter.text();
  console.log("Homepage displays updated dates ('November 20 - 22, 2026'):", htmlAfter.includes("November 20 - 22, 2026"));

  console.log("\n=== 6. Updating Delegate Status to Approved (PATCH /api/admin/delegates/[id]) ===");
  const delId = regJson.delegate?.id;
  if (delId) {
    const patchRes = await fetch(`http://localhost:3000/api/admin/delegates/${delId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie || "",
      },
      body: JSON.stringify({ status: "Approved" }),
    });
    const patchJson = await patchRes.json();
    console.log("PATCH status:", patchRes.status);
    console.log("Updated Delegate Status:", patchJson.delegate?.status);
  }

  console.log("\n=== ALL VERIFICATION TESTS COMPLETED ===");
}

test().catch(console.error);
