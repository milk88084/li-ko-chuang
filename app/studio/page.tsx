"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Copy,
  CheckCircle2,
  Loader2,
  Lightbulb,
  Instagram,
  Youtube,
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

const TAB_CONFIG = {
  ig: {
    icon: Instagram,
    label: "IG 文案",
    activeClass:
      "bg-white dark:bg-[#1C1C1E] text-gray-900 dark:text-white shadow-sm",
  },
  yt: {
    icon: Youtube,
    label: "YT 企劃",
    activeClass:
      "bg-white dark:bg-[#1C1C1E] text-gray-900 dark:text-white shadow-sm",
  },
  ideas: {
    icon: Lightbulb,
    label: "創意發想",
    activeClass:
      "bg-white dark:bg-[#1C1C1E] text-gray-900 dark:text-white shadow-sm",
  },
};

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState<Tab>("ig");
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAuthError, setIsAuthError] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const fetchWithBackoff = async (
    content: string,
    retries = 5,
  ): Promise<Result[]> => {
    const delays = [1000, 2000, 4000, 8000, 16000];
    for (let i = 0; i < retries; i++) {
      const res = await fetch("/api/n8n-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        if (i === retries - 1) throw new Error(`HTTP error: ${res.status}`);
        await new Promise((r) => setTimeout(r, delays[i]));
        continue;
      }
      const data = await res.json();
      const raw: string = data.output ?? "";
      const jsonString = raw.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
      return JSON.parse(jsonString) as Result[];
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

      if (activeTab === "ig") {
        promptText = `${SYSTEM_PROMPT}

請根據主題「${topic}」，為「微小日常」產生 5 個 Instagram 文案範例。
請直接回傳 JSON 陣列，不要有任何其他文字，格式如下：
[{"title":"標題","content":"內文","tags":"標籤"}]`;
      } else if (activeTab === "yt") {
        promptText = `${SYSTEM_PROMPT}

請根據主題「${topic}」，為「微小日常」產生 5 個 YouTube 影片企劃範例。
請直接回傳 JSON 陣列，不要有任何其他文字，格式如下：
[{"title":"標題","content":"資訊欄內文","tags":"標籤","script":"30秒開場口白"}]`;
      } else {
        promptText = `${SYSTEM_PROMPT}

請根據你對近期華語網路上關於「愛情」、「分手」、「關係」的討論趨勢，為「微小日常」發想 5 個自媒體內容主題點子。
請直接回傳 JSON 陣列，不要有任何其他文字，格式如下：
[{"title":"主題名稱","description":"切入點說明","reason":"熱門原因"}]`;
      }

      const parsed = await fetchWithBackoff(promptText);
      setResults(parsed);
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
    <div className="min-h-screen bg-[#FBFBFD] dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-12">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center justify-center gap-3">
            <Link href="/" className="hover:opacity-70 transition-opacity">
              <Image
                src="/favicon.ico"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-xl shadow-sm"
              />
            </Link>
            Idea Generator
          </h1>
          <p className="text-gray-500 dark:text-gray-500 font-light">
            Generate ideas for your media content.
          </p>
          <div className="h-px w-12 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto"></div>
        </header>

        {/* Main Card */}
        <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden transition-colors duration-300">
          {/* Tabs */}
          <div className="p-2 bg-gray-50 dark:bg-[#050505] border-b border-gray-100 dark:border-white/5 flex gap-1">
            {(Object.keys(TAB_CONFIG) as Tab[]).map((tab) => {
              const { icon: Icon, label, activeClass } = TAB_CONFIG[tab];
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setResults([]);
                    setError(null);
                  }}
                  className={`flex-1 py-2.5 flex items-center justify-center gap-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                    activeTab === tab
                      ? activeClass
                      : "text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              );
            })}
          </div>

          {/* Input Area */}
          <div className="p-6 md:p-8 space-y-5">
            {activeTab !== "ideas" ? (
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-500">
                  主題或關鍵字
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="例如：面對分手後遺症、遠距離戀愛的溝通成本..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1C1C1E] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20 focus:border-gray-400 dark:focus:border-white/30 transition-all text-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                />
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-[#1C1C1E] p-4 rounded-xl border border-gray-100 dark:border-white/10 flex gap-3">
                <AlertCircle className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                  系統將自動檢索近期關於「愛情」、「分手」、「關係」的網路討論趨勢，並為你產出
                  5
                  個客觀且具備討論度的內容主題。不需輸入關鍵字，直接點擊產生即可。
                </p>
              </div>
            )}

            {isAuthError && (
              <div className="bg-gray-50 dark:bg-[#1C1C1E] border border-gray-200 dark:border-white/10 p-4 rounded-xl flex items-start gap-3">
                <RefreshCw className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    API 金鑰授權失敗
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-500 font-light">
                    請確認後端服務的 API 金鑰與環境變數已正確設定，並重新啟動開發伺服器。
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black font-medium py-3 rounded-full text-sm transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  生成中，請稍候...
                </>
              ) : (
                "一鍵產生內容"
              )}
            </button>

            {error && (
              <p className="text-xs text-center text-gray-500 dark:text-gray-500">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-gray-400" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-500">
                生成結果 · {results.length} 則
              </h2>
            </div>

            <div className="grid gap-4">
              {results.map((item, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-[#1C1C1E] p-6 rounded-2xl border border-gray-100 dark:border-white/10 relative group hover:border-gray-200 dark:hover:border-white/20 hover:shadow-sm transition-all duration-300"
                >
                  {/* Copy Button */}
                  <button
                    onClick={() =>
                      copyToClipboard(formatTextForCopy(item, activeTab), index)
                    }
                    className="absolute top-5 right-5 p-2 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg transition-all flex items-center gap-1.5 text-xs font-medium"
                    title="複製文案"
                  >
                    {copiedIndex === index ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                        <span className="hidden sm:inline text-gray-500 dark:text-gray-400">
                          已複製
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">複製</span>
                      </>
                    )}
                  </button>

                  <div className="pr-20 space-y-5">
                    {/* IG & YT */}
                    {(activeTab === "ig" || activeTab === "yt") && (
                      <>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-2 block">
                            標題 · Hook
                          </span>
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white leading-snug">
                            {(item as IgResult).title}
                          </h3>
                        </div>

                        <div className="h-px bg-gray-100 dark:bg-white/5" />

                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-2 block">
                            內文
                          </span>
                          <p className="text-gray-600 dark:text-gray-400 text-sm font-light whitespace-pre-wrap leading-relaxed">
                            {(item as IgResult).content}
                          </p>
                        </div>

                        {activeTab === "yt" && (
                          <>
                            <div className="h-px bg-gray-100 dark:bg-white/5" />
                            <div className="bg-gray-50 dark:bg-[#0a0a0a] p-4 rounded-xl border border-gray-100 dark:border-white/5">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-2 flex items-center gap-1.5">
                                <Youtube className="w-3 h-3" />
                                30 秒開場口白
                              </span>
                              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium leading-relaxed mt-2">
                                {(item as YtResult).script}
                              </p>
                            </div>
                          </>
                        )}

                        <div className="h-px bg-gray-100 dark:bg-white/5" />

                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-2 block">
                            標籤
                          </span>
                          <p className="text-gray-500 dark:text-gray-500 text-xs font-light">
                            {(item as IgResult).tags}
                          </p>
                        </div>
                      </>
                    )}

                    {/* Ideas */}
                    {activeTab === "ideas" && (
                      <>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-2 block">
                            主題點子
                          </span>
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                            {(item as IdeaResult).title}
                          </h3>
                        </div>

                        <div className="h-px bg-gray-100 dark:bg-white/5" />

                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-2 block">
                            切入點
                          </span>
                          <p className="text-gray-600 dark:text-gray-400 text-sm font-light leading-relaxed">
                            {(item as IdeaResult).description}
                          </p>
                        </div>

                        <div className="h-px bg-gray-100 dark:bg-white/5" />

                        <div className="bg-gray-50 dark:bg-[#0a0a0a] p-4 rounded-xl border border-gray-100 dark:border-white/5">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-2 block">
                            熱門趨勢原因
                          </span>
                          <p className="text-gray-600 dark:text-gray-400 text-sm font-light leading-relaxed mt-2">
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
