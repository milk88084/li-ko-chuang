# CI/CD 配置說明

## GitHub Actions CI

本專案已設定自動化檢查流程，當你 push 程式碼到 GitHub 時會自動執行：

### 自動檢查項目

1. **ESLint 檢查** - 確保程式碼符合規範
2. **TypeScript 型別檢查** - 透過 build 檢查型別錯誤
3. **Build 測試** - 確保專案能成功編譯

### 觸發條件

- Push 到 `main`、`master` 或 `dev` branch
- 對這些 branch 發起 Pull Request

### 檢查流程

```
Push 程式碼到 GitHub
    ↓
GitHub Actions 自動啟動
    ↓
安裝依賴 (npm ci)
    ↓
執行 ESLint 檢查
    ↓
執行 TypeScript & Build 檢查
    ↓
✅ 全部通過 → 可以安全部署
❌ 有錯誤 → 會收到通知，需要修正
```

### 如何查看結果

1. 到你的 GitHub repo
2. 點選上方的 **Actions** 標籤
3. 可以看到每次 push 的檢查結果

### 與 Vercel 部署的整合

- Vercel 會等 GitHub Actions 檢查完成後才部署
- 如果 CI 檢查失敗，Vercel 仍會嘗試 build，但你會在 Actions 頁面看到警告
- 建議：只有在 CI 通過後才 merge PR

## Vercel 部署設定

### 首次設定步驟

1. 前往 [vercel.com](https://vercel.com)
2. 使用 GitHub 帳號登入
3. 點選 "Import Project"
4. 選擇此專案的 GitHub repository
5. 保持預設設定，點擊 "Deploy"

### 自動部署規則

- **Production**：推送到 `main` branch 時自動部署
- **Preview**：每個 PR 都會自動建立預覽環境
- **失敗處理**：如果 build 失敗，不會更新 Production

### 環境變數（如需要）

目前專案沒有使用環境變數，未來如需設定：

1. 到 Vercel Dashboard
2. 選擇專案 → Settings → Environment Variables
3. 新增需要的變數

## 本地開發建議

### 在 push 前先本地檢查

```bash
# 執行 ESLint 檢查
npm run lint

# 測試 build 是否成功
npm run build

# 如果 build 成功，啟動 production server 測試
npm run start
```

### 開發流程建議

1. 在 feature branch 開發
2. 本地測試 (`npm run dev`)
3. 執行 `npm run lint` 和 `npm run build` 確認沒問題
4. Push 到 GitHub
5. 建立 PR，等待 CI 檢查通過
6. Merge 到 main，自動部署到 Production

## 故障排除

### CI 檢查失敗

1. 查看 GitHub Actions 的錯誤訊息
2. 在本地執行相同的指令 (`npm run lint` 或 `npm run build`)
3. 修正錯誤後重新 push

### Vercel 部署失敗

1. 查看 Vercel Dashboard 的部署日誌
2. 確認是否是環境變數問題
3. 確認 `package.json` 的 dependencies 是否都正確

## 效能監控

部署後建議使用 Lighthouse 測試：

1. 打開 Chrome DevTools
2. Lighthouse 標籤
3. 選擇 Production URL
4. 執行測試並檢查效能分數
