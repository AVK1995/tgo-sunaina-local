'use client';

/**
 * Section 8 · the toolkit.
 *
 * Six things that sum to a price, so the shape is accumulation. Two rules
 * decide the treatment:
 *
 *  1. The value is shown PER ITEM, never as one lump "worth ₹5,485": a lump
 *     is a claim, a line-item is a contract.
 *  2. The challenge itself is the item that dominates (₹2,500 of the ₹5,485
 *     and the only LIVE one), so it is lifted out of the grid and given the
 *     lead card. The layout says which one matters before the copy does.
 *
 * The total is COMPUTED from the item values below, never typed, so the ledger
 * and the total can never disagree. Each value is stored as a number and
 * formatted for display, which is why "₹2,500" and "₹497" come out exactly as
 * the source writes them.
 *
 * This is the FIRST of the page's two accumulation beats. The second is the
 * closing recap, which is a ruled ledger: the two are deliberately different
 * forms so the recap reads as a summing-up rather than as a repeat. The recap
 * also keeps the gold surface and the strike-draw, so it stays the peak.
 *
 * Cover art is IN. Every one of the six items carries its own mockup, squared
 * to 1:1 so the five bonus cards tile at exactly one height. The portrait box
 * shots were padded out to square by stretching their edge columns rather than
 * flat-filling: these backgrounds carry a soft vignette and a flat fill seams.
 */
import type { Icon } from '@phosphor-icons/react';
import {
  ArrowRight,
  BookBookmark,
  BookOpenText,
  Broadcast,
  ChatsCircle,
  CheckCircle,
  Lightning,
  ListChecks,
  MoonStars,
  UsersThree,
  VideoCamera,
} from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

import { asset } from './asset-version';
import { legoBrick, legoDelay } from './lego-style';
import { CHECKOUT_HREF, CTA_LABEL, CTA_NOTE, PRICE } from './offer';
import { C, MediaPlaceholder, SectionEyebrow } from './shared';

const rupees = (n: number) => `₹${n.toLocaleString('en-IN')}`;

const LEAD = {
  n: '01',
  icon: Broadcast,
  title: '5-Day Live ‘Start Your Morning Right’ Challenge',
  value: 2500,
  body: 'Experience six expert-guided mornings combining stillness, movement, affirmations, breathwork & connection in one deliberately sequenced practice for your mind, body & inner self.',
  tag: 'LIVE ACCESS · INCLUDED',
  tagIcon: 'live' as const,
  image: '/mockups/challenge-live.webp',
};

const BONUSES = [
  {
    n: '02',
    title: 'The ‘Say It To Yourself’ Affirmation Guide',
    icon: BookOpenText,
    value: 497,
    body: 'A printable collection of Sunaina’s guided affirmations to help you strengthen your inner dialogue, build self-belief and start speaking to yourself more positively.',
    tag: 'INSTANT ACCESS · INCLUDED',
    tagIcon: 'instant' as const,
    image: '/mockups/guide-affirmations.webp',
  },
  {
    n: '03',
    title: 'The S.T.A.R.T. Right Scorecard',
    icon: ListChecks,
    value: 497,
    body: 'A simple daily tracker to record how you feel before and after your morning practice, so you can see the difference you’re creating in your own numbers.',
    tag: 'INSTANT ACCESS · INCLUDED',
    tagIcon: 'instant' as const,
    image: '/mockups/guide-scorecard.webp',
  },
  {
    n: '04',
    title: 'The Wind Down Breathwork Track',
    icon: MoonStars,
    value: 497,
    body: 'A guided evening breathing practice to help quiet a racing mind, release the day and settle into a calmer state before sleep.',
    tag: 'INSTANT ACCESS · INCLUDED',
    tagIcon: 'instant' as const,
    image: '/mockups/track-breathwork.webp',
  },
  {
    n: '05',
    title: 'The S.T.A.R.T. Right Inner Circle',
    icon: ChatsCircle,
    value: 997,
    body: 'Join an uplifting WhatsApp community of people practising alongside you, so you have the connection, encouragement and accountability to keep showing up.',
    tag: 'COMMUNITY ACCESS · INCLUDED',
    tagIcon: 'community' as const,
    image: '/mockups/community-inner-circle.webp',
  },
  {
    n: '06',
    title: 'The ‘One Good Story’ Collection',
    icon: BookBookmark,
    value: 497,
    body: 'Keep some of Sunaina’s most-loved stories close for the mornings when motivation feels low, giving you a little perspective, positivity and reason to show up again.',
    tag: 'INSTANT ACCESS · INCLUDED',
    tagIcon: 'instant' as const,
    image: '/mockups/guide-one-good-story.webp',
  },
];

