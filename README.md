# DORA Enforcement Tracker

一个面向法务、风险、采购和合规团队的双语监管执法追踪工作台（React/Vite）。English UI is available from the `中文 / EN` toggle and is persisted in `localStorage`.

## 范围口径 / Scope

- DORA 仅在事项与金融客户或关键 ICT 供应链相关时进入重点视图。
- DGA 仅在事项涉及数据中介或相关非个人数据出境时单列。
- 当前 `public/data/records.json` 是官方来源整理后的 `pending-review` 候选集，不代表已确认执法结论；每条记录保留 `recordType`、来源 URL、证据摘录、最后核验日期和 `dataConfidence`。
- DORA 官方监督入口：<https://www.eba.europa.eu/activities/direct-supervision-and-oversight/digital-operational-resilience-act/dora-oversight>

## 交付能力 / Delivery surface

- 主看板：KPI、按筛选联动的趋势、未来 30 天行动、证据表和详情面板。
- 双语：界面、状态/筛选标签、记录字段、日期格式和 CSV/JSON/Markdown 导出均支持中文/英文。
- 交付快照：`/static/index.html` 是从 `public/data/records.json` 生成的可打印/可分享静态快照，保留记录类型和复核闸门，不依赖 React 运行时；数据快照异常时会回退到内置数据。
- 数据交接：`public/data/records.json` 是可替换的数据快照；当前 `dataset_status` 为 `pending-review`，已整理官方来源但仍需业务负责人/法务人工复核。
- 共享复核：`reviewed` 数据必须包含批准决定、复核人、复核日期和备注；`npm run validate:records` 会在 Pages 构建前拦截缺失元数据、未知记录类型和坏日期。
- 新鲜度：`lastUpdate` 表示本次追踪器整理/复核日期，`publishedAt` 表示官方来源日期；超过 30 天未核验的证据会保留但标记为需重新核验。
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
npm run validate:records
npm run build
npm run records:snapshot
npm run snapshot
npx playwright install chromium
npm run test:e2e
```

手动运行来源监测：

```bash
python3 scripts/check_updates.py
```

监测脚本默认从官方页面抓取 HTML，只在内容 hash 变化时更新 `public/data/updates.json`。真实接入时仍需人工复核来源、适用性、业务影响和下一步动作。

生产数据交接：先复制当前 `public/data/records.json` 作为结构模板，逐条替换 `records`，保留 `recordType`、双语字段、官方 `sourceUrl`、`evidenceExcerpt`、`lastVerifiedAt`、`owner`、`nextAction` 和 `businessImpact`。只有在完成业务负责人/法务复核后，才将 `dataset_status` 改为 `reviewed`，并填写 `review.decision: "approved"`、`review.reviewer`、`review.reviewedAt` 和 `review.notes`；不确定的记录使用 `pending-review`，不要把页面 hash 自动升级为法律结论。当前快照已由官方 EBA/ESA 来源整理为 `pending-review`，其中截止日期是内部复核目标，不是监管期限。`npm run records:snapshot` 只用于重新生成 demo 种子；正常 `npm run build` 不会覆盖这份可替换快照。

## 发布闭环 / Publish loop

1. 推送 `main` 分支；`Build and deploy tracker` 会运行全套测试并发布 GitHub Pages。
2. `Monitor official DORA sources` 每日检查官方 EBA 页面；检测到更新后只提交 `public/data/updates.json`，随后由 `workflow_run` 触发 Pages 构建。
3. 首次发布前在仓库 Settings → Pages 中确认 Source 使用 GitHub Actions；当前公开看板地址为 <https://xuzhujie.github.io/DORA-enforcement-tracker/>。
4. 不要把待复核线索当作已确认执法统计；替换 `records.json` 后先运行 `npm run validate:records`，再在看板中确认双语、类型筛选、行动和详情链路，最后通过 PR 发布。
