import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? "";
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const payload = await req.json();

    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => null);
      console.error("[Gemini API error]", res.status, JSON.stringify(errBody));
      if (res.status === 401 || res.status === 403) {
        return NextResponse.json({ error: "AUTH_ERROR" }, { status: res.status });
      }
      return NextResponse.json(
        { error: `Gemini error: ${res.status}`, detail: errBody },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
