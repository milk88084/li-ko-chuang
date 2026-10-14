# 個人網站全站改版設計

日期：2026-10-14
分支：`feat/site-redesign`
參考：https://guocianyu.com/（借用設計語言，不複製版面、插圖或文案）

## 目標

- 受眾混合：招募／用人主管、潛在合作對象、想認識「這個人」的訪客
- 內容只聚焦三塊：**工程、行銷、活動**；移除所有「創作者」內容
- 從「先選身分」改為「先看作品，再認識人」
- 視覺改為 Guo 式的克制設計：淺灰底、單一強調色、襯線＋無襯線混排、設計工具感元素

## 已確認的決定

| 項目 | 決定 |
|---|---|
| 架構 | 方案 A：以內容分頁（Home / Work / About / Events / Writing） |
| 物理標籤 | 首頁中段，包在 Figma 框裡，捲動到才掉落；移除 LOADING 畫面 |
| 主色 | `#3250FE`（深色模式用 `#5B74FF`） |
| 專案頁 | 每個專案一個獨立頁 `/work/[slug]` |
| 活動頁 | 分「我策劃的」與「我參加的」；三場 Meetup 角色皆為參加者 |
| Logo 牆 | 文字標誌，之後可換成圖檔 |
| 推薦語牆 | 做好區塊與資料格式，資料為空時整塊隱藏 |
| 保留 | 中英雙語、深淺色切換、捲動人像 Hero、物理標籤 |
| 移除 | ThreeCanvas 3D 背景、Creator 頁與相關標籤、LOADING 畫面 |
| 游標 | 自訂游標（圓點／放大圈／View／Drag／文字細線） |

## 網址

| EN | ZH | 內容 |
|---|---|---|
| `/` | `/zh` | 首頁 |
| `/work` | `/zh/work` | 全部作品，`?type=engineering|marketing` 篩選 |
| `/work/[slug]` | `/zh/work/[slug]` | 專案介紹頁（靜態產生） |
| `/about` | `/zh/about` | 關於我 |
| `/events` | `/zh/events` | 活動 |
| `/writing` | `/zh/writing` | 文章 |
| `/studio` | — | 不改動 |

永久導向（308，`next.config.ts` 的 `redirects`）：

- `/engineer` → `/work?type=engineering`、`/zh/engineer` → `/zh/work?type=engineering`
- `/marketer` → `/work?type=marketing`、`/zh/marketer` → `/zh/work?type=marketing`
- `/creator` → `/about`、`/zh/creator` → `/zh/about`

語系切換：`/work/aras` ↔ `/zh/work/aras`，專案頁也對應到另一語系的同一專案。

## 視覺系統

設計 token 定義在 `app/globals.css` 的 `:root` 與 `.dark`，全站共用（取代 `#view-engineer` 的區域 token）：

| Token | 淺色 | 深色 |
|---|---|---|
| `--bg` | `#F4F4F2` | `#0E0E0F` |
| `--surface` | `#EAEAE6` | `#18181A` |
| `--ink` | `#141414` | `#EDEDEA` |
| `--muted` | `#6B6B6B` | `#9A9A96` |
| `--line` | `#DADAD5` | `#2A2A2C` |
| `--accent` | `#3250FE` | `#5B74FF` |
| `--accent-ink`（強調色上的文字） | `#FFFFFF` | `#FFFFFF` |

字體（`next/font/google`）：

- 無襯線：Inter Tight → `--font-sans`
- 襯線強調：Instrument Serif（italic）→ `--font-serif`
- 等寬標籤：JetBrains Mono → `--font-mono`
- 中文：Noto Sans TC（無襯線 fallback）、Noto Serif TC（襯線 fallback），`preload: false`
- 捲動人像 Hero 仍需要 Bodoni Moda，保留

設計工具感元件（`components/canvas/`）：

- `GridLines`：12 欄淡色直線背景
- `FigmaFrame`：藍色細框、四角方塊、`Frame · Col x–y` 標籤、`W × H` 尺寸標籤（以 ResizeObserver 讀實際尺寸）
- `CursorTag`：藍色小標籤 `Max`，帶箭頭
- `SectionLabel`：`/ Hello` 這類等寬區塊標籤

動態：

- `SplitReveal`：標題逐字浮現
- `ScrubText`：段落捲動時由淡變深
- 區塊淡入沿用 `useScrollReveal`
- `prefers-reduced-motion: reduce` 時全部停用，直接顯示最終狀態

## 自訂游標（`components/CustomCursor.tsx`）

- 只在 `(pointer: fine)` 啟用；觸控裝置不渲染
- 啟用時 `html` 加上 `has-custom-cursor`，CSS 隱藏系統游標；`input`、`textarea`、`select`、`[contenteditable]` 保留系統游標
- 狀態由最近祖先的 `data-cursor` 決定：`view`（顯示「View／查看」）、`drag`（「Drag／拖曳」）、`text`（細直線）；`a`、`button` 為放大空心圈
- 減少動態效果時：不做延遲跟隨與縮放動畫
- `/studio` 不掛載

## 頁面

### 共用外框

