# DORA Enforcement Tracker

一个面向法务、风险、采购和合规团队的双语监管执法追踪工作台（React/Vite）。English UI is available from the `中文 / EN` toggle and is persisted in `localStorage`.

## 范围口径 / Scope

- DORA 仅在事项与金融客户或关键 ICT 供应链相关时进入重点视图。
- DGA 仅在事项涉及数据中介或相关非个人数据出境时单列。
- 当前记录为演示数据，不代表真实执法统计；每条记录保留来源 URL、证据摘录、最后核验日期和 `dataConfidence`，便于后续接入真实数据。
- DORA 官方监督入口：<https://www.eba.europa.eu/activities/direct-supervision-and-oversight/digital-operational-resilience-act/dora-oversight>

## 交付能力 / Delivery surface

- 主看板：KPI、按筛选联动的趋势、未来 30 天行动、证据表和详情面板。
- 双语：界面、状态/筛选标签、记录字段、日期格式和 CSV/JSON/Markdown 导出均支持中文/英文。
- 交付快照：`/static/index.html` 是可打印/可分享的静态快照，不依赖 React 运行时。
- 官方来源监测：`scripts/check_updates.py` 对 EBA DORA 页面做哈希变更检测，并写入 `public/data/updates.json`；只产生待人工核验的来源更新，不自动推断法律结论。
- 来源与复核：来源登记表区分 DORA 官方监测源与 DGA 次级范围；更新事件只进入人工复核闸门，详情面板会把本地复核动作记录到浏览器存储。
- CI/部署：GitHub Actions 定时检查来源，Pages 构建前运行 JavaScript/Python 测试、Playwright 烟测、lint 和生产构建。

## 本地运行 / Local development

```bash
npm ci
npm run dev
```

验证：

```bash
npm test
python3 -m unittest discover -s tests -v
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

手动运行来源监测：

```bash
python3 scripts/check_updates.py
```

监测脚本默认从官方页面抓取 HTML，只在内容 hash 变化时更新 `public/data/updates.json`。真实接入时仍需人工复核来源、适用性、业务影响和下一步动作。

## 发布闭环 / Publish loop

1. 在 GitHub 创建或指定一个空仓库，并把本地仓库 remote 命名为 `origin`。
2. 推送 `main` 分支；`Build and deploy tracker` 会构建并发布 GitHub Pages。
3. `Monitor official DORA sources` 每日检查官方 EBA 页面；检测到更新后只提交 `public/data/updates.json`，随后由 `workflow_run` 触发 Pages 构建。
4. 首次发布前在仓库 Settings → Pages 中确认 Source 使用 GitHub Actions；不要把演示记录当作真实执法统计。

当前工作区没有预设 GitHub remote，因此本地初始化与实际推送分开处理；拿到目标仓库地址后再执行 `git remote add origin ...` 与 `git push`。