/** Computed, never typed. The source says ₹5,485 and the items say so too. */
const TOTAL_VALUE = [LEAD, ...BONUSES].reduce((sum, item) => sum + item.value, 0);

/* The art slot. Renders the real mockup when a path is set and the reserved
   frame at the same ratio when it is not, so the two states are never
   different sizes and a pulled asset cannot collapse a card. */
function CoverArt({
  image,
  label,
  className = '',
}: {
  image?: string;
  label: string;
  className?: string;
}) {
  if (!image) return <MediaPlaceholder ratio="1 / 1" label={label} className={className} />;
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={asset(image)}
      alt={label}
      className={`aspect-square w-full rounded-2xl object-cover ${className}`}
      loading="lazy"
    />
  );
}

/* A bed, not a bare glyph: at this size an unbedded icon reads as debris next
   to a 26px ordinal. Gold-pale is the page's established icon bed. */
function IconBed({ icon: Glyph, size = 'md' }: { icon: Icon; size?: 'md' | 'lg' }) {
  const box = size === 'lg' ? 'h-14 w-14' : 'h-11 w-11';
  const glyph = size === 'lg' ? 'h-7 w-7' : 'h-5 w-5';
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-2xl ${box}`}
      style={{ background: C.goldPale, border: `1px solid ${C.line}` }}
      aria-hidden="true"
    >
      <Glyph weight="duotone" className={glyph} style={{ color: C.goldInk }} />
    </span>
  );
}

function AccessTag({ text, icon }: { text: string; icon: 'live' | 'instant' | 'community' }) {
  const Icon = icon === 'live' ? VideoCamera : icon === 'community' ? UsersThree : Lightning;
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em]"
      style={{ background: C.canvas, border: `1px solid ${C.line}`, color: C.inkSoft }}
    >
      <Icon weight="fill" className="h-3 w-3" style={{ color: C.goldInk }} />
      {text}
      <CheckCircle weight="fill" className="h-3 w-3" style={{ color: C.coralInk }} />
    </span>
  );
}

export default function Toolkit() {
  return (
    <section className="px-4 py-12 sm:py-20 lg:py-24" style={{ background: C.canvas }}>
      <div className="mx-auto max-w-[820px] text-center">
        <div className="mb-5 flex justify-center">
          <SectionEyebrow text="GET INSTANT ACCESS TO" />
        </div>
        <h2
          className="font-display font-bold text-[clamp(28px,4.4vw,46px)] leading-[1.14]"
          style={{ color: C.ink, textWrap: 'balance' } as React.CSSProperties}
        >
          Your 5-Day S.T.A.R.T. Right Experience &amp;{' '}
          <span style={{ color: C.goldDeep }}>Complete Morning Essentials Toolkit</span>
        </h2>
      </div>

      <div className="mx-auto mt-14 max-w-[1080px]">
        {/* ── the lead item ─────────────────────────────────────────────── */}
        <article
          data-lego=""
          className="lego-hover-soft rounded-[28px] p-8 sm:p-10"
          style={{
            ...legoDelay(0, 90),
            background: `linear-gradient(160deg, ${C.goldWash} 0%, ${C.canvas} 62%)`,
            border: `1px solid ${C.lineStrong}`,
            boxShadow: '0 24px 54px -32px rgba(88,51,79,0.3)',
          }}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            <div className="flex shrink-0 flex-col items-start gap-4">
              <span
                className="font-display font-bold text-[44px] leading-none"
                style={{ color: C.goldDeep }}
              >
                {LEAD.n}
              </span>
              <IconBed icon={LEAD.icon} size="lg" />
            </div>
            <div className="min-w-0 flex-1">
              <h3
                className="font-display font-bold text-[24px] leading-snug sm:text-[27px]"
                style={{ color: C.ink }}
              >
                {LEAD.title}
              </h3>
              <p className="mt-1.5 font-display font-bold text-[18px] " style={{ color: C.goldDeep }}>
                ({rupees(LEAD.value)} Value)
              </p>
              <p className="mt-3.5 max-w-[620px] text-[15px] leading-relaxed" style={{ color: C.inkSoft }}>
                {LEAD.body}
              </p>
              <div className="mt-6">
                <AccessTag text={LEAD.tag} icon={LEAD.tagIcon} />
              </div>
            </div>

            {/* Reserved at the ratio the real still will use, so nothing
                reflows when the art lands. */}
            <CoverArt
              image={LEAD.image}
              label={LEAD.title}
              className="w-full sm:w-[240px] sm:shrink-0"
            />
          </div>
        </article>

        {/* ── the five bonuses ─────────────────────────────────────────── */}
        <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {BONUSES.map((b, i) => {
            /* Five cards strand orphans at both breakpoints, and the fix is
               different at each.

               lg: five into three columns leaves TWO stranded hard-left with a
               column-wide hole beside them. So the desktop grid is SIX columns
               with a 2-column span per card, visually identical to three
               columns, but the half-column offset now exists, so the pair
               starts at column 2 and sits dead centre. A 3-column grid cannot
               do this: centring two items across three tracks needs fractional
               placement.

               sm: five into two columns leaves ONE. It spans the row but is
               width-capped and centred, so it reads as a normal card. */
            const startsTail = i === BONUSES.length - 2;
            const isOrphan = i === BONUSES.length - 1;
            const placement = [
              'lg:col-span-2',
              startsTail ? 'lg:col-start-2' : '',
              isOrphan ? 'sm:col-span-2 sm:mx-auto sm:w-full sm:max-w-[calc(50%-10px)]' : '',
              isOrphan ? 'lg:col-span-2 lg:mx-0 lg:max-w-none' : '',
            ]
              .filter(Boolean)
              .join(' ');
            return (
              <li
                key={b.n}
                data-lego=""
                className={`lego-hover flex flex-col rounded-3xl p-7 ${placement}`}
                style={{
                  ...legoBrick(i + 1, 80),
                  background: C.canvasAlt,
                  border: `1px solid ${C.line}`,
                }}
              >
                {/* Cover art sits above the title, which is where the guides'
                    real covers were always going to go. */}
                <CoverArt image={b.image} label={b.title} className="mb-6" />

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <IconBed icon={b.icon} />
                    <span
                      className="font-display font-bold text-[26px] leading-none"
                      style={{ color: C.goldDeep }}
                    >
                      {b.n}
                    </span>
                  </div>
                  <span
                    className="font-display font-bold text-[16px] "
                    style={{ color: C.goldDeep }}
                  >
                    ({rupees(b.value)} Value)
                  </span>
                </div>
                <h3
                  className="mt-4 font-display font-bold text-[19px] leading-snug"
                  style={{ color: C.ink }}
                >
                  {b.title}
                </h3>
                <p
                  className="mt-2.5 flex-1 text-[14px] leading-relaxed"
                  style={{ color: C.inkSoft }}
                >
                  {b.body}
                </p>
                <div className="mt-6">
                  <AccessTag text={b.tag} icon={b.tagIcon} />
                </div>
              </li>
            );
          })}
        </ul>

        {/* ── the sum, then the click ──────────────────────────────────────
            Deliberately quieter than the closing recap: a ruled foot to the
            stack rather than a second gold price box. The recap is the page's
            premium peak and keeps the gold surface and the strike-draw, so this
            one states the arithmetic and hands over to the button. */}
        <div
          data-lego=""
          className="mx-auto mt-10 max-w-[620px] rounded-3xl px-6 py-9 text-center sm:px-10"
          style={{
            ...legoDelay(1, 90),
            background: C.canvasAlt,
            border: `1px solid ${C.lineStrong}`,
          }}
        >
          <p
            className="text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: C.inkSoft }}
          >
            TOTAL REAL VALUE
          </p>
          <p
            className="mt-2 font-display font-bold text-[30px] leading-none"
            style={{ color: C.ink }}
          >
            {rupees(TOTAL_VALUE)}
          </p>

          <span
            aria-hidden
            className="mx-auto mt-7 block h-px w-24"
            style={{
              background: `linear-gradient(90deg, transparent, ${C.goldMid}, transparent)`,
            }}
          />

          <p
            className="mt-7 text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: C.goldInk }}
          >
            ALL FOR JUST
          </p>
          <p className="kz-lit mt-2 font-display font-bold text-[52px] leading-none">
            {PRICE}
          </p>
          <p className="mt-2 text-[13px]" style={{ color: C.inkSoft }}>
            (Introductory price increasing soon)
          </p>

          <div className="mx-auto mt-8 flex max-w-[460px] flex-col items-center">
            <Link
              href={CHECKOUT_HREF}
              data-cta
              className="lego-press cta-shimmer group inline-flex min-h-[56px] w-full items-center justify-center gap-2.5 rounded-full px-7 font-body text-[15px] font-bold"
              style={{
                background: C.gold,
                color: C.inkBody,
                border: `1px solid ${C.goldDeep}`,
                ['--shimmer' as string]: 'rgba(242,180,95,0.30)',
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
            <p className="mt-3.5 text-[13.5px] font-medium" style={{ color: C.inkSoft }}>
              {CTA_NOTE}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
