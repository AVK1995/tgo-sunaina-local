/**
 * Above-the-fold: the announcement strip, the header and the hero stage.
 *
 * A pure Server Component (no 'use client', no hooks) so it paints from static
 * HTML with zero JavaScript on the critical path.
 *
 * Copy follows COPY-SOURCE.md. Every price, date and session time comes from
 * ./offer. Nothing here declares one.
 *
 * The stage is LIGHT: warm ivory with soft apricot and coral blooms. Text on it
 * uses the light-ground inks.
 */
import {
  CalendarBlank,
  Clock,
  Translate,
  VideoCamera,
} from '@phosphor-icons/react/dist/ssr';

import BrandMark from './brand-mark';
import { asset } from './asset-version';
import { legoDelay } from './lego-style';
import {
  CTA_LABEL,
  CTA_SUBLABEL,
  EVENTS,
  PRICE,
  WORKSHOP_DATES,
  WORKSHOP_NAME,
} from './offer';
import { C, PrimaryCTA } from './shared';

/* ══ 0 · Announcement strip ════════════════════════════════════════════════
   A slim plum strip with one live coral dot and a slow shine, so it reads as
   alive rather than as a static sale bar. Facts only: the source copy makes no
   deadline or discount claim, so this does not either. */
export function AnnouncementBar() {
  const segments = [
    <>
      <span className="font-bold">{WORKSHOP_NAME}</span> at just{' '}
      <span style={{ color: C.gold }}>{PRICE}</span>
    </>,
    <>Live · {WORKSHOP_DATES}</>,
    <>Hindi &amp; English</>,
    <>With Sunaina Setia</>,
  ];

  /* One copy of the strip. Rendered twice inside the track, which is what makes
     a -50% translate loop seamlessly: at the reset the second copy sits exactly
     where the first began. The duplicate is decorative, so it is hidden from
     assistive tech rather than read out twice. */
  const strip = (copy: '1' | '2') => (
    <ul
      key={copy}
      data-marquee-copy={copy}
      aria-hidden={copy === '2' ? true : undefined}
      className="flex shrink-0 items-center gap-x-3 whitespace-nowrap pr-3 text-[12.5px] leading-snug sm:text-[13.5px]"
    >
      {segments.map((seg, i) => (
        <li key={i} className="inline-flex items-center gap-3 pr-3">
          {i === 0 ? (
            <span
              className="lego-pulse-dot inline-block h-[7px] w-[7px] shrink-0 rounded-full"
              style={{
                background: C.coral,
                ['--dot-pulse' as string]: 'rgba(233,111,85,0.6)',
              }}
            />
          ) : (
            <span aria-hidden style={{ color: 'rgba(224,164,79,0.55)' }}>
              |
            </span>
          )}
          <span>{seg}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className="cta-shimmer w-full py-2.5"
      style={{
        background: C.plumDeep,
        color: C.onDark,
        ['--shimmer' as string]: 'rgba(242,180,95,0.14)',
      }}
    >
      {/* The mask lives on this inner element, NOT on the bar. A mask applies to
          the element's own background as well as its content, so masking the bar
          faded the plum itself and let the page behind show through as white. */}
      <div className="kz-marquee">
        <div className="kz-marquee-track">
          {strip('1')}
          {strip('2')}
        </div>
      </div>
    </div>
  );
}

/* ══ 0b · Header ═══════════════════════════════════════════════════════════
   The mark alone, on the stage. No nav: this is a single-offer page and every
   link out of it is a way to not buy. */
export function SiteHeader() {
  return (
    <div className="mx-auto flex max-w-[1180px] items-center justify-center px-5 pb-2 pt-6 sm:justify-start md:px-8">
      <BrandMark height={76} priority />
    </div>
  );
}

/* ══ 1 · Hero ══════════════════════════════════════════════════════════════ */

const WORKSHOP_FACTS = [
  { icon: CalendarBlank, label: 'Dates', lines: EVENTS.map((e) => e.date) },
  {
    icon: Clock,
    label: 'Timings',
    lines: EVENTS.map((e) => `Day ${e.day} – ${e.time}`),
  },
  {
    icon: VideoCamera,
    label: 'Live Workshop',
    lines: [`${EVENTS.length} ${EVENTS.length === 1 ? 'Day' : 'Days'}`],
  },
  { icon: Translate, label: 'Language', lines: ['Hindi & English'] },
];

export function Hero() {
  return (
    <>
      <section data-hero className="kz-stage pb-16 pt-1">
        <SiteHeader />

        <div className="mx-auto grid max-w-[1180px] items-center gap-9 px-5 pt-6 sm:gap-12 md:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 lg:pt-10">
          {/* ══ LEFT ══════════════════════════════════════════════════════ */}
          <div className="text-center lg:text-left">
            <span
              className="mx-auto inline-flex max-w-[620px] items-center gap-2.5 rounded-[26px] px-4 py-2.5 text-left text-[11px] font-bold uppercase leading-[1.5] tracking-[0.12em] lg:mx-0"
              style={{
                background: C.goldWash,
                border: `1px solid ${C.lineStrong}`,
                color: C.goldInk,
              }}
            >
              <span
                className="lego-pulse-dot inline-block h-2 w-2 shrink-0 rounded-full"
                style={{
                  background: C.coral,
                  ['--dot-pulse' as string]: 'rgba(233,111,85,0.6)',
                }}
              />
              {WORKSHOP_NAME}
            </span>

            <p
              className="mt-6 font-display font-bold text-[19px] leading-snug sm:text-[22px]"
              style={{ color: C.goldInk }}
            >
              What If Sleeping Peacefully Could Feel Natural Again?
            </p>

            {/* ONE lit token in the headline: the promise itself. */}
            <h1
              className="mt-4 font-display font-bold text-[32px] leading-[1.12] sm:text-[42px] lg:text-[50px]"
              style={{ color: C.ink }}
            >
              Learn How To Get{' '}
              <span style={{ color: C.goldDeep }}>Deep, Restful Sleep</span> Even
              If You&rsquo;ve Struggled With Sleepless Nights For Years
            </h1>

            <p
              className="mx-auto mt-6 max-w-[600px] text-[16px] leading-[1.7] lg:mx-0"
              style={{ color: C.inkSoft }}
            >
              Learn How To Fall Asleep Faster, Sleep Deeper &amp; Wake Up Feeling
              Refreshed Every Morning{' '}
              <strong style={{ color: C.ink, fontWeight: 700 }}>
                Without More Sleeping Pills, Expensive Sleep Products Or Spending
                Hours On Bedtime Rituals
              </strong>
            </p>

            <div className="mt-8 flex justify-center lg:justify-start">
              <PrimaryCTA label={CTA_LABEL} sub={CTA_SUBLABEL} breathe />
            </div>
          </div>

          {/* ══ RIGHT, the workshop card ═════════════════════════════════════
              The source's details table: Sunaina's picture and credentials,
              then the four facts the reader needs before booking. */}
          <div>
            <div
              data-lego=""
              className="overflow-hidden rounded-[28px]"
              style={{
                ...legoDelay(2, 90),
                background: C.canvas,
                border: `1px solid ${C.lineStrong}`,
                boxShadow:
                  '0 0 0 8px rgba(242,180,95,0.10), 0 30px 60px -32px rgba(88,51,79,0.45)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset('/workshop/sunaina-seated.jpg')}
                alt="Sunaina Setia seated in a calm practice space"
                width={688}
                height={1280}
                loading="eager"
                fetchPriority="high"
                className="aspect-[4/3] w-full object-cover"
                style={{ objectPosition: '50% 20%' }}
              />

              <div className="p-6 sm:p-7">
                <h2
                  className="font-display font-bold text-[24px] leading-tight"
                  style={{ color: C.ink }}
                >
                  Sunaina Setia
                </h2>
                <p className="mt-1.5 text-[14px] leading-snug" style={{ color: C.inkSoft }}>
                  <strong style={{ color: C.ink, fontWeight: 700 }}>
                    15+ Years of Experience
                  </strong>{' '}
                  in Yoga, Mindfulness &amp; Personal Development
                </p>

                <ul
                  className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl"
                  style={{ background: C.line, border: `1px solid ${C.line}` }}
                >
                  {WORKSHOP_FACTS.map(({ icon: Icon, label, lines }) => (
                    <li key={label} className="p-3.5" style={{ background: C.canvas }}>
                      <span
                        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em]"
                        style={{ color: C.goldInk }}
                      >
                        <Icon weight="bold" className="h-3.5 w-3.5 shrink-0" />
                        {label}
                      </span>
                      {lines.map((line) => (
                        <span
                          key={line}
                          className="mt-1 block text-[13.5px] font-semibold leading-snug"
                          style={{ color: C.ink }}
                        >
                          {line}
                        </span>
                      ))}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="kz-stage-seam" aria-hidden />
    </>
  );
}
