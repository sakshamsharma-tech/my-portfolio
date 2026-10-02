import { useRef, useState } from 'react';
import TabPanel from './TabPanel.jsx';

/**
 * TabGroup — YouTube service areas ka tab UI (SMART component).
 *
 * State ownership (2.5 ka "state colocation" rule): `activeTab` sirf isko chahiye,
 * isliye yahan hai — App ya YouTube wrapper me nahi.
 *
 * Keyboard behaviour (AC-05.7, NFR-09):
 *  - ArrowRight / ArrowLeft → next / previous, WRAP-AROUND (last → 0)
 *  - Home / End            → pehla / aakhri
 *  - Roving tabindex: active tab `tabIndex=0`, baaki `-1`
 *    → Tab key 6 baar nahi, sirf 1 baar chahiye; arrow se navigate karo
 */
export default function TabGroup({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);
  const tabRefs = useRef([]);

  const last = tabs.length - 1;

  function onKeyDown(event) {
    // KEY: relative position FOCUSED tab se nikaalo, state se nahi.
    //
    // Pehle `activeTab` se compute kar rahe the. Ye galat thi: agar focus
    // kisi aur tab pe ho (jaise koi external code `.focus()` kare, ya tab
    // rerender ho) to arrows state ke hisaab se chalti — user ko dikhta
    // ki kuch aur hua. `indexOf(-1)` fallback activeTab pe.
    const focusedIndex = tabRefs.current.indexOf(event.target);
    const from = focusedIndex === -1 ? activeTab : focusedIndex;

    let next;
    switch (event.key) {
      case 'ArrowRight':
        next = from === last ? 0 : from + 1;
        break;
      case 'ArrowLeft':
        next = from === 0 ? last : from - 1;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = last;
        break;
      default:
        return; // baaki keys chhodo
    }

    event.preventDefault(); // page scroll na ho
    setActiveTab(next);
    // Focus bhi move karo — sirf state badalna keyboard user ke liye kaafi nahi
    tabRefs.current[next]?.focus();
  }

  return (
    <div className="yt-tabs" data-reveal>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div className="yt-tabs__list" role="tablist" aria-label="YouTube channel management services" onKeyDown={onKeyDown}>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            type="button"
            role="tab"
            id={`yt-tab-${tab.id}`}
            className={`yt-tab${index === activeTab ? ' yt-tab--active' : ''}`}
            aria-selected={index === activeTab}
            aria-controls={`yt-panel-${tab.id}`}
            tabIndex={index === activeTab ? 0 : -1}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sirf ACTIVE panel render — baaki hidden attribute se bhi better,
          screen reader unhe ignore karta hai (AC-05.5) */}
      <TabPanel tab={tabs[activeTab]} />
    </div>
  );
}
