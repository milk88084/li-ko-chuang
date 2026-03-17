import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const response = await fetch(
    "https://n8n.iii-ei-stack.com/webhook/getData",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    return NextResponse.json({ error: "n8n error" }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data);
}
