import { useEffect, useMemo, useState } from 'react';
import { DATA_AS_OF, DEFAULT_FILTERS, REFERENCE_DATE, records, filterRecords, getSummary, getTrend } from './data';
import { buildCsvContent, buildJsonContent, buildMarkdownContent } from './export';
import { formatLongDate, getStoredLanguage, LANGUAGE_LABELS, UI } from './copy';
import { sourceRegistry } from './sourceRegistry';
import { normalizeRecordSnapshot } from './recordSnapshot';
import { appendReviewEntry, applyReviewEntries, createReviewEntry, readReviewLog, writeReviewLog } from './reviewLog';
import { initialUpdateEvents, normalizeUpdateEvent } from './updates';
import {
  DemoNotice,
  DetailPanel,
  EvidenceTable,
  FilterBar,
  Icon,
  SummaryBand,
  SourceRegistryPanel,
  TrendChart,
  UpdateFeed,
  UpcomingActions,
} from './components';

const initialFilters = DEFAULT_FILTERS;

function App() {
  const [filters, setFilters] = useState(initialFilters);
  const [selectedId, setSelectedId] = useState(records[0].id);
  const [activeNav, setActiveNav] = useState('tracker');
  const [toast, setToast] = useState('');
  const [language, setLanguage] = useState(getStoredLanguage);
  const [reviewEntries, setReviewEntries] = useState(() => readReviewLog());
  const [updateEvents, setUpdateEvents] = useState(initialUpdateEvents);
  const [sourceCheckedAt, setSourceCheckedAt] = useState(DATA_AS_OF);
  const [recordSnapshot, setRecordSnapshot] = useState(() => normalizeRecordSnapshot(null, records));

  const datasetRecords = recordSnapshot.records;

  const reviewedIds = useMemo(() => applyReviewEntries(
    new Set(datasetRecords.filter((record) => record.reviewed).map((record) => record.id)),
    reviewEntries,
  ), [datasetRecords, reviewEntries]);

  const copy = UI[language];
  const datasetReferenceDate = recordSnapshot.asOf || REFERENCE_DATE;
  const viewRecords = useMemo(() => datasetRecords.map((record) => ({
    ...record,
    reviewed: reviewedIds.has(record.id),
    status: reviewedIds.has(record.id) ? 'reviewed' : record.status,
  })), [datasetRecords, reviewedIds]);
  const filteredRecords = useMemo(() => filterRecords(viewRecords, filters, datasetReferenceDate), [datasetReferenceDate, filters, viewRecords]);
  const summary = useMemo(() => getSummary(filteredRecords, datasetReferenceDate), [datasetReferenceDate, filteredRecords]);
  const trend = useMemo(() => getTrend(filteredRecords, datasetReferenceDate), [datasetReferenceDate, filteredRecords]);
  const selectedRecord = selectedId === null
    ? null
    : filteredRecords.find((record) => record.id === selectedId) || filteredRecords[0] || null;

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = `${copy.pageTitle} · DORA Enforcement Tracker`;
    window.localStorage.setItem('dora-tracker-language', language);
  }, [copy.pageTitle, language]);

  useEffect(() => {
    let active = true;
    fetch(`${import.meta.env.BASE_URL}data/records.json`)
      .then((response) => (response.ok ? response.json() : null))
      .then((snapshot) => {
        if (!active || !snapshot) return;
        setRecordSnapshot(normalizeRecordSnapshot(snapshot, records));
      })
      .catch(() => {
        // Keep the built-in fallback dataset when the production snapshot is unavailable.
      });
    fetch(`${import.meta.env.BASE_URL}data/updates.json`)
      .then((response) => (response.ok ? response.json() : null))
      .then((snapshot) => {
        if (!active || !snapshot) return;
        setSourceCheckedAt(snapshot.last_checked_at || snapshot.updated_at || DATA_AS_OF);
        if (snapshot.items?.length) setUpdateEvents(snapshot.items.map(normalizeUpdateEvent));
      })
      .catch(() => {
        // Keep the committed fallback feed when the static data endpoint is unavailable.
      });
    return () => { active = false; };
  }, []);

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  }

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function resetFilters() {
    setFilters(initialFilters);
    showToast(copy.actions.filtersReset);
  }

  function toggleReview() {
    if (!selectedRecord) return;
    const wasReviewed = reviewedIds.has(selectedRecord.id);
    const action = wasReviewed ? 'review-cancelled' : 'marked-reviewed';
    const nextEntries = appendReviewEntry(reviewEntries, createReviewEntry(selectedRecord.id, action));
    setReviewEntries(nextEntries);
    writeReviewLog(nextEntries);
    showToast(wasReviewed ? copy.actions.reviewCancelled : copy.actions.reviewAdded);
  }

  function exportData(format) {
    let content;
    let filename;
    let mimeType;

    if (format === 'json') {
      content = buildJsonContent(filteredRecords, language, datasetReferenceDate, recordSnapshot);
      filename = 'dora-enforcement-tracker.json';
      mimeType = 'application/json;charset=utf-8;';
    } else if (format === 'markdown') {
      content = buildMarkdownContent(filteredRecords, language, datasetReferenceDate, { ...recordSnapshot, datasetNotice: copy.datasetNotice[recordSnapshot.datasetStatus] || copy.datasetNotice.demo });
      filename = 'dora-enforcement-tracker.md';
      mimeType = 'text/markdown;charset=utf-8;';
    } else {
      content = buildCsvContent(filteredRecords, language, { ...recordSnapshot, referenceDate: datasetReferenceDate });
      filename = 'dora-enforcement-tracker.csv';
      mimeType = 'text/csv;charset=utf-8;';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    showToast(copy.export.exported(filteredRecords.length, format.toUpperCase()));
  }

  function handleNav(nav) {
    setActiveNav(nav);
    if (nav === 'cases') {
      document.getElementById('evidence')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (nav === 'settings') document.getElementById('sources')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark">
          <span>DORA</span>
          <span>Enforcement</span>
          <span>Tracker</span>
        </div>
        <div className="sidebar-rule" />
        <nav className="sidebar-nav" aria-label={copy.nav.label}>
          <NavItem icon="grid" label={copy.nav.tracker} active={activeNav === 'tracker'} onClick={() => handleNav('tracker')} />
          <NavItem icon="layers" label={copy.nav.cases} active={activeNav === 'cases'} onClick={() => handleNav('cases')} />
          <NavItem icon="settings" label={copy.nav.settings} active={activeNav === 'settings'} onClick={() => handleNav('settings')} />
        </nav>
        <div className="sidebar-footer">
          <span className="sidebar-footer-label">{copy.scope.label}</span>
          <p>{copy.scope.dora}<br />{copy.scope.supplyChain}</p>
          <div className="sidebar-footer-line" />
          <p className="sidebar-muted">{copy.scope.dga}</p>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-title">
            <h1>{copy.pageTitle}</h1>
            <DemoNotice language={language} status={recordSnapshot.datasetStatus} />
            <div className="freshness-line">{copy.dataFreshness} {formatLongDate(datasetReferenceDate, language)} · <a href="https://www.eba.europa.eu/activities/direct-supervision-and-oversight/digital-operational-resilience-act/dora-oversight" target="_blank" rel="noreferrer">{copy.officialSource}</a></div>
          </div>
          <div className="topbar-actions">
            <div className="language-toggle" aria-label="Language">
              {Object.entries(LANGUAGE_LABELS).map(([code, label]) => (
                <button key={code} className={language === code ? 'is-active' : ''} type="button" onClick={() => setLanguage(code)}>{label}</button>
              ))}
            </div>
            <details className="export-menu">
              <summary className="outline-button"><Icon name="download" size={16} />{copy.actions.export}</summary>
              <div className="export-menu-popover">
                <button type="button" onClick={() => exportData('csv')}>{copy.actions.exportCsv}</button>
                <button type="button" onClick={() => exportData('json')}>{copy.actions.exportJson}</button>
                <button type="button" onClick={() => exportData('markdown')}>{copy.actions.exportMarkdown}</button>
              </div>
            </details>
            <button className="outline-button save-view" type="button" onClick={() => showToast(copy.actions.savedView)}><Icon name="bookmark" size={16} />{copy.actions.saveView} <Icon name="chevron" size={14} /></button>
          </div>
        </header>

        <div className="content-grid">
          <div className="workspace-column">
            <SummaryBand summary={summary} language={language} />
            <div className="insight-grid">
              <TrendChart trend={trend} language={language} />
              <UpcomingActions items={summary.upcomingItems} onSelect={setSelectedId} language={language} />
            </div>
            <FilterBar filters={filters} onChange={updateFilter} onReset={resetFilters} language={language} />
            <EvidenceTable items={filteredRecords} selectedId={selectedRecord?.id} onSelect={setSelectedId} referenceDate={datasetReferenceDate} language={language} />
            <div className="operations-grid">
              <SourceRegistryPanel sources={sourceRegistry} lastCheckedAt={sourceCheckedAt} language={language} />
              <UpdateFeed items={updateEvents} language={language} />
            </div>
            <footer className="page-footnote">
              <span>{copy.footnote.referenceDate}: {formatLongDate(datasetReferenceDate, language)}</span>
              <span>{copy.footnote.scope}</span>
            </footer>
          </div>
          <DetailPanel record={selectedRecord} onClear={() => setSelectedId(null)} onToggleReview={toggleReview} reviewEntries={reviewEntries} datasetStatus={recordSnapshot.datasetStatus} datasetReview={recordSnapshot.review} reviewGate={recordSnapshot.reviewGate} referenceDate={datasetReferenceDate} language={language} />
        </div>
      </main>

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return <button className={`nav-item ${active ? 'is-active' : ''}`} type="button" onClick={onClick}><Icon name={icon} size={18} /><span>{label}</span></button>;
}

export default App;
