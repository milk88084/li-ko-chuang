import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const response = await fetch(
    "https://n8n.iii-ei-stack.com/webhook-test/getData",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  return NextResponse.json({ ok: response.ok });
}
