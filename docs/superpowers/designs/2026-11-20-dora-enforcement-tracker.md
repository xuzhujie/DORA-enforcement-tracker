# DORA Enforcement Tracker — Design

## Intent

为法务、风险、采购和合规团队提供一张可快速分诊的监管执法追踪工作台。首屏回答三个问题：哪些事项尚未分诊、哪些事项正在复核、未来 30 天有什么行动需要跟进。

## Scope and rules

- DORA 只有在记录与金融客户或关键 ICT 供应链相关时进入主视图。
- DGA 只有在记录涉及数据中介或相关非个人数据出境时单列。
- 其他数据治理事项保留在追踪表中，但不抢占 DORA/DGA 的主叙事。
- 每条记录带有来源机构、来源 URL、发布日期、最后更新、相关性、状态和优先级。
- 演示数据必须在界面上明确标记为演示数据，不伪装成真实执法统计。

## Audience and workflow

用户进入后先看 KPI 与趋势，再使用 regime、relevance、status、date range 筛选；从证据表选择记录，右侧详情展示摘要、来源证据和操作入口；“标记复核”只改变本地 UI 状态，不声称已经同步到外部系统。

## Visual direction

- 深墨蓝导航轨，白色主画布，浅 slate 表面。
- 琥珀表示需要关注，青绿色表示已复核/进行中，蓝色表示 DORA 相关性。
- 细 1px 分隔线、10–14px 圆角、低阴影，避免玻璃拟态、霓虹和泛卡片矩阵。
- 内容排版强调证据密度；控制文字、表格、图表标签使用明确字号与行高。

## Information architecture

1. App shell：品牌、Tracker / Cases & evidence / Settings 导航。
2. Header：页面标题、演示数据 disclosure、导出和保存视图操作。
3. Summary band：待分诊、复核中、未来 30 天行动。
4. Insight area：按 regime 的趋势图与即将行动列表。
5. Evidence workspace：筛选控件、可排序证据表、选中记录详情抽屉。
6. Responsive：窄屏隐藏导航文字并把详情移到表格下方；表格允许横向滚动但不裁剪关键字段。

## Interaction contract

- 选择任一筛选器会同时更新 KPI、趋势、即将行动列表和证据表。
- 选择表格行会更新详情区并高亮当前行。
- “标记复核”在当前会话内切换记录的 `reviewed` 状态。
- “打开来源”使用记录的实际 `sourceUrl` 新开标签页。
- 导出按钮下载当前筛选结果的 CSV；保存视图给出本地 UI toast。
- 所有主要按钮、表头排序和筛选器具备键盘焦点样式。

## Deliberate limitations

当前版本不接后端、不抓取或推断实时执法数据，也不把官方监管入口当作一条真实案件记录。后续接入真实数据时，保留 `sourceUrl`、`sourcePublishedAt`、`evidenceExcerpt` 和 `dataConfidence` 字段，优先从 EBA/ESA 或其他官方来源填充。

## Delivery extension aligned with adjacent DMA/DSA work

- 双语不是只翻译壳层：界面 copy、记录字段、状态/筛选标签、日期格式和导出文件都由 `zh/en` 同一数据契约驱动，并把语言偏好保存在本地。
- 保留 source-first 交付：主看板详情、静态分享页和更新快照都保留官方来源 URL；监测只检测官方页面 hash 变化，不自动把页面变化解释成法律结论。
- 交付效果对齐 DMA/DSA：提供可打印/可分享的静态快照、CSV/JSON/Markdown 导出、每日 GitHub Actions 来源检查、Pages 构建门禁和可复跑的 Node/Python 测试。
- 数据字段向“能落到动作”靠拢：除摘要与证据摘录外，保留 `owner`、`nextAction`、`businessImpact`、`lastVerifiedAt` 和 `dataConfidence`，方便后续接入真实案件/事件记录。

