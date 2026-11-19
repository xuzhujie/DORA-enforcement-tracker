export const REFERENCE_DATE = '2026-11-20';
export const DATA_AS_OF = REFERENCE_DATE;
export const DEFAULT_FILTERS = { regime: 'DORA', relevance: 'all', status: 'all', dateRange: '90d' };

const bilingual = (zh, en) => ({ zh, en });

export const DORA_RELEVANCE_VALUES = ['financial-customer', 'critical-ict-supply-chain'];
export const DGA_RELEVANCE_VALUES = ['data-intermediary', 'non-personal-data-transfer'];

export const REGIME_OPTIONS = [
  { value: 'all', label: bilingual('全部规则域', 'All regimes') },
  { value: 'DORA', label: bilingual('DORA', 'DORA') },
  { value: 'DGA', label: bilingual('DGA', 'DGA') },
  { value: 'Other', label: bilingual('其他', 'Other') },
];

export const RELEVANCE_OPTIONS = [
  { value: 'all', label: bilingual('全部相关性', 'All relevance') },
  { value: 'financial-customer', label: bilingual('金融客户', 'Financial customer') },
  { value: 'critical-ict-supply-chain', label: bilingual('关键 ICT 供应链', 'Critical ICT supply chain') },
  { value: 'data-intermediary', label: bilingual('数据中介', 'Data intermediary') },
  { value: 'non-personal-data-transfer', label: bilingual('非个人数据出境', 'Non-personal data transfer') },
  { value: 'other', label: bilingual('其他', 'Other') },
];

export const STATUS_OPTIONS = [
  { value: 'all', label: bilingual('全部状态', 'All statuses') },
  { value: 'open', label: bilingual('待分诊', 'Open triage') },
  { value: 'under-review', label: bilingual('复核中', 'Under review') },
  { value: 'reviewed', label: bilingual('已复核', 'Reviewed') },
];

export const PRIORITY_OPTIONS = [
  { value: 'high', label: bilingual('高', 'High') },
  { value: 'medium', label: bilingual('中', 'Medium') },
  { value: 'low', label: bilingual('低', 'Low') },
];

export const DATE_OPTIONS = [
  { value: '90d', label: bilingual('近 90 天', 'Last 90 days') },
  { value: '30d', label: bilingual('近 30 天', 'Last 30 days') },
  { value: 'all', label: bilingual('全部时间', 'All time') },
];

export const TREND_MONTH_LABELS = [
  bilingual('6月', 'Jun'),
  bilingual('7月', 'Jul'),
  bilingual('8月', 'Aug'),
  bilingual('9月', 'Sep'),
  bilingual('10月', 'Oct'),
  bilingual('11月', 'Nov'),
];