- `SiteHeader`：Logo（`Max`，襯線）｜作品、關於我、活動、文章｜語系切換、深淺色切換、藍色「聯絡我」（連到 `#contact`）。目前頁面的連結以強調色標示。
- `SiteFooter`（`id="contact"`）：名字＋一句介紹＋Email＋社群圖示｜網站地圖｜「想一起合作嗎？」方框＋「寫信給我」按鈕（`mailto:`）。

### 首頁

1. Hero：GridLines 背景；雙行標題（無襯線黑＋襯線藍）；右上 FigmaFrame 內放 `engineer_intro.png`；CursorTag；右下自我介紹
2. Logo 牆：「曾合作的單位」＋文字標誌跑馬燈（`data/clients.json`）
3. `/ Hello`：ScrubText 自我介紹
4. `/ Selected Work`：2 大卡＋2 小卡＋「看全部作品」卡；精選為 araS、reteP、Agent Fabric、校園性別平權宣講計畫（`featured` 欄位控制）；有影片的卡片 hover 播放
5. `/ What I Bring`：工程／行銷／活動三欄，各一個 SVG 線條動畫
6. `/ Toolbox`：FigmaFrame（`Frame · Skills`）內的 `PhysicsPlayground`，進入畫面才開始掉落
7. `/ Kind Words`：推薦語（空陣列時不渲染）
8. `/ Writing`：最新 3 篇 Medium 文章＋看全部

### /work

標題區 → 篩選（全部／工程／行銷，同步到網址 `?type=`）→ 卡片網格。伺服器端輸出全部卡片，篩選在客戶端進行，讓爬蟲看得到所有專案。

### /work/[slug]

類別標籤＋標題＋摘要 → 資訊列（類型、角色、技術、外部連結）→ 封面（有影片就播影片）→ 解決的問題 → 成果 → 重點（metrics）→ 使用技術 → 下一個專案。

### /about

ScrollPortraitHero（內容移到 `about.scrollHero`，CTA 改連 `#about-story`）→ 理念 → 經歷時間軸（工程＋行銷經歷合併，依時間排序）→ 目前專注 → 技能（工程技術＋行銷核心能力兩組清單）。

### /events

標題區 → `/ Organized`（策劃的活動：校園宣講、百貨 CSR、數位募款、論壇等，取自行銷經歷）→ `/ Attended`（參加的技術 Meetup：OpenClaw、Dify AI、Claude Code）。

### /writing

標題區 → 全部 Medium 文章（`MediumArticles`，改為新樣式，可設定顯示數量）。

## 資料

- `data/content.json`：每個語系改為 `common`、`nav`、`home`、`work`、`about`、`events`、`writing`、`footer`、`cursor`；移除 `engineer`、`marketer`、`creator`
- `data/projects.json`：統一的專案陣列，每筆含 `slug`、`type`、`featured`、`cover`、`video`、`link`、`role`，以及 `en`／`zh` 文案（`title`、`summary`、`problem`、`outcome`、`tech`、`highlights`）
- `data/events.json`：`organized`、`attended` 兩組
- `data/clients.json`：Logo 牆名稱
- `data/testimonials.json`：`[]`
- `lib/projects.ts`：`getProjects(locale, type?)`、`getProject(slug)`、`getNextProject(slug)`、`PROJECT_SLUGS`

專案資料直接從現有的 engineer／marketer 內容搬移，不新增未經確認的事實（例如年份）。

## SEO

- `lib/locale.ts`：`LOCALIZED_ROUTES` 改為 `"" | "/work" | "/about" | "/events" | "/writing"`；`otherLocalePath` 支援 `/work/[slug]`
- `lib/page-metadata.ts`：每頁一個 metadata 函式，專案頁用 `generateMetadata`
- `sitemap.ts`：加入所有專案頁
- `structured-data.ts`：頁面類型改為 `home | work | about | events | writing | project`；iOS App 的 `SoftwareApplication` 放在 work 頁與對應專案頁
- `llms.txt`：改寫頁面清單
- OG 圖：每個新路由各一張，沿用 `OgCard`，配色改為新 token

## 移除

`ThreeCanvas`、`HomeBackground`、`HomeView`、`EngineerContent/View`、`MarketerContent/View`、`CreatorContent/View`、`Navigation`、`Footer`、`ProjectShowcase`、`ProjectTimeline`、`components/index.ts`，以及舊的 engineer／marketer／creator 路由與 OG 圖；移除 `three`、`@types/three` 相依套件。

## 測試與驗收

- Jest：`lib/locale`（新路由、專案頁語系切換）、`lib/projects`（slug 唯一、兩語系文案齊全、篩選、下一個專案循環）
- `npm run lint`、`npm test`、`npm run build` 全部通過
- Playwright 在 1440px 與 390px、淺色與深色下檢查每一頁；確認舊網址導向正確
- 無 JS 時首頁 HTML 仍包含主要文案與專案標題

## 實作順序

1. 基礎：token、字體、游標、canvas 元件、SiteHeader／SiteFooter、資料搬移、`lib/projects`、路由與導向
2. 首頁
3. /work 與 /work/[slug]
4. /about、/events、/writing
5. SEO 更新、移除舊程式、測試、視覺驗收
