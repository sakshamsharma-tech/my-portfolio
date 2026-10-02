import { render, screen, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import YouTube from '../components/YouTube.jsx';
import StatsStrip from '../components/YouTube/StatsStrip.jsx';
import { ytStats, ytTabs, ytCta } from '../data/youtube.js';

/**
 * YouTube section tests — AC-05.* aur AC-06.* (analysis doc 1.7.1 se).
 *
 * Test cases design doc 2.11.1 me pehle se map kiye gaye hain.
 * Har test ke aage AC number likha hai taaki trace karna ho ki
 * kaunsa acceptance criterion kahan verify hua.
 */

const setup = () => {
  const user = userEvent.setup();
  render(<YouTube />);
  return user;
};

describe('AC-05.1 — section render hota hai, sahi jagah', () => {
  it('section id="youtube" aur "YouTube Channel Management" heading ke saath render hota hai', () => {
    setup();

    const section = document.getElementById('youtube');
    expect(section).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /youtube channel management/i }),
    ).toBeInTheDocument();
  });
});

describe('AC-05.2 / 05.3 — stats strip', () => {
  it('4 primary channel metrics dikhata hai (Subscribers, Videos, Views, Niches)', () => {
    setup();

    ['Subscribers', 'Videos', 'Views', 'Niches'].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('3 service proof counters bhi dikhata hai (AC-05.3) — total 7', () => {
    setup();

    ['Channels Managed', 'Videos Delivered', 'Avg Retention Gain'].forEach(
      (label) => {
        expect(screen.getByText(label)).toBeInTheDocument();
      },
    );

    // 4 primary + 3 service = 7 cards
    expect(screen.getAllByTestId('yt-stat')).toHaveLength(7);
  });

  it('stats strip horizontally scrollable hai (AC-05.3.1, DL-14)', () => {
    setup();

    const strip = screen.getByRole('group', {
      name: /channel statistics/i,
    });
    expect(strip).toBeInTheDocument();
    // Keyboard se scroll ho sake → focusable hona zaroori (NFR-13)
    expect(strip).toHaveAttribute('tabindex', '0');
  });
});

describe('AC-05.10 / AC-06.1 — "Sample data" label (NFR-12)', () => {
  it('sample data badge dikhta hai jab numbers dummy hain', () => {
    setup();
    expect(ytStats.isSampleData).toBe(true);
    expect(screen.getByText('Sample data')).toBeInTheDocument();
  });

  it('badge sirf tabhi dikhta hai jab isSampleData true ho', () => {
    // `StatsStrip` ko directly props se test karo — module mock karne se
    // zyada saaf. Logic sirf `showSampleBadge` prop par depend karti hai.
    const { unmount } = render(
      <StatsStrip
        channel={ytStats.channel}
        service={ytStats.service}
        showSampleBadge={false}
        sampleBadge="Sample data"
      />,
    );

    // Asli numbers daalne ke baad yeh case hoga → badge nahi dikhni chahiye
    expect(screen.queryByText('Sample data')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('yt-stat')).toHaveLength(7); // data chhupa nahi

    unmount();

    // Wapas true → badge wapas
    render(
      <StatsStrip
        channel={ytStats.channel}
        service={ytStats.service}
        showSampleBadge
        sampleBadge="Sample data"
      />,
    );
    expect(screen.getByText('Sample data')).toBeInTheDocument();
  });
});

describe('AC-05.4 — 6 tabs, pehla active', () => {
  it('exactly 6 tabs render hote hain', () => {
    setup();
    expect(screen.getAllByRole('tab')).toHaveLength(6);
  });

  it('pehla tab by default aria-selected="true" hai, baaki false', () => {
    setup();

    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    tabs.slice(1).forEach((tab) => {
      expect(tab).toHaveAttribute('aria-selected', 'false');
    });
  });

  it('har tab ka label data file se aata hai', () => {
    setup();
    ytTabs.forEach((tab) => {
      expect(screen.getByRole('tab', { name: tab.label })).toBeInTheDocument();
    });
  });
});

describe('AC-05.5 — sirf active tab ka panel dikhta hai', () => {
  it('initially exactly 1 tabpanel hota hai', () => {
    setup();
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
  });

  it('tab click karne par panel badal jaata hai — phir bhi exactly 1', async () => {
    const user = setup();

    await user.click(screen.getByRole('tab', { name: ytTabs[3].label }));

    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
    expect(
      screen.getByRole('heading', { name: ytTabs[3].label }),
    ).toBeInTheDocument();
  });

  it('panel ka aria-labelledby sahi tab se juda hai', () => {
    setup();

    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAttribute('aria-labelledby', `yt-tab-${ytTabs[0].id}`);
    expect(panel).toHaveAttribute('id', `yt-panel-${ytTabs[0].id}`);
  });

  it('panel ke andar active tab ke saare points dikhte hain', () => {
    setup();

    const panel = screen.getByRole('tabpanel');
    ytTabs[0].points.forEach((point) => {
      expect(within(panel).getByText(point)).toBeInTheDocument();
    });
  });
});

describe('AC-05.6 — aria-selected shift hota hai', () => {
  it('click ke baad naya tab selected aur purana deselected', async () => {
    const user = setup();

    await user.click(screen.getByRole('tab', { name: ytTabs[1].label }));

    expect(screen.getByRole('tab', { name: ytTabs[1].label })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tab', { name: ytTabs[0].label })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });
});

describe('AC-05.7 — keyboard navigation (NFR-09)', () => {
  it('ArrowRight next tab select karta hai', async () => {
    const user = setup();
    const tabs = screen.getAllByRole('tab');

    tabs[0].focus();
    await user.keyboard('{ArrowRight}');

    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('ArrowLeft pehle wale pe wapas jaata hai', async () => {
    const user = setup();
    const tabs = screen.getAllByRole('tab');

    tabs[1].focus();
    await user.keyboard('{ArrowLeft}');

    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('last tab se ArrowRight → wrap-around pehla tab (AC-05.7)', async () => {
    const user = setup();
    const tabs = screen.getAllByRole('tab');

    tabs[5].focus();
    await user.keyboard('{ArrowRight}');

    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('pehle tab se ArrowLeft → wrap-around last tab', async () => {
    const user = setup();
    const tabs = screen.getAllByRole('tab');

    tabs[0].focus();
    await user.keyboard('{ArrowLeft}');

    expect(tabs[5]).toHaveAttribute('aria-selected', 'true');
  });

  it('Home pehla tab, End aakhri tab', async () => {
    const user = setup();
    const tabs = screen.getAllByRole('tab');

    tabs[0].focus();
    await user.keyboard('{End}');
    expect(tabs[5]).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{Home}');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('focus arrow-key ke saath move hota hai, sirf state nahi badalta', async () => {
    const user = setup();
    const tabs = screen.getAllByRole('tab');

    tabs[0].focus();
    await user.keyboard('{ArrowRight}');

    // Sirf aria-selected change hona kaafi nahi — keyboard user ko focus
    // bhi follow karna chahiye, warna next ArrowRight galat tab pe lage
    expect(tabs[1]).toHaveFocus();
  });

  it('roving tabindex: sirf active tab Tab-key reachable', () => {
    setup();
    const tabs = screen.getAllByRole('tab');

    expect(tabs[0]).toHaveAttribute('tabindex', '0');
    tabs.slice(1).forEach((tab) => {
      expect(tab).toHaveAttribute('tabindex', '-1');
    });
  });

  it('arrow keys page scroll block karti hain (preventDefault)', async () => {
    const user = setup();
    const tabs = screen.getAllByRole('tab');

    tabs[0].focus();

    // `dispatchEvent` se pata chalta hai ki `preventDefault()` lagaya ya nahi:
    // agar handler ne preventDefault() kiya, `dispatchEvent` false return karta hai.
    // Raw event ko `act()` me bhejna zaroori hai — React state update ko
    // flush karwane ke liye, warna act() warning aati hai.
    let dispatchResult;
    await act(async () => {
      dispatchResult = tabs[0].dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'ArrowRight',
          bubbles: true,
          cancelable: true,
        }),
      );
    });

    expect(dispatchResult).toBe(false); // = defaultPrevented
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');

    // Aage ka behaviour normal hai
    await user.keyboard('{ArrowLeft}');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });
});

describe('AC-05.8 — CTA contact section tak le jata hai', () => {
  it('CTA button href="#contact" hai', () => {
    setup();
    expect(
      screen.getByRole('link', { name: ytCta.buttonLabel }),
    ).toHaveAttribute('href', ytCta.href);
    expect(ytCta.href).toBe('#contact');
  });

  it('CTA title + text dikhte hain', () => {
    setup();
    expect(screen.getByText(ytCta.title)).toBeInTheDocument();
    expect(screen.getByText(ytCta.text)).toBeInTheDocument();
  });
});

describe('AC-06.3 / AC-06.4 — data-driven content (FR-17)', () => {
  it('saare 6 tabs data file se aate hain, component hardcode nahi', () => {
    setup();
    expect(ytTabs).toHaveLength(6);
    ytTabs.forEach((tab) => {
      expect(tab.id).toBeTruthy();
      expect(tab.label).toBeTruthy();
      expect(tab.summary).toBeTruthy();
      expect(tab.points.length).toBeGreaterThan(0);
    });
  });

  it('stats numbers bhi data file se aate hain', () => {
    setup();
    const all = [...ytStats.channel.items, ...ytStats.service.items];
    all.forEach((item) => {
      expect(screen.getByText(item.value)).toBeInTheDocument();
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  it('har tab ka unique id hai — keys aur aria ids collide nahi karte', () => {
    setup();
    const ids = ytTabs.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('NFR-04 — accessibility', () => {
  it('section ka aria-labelledby sahi heading se juda hai', () => {
    setup();
    const section = document.getElementById('youtube');
    expect(section).toHaveAttribute('aria-labelledby', 'youtube-title');
  });

  it('tablist ka accessible label hai', () => {
    setup();
    expect(
      screen.getByRole('tablist', { name: /channel management services/i }),
    ).toBeInTheDocument();
  });

  it('panel focusable hai (keyboard user panel ke andar scroll kar sake)', () => {
    setup();
    expect(screen.getByRole('tabpanel')).toHaveAttribute('tabindex', '0');
  });
});