export const records = [
  {
    id: 'dora-001',
    regime: 'DORA',
    relevance: 'financial-customer',
    topic: bilingual('ICT 第三方风险管理', 'ICT third-party risk management'),
    source: bilingual('EBA / ESA', 'EBA / ESA'),
    sourceType: 'official',
    affectedParty: bilingual('金融客户', 'Financial customers'),
    status: 'open',
    priority: 'high',
    lastUpdate: '2026-11-18',
    publishedAt: '2026-11-18',
    lastVerifiedAt: '2026-11-20',
    dueDate: '2026-11-26',
    sourceUrl: 'https://www.eba.europa.eu/activities/direct-supervision-and-oversight/digital-operational-resilience-act/dora-oversight',
    summary: bilingual(
      '跟进金融客户在 ICT 第三方风险管理与韧性安排上的监管动作，重点核对合同控制、监测机制和关键服务依赖。',
      'Track regulatory activity affecting ICT third-party risk and resilience for financial customers, focusing on contract controls, monitoring, and critical service dependencies.',
    ),
    evidenceExcerpt: bilingual(
      'DORA 的监督框架围绕关键 ICT 第三方服务商对金融部门造成的风险展开，并与金融实体自身的 ICT 风险责任并行。',
      'DORA oversight addresses the risks that critical ICT third-party providers create for the financial sector alongside the ICT risk responsibilities of financial entities.',
    ),
    businessImpact: bilingual('需要更新第三方风险登记和合同控制证据。', 'Refresh the third-party risk register and contract-control evidence.'),
    owner: bilingual('采购 / ICT 风险', 'Procurement / ICT risk'),
    nextAction: bilingual('核对关键供应商合同中的监测和退出条款。', 'Review monitoring and exit clauses in critical-provider contracts.'),
    dataConfidence: 'demo',
    reviewed: false,
  },
  {
    id: 'dora-002',
    regime: 'DORA',
    relevance: 'critical-ict-supply-chain',
    topic: bilingual('关键 ICT 供应链韧性', 'Critical ICT supply-chain resilience'),
    source: bilingual('EBA / ESA', 'EBA / ESA'),
    sourceType: 'official',
    affectedParty: bilingual('关键 ICT 供应链', 'Critical ICT supply chain'),
    status: 'under-review',
    priority: 'high',
    lastUpdate: '2026-11-14',
    publishedAt: '2026-11-14',
    lastVerifiedAt: '2026-11-20',
    dueDate: '2026-12-02',
    sourceUrl: 'https://www.eba.europa.eu/activities/direct-supervision-and-oversight/digital-operational-resilience-act/dora-oversight',
    summary: bilingual(
      '评估关键 ICT 供应链在事件响应、业务连续性和集中度风险方面的跟进动作。',
      'Assess follow-up actions for incident response, business continuity, and concentration risk across the critical ICT supply chain.',
    ),
    evidenceExcerpt: bilingual(
      '监督活动关注关键 ICT 第三方服务商的治理与风险管理安排，以及其对金融部门数字韧性的影响。',
      'Oversight focuses on governance and risk-management arrangements at critical ICT third-party providers and their impact on financial-sector digital resilience.',
    ),
    businessImpact: bilingual('可能影响供应商分级、集中度评估和业务连续性测试。', 'May affect supplier tiering, concentration assessment, and continuity testing.'),
    owner: bilingual('业务连续性 / 采购', 'Business continuity / Procurement'),
    nextAction: bilingual('补齐关键 ICT 服务依赖和替代方案证据。', 'Complete evidence for critical ICT dependencies and exit alternatives.'),
    dataConfidence: 'demo',
    reviewed: false,
  },
  {
    id: 'dga-001',
    regime: 'DGA',
    relevance: 'data-intermediary',
    topic: bilingual('数据中介监督', 'Data-intermediary oversight'),
    source: bilingual('EU data policy', 'EU data policy'),
    sourceType: 'policy',
    affectedParty: bilingual('数据中介', 'Data intermediary'),
    status: 'open',
    priority: 'medium',
    lastUpdate: '2026-11-11',
    publishedAt: '2026-11-11',
    lastVerifiedAt: '2026-11-20',
    dueDate: '2026-11-29',
    sourceUrl: 'https://digital-strategy.ec.europa.eu/en/policies/data-governance-act',
    summary: bilingual(
      '仅在业务模式涉及数据中介服务时纳入 DGA 线索，核对通知、透明度与跨主体数据共享要求。',
      'Include a DGA lead only where the business model involves data-intermediary services; check notification, transparency, and cross-party sharing requirements.',
    ),
    evidenceExcerpt: bilingual(
      'DGA 相关追踪应聚焦数据中介服务与数据利他机制等具体业务触点，而非泛化为所有数据治理事项。',
      'DGA tracking should focus on concrete business touchpoints such as data-intermediation services and data altruism, not data governance in general.',
    ),
    businessImpact: bilingual('需要确认是否触发数据中介业务的通知与透明度流程。', 'Confirm whether data-intermediary notification and transparency processes are triggered.'),
    owner: bilingual('数据治理 / 法务', 'Data governance / Legal'),
    nextAction: bilingual('确认平台是否为数据中介并记录适用边界。', 'Confirm whether the platform is a data intermediary and record the applicability boundary.'),
    dataConfidence: 'demo',
    reviewed: false,
  },
  {
    id: 'dga-002',
    regime: 'DGA',
    relevance: 'non-personal-data-transfer',
    topic: bilingual('非个人数据出境', 'Non-personal data transfer'),
    source: bilingual('EU data policy', 'EU data policy'),
    sourceType: 'policy',
    affectedParty: bilingual('非个人数据出境链路', 'Non-personal data transfer path'),
    status: 'under-review',
    priority: 'medium',
    lastUpdate: '2026-10-29',
    publishedAt: '2026-10-29',
    lastVerifiedAt: '2026-11-20',
    dueDate: '2026-12-08',
    sourceUrl: 'https://digital-strategy.ec.europa.eu/en/policies/data-governance-act',
    summary: bilingual(
      '当业务触及相关非个人数据出境时单列评估，避免把 DGA 事项与个人数据出境或一般数据治理混为一谈。',
      'Assess separately when the business touches relevant non-personal data transfers; do not mix DGA with personal-data transfers or generic data governance.',
    ),
    evidenceExcerpt: bilingual(
      '本条为业务场景标签，用于提示进一步核对适用的非个人数据跨境规则与合同/技术控制。',
      'This is a business-scenario flag to prompt a review of applicable non-personal-data transfer rules and contractual or technical controls.',
    ),
    businessImpact: bilingual('需要把非个人数据流向、合同限制和技术隔离证据归档。', 'Archive non-personal data flows, contractual restrictions, and technical-separation evidence.'),
    owner: bilingual('数据出境 / 法务', 'Data transfers / Legal'),
    nextAction: bilingual('核对相关数据集分类及供应商传输路径。', 'Review the classification of relevant datasets and provider transfer paths.'),
    dataConfidence: 'demo',
    reviewed: false,
  },
  {
    id: 'dora-003',
    regime: 'DORA',
    relevance: 'financial-customer',
    topic: bilingual('重大 ICT 事件报告', 'Major ICT-related incident reporting'),
    source: bilingual('EBA / ESA', 'EBA / ESA'),
    sourceType: 'official',
    affectedParty: bilingual('金融客户', 'Financial customers'),
    status: 'open',
    priority: 'high',
    lastUpdate: '2026-10-07',
    publishedAt: '2026-10-07',
    lastVerifiedAt: '2026-11-20',
    dueDate: '2026-11-24',
    sourceUrl: 'https://www.eba.europa.eu/publications-and-media/press-releases/esas-publish-first-report-dora-major-ict-related-incidents',
    summary: bilingual(
      '跟进金融客户重大 ICT 事件的分类、报告与补救闭环，重点关注是否触发内部升级和监管沟通。',
      'Track classification, reporting, and remediation closure for major ICT incidents affecting financial customers, including escalation and regulatory communication.',
    ),
    evidenceExcerpt: bilingual(
      'DORA 的重大 ICT 事件报告机制覆盖对金融实体服务造成不利影响的网络与信息系统事件。',
      'DORA major ICT incident reporting covers network and information-system incidents that adversely affect services provided to financial entities.',
    ),
    businessImpact: bilingual('影响事件分级、通知时限和客户沟通证据。', 'Affects incident severity, notification timelines, and customer-communication evidence.'),
    owner: bilingual('安全运营 / 法务', 'Security operations / Legal'),
    nextAction: bilingual('确认重大 ICT 事件分类与升级路径是否留痕。', 'Confirm that major ICT incident classification and escalation paths are evidenced.'),
    dataConfidence: 'demo',
    reviewed: false,
  },
  {
    id: 'other-001',
    regime: 'Other',
    relevance: 'other',
    topic: bilingual('ICT 服务提供商合同治理', 'ICT service-provider contract governance'),
    source: bilingual('National regulator', 'National regulator'),
    sourceType: 'reference',
    affectedParty: bilingual('ICT 服务提供商', 'ICT service provider'),
    status: 'under-review',
    priority: 'low',
    lastUpdate: '2026-09-18',
    publishedAt: '2026-09-18',
    lastVerifiedAt: '2026-11-20',
    dueDate: null,
    sourceUrl: 'https://www.eba.europa.eu/regulation-and-policy/operational-resilience',
    summary: bilingual(
      '作为非 DORA 主线事项保留，用于核对一般 ICT 合同治理的审阅边界。',
      'Retained as a non-DORA line item to clarify the review boundary for general ICT contract governance.',
    ),
    evidenceExcerpt: bilingual(
      '该记录用于演示其他规则域的证据归档，不代表 DORA 适用性结论。',
      'This record demonstrates evidence filing for other regimes and is not a DORA applicability conclusion.',
    ),
    businessImpact: bilingual('作为合同治理基线，不直接改变 DORA 主线计数。', 'Acts as a contract-governance baseline and does not change the DORA primary count.'),
    owner: bilingual('采购', 'Procurement'),
    nextAction: bilingual('维持归档，待出现具体规则触点再升级。', 'Keep archived and escalate only if a specific regulatory trigger appears.'),
    dataConfidence: 'demo',
    reviewed: true,
  },
  {
    id: 'dora-004',
    regime: 'DORA',
    relevance: 'critical-ict-supply-chain',
    topic: bilingual('韧性测试与整改', 'Resilience testing and remediation'),
    source: bilingual('EBA / ESA', 'EBA / ESA'),
    sourceType: 'official',
    affectedParty: bilingual('关键 ICT 供应链', 'Critical ICT supply chain'),
    status: 'under-review',
    priority: 'medium',
    lastUpdate: '2026-08-22',
    publishedAt: '2026-08-22',
    lastVerifiedAt: '2026-11-20',
    dueDate: '2026-11-30',
    sourceUrl: 'https://www.eba.europa.eu/activities/direct-supervision-and-oversight/digital-operational-resilience-act',
    summary: bilingual(
      '对关键 ICT 供应链的测试、脆弱性发现和整改证据进行归档，作为供应商尽调的后续输入。',
      'File testing, vulnerability findings, and remediation evidence for the critical ICT supply chain as follow-up input for supplier diligence.',
    ),
    evidenceExcerpt: bilingual(
      '监督框架包括对关键 ICT 第三方服务商进行信息请求、非现场调查、现场检查以及建议或处罚等工具。',
      'The oversight framework includes information requests, off-site investigations, on-site inspections, and recommendations or penalties for critical ICT third-party providers.',
    ),
    businessImpact: bilingual('会影响测试计划、整改跟踪和供应商复评材料。', 'Affects testing plans, remediation tracking, and supplier re-assessment materials.'),
    owner: bilingual('技术风险 / 采购', 'Technology risk / Procurement'),
    nextAction: bilingual('汇总测试结果与未关闭整改项。', 'Consolidate test results and open remediation items.'),
    dataConfidence: 'demo',
    reviewed: false,
  },
  {
    id: 'other-002',
    regime: 'Other',
    relevance: 'other',
    topic: bilingual('一般数据治理（归档）', 'General data governance (archived)'),
    source: bilingual('EU data policy', 'EU data policy'),
    sourceType: 'reference',
    affectedParty: bilingual('服务提供商', 'Service provider'),
    status: 'under-review',
    priority: 'low',
    lastUpdate: '2026-07-10',
    publishedAt: '2026-07-10',
    lastVerifiedAt: '2026-11-20',
    dueDate: null,
    sourceUrl: 'https://digital-strategy.ec.europa.eu/en/policies/data-governance-act',
    summary: bilingual(
      '仅作为归档记录存在，不会进入 DORA 或 DGA 的重点计数。',
      'Retained as an archive record and excluded from the primary DORA or DGA focus count.',
    ),
    evidenceExcerpt: bilingual(
      '通用数据治理记录只有在命中数据中介或相关非个人数据出境场景时才应升级为 DGA 线索。',
      'A general data-governance record should become a DGA lead only when it matches a data-intermediary or relevant non-personal-data transfer scenario.',
    ),
    businessImpact: bilingual('不影响主线计数，仅保留为后续分诊背景。', 'Does not affect the primary count; retained as triage context.'),
    owner: bilingual('数据治理', 'Data governance'),
    nextAction: bilingual('保持归档，出现业务触点后再重新分诊。', 'Keep archived and re-triage if a business touchpoint appears.'),
    dataConfidence: 'demo',
    reviewed: true,
  },
];

