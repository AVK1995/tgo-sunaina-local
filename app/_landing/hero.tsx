/**
 * Above-the-fold: the announcement strip, the header, the dark hero stage and
 * the trust ledger that straddles the seam beneath it.
 *
 * A pure Server Component (no 'use client', no hooks) so it paints from static
 * HTML with zero JavaScript on the critical path.
 *
 * COPY IS VERBATIM from COPY-SOURCE.md. Where a run-on line has been split
 * across elements the words and their order are untouched; nothing is
 * re-voiced, shortened or added. Two things the copy carries that need a human
 * decision are flagged at their call sites: the "#,###+" placeholder and the
 * "Price Increases To ₹1699 Tomorrow" line.
 *
 * Every price, date and session time comes from ./offer. Nothing here declares
 * one.
 *
 * The stage is LIGHT (2026-09-24): warm ivory with soft apricot and coral
 * blooms, not the plum it used to be. Text on it uses the light-ground inks.
 */
import {
  ArrowRight,
  CalendarBlank,
  Clock,
  Heart,
  Lock,
  SealCheck,
  ShieldCheck,
  Star,
  VideoCamera,
} from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

import BrandMark from './brand-mark';
import { legoBrick, legoDelay } from './lego-style';
import {
  CHECKOUT_HREF,
  CTA_LABEL,
  CTA_LABEL_RESERVE,
  CTA_NOTE,
  FREE_LABEL,
  LIVES_IMPACTED,
  PRICE,
  SESSION_TIMES,
  START_DATE,
} from './offer';
import { asset } from './asset-version';
import { C } from './shared';

/* LIVES_IMPACTED now comes from ./offer with every other figure on the page.
   It was declared here as a second copy of the same placeholder, so filling in
   the real number in one place would have left the other still reading
   "#,###+" with nothing to catch it. One declaration, one figure. */

/* ══ 0 · Announcement strip (R10) ══════════════════════════════════════════
   A slim plum strip with one live coral dot and a slow shine, so it reads as
   alive rather than as a static red sale bar. It names a specific price, a
   specific anchor and a specific date, never "limited time".

   ⚠️ FLAG FOR ATUL: "Price Increases To ₹1699 Tomorrow" is rendered verbatim
   from the copy. On an evergreen page "Tomorrow" is a claim that stops being
   true the day after launch. Either the campaign carries a real dated
   deadline, or that segment needs re-wording by NO-BRAINER. Not silently
   changed here. */
