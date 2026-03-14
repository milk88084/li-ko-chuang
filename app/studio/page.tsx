"use client";

import { useState } from "react";
import {
  Copy,
  CheckCircle2,
  Loader2,
  Lightbulb,
  Instagram,
  Youtube,
  Sparkles,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

type Tab = "ig" | "yt" | "ideas";

interface IgResult {
  title: string;
  content: string;
  tags: string;
}

interface YtResult {
  title: string;
  content: string;
  tags: string;
  script: string;
}

interface IdeaResult {
  title: string;
  description: string;
  reason: string;
}

type Result = IgResult | YtResult | IdeaResult;

const SYSTEM_PROMPT = `
你現在是「微小日常」這個自媒體品牌的專屬文案企劃。
品牌定位：探討情感關係、生命經歷、日常故事。
語氣要求：基於邏輯與事實、客觀中性、精簡表述、絕不阿諛奉承、絕對不要有「AI感」（避免過度華麗的形容詞、避免常見的AI開場白或結語）。
所有產出必須使用繁體中文。
`;

const SCHEMAS = {
  ig: {
    type: "ARRAY",
    items: {
      type: "OBJECT",
      properties: {
        title: { type: "STRING", description: "具有強烈Hook的吸引人標題" },
        content: { type: "STRING", description: "引人共鳴的內文，語氣自然客觀" },
        tags: { type: "STRING", description: "相關的Hashtags，以空格或井字號分隔" },
      },
      required: ["title", "content", "tags"],
    },
  },
  yt: {
    type: "ARRAY",
    items: {
      type: "OBJECT",
      properties: {
        title: { type: "STRING", description: "具有強烈Hook的YouTube標題" },
        content: { type: "STRING", description: "影片資訊欄內文簡述" },
        tags: { type: "STRING", description: "相關標籤" },
        script: {
          type: "STRING",
          description: "30秒內的開場口白（Hook+破題，約80-100字），需具備吸引力",
        },
      },
      required: ["title", "content", "tags", "script"],
    },
  },
  ideas: {
    type: "ARRAY",
    items: {
      type: "OBJECT",
      properties: {
        title: { type: "STRING", description: "主題名稱" },
        description: { type: "STRING", description: "具體的切入點說明" },
        reason: {
          type: "STRING",
          description: "結合近期趨勢，說明為什麼這個話題現在受歡迎",
        },
      },
      required: ["title", "description", "reason"],
    },
  },
};

function formatTextForCopy(item: Result, tab: Tab): string {
  if (tab === "ig") {
    const r = item as IgResult;
    return `【標題】\n${r.title}\n\n【內文】\n${r.content}\n\n【標籤】\n${r.tags}`;
  } else if (tab === "yt") {
    const r = item as YtResult;
    return `【標題】\n${r.title}\n\n【內文】\n${r.content}\n\n【標籤】\n${r.tags}\n\n【30秒開場口白】\n${r.script}`;
  } else {
    const r = item as IdeaResult;
    return `【主題】\n${r.title}\n\n【切入點】\n${r.description}\n\n【熱門原因】\n${r.reason}`;
  }
}

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState<Tab>("ig");
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAuthError, setIsAuthError] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const fetchWithBackoff = async (
    payload: object,
    retries = 5,
  ): Promise<object> => {
    const delays = [1000, 2000, 4000, 8000, 16000];
    for (let i = 0; i < retries; i++) {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error("AUTH_ERROR");
        }
        if (i === retries - 1) throw new Error(`HTTP error: ${res.status}`);
        await new Promise((r) => setTimeout(r, delays[i]));
        continue;
      }
      return res.json();
    }
    throw new Error("Max retries exceeded");
  };

  const handleGenerate = async () => {
    if (!topic.trim() && activeTab !== "ideas") {
      setError("請輸入主題或關鍵字");
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsAuthError(false);
    setResults([]);
    setCopiedIndex(null);

    try {
      let promptText = "";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tools: any[] = [];

      if (activeTab === "ig") {
        promptText = `請根據主題「${topic}」，為「微小日常」產生 5 個 Instagram 文案範例。每個範例必須包含強烈 Hook 的標題、客觀無 AI 感的內文，以及相關標籤。`;
      } else if (activeTab === "yt") {
        promptText = `請根據主題「${topic}」，為「微小日常」產生 5 個 YouTube 影片企劃範例。每個範例包含強烈 Hook 的標題、資訊欄內文、標籤，以及一段 30 秒內（約 80-100 字）的精煉開場口白。`;
      } else {
        promptText = `請搜尋近期（過去三個月）關於「愛情」、「分手」、「關係」的網路討論趨勢與熱門話題。根據搜尋結果，為「微小日常」發想 5 個具體的自媒體內容主題點子，並說明切入點以及受歡迎的原因。`;
        tools.push({ google_search: {} });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = {
        contents: [{ parts: [{ text: promptText }] }],
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: SCHEMAS[activeTab],
        },
      };

      if (tools.length > 0) {
        payload.tools = tools;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await fetchWithBackoff(payload) as any;
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!responseText) throw new Error("API 回傳格式錯誤或無內容");

      setResults(JSON.parse(responseText));
    } catch (err) {
      if (err instanceof Error && err.message === "AUTH_ERROR") {
        setIsAuthError(true);
      } else {
        console.error(err);
        setError("生成失敗，請稍後再試。");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.cssText = "position:fixed;top:0;left:0;opacity:0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      alert("複製失敗，請手動選取複製");
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 font-sans p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">

        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-indigo-500" />
            微小日常 - 自媒體文案產生器
          </h1>
          <p className="text-neutral-500">客觀、精煉、直擊人心的內容引擎</p>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">

          {/* Tabs */}
          <div className="flex border-b border-neutral-200">
            <button
              onClick={() => setActiveTab("ig")}
              className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-colors ${
                activeTab === "ig"
                  ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600"
                  : "text-neutral-500 hover:bg-neutral-50"
              }`}
            >
              <Instagram className="w-5 h-5" />
              IG 文案
            </button>
            <button
              onClick={() => setActiveTab("yt")}
              className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-colors ${
                activeTab === "yt"
                  ? "bg-red-50 text-red-700 border-b-2 border-red-600"
                  : "text-neutral-500 hover:bg-neutral-50"
              }`}
            >
              <Youtube className="w-5 h-5" />
              YT 企劃
            </button>
            <button
              onClick={() => setActiveTab("ideas")}
              className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-colors ${
                activeTab === "ideas"
                  ? "bg-amber-50 text-amber-700 border-b-2 border-amber-600"
                  : "text-neutral-500 hover:bg-neutral-50"
              }`}
            >
              <Lightbulb className="w-5 h-5" />
              創意發想
            </button>
          </div>

          {/* Input */}
          <div className="p-6 space-y-4">
            {activeTab !== "ideas" ? (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">
                  輸入主題或關鍵字
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="例如：面對分手後遺症、遠距離戀愛的溝通成本..."
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none"
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                />
              </div>
            ) : (
              <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-100 flex gap-3 text-amber-800">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  系統將自動檢索近期關於「愛情」、「分手」、「關係」的網路討論趨勢，並為你產出
                  5 個客觀且具備討論度的內容主題。不需輸入關鍵字，直接點擊產生即可。
                </p>
              </div>
            )}

            {isAuthError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start gap-3">
                <RefreshCw className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-red-800">API 金鑰授權失敗</h4>
                  <p className="text-sm mt-1">
                    請確認 <code className="bg-red-100 px-1 rounded">.env.local</code> 中已設定
                    有效的 <code className="bg-red-100 px-1 rounded">GEMINI_API_KEY</code>，並重新啟動開發伺服器。
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  生成中，請稍候...
                </>
              ) : (
                "一鍵產生內容"
              )}
            </button>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 px-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              生成結果（{results.length}）
            </h2>
            <div className="grid gap-6">
              {results.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 relative hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() =>
                      copyToClipboard(formatTextForCopy(item, activeTab), index)
                    }
                    className="absolute top-4 right-4 p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                    title="複製文案"
                  >
                    {copiedIndex === index ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="w-4 h-4" /> 已複製
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Copy className="w-4 h-4" /> 複製
                      </span>
                    )}
                  </button>

                  <div className="pr-20 space-y-4">
                    {(activeTab === "ig" || activeTab === "yt") && (
                      <>
                        <div>
                          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1 block">
                            標題 (Hook)
                          </span>
                          <h3 className="text-lg font-bold text-neutral-900 leading-snug">
                            {(item as IgResult).title}
                          </h3>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1 block">
                            內文
                          </span>
                          <p className="text-neutral-700 whitespace-pre-wrap leading-relaxed">
                            {(item as IgResult).content}
                          </p>
                        </div>
                        {activeTab === "yt" && (
                          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                              <Youtube className="w-4 h-4" />
                              30秒開場口白
                            </span>
                            <p className="text-slate-800 font-medium">
                              {(item as YtResult).script}
                            </p>
                          </div>
                        )}
                        <div>
                          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1 block">
                            標籤
                          </span>
                          <p className="text-indigo-600 text-sm">
                            {(item as IgResult).tags}
                          </p>
                        </div>
                      </>
                    )}

                    {activeTab === "ideas" && (
                      <>
                        <div>
                          <span className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1 block">
                            主題點子
                          </span>
                          <h3 className="text-lg font-bold text-neutral-900">
                            {(item as IdeaResult).title}
                          </h3>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1 block">
                            切入點
                          </span>
                          <p className="text-neutral-700 leading-relaxed">
                            {(item as IdeaResult).description}
                          </p>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1 block">
                            熱門趨勢原因
                          </span>
                          <p className="text-amber-900 text-sm">
                            {(item as IdeaResult).reason}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
