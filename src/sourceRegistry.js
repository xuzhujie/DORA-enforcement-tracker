const bilingual = (zh, en) => ({ zh, en });

export const sourceRegistry = [
  {
    id: 'eba-dora-root',
    regime: 'DORA',
    authority: 'EBA / ESA',
    name: bilingual('EBA DORA 监管入口', 'EBA DORA regulatory entry point'),
    url: 'https://www.eba.europa.eu/activities/direct-supervision-and-oversight/digital-operational-resilience-act',
    sourceType: 'official',
    scope: bilingual('金融客户与关键 ICT 供应链相关 DORA 监管活动', 'DORA activity relevant to financial customers and critical ICT supply chains'),
    status: 'active',
    monitorEnabled: true,
    lastCheckedAt: '2026-11-20',
  },
  {
    id: 'eba-dora-oversight',
    regime: 'DORA',
    authority: 'EBA / ESA',
    name: bilingual('EBA DORA 监督入口', 'EBA DORA oversight entry point'),
    url: 'https://www.eba.europa.eu/activities/direct-supervision-and-oversight/digital-operational-resilience-act/dora-oversight',
    sourceType: 'official',
    scope: bilingual('关键 ICT 第三方服务商监督及金融部门韧性风险', 'Critical ICT third-party oversight and financial-sector resilience risk'),
    status: 'active',
    monitorEnabled: true,
    lastCheckedAt: '2026-11-20',
  },
  {
    id: 'ec-dga-policy',
    regime: 'DGA',
    authority: 'European Commission',
    name: bilingual('欧盟数据治理法政策页', 'European Data Governance Act policy page'),
    url: 'https://digital-strategy.ec.europa.eu/en/policies/data-governance-act',
    sourceType: 'official',
    scope: bilingual('仅在数据中介或相关非个人数据出境场景单列', 'Separate only for data-intermediary or relevant non-personal-data transfer scenarios'),
    status: 'secondary',
    monitorEnabled: false,
    lastCheckedAt: '2026-11-20',
  },
];

export function sourceForUrl(url) {
  return sourceRegistry.find((source) => source.url === url) || null;
}