export function AnnouncementBar() {
  const segments = [
    <>
      <span className="font-bold">Special Offer:</span> 5-Day &lsquo;Start Your
      Morning Right&rsquo; Challenge, now{' '}
      <span style={{ color: C.gold }}>{FREE_LABEL}</span>
    </>,
    <>Limited Seats Available</>,
    <>100% Free · No Payment Required</>,
    <>
      Live · Starts {START_DATE} · {SESSION_TIMES}
    </>,
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

const HERO_FACTS = [
  { icon: CalendarBlank, text: `Starts ${START_DATE}` },
  { icon: Clock, text: SESSION_TIMES },
  { icon: VideoCamera, text: 'Live, Coach-Led Sessions' },
];

export function Hero() {
  return (
    <>
      <section data-hero className="kz-stage pb-24 pt-1">
        <SiteHeader />

        <div className="mx-auto grid max-w-[1180px] items-center gap-9 px-5 pt-6 sm:gap-12 md:px-8 lg:grid-cols-[1.04fr_0.96fr] lg:gap-16 lg:pt-10">
          {/* ══ LEFT ══════════════════════════════════════════════════════ */}
          <div className="text-center lg:text-left">
            {/* The gate line: who this is for, said before anything is sold.
                The client's gate line is a full sentence rather than a chip, so
                the radius is softened from a capsule to a plaque; every token,
                the border, the dot and the type are the skin's. */}
            <span
              className="mx-auto inline-flex max-w-[620px] items-start gap-2.5 rounded-[26px] px-4 py-2.5 text-left text-[10.5px] font-bold uppercase leading-[1.6] tracking-[0.12em] lg:mx-0"
              style={{
                background: C.goldWash,
                border: `1px solid ${C.lineStrong}`,
                color: C.goldInk,
              }}
            >
              <span
                className="lego-pulse-dot mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full"
                style={{
                  background: C.coral,
                  ['--dot-pulse' as string]: 'rgba(233,111,85,0.6)',
                }}
              />
              For anyone who&rsquo;s started (and quit) every morning routine
              they&rsquo;ve tried.
            </span>

            {/* ONE lit token in the headline: the promise's clock. Everything
                else stays warm white, which is what stops the line reading as a
                highlighter pass. (C2/C3) */}
            <h1
              className="mt-7 font-display font-bold text-[34px] leading-[1.1] sm:text-[44px] lg:text-[54px]"
              style={{ color: C.ink }}
            >
              Ease Anxiety. Feel Happier, Energised &amp; In Control{' '}
              <span style={{ color: C.goldDeep }}>in Just 5 Mornings.</span>
            </h1>

            {/* Mobile-only banner, straight under the headline. From lg up the
                offer card beside the copy carries the artwork instead. Eager
                and high priority: on a phone this is the first image on
                screen. 1672x941 is the file's true size, so the frame is
                reserved before it loads and nothing reflows. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset('/banner%20image/Sunaina.png')}
              alt="S.T.A.R.T. Right 5-Day Morning Challenge with Sunaina"
              width={1672}
              height={941}
              loading="eager"
              fetchPriority="high"
              className="mx-auto mt-6 block h-auto w-full max-w-[560px] rounded-2xl lg:hidden"
              style={{ boxShadow: '0 18px 40px -26px rgba(88,51,79,0.45)' }}
            />

            <p
              className="mx-auto mt-6 max-w-[600px] text-[16px] leading-[1.7] lg:mx-0"
              style={{ color: C.inkSoft }}
            >
              <strong style={{ color: C.ink, fontWeight: 700 }}>No 5 AM alarms.</strong>{' '}
              Just{' '}
              <strong style={{ color: C.ink, fontWeight: 700 }}>5 live mornings with Sunaina</strong>:
              combining yoga, dance, breathwork &amp; laughter in a fun group
              experience you&rsquo;ll actually look forward to. Feel the
              difference from Day One, and it&rsquo;s{' '}
              <strong style={{ color: C.ink, fontWeight: 700 }}>completely free to join</strong>.
            </p>

            <div className="mt-9 flex justify-center lg:justify-start">
              {/* Shimmer, but no breath: the offer card beside it is the page's
                  focal action and carries the one breathing CTA. Two breathing
                  buttons on one screen is two primaries, which is none. */}
              <Link
                href={CHECKOUT_HREF}
                data-cta
                className="lego-press cta-shimmer group inline-flex min-h-[58px] w-full items-center justify-center gap-2.5 rounded-full px-8 font-body text-[15.5px] font-bold sm:w-auto"
                style={{
                  background: C.gold,
                  color: C.inkBody,
                  border: `1px solid ${C.goldDeep}`,
                  boxShadow: '0 14px 30px -14px rgba(88,51,79,0.5)',
                  ['--shimmer' as string]: 'rgba(255,255,255,0.55)',
                }}
              >
                <span className="inline-flex items-center gap-2.5">
                  {CTA_LABEL}
                  <ArrowRight
                    weight="bold"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </div>

            {/* Welded to the button, never floated away from it. */}
            <p
              className="mt-4 flex items-center justify-center gap-2 text-[13.5px] font-medium lg:justify-start"
              style={{ color: C.inkSoft }}
            >
              <ShieldCheck weight="fill" className="h-4 w-4" style={{ color: C.coral }} />
              {CTA_NOTE}
            </p>

            {/* The three facts, on a hairline rule rather than in boxes. */}
            <ul
              className="mt-9 flex flex-col items-stretch gap-px overflow-hidden rounded-2xl sm:flex-row"
              style={{
                background: C.line,
                border: `1px solid ${C.line}`,
              }}
            >
              {HERO_FACTS.map(({ icon: Icon, text }, idx) => (
                <li
                  key={text}
                  data-lego=""
                  className="flex flex-1 items-center justify-center gap-2.5 px-4 py-3.5 text-[13px] font-semibold"
                  style={{
                    ...legoDelay(idx, 90),
                    background: C.canvas,
                    color: C.ink,
                  }}
                >
                  <Icon weight="bold" className="h-4 w-4 shrink-0" style={{ color: C.goldInk }} />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {/* ══ RIGHT, the offer card ═════════════════════════════════════
              The page's single focal object. There is no video and no
              photography yet, so the offer itself is what catches the light:
              an ivory card on the plum stage, with a local ink re-theme (C12).
              When a coach clip or a session image lands, it slots in above
              the eyebrow and nothing else has to change. */}
          <div>
            <div
              data-lego=""
              className="rounded-[28px] p-7 sm:p-8"
              style={{
                ...legoDelay(2, 90),
                background: C.canvas,
                border: `1px solid ${C.lineStrong}`,
                boxShadow:
                  '0 0 0 8px rgba(242,180,95,0.10), 0 30px 60px -32px rgba(88,51,79,0.45)',
              }}
            >
              {/* Art sits above the eyebrow. The offer composite goes HERE
                  rather than in the mobile-only hero slot because this card is
                  the conversion object, it shows at every breakpoint, and the
                  artwork carries the ₹497 the card is asking for. 3/2 is the
                  file's true ratio; forcing it to 16/9 would crop the price
                  badge off the right edge. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset('/mockups/toolkit-overview.webp')}
                alt="The complete S.T.A.R.T. Right toolkit: six guides, live sessions and community support"
                className="mb-6 aspect-[3/2] w-full rounded-2xl object-cover"
              />

              <span
                className="inline-flex items-center rounded-full px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.18em]"
                style={{ background: C.goldPale, color: C.goldInk }}
              >
                S.T.A.R.T. RIGHT METHOD
              </span>

              <h2
                className="mt-4 font-display font-bold text-[26px] leading-[1.16]"
                style={{ color: C.ink }}
              >
                5-Day &lsquo;Start Your Morning Right&rsquo; Challenge
              </h2>
              <p className="mt-2 text-[14px]" style={{ color: C.inkSoft }}>
                Live on Zoom · {SESSION_TIMES} · 5 Expert-Guided Mornings
              </p>

              {/* The value collapse, stated once: FREE lit, the paid price
                  struck beside it, and the scarcity as a coral chip. */}
              <div
                className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-2 border-t pt-6"
                style={{ borderColor: C.line }}
              >
                <span className="kz-lit font-display font-bold text-[46px] leading-none">
                  {FREE_LABEL}
                </span>
                <span
                  className="font-display font-bold text-[22px] line-through"
                  style={{ color: C.inkSoft }}
                >
                  {PRICE}
                </span>
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.16em]"
                  style={{ background: C.coralBed, color: C.coralInk }}
                >
                  LIMITED SEATS
                </span>
              </div>

              {/* THE breathing CTA. The only one on the page. */}
              <Link
                href={CHECKOUT_HREF}
                data-cta
                className="lego-press cta-shimmer cta-breath group mt-6 inline-flex min-h-[56px] w-full items-center justify-center gap-2.5 rounded-2xl font-body text-[15.5px] font-bold"
                style={{
                  background: C.gold,
                  color: C.inkBody,
                  border: `1px solid ${C.goldDeep}`,
                  ['--shimmer' as string]: 'rgba(242,180,95,0.30)',
                }}
              >
                <span className="inline-flex items-center gap-2.5">
                  {CTA_LABEL_RESERVE}
                  <ArrowRight
                    weight="bold"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>

              <p
                className="mt-4 flex items-center justify-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.08em]"
                style={{ color: C.inkSoft }}
              >
                <Lock weight="fill" className="h-3.5 w-3.5" style={{ color: C.goldInk }} />
                No Payment · No Card Required
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="kz-stage-seam" aria-hidden />
      <TrustLedger />
    </>
  );
}

/* ══ 2 · The trust ledger ══════════════════════════════════════════════════
   Four figures on a ruled row, lifted so the card straddles the seam between
   the dark stage and the cream page: the join is a designed object rather
   than a colour change.

   The source copy sets these with emoji (❤️ ⭐ 🛡️ 💯). They are rendered as
   matched-weight line icons instead: emoji as UI is the single loudest
   template tell, and it renders differently on every device the audience owns.
   The words are untouched. */
const STATS = [
  { icon: Heart, big: LIVES_IMPACTED, small: 'Lives Impacted', bed: C.coralBed, fg: C.coralInk },
  { icon: Star, big: '15+ Years', small: 'Guided Practice & Teaching', bed: C.goldPale, fg: C.goldInk },
  { icon: ShieldCheck, big: '100%', small: 'Free To Join', bed: C.plumBed, fg: C.ink },
  {
    icon: SealCheck,
    big: 'Certified',
    small: 'Yoga Teacher & Life Coach',
    bed: C.goldPale,
    fg: C.goldInk,
  },
];

function TrustLedger() {
  return (
    <div className="relative z-10 mx-auto -mt-14 max-w-[1120px] px-5 md:px-8">
      <ul
        className="grid grid-cols-2 gap-x-5 gap-y-7 rounded-3xl px-6 py-8 sm:px-9 lg:grid-cols-4"
        style={{
          background: C.canvas,
          border: `1px solid ${C.line}`,
          boxShadow: '0 26px 54px -30px rgba(88,51,79,0.35)',
        }}
      >
        {STATS.map(({ icon: Icon, big, small, bed, fg }, idx) => (
          /* lego-hover-icon: the whole row is the hover target so the hit area
             stays generous, but only the glyph moves. Lifting a figure drags
             the eye off the number, which is the one thing worth reading. */
          <li
            key={small}
            data-lego=""
            className="lego-hover-icon flex items-center gap-3.5"
            style={legoBrick(idx, 85)}
          >
            <span
              data-lego-stud=""
              className="lego-stud grid h-11 w-11 shrink-0 place-items-center rounded-full"
              style={{ ...legoBrick(idx, 85), background: bed }}
            >
              <Icon weight="fill" className="h-5 w-5" style={{ color: fg }} />
            </span>
            <span className="leading-tight">
              <span
                className="block font-display font-bold text-[20px] "
                style={{ color: C.ink }}
              >
                {big}
              </span>
              <span className="mt-0.5 block text-[12.5px]" style={{ color: C.inkSoft }}>
                {small}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
