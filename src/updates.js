const bilingual = (zh, en) => ({ zh, en });

export function normalizeUpdateEvent(item) {
  return {
    id: `${item.link}-${item.source_hash || item.date}`,
    title: bilingual(item.title_zh || item.title || '官方来源更新', item.title || item.title_en || 'Official source update'),
    summary: bilingual(item.summary_zh || item.summary || '', item.summary_en || item.summary || ''),
    link: item.link,
    date: item.date,
    source: item.source,
    sourceHash: item.source_hash || '',
    reviewRequired: true,
  };
}

export const initialUpdateEvents = [
  normalizeUpdateEvent({
    title: 'Digital Operational Resilience Act | European Banking Authority',
    title_zh: 'EBA DORA 监管入口',
    summary: 'The official EBA DORA activity and oversight page changed.',
    summary_zh: 'EBA DORA 官方活动与监管入口页面有更新。',
    summary_en: 'The official EBA DORA activity and oversight page changed.',
    link: 'https://www.eba.europa.eu/activities/direct-supervision-and-oversight/digital-operational-resilience-act',
    date: '2026-11-20',
    source: 'EBA',
    source_hash: '8499936ade27ebcc550cebb265870ee8edd6b3bd60b67d33bf05620adb3996fb',
  }),
  normalizeUpdateEvent({
    title: 'DORA oversight | European Banking Authority',
    title_zh: 'EBA DORA 监督入口',
    summary: 'The official EBA DORA oversight page changed; review whether applicability or action items are affected.',
    summary_zh: 'EBA DORA 监督页面有更新，需人工核对是否影响适用性或行动项。',
    summary_en: 'The official EBA DORA oversight page changed; review whether applicability or action items are affected.',
    link: 'https://www.eba.europa.eu/activities/direct-supervision-and-oversight/digital-operational-resilience-act/dora-oversight',
    date: '2026-11-20',
    source: 'EBA',
    source_hash: '89573edfb932b3b6c7e8153d1dba32007478e26d33d8e515ac19b2ff5d73e75b',
  }),
];
