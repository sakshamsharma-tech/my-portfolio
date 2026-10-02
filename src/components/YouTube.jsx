import { ytStats, ytTabs, ytCta, ytSection } from '../data/youtube.js';
import StatsStrip from './YouTube/StatsStrip.jsx';
import TabGroup from './YouTube/TabGroup.jsx';

/**
 * YouTube — "YouTube Channel Management" section.
 *
 * Ye khud DUMB hai — koi state nahi. State sirf `TabGroup` ke andar hai
 * (state colocation — design doc 2.5).
 *
 * Position: `Skills` ke baad, `Projects` se pehle (FR-18).
 */
export default function YouTube() {
  return (
    <section id={ytSection.id} className="section yt" aria-labelledby="youtube-title">
      <div className="container">
        {/* ---- Heading ---- */}
        <header className="section__head" data-reveal>
          <p className="eyebrow">{ytSection.eyebrow}</p>
          <h2 id="youtube-title" className="section__title">
            {ytSection.title}
          </h2>
          <p className="section__sub">{ytSection.subtitle}</p>
        </header>

        {/* ---- Stats (horizontal scroll strip) ---- */}
        <StatsStrip
          channel={ytStats.channel}
          service={ytStats.service}
          showSampleBadge={ytStats.isSampleData}
          sampleBadge={ytSection.sampleBadge}
        />

        {/* ---- 6 service areas as tabs ---- */}
        <TabGroup tabs={ytTabs} />

        {/* ---- CTA → contact section (FR-24, AC-05.8) ---- */}
        <aside className="yt-cta" data-reveal>
          <div>
            <h3 className="yt-cta__title">{ytCta.title}</h3>
            <p className="yt-cta__text">{ytCta.text}</p>
          </div>
          <a className="btn btn--primary" href={ytCta.href}>
            {ytCta.buttonLabel}
          </a>
        </aside>
      </div>
    </section>
  );
}
