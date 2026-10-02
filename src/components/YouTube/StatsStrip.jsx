/**
 * StatsStrip — YouTube section ka numbers wala block (DUMB component).
 *
 * ⚠️ Q4 ke mutabiye ye HORIZONTAL SCROLL strip hai (DL-14), 2-column grid nahi.
 * Isi liye `overflow-x: auto` + `scroll-snap` CSS chahiye (components.css).
 *
 * A11y:
 *  - Numbers screen reader ko bhi sunaayi de (AC-05.2)
 *  - Har card `tabIndex={0}` taaki keyboard user scroll kar sake (NFR-13)
 *  - Container focusable + `aria-label`, kyunki arrow-key se scroll hota hai
 */
export default function StatsStrip({ channel, service, showSampleBadge, sampleBadge }) {
  return (
    <div className="yt-stats" data-reveal>
      {/* Sample-data honesty — koi na samjhe ki ye real numbers hain (AC-05.10, AC-06.1) */}
      {showSampleBadge && <span className="yt-stats__badge">{sampleBadge}</span>}

      <div
        className="yt-stats__scroll"
        tabIndex={0}
        role="group"
        aria-label="YouTube channel statistics — scroll for more"
      >
        {/* Primary: channel ke apne numbers (credibility) */}
        {channel.items.map((item) => (
          <StatCard key={item.id} {...item} />
        ))}

        {/* Visual divider — service proof alag group hai */}
        <span className="yt-stats__divider" aria-hidden="true" />

        {/* Secondary: meri service ka proof */}
        {service.items.map((item) => (
          <StatCard key={item.id} {...item} variant="service" />
        ))}
      </div>
    </div>
  );
}

/** Ek number card (dumb). */
function StatCard({ value, label, variant = 'channel' }) {
  return (
    <div className={`yt-stat yt-stat--${variant}`} data-testid="yt-stat">
      <span className="yt-stat__value">{value}</span>
      <span className="yt-stat__label">{label}</span>
    </div>
  );
}
