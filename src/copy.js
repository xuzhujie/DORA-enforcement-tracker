export const LANGUAGES = ['zh', 'en'];

export const LANGUAGE_LABELS = {
  zh: '中文',
  en: 'EN',
};

export const UI = {
  zh: {
    appName: 'DORA Enforcement Tracker',
    pageTitle: '监管执法追踪',
    nav: {
      tracker: '监管追踪',
      cases: '案例与证据',
      settings: '设置',
      label: '主导航',
    },
    scope: {
      label: '重点范围',
      dora: '金融客户',
      supplyChain: '关键 ICT 供应链',
      dga: 'DGA 仅在数据中介或相关非个人数据出境场景单列',
    },
    demoNotice: '演示数据 · 仅用于界面与流程验证，不代表真实执法统计',
    dataFreshness: '数据核验截至',
    officialSource: '官方监管入口',
    actions: {
      export: '导出',
      exportCsv: 'CSV',
      exportJson: 'JSON',
      exportMarkdown: 'Markdown',
      saveView: '保存视图',
      savedView: '当前筛选已保存为本地视图',
      reset: '重置',
      filtersReset: '筛选条件已重置',
      settingsSoon: '设置页将在接入数据源后开放',
      source: '打开官方来源',
      sourcePublished: '发布于',
      reviewed: '已标记复核',
      markReview: '标记为已复核',
      reviewCancelled: '已取消已复核标记',
      reviewAdded: '已标记为已复核',
    },
    summary: {
      aria: '摘要指标',
      open: { label: '待分诊事项', note: '需要先确认适用性', tone: '需关注' },
      underReview: { label: '正在复核', note: '已有证据或内部动作', tone: '已归档' },
      upcoming: { label: '未来 30 天行动', note: '按演示基准日计算', tone: '排期中' },
    },
    trend: {
      title: '监管事项趋势',
      subtitle: '当前筛选下的演示记录分布',
      legend: '规则域图例',
      aria: 'DORA、DGA 与其他规则域的演示记录趋势',
      other: '其他',
    },
    upcoming: {
      title: '即将行动',
      subtitle: '未来 30 天内需要跟进的事项',
      owner: '责任人',
      empty: '当前筛选没有待排期事项',
    },
    sources: {
      title: '来源登记',
      subtitle: '官方来源状态、适用范围与最后检查时间',
      official: '官方',
      active: '监测中',
      secondary: '次级范围',
      checked: '最近检查',
      automatic: '自动监测',
      manual: '仅人工复核',
      open: '打开来源',
      count: (count) => `${count} 个来源`,
    },
    updates: {
      title: '官方更新事件',
      subtitle: '页面指纹变化只触发人工复核，不自动推导法律结论',
      changed: '页面有变化',
      reviewGate: '需人工复核',
      sourceHash: '指纹',
      empty: '暂无已记录的官方更新事件',
    },
    reviewHistory: {
      title: '复核留痕',
      empty: '该记录暂无本地复核事件',
      marked: '已标记为已复核',
      cancelled: '已取消已复核标记',
    },
    filters: {
      aria: '证据筛选',
      title: '筛选',
      reset: '重置',
      regime: '规则域',
      relevance: '相关性',
      status: '状态',
      dateRange: '更新时间',
    },
    evidence: {
      title: '证据记录',
      subtitle: '只将命中业务相关性的事项提升为重点跟进',
      source: '来源',
      topic: '主题',
      affectedParty: '受影响对象',
      status: '状态',
      priority: '优先级',
      lastUpdate: '最近更新',
      emptyTitle: '没有符合当前筛选的记录',
      emptySubtitle: '可以放宽时间范围或重置筛选条件。',
      count: (count) => `${count} 条记录`,
    },
    detail: {
      aria: '记录详情',
      kicker: '监管事项',
      close: '关闭详情',
      emptyTitle: '选择一条证据记录',
      emptySubtitle: '从左侧表格打开详情，查看摘要、来源和下一步动作。',
      regime: '规则域',
      relevance: '相关性',
      status: '状态',
      priority: '优先级',
      lastUpdate: '最近更新',
      dueDate: '行动日期',
      verifiedAt: '最后核验',
      owner: '责任人',
      summary: '摘要',
      nextAction: '下一步动作',
      businessImpact: '业务影响',
      evidence: '来源证据',
      official: '官方来源',
    },
    footnote: {
      referenceDate: '演示基准日',
      scope: '口径：DORA 仅追踪金融客户与关键 ICT 供应链相关事项',
    },
    export: {
      headers: ['规则域', '相关性', '主题', '来源', '受影响对象', '状态', '优先级', '最近更新', '行动日期', '来源 URL', '证据摘录'],
      exported: (count, format) => `已导出 ${count} 条当前记录（${format}）`,
    },
  },
  en: {
    appName: 'DORA Enforcement Tracker',
    pageTitle: 'Enforcement tracker',
    nav: {
      tracker: 'Tracker',
      cases: 'Cases & evidence',
      settings: 'Settings',
      label: 'Primary navigation',
    },
    scope: {
      label: 'Focus scope',
      dora: 'Financial customers',
      supplyChain: 'Critical ICT supply chain',
      dga: 'DGA is separated only for data intermediaries or relevant non-personal data transfers',
    },
    demoNotice: 'Demo data · for interface and workflow validation only; not real enforcement statistics',
    dataFreshness: 'Data verified through',
    officialSource: 'Official regulatory entry point',
    actions: {
      export: 'Export',
      exportCsv: 'CSV',
      exportJson: 'JSON',
      exportMarkdown: 'Markdown',
      saveView: 'Save view',
      savedView: 'Current filters saved as a local view',
      reset: 'Reset',
      filtersReset: 'Filters reset',
      settingsSoon: 'Settings will open after a data source is connected',
      source: 'Open official source',
      sourcePublished: 'Published',
      reviewed: 'Marked as reviewed',
      markReview: 'Mark as reviewed',
      reviewCancelled: 'Reviewed mark removed',
      reviewAdded: 'Marked as reviewed',
    },
    summary: {
      aria: 'Summary metrics',
      open: { label: 'Open triage', note: 'Confirm applicability first', tone: 'Attention' },
      underReview: { label: 'Under review', note: 'Evidence or internal action exists', tone: 'In review' },
      upcoming: { label: 'Actions in 30 days', note: 'Calculated from the demo reference date', tone: 'Scheduled' },
    },
    trend: {
      title: 'Regulatory activity trend',
      subtitle: 'Demo record distribution for the current filters',
      legend: 'Regime legend',
      aria: 'Demo record trend for DORA, DGA, and other regimes',
      other: 'Other',
    },
    upcoming: {
      title: 'Upcoming actions',
      subtitle: 'Items requiring follow-up in the next 30 days',
      owner: 'Owner',
      empty: 'No scheduled actions match the current filters',
    },
    sources: {
      title: 'Source registry',
      subtitle: 'Official source status, scope, and last checked time',
      official: 'Official',
      active: 'Monitoring',
      secondary: 'Secondary scope',
      checked: 'Last checked',
      automatic: 'Automatic monitor',
      manual: 'Human review only',
      open: 'Open source',
      count: (count) => `${count} sources`,
    },
    updates: {
      title: 'Official update events',
      subtitle: 'A page-fingerprint change triggers human review; it does not infer legal conclusions',
      changed: 'Page changed',
      reviewGate: 'Human review required',
      sourceHash: 'Fingerprint',
      empty: 'No official update events recorded yet',
    },
    reviewHistory: {
      title: 'Review history',
      empty: 'No local review event for this record',
      marked: 'Marked as reviewed',
      cancelled: 'Reviewed mark removed',
    },
    filters: {
      aria: 'Evidence filters',
      title: 'Filters',
      reset: 'Reset',
      regime: 'Regime',
      relevance: 'Relevance',
      status: 'Status',
      dateRange: 'Updated',
    },
    evidence: {
      title: 'Evidence records',
      subtitle: 'Promote only items that match a business-relevance rule',
      source: 'Source',
      topic: 'Topic',
      affectedParty: 'Affected party',
      status: 'Status',
      priority: 'Priority',
      lastUpdate: 'Last update',
      emptyTitle: 'No records match the current filters',
      emptySubtitle: 'Broaden the date range or reset the filters.',
      count: (count) => `${count} records`,
    },
    detail: {
      aria: 'Record details',
      kicker: 'Regulatory item',
      close: 'Close details',
      emptyTitle: 'Select an evidence record',
      emptySubtitle: 'Open a row from the table to review its summary, source, and next action.',
      regime: 'Regime',
      relevance: 'Relevance',
      status: 'Status',
      priority: 'Priority',
      lastUpdate: 'Last update',
      dueDate: 'Action date',
      verifiedAt: 'Last verified',
      owner: 'Owner',
      summary: 'Summary',
      nextAction: 'Next action',
      businessImpact: 'Business impact',
      evidence: 'Source evidence',
      official: 'Official source',
    },
    footnote: {
      referenceDate: 'Demo reference date',
      scope: 'Scope: DORA tracks financial-customer and critical-ICT-supply-chain relevance only',
    },
    export: {
      headers: ['Regime', 'Relevance', 'Topic', 'Source', 'Affected party', 'Status', 'Priority', 'Last update', 'Action date', 'Source URL', 'Evidence excerpt'],
      exported: (count, format) => `Exported ${count} current records (${format})`,
    },
  },
};

export function text(value, language = 'zh') {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object' && !Array.isArray(value)) {
    return value[language] ?? value.zh ?? value.en ?? '';
  }
  return value;
}

export function getStoredLanguage() {
  if (typeof window === 'undefined') return 'zh';
  return window.localStorage.getItem('dora-tracker-language') === 'en' ? 'en' : 'zh';
}

export function formatDate(value, language = 'zh') {
  if (!value) return '—';
  const locale = language === 'en' ? 'en-GB' : 'zh-CN';
  return new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(new Date(`${value}T00:00:00`));
}

export function formatLongDate(value, language = 'zh') {
  if (!value) return '—';
  const locale = language === 'en' ? 'en-GB' : 'zh-CN';
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(`${value}T00:00:00`));
}
