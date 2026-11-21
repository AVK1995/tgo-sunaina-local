'use client';

/**
 * The three free bonuses. Titles and descriptions live in checkout/included so
 * this section and the order summary cannot disagree.
 */
import { BONUSES } from '../checkout/included';
import { asset } from './asset-version';
import { legoBrick } from './lego-style';
import { CTA_LABEL, CTA_SUBLABEL } from './offer';
import { C, PrimaryCTA, SectionHeading } from './shared';

/* One cover per bonus, in BONUSES order. The covers carry their own
   "Bonus 1/2/3" label, so the card adds only a small number chip. */
const COVERS = [
  { src: '/workshop/bonuses/deep-sleep-meditation.jpg', alt: 'The Deep Sleep Guided Meditation, a 15-minute guided audio' },
  { src: '/workshop/bonuses/sleep-reset-planner.jpg', alt: 'The 7-Day Better Sleep Reset Planner, with a daily habit tracker' },
  { src: '/workshop/bonuses/morning-recharge.jpg', alt: 'The 10-Minute Morning Recharge Routine' },
];

export default function Bonuses() {
  return (
    <section className="px-4 py-12 sm:py-20 lg:py-24" style={{ background: C.canvas }}>
      <SectionHeading>
        Register <span className="kz-mark" data-lego-mark="">Today</span> and Get These 3
        Bonuses <span className="kz-mark" data-lego-mark="">FREE</span>
      </SectionHeading>

      <ul className="mx-auto mt-14 grid max-w-[1080px] gap-5 md:grid-cols-3">
        {BONUSES.map(({ title, body }, i) => {
          const cover = COVERS[i];
          return (
            <li
              key={title}
              data-lego=""
              className="lego-hover kz-bonus group flex flex-col rounded-3xl p-4 sm:p-5"
              style={{
                ...legoBrick(i, 80),
                background: C.canvasAlt,
                border: `1px solid ${C.line}`,
              }}
            >
              {/* The cover sits on white, the colour it was shot on, so its
                  soft shadow reads as a book resting on a surface. */}
              <div className="relative overflow-hidden rounded-2xl" style={{ background: '#FFFFFF' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset(cover.src)}
                  alt={cover.alt}
                  width={900}
                  height={900}
                  loading="lazy"
                  className="kz-bonus-cover aspect-square w-full object-contain"
                />
              </div>
              <span className="mt-5 flex items-center gap-2 px-2">
                <span
                  className="text-[11px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: C.goldInk }}
                >
                  Bonus #{i + 1}
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em]"
                  style={{ background: C.plumDeep, color: C.gold }}
                >
                  Free
                </span>
              </span>
              <h3
                className="mt-2 px-2 font-display font-bold text-[20px] leading-snug"
                style={{ color: C.ink }}
              >
                {title}
              </h3>
              <p className="mt-2.5 px-2 pb-2 text-[14.5px] leading-relaxed" style={{ color: C.inkSoft }}>
                {body}
              </p>
            </li>
          );
        })}
      </ul>

      <div className="mx-auto mt-10 flex max-w-[460px] justify-center">
        <PrimaryCTA label={CTA_LABEL} sub={CTA_SUBLABEL} full />
      </div>
    </section>
  );
}
