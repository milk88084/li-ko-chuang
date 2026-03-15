import { NextRequest } from "next/server";

// ── 必須在 import route 之前設定 env ──────────────────────────────────────
const FAKE_KEY = "test-api-key-12345";

// 每個 describe 共用的 fetch mock
const mockFetch = jest.fn();
global.fetch = mockFetch;

// ── 工具函式 ──────────────────────────────────────────────────────────────
function makeRequest(body: object): NextRequest {
  return new NextRequest("http://localhost/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function mockGeminiOk(data: object) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => data,
  } as unknown as Response);
}

function mockGeminiError(status: number) {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status,
    json: async () => ({ error: `error ${status}` }),
  } as unknown as Response);
}

// ── 測試 ──────────────────────────────────────────────────────────────────
describe("POST /api/gemini", () => {
  beforeEach(() => {
    jest.resetModules();
    mockFetch.mockReset();
  });

  // ── 1. 缺少 API Key ───────────────────────────────────────────────────
  it("API Key 未設定時應回傳 500", async () => {
    delete process.env.GEMINI_API_KEY;

    const { POST } = await import("./route");
    const res = await POST(makeRequest({ contents: [] }));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("API key not configured");
  });

  // ── 2. 正常成功回應 ────────────────────────────────────────────────────
  it("Gemini 回傳成功時應將資料原封不動回傳給前端", async () => {
    process.env.GEMINI_API_KEY = FAKE_KEY;

    const geminiPayload = {
      candidates: [{ content: { parts: [{ text: '[{"title":"測試"}]' }] } }],
    };
    mockGeminiOk(geminiPayload);

    const { POST } = await import("./route");
    const res = await POST(makeRequest({ contents: [] }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual(geminiPayload);
  });

  // ── 3. Gemini 回傳 401 ─────────────────────────────────────────────────
  it("Gemini 回傳 401 時應回傳 AUTH_ERROR (401)", async () => {
    process.env.GEMINI_API_KEY = FAKE_KEY;
    mockGeminiError(401);

    const { POST } = await import("./route");
    const res = await POST(makeRequest({ contents: [] }));
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe("AUTH_ERROR");
  });

  // ── 4. Gemini 回傳 403 ─────────────────────────────────────────────────
  it("Gemini 回傳 403 時應回傳 AUTH_ERROR (403)", async () => {
    process.env.GEMINI_API_KEY = FAKE_KEY;
    mockGeminiError(403);

    const { POST } = await import("./route");
    const res = await POST(makeRequest({ contents: [] }));
    const body = await res.json();

    expect(res.status).toBe(403);
    expect(body.error).toBe("AUTH_ERROR");
  });

  // ── 5. Gemini 回傳其他錯誤 ─────────────────────────────────────────────
  it("Gemini 回傳 429 時應回傳對應的錯誤訊息", async () => {
    process.env.GEMINI_API_KEY = FAKE_KEY;
    mockGeminiError(429);

    const { POST } = await import("./route");
    const res = await POST(makeRequest({ contents: [] }));
    const body = await res.json();

    expect(res.status).toBe(429);
    expect(body.error).toContain("429");
  });

  // ── 6. Gemini 回傳 500 ─────────────────────────────────────────────────
  it("Gemini 回傳 500 時應回傳對應的錯誤訊息", async () => {
    process.env.GEMINI_API_KEY = FAKE_KEY;
    mockGeminiError(500);

    const { POST } = await import("./route");
    const res = await POST(makeRequest({ contents: [] }));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toContain("500");
  });

  // ── 7. fetch 拋出例外 ──────────────────────────────────────────────────
  it("fetch 發生網路錯誤時應回傳 500 Internal server error", async () => {
    process.env.GEMINI_API_KEY = FAKE_KEY;
    mockFetch.mockRejectedValueOnce(new Error("Network failure"));

    const { POST } = await import("./route");
    const res = await POST(makeRequest({ contents: [] }));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Internal server error");
  });

  // ── 8. Gemini URL 包含正確的 API Key ──────────────────────────────────
  it("呼叫 Gemini 時 URL 中應包含正確的 API Key", async () => {
    process.env.GEMINI_API_KEY = FAKE_KEY;
    mockGeminiOk({ candidates: [] });

    const { POST } = await import("./route");
    await POST(makeRequest({ contents: [{ parts: [{ text: "test" }] }] }));

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain(`key=${FAKE_KEY}`);
  });

  // ── 9. 轉發原始 payload 給 Gemini ─────────────────────────────────────
  it("應將前端傳入的 payload 原封不動轉發給 Gemini", async () => {
    process.env.GEMINI_API_KEY = FAKE_KEY;
    mockGeminiOk({ candidates: [] });

    const inputPayload = {
      contents: [{ parts: [{ text: "關於分手的故事" }] }],
      systemInstruction: { parts: [{ text: "你是文案企劃" }] },
    };

    const { POST } = await import("./route");
    await POST(makeRequest(inputPayload));

    const sentBody = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(sentBody).toEqual(inputPayload);
  });
});
