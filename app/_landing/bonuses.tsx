'use client';

/**
 * The three free bonuses. Titles and descriptions live in checkout/included so
 * this section and the order summary cannot disagree.
 */
import type { Icon } from '@phosphor-icons/react';
import { CalendarCheck, Headphones, SunHorizon } from '@phosphor-icons/react/dist/ssr';

import { BONUSES } from '../checkout/included';
import { legoBrick } from './lego-style';
import { CTA_LABEL, CTA_SUBLABEL } from './offer';
import { C, PrimaryCTA, SectionHeading } from './shared';

const ICONS: Icon[] = [Headphones, CalendarCheck, SunHorizon];

export default function Bonuses() {
  return (
    <section className="px-4 py-12 sm:py-20 lg:py-24" style={{ background: C.canvas }}>
      <SectionHeading>
        Register <span style={{ color: C.goldDeep }}>Today</span> and Get These 3
        Bonuses <span style={{ color: C.goldDeep }}>FREE</span>
      </SectionHeading>

      <ul className="mx-auto mt-14 grid max-w-[1080px] gap-5 md:grid-cols-3">
        {BONUSES.map(({ title, body }, i) => {
          const Glyph = ICONS[i];
          return (
            <li
              key={title}
              data-lego=""
              className="lego-hover flex flex-col rounded-3xl p-7"
              style={{
                ...legoBrick(i, 80),
                background: C.canvasAlt,
                border: `1px solid ${C.line}`,
              }}
            >
              <span className="flex items-center justify-between gap-3">
                <span
                  className="text-[11px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: C.goldInk }}
                >
                  Bonus #{i + 1}
                </span>
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl"
                  style={{ background: C.goldPale, border: `1px solid ${C.line}` }}
                >
                  <Glyph weight="duotone" className="h-5 w-5" style={{ color: C.goldInk }} />
                </span>
              </span>
              <h3
                className="mt-4 font-display font-bold text-[20px] leading-snug"
                style={{ color: C.ink }}
              >
                {title}
              </h3>
              <p className="mt-2.5 text-[14.5px] leading-relaxed" style={{ color: C.inkSoft }}>
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
