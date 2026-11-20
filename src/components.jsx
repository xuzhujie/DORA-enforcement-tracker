import { DATE_OPTIONS, PRIORITY_OPTIONS, REGIME_OPTIONS, RELEVANCE_OPTIONS, STATUS_OPTIONS, labelFor } from './data';
import { formatDate, text, UI } from './copy';

export function Icon({ name, size = 18, strokeWidth = 1.8 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  const paths = {
    grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
    layers: <><path d="m12 3 8 4-8 4-8-4 8-4Z" /><path d="m4 12 8 4 8-4" /><path d="m4 17 8 4 8-4" /></>,
    settings: <><path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" /><path d="m19.4 15 .1.1a1.9 1.9 0 0 1-2.7 2.7l-.1-.1a1.9 1.9 0 0 0-3.2 1.3V19a1.9 1.9 0 0 1-3.8 0v-.2a1.9 1.9 0 0 0-3.2-1.3l-.1.1a1.9 1.9 0 0 1-2.7-2.7l.1-.1a1.9 1.9 0 0 0-1.3-3.2H2.2a1.9 1.9 0 0 1 0-3.8h.2a1.9 1.9 0 0 0 1.3-3.2l-.1-.1a1.9 1.9 0 0 1 2.7-2.7l.1.1a1.9 1.9 0 0 0 3.2-1.3V2.2a1.9 1.9 0 0 1 3.8 0v.2a1.9 1.9 0 0 0 3.2 1.3l.1-.1a1.9 1.9 0 0 1 2.7 2.7l-.1.1a1.9 1.9 0 0 0 1.3 3.2h.2a1.9 1.9 0 0 1 0 3.8h-.2a1.9 1.9 0 0 0-1.3 1.6Z" /></>,
    download: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M4 20h16" /></>,
    bookmark: <path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-3.7L6 21V4.8Z" />,
    chevron: <path d="m7 9 5 5 5-5" />,
    calendar: <><rect x="3" y="4.5" width="18" height="16" rx="2" /><path d="M16 2.5v4M8 2.5v4M3 9h18" /></>,
    external: <><path d="M14 4h6v6" /><path d="m20 4-9 9" /><path d="M19 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    file: <><path d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M14 3v5h5M8 13h8M8 17h6" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    filter: <><path d="M4 5h16M7 12h10M10 19h4" /></>,
    refresh: <><path d="M20 11a8.1 8.1 0 0 0-14.7-3L4 10" /><path d="M4 5v5h5" /><path d="M4 13a8.1 8.1 0 0 0 14.7 3L20 14" /><path d="M20 19v-5h-5" /></>,
  };

  return <svg {...common}>{paths[name] || paths.grid}</svg>;
}

export function StatusChip({ status, language = 'zh' }) {
  const className = status === 'open' ? 'status-open' : status === 'under-review' ? 'status-review' : 'status-reviewed';
  return <span className={`status-chip ${className}`}>{labelFor(STATUS_OPTIONS, status, language)}</span>;
}

export function RegimeChip({ regime, language = 'zh' }) {
  const className = regime === 'DORA' ? 'regime-dora' : regime === 'DGA' ? 'regime-dga' : 'regime-other';
  return <span className={`regime-chip ${className}`}>{labelFor(REGIME_OPTIONS, regime, language)}</span>;
}

export function PriorityLabel({ priority, language = 'zh' }) {
  const className = priority === 'high' ? 'priority-high' : priority === 'medium' ? 'priority-medium' : 'priority-low';
  return <span className={`priority-label ${className}`}>{labelFor(PRIORITY_OPTIONS, priority, language)}</span>;
}

export function SummaryBand({ summary, language = 'zh' }) {
  const copy = UI[language].summary;
  const items = [
    { ...copy.open, value: summary.open, tone: 'attention', toneLabel: copy.open.tone },
    { ...copy.underReview, value: summary.underReview, tone: 'reviewed', toneLabel: copy.underReview.tone },
    { ...copy.upcoming, value: summary.upcoming, tone: 'neutral', toneLabel: copy.upcoming.tone },
  ];
  return (
    <section className="summary-band" aria-label={copy.aria}>
      {items.map((item, index) => (
        <div className={`summary-item ${index === items.length - 1 ? 'summary-item-last' : ''}`} key={item.label}>
          <div className="summary-label">{item.label}</div>
          <div className="summary-value-row">
            <strong>{item.value}</strong>
            <span className={`summary-tone ${item.tone}`}>{item.toneLabel}</span>
          </div>
          <div className="summary-note">{item.note}</div>
        </div>
      ))}
    </section>
  );
}

const chartMeta = {
  DORA: { color: '#1f4f98', fill: 'url(#doraFill)' },
  DGA: { color: '#0f8d87', fill: 'url(#dgaFill)' },
  Other: { color: '#8b96a6', fill: 'url(#otherFill)' },
};

export function TrendChart({ trend, language = 'zh' }) {
  const width = 620;
  const height = 226;
  const padding = { top: 26, right: 18, bottom: 34, left: 34 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const values = Object.values(trend.series).flat();
  const maxValue = Math.max(4, ...values, 1);
  const x = (index) => padding.left + (index / (trend.labels.length - 1)) * chartWidth;
  const y = (value) => padding.top + chartHeight - (value / maxValue) * chartHeight;
  const pathFor = (valuesForSeries) => valuesForSeries.map((value, index) => `${index === 0 ? 'M' : 'L'} ${x(index)} ${y(value)}`).join(' ');
  const areaFor = (valuesForSeries) => `${pathFor(valuesForSeries)} L ${x(valuesForSeries.length - 1)} ${y(0)} L ${x(0)} ${y(0)} Z`;
  const ticks = [0, Math.ceil(maxValue / 2), maxValue];
  const copy = UI[language].trend;

  return (
    <section className="panel trend-panel" aria-labelledby="trend-title">
      <div className="panel-heading">
        <div>
          <h2 id="trend-title">{copy.title}</h2>
          <p>{copy.subtitle}</p>
        </div>
        <div className="legend" aria-label={copy.legend}>
          {Object.entries(chartMeta).map(([key, meta]) => (
            <span className="legend-item" key={key}><i style={{ backgroundColor: meta.color }} />{key === 'Other' ? copy.other : key}</span>
          ))}
        </div>
      </div>
      <div className="trend-chart-wrap">
        <svg className="trend-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={copy.aria}>
          <defs>
            <linearGradient id="doraFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#1f4f98" stopOpacity=".14" /><stop offset="100%" stopColor="#1f4f98" stopOpacity="0" /></linearGradient>
            <linearGradient id="dgaFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#0f8d87" stopOpacity=".10" /><stop offset="100%" stopColor="#0f8d87" stopOpacity="0" /></linearGradient>
            <linearGradient id="otherFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#8b96a6" stopOpacity=".10" /><stop offset="100%" stopColor="#8b96a6" stopOpacity="0" /></linearGradient>
          </defs>
          {ticks.map((tick) => <line className="chart-grid-line" key={tick} x1={padding.left} x2={width - padding.right} y1={y(tick)} y2={y(tick)} />)}
          {ticks.map((tick) => <text className="chart-y-label" key={`label-${tick}`} x="2" y={y(tick) + 4}>{tick}</text>)}
          {trend.labels.map((label, index) => <text className="chart-x-label" key={`${label.en}-${index}`} x={x(index)} y={height - 8} textAnchor="middle">{text(label, language)}</text>)}
          {Object.entries(chartMeta).map(([key, meta]) => (
            <g key={key}>
              <path className="chart-area" d={areaFor(trend.series[key])} fill={meta.fill} />
              <path className="chart-line" d={pathFor(trend.series[key])} stroke={meta.color} />
              {trend.series[key].map((value, index) => <circle key={`${key}-${index}`} className="chart-dot" cx={x(index)} cy={y(value)} r="3.2" fill={meta.color} />)}
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}

export function UpcomingActions({ items, onSelect, language = 'zh' }) {
  const copy = UI[language].upcoming;
  return (
    <section className="panel actions-panel" aria-labelledby="actions-title">
      <div className="panel-heading">
        <div>
          <h2 id="actions-title">{copy.title}</h2>
          <p>{copy.subtitle}</p>
        </div>
        <span className="panel-count">{items.length}</span>
      </div>
      <div className="action-list">
        {items.slice(0, 4).map((item) => (
          <button className="action-row" key={item.id} type="button" onClick={() => onSelect?.(item.id)}>
            <time dateTime={item.dueDate}>{formatDate(item.dueDate, language)}</time>
            <div className="action-topic">
              <strong>{text(item.topic, language)}</strong>
              <small>{copy.owner}: {text(item.owner, language)}</small>
              <span className="action-detail">
                <span>{copy.nextAction}: {text(item.nextAction, language)}</span>
                <span>{copy.businessImpact}: {text(item.businessImpact, language)}</span>
              </span>
            </div>
            <RegimeChip regime={item.regime} language={language} />
          </button>
        ))}
        {items.length === 0 && <div className="panel-empty">{copy.empty}</div>}
      </div>
    </section>
  );
}

export function SourceRegistryPanel({ sources, lastCheckedAt, language = 'zh' }) {
  const copy = UI[language].sources;
  return (
    <section className="panel source-registry-panel" id="sources" aria-labelledby="sources-title">
      <div className="panel-heading">
        <div>
          <h2 id="sources-title">{copy.title}</h2>
          <p>{copy.subtitle}</p>
        </div>
        <span className="panel-count">{copy.count(sources.length)}</span>
      </div>
      <div className="source-registry-list">
        {sources.map((source) => (
          <article className="source-registry-item" key={source.id}>
            <div className="source-registry-topline">
              <div className="source-registry-name"><RegimeChip regime={source.regime} language={language} /><strong>{text(source.name, language)}</strong></div>
              <span className={`source-status ${source.monitorEnabled ? 'source-status-active' : 'source-status-secondary'}`}>
                {source.monitorEnabled ? copy.active : copy.secondary}
              </span>
            </div>
            <p>{text(source.scope, language)}</p>
            <div className="source-registry-meta"><span>{source.authority}</span><span>{copy.checked} {formatDate(lastCheckedAt || source.lastCheckedAt, language)} · {source.monitorEnabled ? copy.automatic : copy.manual}</span></div>
            <a className="source-registry-link" href={source.url} target="_blank" rel="noreferrer">{copy.open}<Icon name="external" size={13} /></a>
          </article>
        ))}
      </div>
    </section>
  );
}

export function UpdateFeed({ items, language = 'zh' }) {
  const copy = UI[language].updates;
  return (
    <section className="panel updates-panel" aria-labelledby="updates-title">
      <div className="panel-heading">
        <div>
          <h2 id="updates-title">{copy.title}</h2>
          <p>{copy.subtitle}</p>
        </div>
        <span className="panel-count">{items.length}</span>
      </div>
      <div className="update-list">
        {items.slice(0, 4).map((item) => (
          <article className="update-item" key={item.id}>
            <div className="update-item-topline"><time dateTime={item.date}>{formatDate(item.date, language)}</time><span className="update-badge">{copy.changed}</span></div>
            <a className="update-title" href={item.link} target="_blank" rel="noreferrer">{text(item.title, language)}<Icon name="external" size={13} /></a>
            <p>{text(item.summary, language)}</p>
            <div className="update-meta">{copy.reviewGate} · {copy.sourceHash}: <code>{item.sourceHash.slice(0, 8)}</code></div>
          </article>
        ))}
        {items.length === 0 && <div className="panel-empty">{copy.empty}</div>}
      </div>
    </section>
  );
}

export function FilterBar({ filters, onChange, onReset, language = 'zh' }) {
  const copy = UI[language].filters;
  const selectItems = [
    { key: 'regime', label: copy.regime, options: REGIME_OPTIONS },
    { key: 'relevance', label: copy.relevance, options: RELEVANCE_OPTIONS },
    { key: 'status', label: copy.status, options: STATUS_OPTIONS },
    { key: 'dateRange', label: copy.dateRange, options: DATE_OPTIONS },
  ];

  return (
    <div className="filter-bar" aria-label={copy.aria}>
      <div className="filter-heading"><Icon name="filter" size={17} /><span>{copy.title}</span></div>
      {selectItems.map((item) => (
        <label className="filter-field" key={item.key}>
          <span>{item.label}</span>
          <span className="select-wrap">
            <select value={filters[item.key]} onChange={(event) => onChange(item.key, event.target.value)} aria-label={item.label}>
              {item.options.map((option) => <option key={option.value} value={option.value}>{labelFor(item.options, option.value, language)}</option>)}
            </select>
            <Icon name="chevron" size={15} />
          </span>
        </label>
      ))}
      <button className="text-button reset-button" onClick={onReset} type="button"><Icon name="refresh" size={15} />{copy.reset}</button>
    </div>
  );
}

export function EvidenceTable({ items, selectedId, onSelect, language = 'zh' }) {
  const copy = UI[language].evidence;
  return (
    <section className="evidence-panel" id="evidence" aria-labelledby="evidence-title">
      <div className="evidence-header">
        <div>
          <h2 id="evidence-title">{copy.title}</h2>
          <p>{copy.subtitle}</p>
        </div>
        <span className="row-count">{copy.count(items.length)}</span>
      </div>
      <div className="table-scroll">
        <table className="evidence-table">
          <thead>
            <tr>
              <th scope="col">{copy.source}</th>
              <th scope="col">{copy.topic}</th>
              <th scope="col">{copy.affectedParty}</th>
              <th scope="col">{copy.status}</th>
              <th scope="col">{copy.priority}</th>
              <th scope="col">{copy.lastUpdate}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className={item.id === selectedId ? 'is-selected' : ''}
                onClick={() => onSelect(item.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onSelect(item.id);
                  }
                }}
                tabIndex="0"
                aria-selected={item.id === selectedId}
              >
                <td><span className="source-cell">{text(item.source, language)}</span></td>
                <td><div className="topic-cell"><RegimeChip regime={item.regime} language={language} /><span>{text(item.topic, language)}</span></div></td>
                <td>{text(item.affectedParty, language)}</td>
                <td><StatusChip status={item.status} language={language} /></td>
                <td><PriorityLabel priority={item.priority} language={language} /></td>
                <td className="date-cell">{formatDate(item.lastUpdate, language)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon"><Icon name="filter" size={18} /></div>
            <strong>{copy.emptyTitle}</strong>
            <span>{copy.emptySubtitle}</span>
          </div>
        )}
      </div>
    </section>
  );
}

export function DetailPanel({ record, onClear, onToggleReview, reviewEntries = [], language = 'zh' }) {
  const copy = UI[language].detail;
  const actions = UI[language].actions;
  if (!record) {
    return (
      <aside className="detail-panel detail-empty" aria-label={copy.aria}>
        <div className="detail-empty-icon"><Icon name="file" size={20} /></div>
        <h2>{copy.emptyTitle}</h2>
        <p>{copy.emptySubtitle}</p>
      </aside>
    );
  }

  return (
    <aside className="detail-panel" aria-labelledby="detail-title">
      <div className="detail-header">
        <div className="detail-kicker">{copy.kicker}</div>
        <button className="icon-button" type="button" onClick={onClear} aria-label={copy.close} title={copy.close}><Icon name="close" size={18} /></button>
      </div>
      <div className="detail-body">
        <div className="detail-title-row"><RegimeChip regime={record.regime} language={language} /><span className="detail-id">{record.id}</span></div>
        <h2 id="detail-title">{text(record.topic, language)}</h2>
        <div className="detail-facts">
          <Fact label={copy.regime} value={<RegimeChip regime={record.regime} language={language} />} />
          <Fact label={copy.relevance} value={labelFor(RELEVANCE_OPTIONS, record.relevance, language)} />
          <Fact label={copy.status} value={<StatusChip status={record.status} language={language} />} />
          <Fact label={copy.priority} value={<PriorityLabel priority={record.priority} language={language} />} />
          <Fact label={copy.lastUpdate} value={formatDate(record.lastUpdate, language)} />
          <Fact label={copy.dueDate} value={formatDate(record.dueDate, language)} />
          <Fact label={copy.verifiedAt} value={formatDate(record.lastVerifiedAt, language)} />
          <Fact label={copy.owner} value={text(record.owner, language)} />
        </div>
        <div className="detail-section">
          <h3>{copy.summary}</h3>
          <p>{text(record.summary, language)}</p>
        </div>
        <div className="detail-section">
          <h3>{copy.nextAction}</h3>
          <p>{text(record.nextAction, language)}</p>
        </div>
        <div className="detail-section">
          <h3>{copy.businessImpact}</h3>
          <p>{text(record.businessImpact, language)}</p>
        </div>
        <div className="detail-section">
          <h3>{copy.evidence}</h3>
          <a className="source-card" href={record.sourceUrl} target="_blank" rel="noreferrer">
            <span className="source-card-icon"><Icon name="file" size={18} /></span>
            <span><strong>{text(record.source, language)}</strong><small>{copy.official} · {actions.sourcePublished} {formatDate(record.publishedAt, language)}</small></span>
            <Icon name="external" size={16} />
          </a>
          <blockquote>“{text(record.evidenceExcerpt, language)}”</blockquote>
        </div>
        <ReviewLogPanel recordId={record.id} entries={reviewEntries} language={language} />
      </div>
      <div className="detail-footer">
        <button className={`primary-button ${record.reviewed ? 'is-reviewed' : ''}`} type="button" onClick={onToggleReview}>
          <Icon name={record.reviewed ? 'check' : 'bookmark'} size={17} />
          {record.reviewed ? actions.reviewed : actions.markReview}
        </button>
      </div>
    </aside>
  );
}

export function ReviewLogPanel({ recordId, entries, language = 'zh' }) {
  const copy = UI[language].reviewHistory;
  const items = entries.filter((entry) => entry.recordId === recordId).slice(0, 4);
  return (
    <section className="detail-section review-log-section">
      <h3>{copy.title}</h3>
      {items.length === 0 ? <p className="review-log-empty">{copy.empty}</p> : (
        <div className="review-log-list">
          {items.map((entry) => (
            <div className="review-log-item" key={entry.id}>
              <span>{entry.action === 'marked-reviewed' ? copy.marked : copy.cancelled}</span>
              <time dateTime={entry.at}>{formatReviewTime(entry.at, language)}</time>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function formatReviewTime(value, language) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(language === 'en' ? 'en-GB' : 'zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function Fact({ label, value }) {
  return <div className="fact-row"><span>{label}</span><strong>{value}</strong></div>;
}

export function DemoNotice({ language = 'zh', status = 'demo' }) {
  const notice = UI[language].datasetNotice[status] || UI[language].datasetNotice.demo;
  return <div className="demo-notice"><span className={`demo-dot dataset-dot-${status}`} />{notice}</div>;
}
