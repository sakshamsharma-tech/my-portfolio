/**
 * TabPanel — ek service area ka content (DUMB component).
 *
 * Sirf ACTIVE tab ka panel render hota hai (AC-05.5) — isliye `tabpanel` role
 * query par hamesha exactly 1 element milega.
 *
 * `tabIndex={0}` zaroori hai: keyboard user arrow keys se tab switch kare,
 * to panel ke andar scroll karna bhi possible hona chahiye (NFR-13 / NFR-04).
 */
export default function TabPanel({ tab, tabId }) {
  const panelId = `yt-panel-${tab.id}`;
  const headingId = `yt-tab-${tab.id}`;

  return (
    <div
      className="yt-panel"
      id={panelId}
      role="tabpanel"
      aria-labelledby={headingId}
      tabIndex={0}
      data-testid="yt-panel"
    >
      <div className="yt-panel__head">
        <TabIcon name={tab.icon} />
        <div>
          <h3 className="yt-panel__title">{tab.label}</h3>
          <p className="yt-panel__summary">{tab.summary}</p>
        </div>
      </div>

      <ul className="yt-panel__points">
        {tab.points.map((point) => (
          <li key={point} className="yt-panel__point">
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Chhote inline SVG icons (koi library nahi). */
function TabIcon({ name }) {
  const paths = {
    compass: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm3.5 6.5-2 5-5 2 2-5 5-2Z',
    film: 'M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm4 3v10M16 7v10M7 7h1M7 12h1M7 17h1M16 7h1M16 12h1M16 17h1',
    calendar:
      'M7 2v2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7ZM5 9h14v10H5V9Z',
    chart: 'M4 20V10h4v10H4Zm6 0V4h4v16h-4Zm6 0v-7h4v7h-4Z',
    coin: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm3.5 6.5c-.6-.7-1.9-1.2-3.5-1.2-2 0-3.5.9-3.5 2.3 0 3.2 7 1.6 7 4.9 0 1.5-1.5 2.5-3.6 2.5-1.7 0-3.1-.6-3.8-1.4l1.3-1.6c.5.6 1.5 1 2.5 1 1.3 0 2.2-.5 2.2-1.2 0-2.2-7-1.2-7-4.8 0-1.7 1.5-2.8 3.8-2.8 1.8 0 3.3.6 4.1 1.6l-1 1.7Z',
    chat: 'M4 4h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4V5a1 1 0 0 1 1-1Z',
  };

  return (
    <span className="yt-panel__icon" aria-hidden="true">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" focusable="false">
        <path d={paths[name] ?? paths.compass} />
      </svg>
    </span>
  );
}
