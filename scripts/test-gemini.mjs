// 執行方式: GEMINI_API_KEY=你的key node scripts/test-gemini.mjs
// 或先設定好 env 再執行: node scripts/test-gemini.mjs

const key = process.env.GEMINI_API_KEY;
if (!key) {
  console.error("❌ 請設定 GEMINI_API_KEY 環境變數");
  process.exit(1);
}

const models = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
];

const payload = {
  contents: [{ parts: [{ text: "請說「測試成功」" }] }],
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: { title: { type: "STRING" } },
        required: ["title"],
      },
    },
  },
};

for (const model of models) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
  process.stdout.write(`測試 ${model} ... `);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await res.json();
    if (res.ok) {
      console.log("✅ 成功");
    } else {
      console.log(`❌ ${res.status} - ${JSON.stringify(body?.error?.message ?? body)}`);
    }
  } catch (e) {
    console.log(`❌ 例外: ${e.message}`);
  }
}