const dateValue = (value) => new Date(`${value}T00:00:00`);

export function filterRecords(items, filters) {
  const cutoff = filters.dateRange === '30d'
    ? dateValue('2026-10-21')
    : filters.dateRange === '90d'
      ? dateValue('2026-08-22')
      : null;

  return items.filter((record) => {
    const matchesRegime = filters.regime === 'all' || record.regime === filters.regime;
    const matchesRelevance = filters.relevance === 'all' || record.relevance === filters.relevance;
    const matchesStatus = filters.status === 'all' || record.status === filters.status;
    const matchesDate = !cutoff || dateValue(record.lastUpdate) >= cutoff;
    return matchesRegime && matchesRelevance && matchesStatus && matchesDate;
  });
}

export function getSummary(items) {
  const reference = dateValue(REFERENCE_DATE);
  const nextThirtyDays = new Date(reference);
  nextThirtyDays.setDate(nextThirtyDays.getDate() + 30);
  const upcoming = items.filter((item) => {
    if (!item.dueDate) return false;
    const dueDate = dateValue(item.dueDate);
    return dueDate >= reference && dueDate <= nextThirtyDays;
  });

  return {
    open: items.filter((item) => item.status === 'open').length,
    underReview: items.filter((item) => item.status === 'under-review').length,
    upcoming: upcoming.length,
    upcomingItems: upcoming.sort((a, b) => dateValue(a.dueDate) - dateValue(b.dueDate)),
  };
}

export function getTrend(items) {
  const series = { DORA: [], DGA: [], Other: [] };
  TREND_MONTH_LABELS.forEach((_, monthIndex) => {
    const month = monthIndex + 6;
    Object.keys(series).forEach((regime) => {
      const count = items.filter((item) => {
        const itemDate = dateValue(item.lastUpdate);
        return item.regime === regime && itemDate.getMonth() + 1 === month;
      }).length;
      series[regime].push(count);
    });
  });
  return { labels: TREND_MONTH_LABELS, series };
}

export function labelFor(options, value, language = 'zh') {
  const option = options.find((item) => item.value === value);
  if (!option) return value;
  return option.label?.[language] ?? option.label?.zh ?? option.label ?? value;
}
