'use client';

/**
 * The closing half of the page: the coach, the mechanism, the results, the
 * decision, the recap and the colophon.
 *
 * COPY IS VERBATIM. Anything in the source that looks wrong is rendered as
 * written and flagged at its call site rather than quietly corrected, see the
 * note on TwoOptions (a bracketed button label).
 */
import type { Icon } from '@phosphor-icons/react';
import {
  Anchor,
  ArrowRight,
  BatteryHigh,
  Bed,
  Brain,
  Briefcase,
  ChatCircleText,
  Check,
  Feather,
  FlowerLotus,
  HandHeart,
  Minus,
  MoonStars,
  PersonSimpleWalk,
  Plus,
  Quotes,
  Smiley,
  Sun,
  UsersThree,
  Wind,
} from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

import SiteFooter from '@/components/SiteFooter';

import { asset } from './asset-version';
import { legoBrick, legoDelay } from './lego-style';
import {
  CHECKOUT_HREF,
  CTA_LABEL,
  CTA_NOTE,
  FREE_LABEL,
  SESSION_TIMES,
  START_DATE,
} from './offer';
import {
  C,
  CtaNote,
  MediaPlaceholder,
  PrimaryCTA,
  SectionHeading,
} from './shared';

const rupees = (n: number) => `₹${n.toLocaleString('en-IN')}`;

/* ══ 9 · Meet your coach ═══════════════════════════════════════════════════
 *
 * NO COMPONENT. This one is prose and stays prose.
 *
 * A founder's story has no inherent structure, no sequence, no contrast, no
 * set, and forcing one onto it (a fake timeline, three "pillar" cards cut out
 * of her paragraphs) is the design equivalent of inventing a claim. So this is
 * clean, well-set type on a capped measure, with ONE object in it: the
 * pull-quote, which is editorial scaffolding rather than a manufactured
 * structure.
 *
 * The photography is IN: a portrait lead with two squares beneath it, cropped
 * from the supplied set to the exact ratios the layout reserved. The pair below
 * is deliberately one close frame and one wide one, so the column reads as a
 * sequence rather than as three versions of the same shot.
 *
 * Any entry set back to null keeps its reserved slot, so the section still runs
 * if a shot is pulled.
 */
const PHOTOS: { lead: string | null; small: [string | null, string | null] } = {
  lead: '/coach/portrait-lead.webp',
  small: ['/coach/detail-close-2.webp', '/coach/detail-practice.webp'],
};

/* One slot. Renders the real image when a path exists and a reserved box at the
   same ratio when it does not, so the two states are never different sizes. */
function GuideShot({
  src,
  ratio,
  label,
  alt,
}: {
  src: string | null;
  ratio: string;
  label: string;
  alt: string;
}) {
  if (src) {
    return (
      <div
        className="overflow-hidden rounded-3xl"
        style={{ border: `1px solid ${C.line}`, background: C.canvas }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(src)}
          alt={alt}
          className="h-full w-full object-cover"
          style={{ aspectRatio: ratio }}
          loading="lazy"
        />
      </div>
    );
  }
  return <MediaPlaceholder ratio={ratio} label={label} className="rounded-3xl" />;
}

function Guide() {
  return (
    <section className="px-4 py-12 sm:py-20 lg:py-24" style={{ background: C.canvasAlt }}>
      {/* The masthead is centred and full width, the same treatment every other
          section on the page uses. */}
      <SectionHeading eyebrow="MEET YOUR COACH">
        Who is <span style={{ color: C.goldDeep }}>Sunaina Setia</span>, and why
        does she believe owning your mornings can change your life?
      </SectionHeading>

      <div className="mx-auto mt-12 max-w-[1060px] lg:grid lg:grid-cols-[0.8fr_1fr] lg:items-start lg:gap-12">
        {/* One lead portrait with two squares beneath it. The pair sits in its
            own 2-up grid so both stay equal width whatever the column does. */}
        <div className="mb-10 flex flex-col gap-3 lg:mb-0">
          <GuideShot
            src={PHOTOS.lead}
            ratio="3 / 4"
            label="Lead portrait"
            alt="Sunaina Setia, Certified Yoga Teacher and Life Coach"
          />
          <div className="grid grid-cols-2 gap-3">
            <GuideShot
              src={PHOTOS.small[0]}
              ratio="1 / 1"
              label="Detail 1"
              alt="Sunaina Setia"
            />
            <GuideShot
              src={PHOTOS.small[1]}
              ratio="1 / 1"
              label="Detail 2"
              alt="Sunaina Setia in seated practice"
            />
          </div>
        </div>

        <div>
          {/* Left-aligned at every width even though the masthead is centred:
              centred paragraphs of this length are hard work to read. */}
          <div
            className="space-y-4 text-[16px] leading-[1.75]"
            style={{ color: C.inkSoft }}
          >
            <p>
              Sunaina is a Certified Yoga Teacher and Life Coach with 15+ years
              of guided practice and teaching, bringing together spiritual
              wisdom, practical coaching, yoga, meditation, pranayama,
              affirmations, storytelling and laughter therapy to work with the
              mind, body and inner self as a whole.
            </p>
            <p>
              Through years of practising and teaching these tools, she realised
              something simple: most people already know what could make them
              feel better. What they’re missing is an easy, structured and
              enjoyable way to bring it all together, stay consistent and have
              people doing it alongside them.
            </p>
          </div>

          {/* The one object in the section. A quotation mark set in the display
              face, an apricot hairline, and the line set in the display face at
              medium: the page's editorial voice, not a coloured box. It is the
              ONLY display element on the site that is not 700, which is why
              layout.tsx loads a 500 at all. No italic: Plus Jakarta Sans ships
              one, but it is not loaded, and a synthesised oblique looks cheap
              at this size. */}
          <figure
            data-lego=""
            className="relative mt-9 rounded-2xl px-7 py-8 sm:px-9"
            style={{
              background: C.canvas,
              border: `1px solid ${C.line}`,
              borderLeft: `2px solid ${C.goldMid}`,
              boxShadow: '0 18px 40px -30px rgba(88,51,79,0.28)',
            }}
          >
            <Quotes
              weight="fill"
              aria-hidden
              className="absolute -top-3 left-6 h-7 w-7"
              style={{ color: C.goldMid }}
            />
            <blockquote
              className="font-display font-medium text-[clamp(18px,2.2vw,23px)] leading-[1.5]"
              style={{ color: C.ink }}
            >
              “You don’t need to change your entire life overnight. You need to
              start your day differently, consistently enough for that difference
              to reach the rest of your life.”
            </blockquote>
          </figure>

          <p className="mt-7 text-[16px] leading-[1.75]" style={{ color: C.inkSoft }}>
            That’s why she created this 5-Day Challenge, so you can experience
            the complete morning formula for yourself and see what begins to
            change when you Start Right.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ══ 10 · Why This Works ═══════════════════════════════════════════════════
 *
 * The mechanism, and it reads as "the five practices of the method" rather
 * than "the old way vs the new way", so it is a numbered ledger, not a
 * comparison. Hairline-ruled rows with big lit ordinals: a ledger reads audited
 * and accountable, which is what sells competence. It is deliberately NOT
 * another icon-card grid, because the Experience section three screens up
 * already is one.
 *
 * The source numbers these 01 to 05 unbroken, one letter of S.T.A.R.T. each,
 * so the ordinals are the client's own.
 */
const PILLARS = [
  {
    n: '01',
    title: 'Stillness To Quiet The Mind',
    icon: FlowerLotus,
    body: 'Chanting and stillness help settle the mental noise before the demands of the day begin.',
  },
  {
    n: '02',
    title: 'Movement To Wake Up The Body',
    icon: PersonSimpleWalk,
    body: 'Yoga, light movement and dance help release stiffness, shake off heaviness and lift your energy.',
  },
  {
    n: '03',
    title: 'Affirmations To Shift Your Inner Voice',
    icon: ChatCircleText,
    body: 'Speaking positive affirmations out loud helps strengthen self-belief and the way you approach your day.',
  },
  {
    n: '04',
    title: 'Breathwork To Reset Your State',
    icon: Wind,
    body: 'Simple breathing practices help calm restlessness, bring you back to the present and restore focus.',
  },
  {
    n: '05',
    title: 'Connection To Make It Stick',
    icon: UsersThree,
    body: 'Stories, laughter and an uplifting live community make showing up feel enjoyable, shared and easier to stay consistent with.',
  },
];

function Mechanism() {
  return (
    <section className="px-4 py-12 sm:py-20 lg:py-24" style={{ background: C.canvas }}>
      <SectionHeading
        eyebrow="READ THIS BEFORE YOU DECIDE"
        sub="The people who get the most out of their days don’t simply manage the hours better. They prepare themselves better for those hours. S.T.A.R.T. Right brings five powerful practices together to help you do exactly that."
      >
        Why This <span style={{ color: C.goldDeep }}>Works</span>.
      </SectionHeading>

      {/* A 1px-gap grid, so the GAPS become the rules: a ruled ledger with no
          card boxes and no shadows. The background is the rule colour. */}
      <ul
        className="mx-auto mt-14 grid max-w-[1000px] gap-px overflow-hidden rounded-2xl sm:grid-cols-2"
        style={{ background: C.line, border: `1px solid ${C.line}` }}
      >
        {PILLARS.map((p, i) => (
          <li
            key={p.title}
            data-lego=""
            /* Five rows into two columns leaves one cell empty, and an empty
               cell in a gap-px ledger shows the rule colour as a grey block.
               The last pillar spans the full width instead, which closes the
               ledger and matches the source, where 05 stands in its own table. */
            className={`lego-hover-sm flex items-start gap-5 px-6 py-7 sm:px-8 ${
              PILLARS.length % 2 === 1 && i === PILLARS.length - 1 ? 'sm:col-span-2' : ''
            }`}
            style={{ ...legoDelay(i, 70), background: C.canvas }}
          >
            {/* Icon and ordinal stack rather than sit side by side: the row is
                a ledger line, and two glyphs abreast would read as two columns
                of data instead of one marker. */}
            <span className="flex shrink-0 flex-col items-center gap-2">
              <span
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{ background: C.goldPale, border: `1px solid ${C.line}` }}
                aria-hidden="true"
              >
                <p.icon weight="duotone" className="h-5 w-5" style={{ color: C.goldInk }} />
              </span>
              <span
                className="font-display font-bold text-[18px] leading-none"
                style={{ color: C.goldDeep }}
              >
                {p.n}
              </span>
            </span>
            <span className="min-w-0 flex-1">
              <span
                className="block font-display font-bold text-[19px] leading-snug"
                style={{ color: C.ink }}
              >
                {p.title}
              </span>
              <span
                className="mt-2 block text-[14.5px] leading-relaxed"
                style={{ color: C.inkSoft }}
              >
                {p.body}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ══ 11 · The results ══════════════════════════════════════════════════════
   Ten short outcomes with no bodies. A light checked grid, because the shape
   is an accumulating list and nothing more: giving ten one-line items the
   weight of cards would be louder than their meaning.

   The source supplies no eyebrow for this section, so it runs without one
   rather than with an invented label. */
const NOTICE: { text: string; icon: Icon }[] = [
  { text: 'Their body feels lighter & less stiff', icon: Feather },
  { text: 'They wake up feeling more ready for the day', icon: Sun },
  { text: 'Their energy lasts beyond the afternoon', icon: BatteryHigh },
  { text: 'Their mind doesn’t race as much at night', icon: MoonStars },
  { text: 'They sleep more peacefully', icon: Bed },
  { text: 'Work stress doesn’t follow them everywhere', icon: Briefcase },
  { text: 'Small setbacks don’t throw them off as easily', icon: Anchor },
  { text: 'They’re more patient with the people around them', icon: HandHeart },
  { text: 'They stop second-guessing themselves as much', icon: Brain },
  { text: 'They feel more positive about themselves', icon: Smiley },
];

function Results() {
  return (
    <section className="px-4 py-12 sm:py-20 lg:py-24" style={{ background: C.canvasAlt }}>
      <SectionHeading>
        That’s Why People Who{' '}
        <span style={{ color: C.goldDeep }}>S.T.A.R.T. Right</span> Notice…
      </SectionHeading>

      {/* Six columns with a 2-column span per item is visually identical to
          three, but the half-column offset lets a stranded tail sit dead centre
          instead of hard-left: two orphans start at column 2, a single orphan
          starts at column 3. */}
      <ul className="mx-auto mt-12 grid max-w-[980px] gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {NOTICE.map((item, idx) => {
          const tail = NOTICE.length % 3;
          const startsTail = tail === 2 && idx === NOTICE.length - 2;
          const isLone = tail === 1 && idx === NOTICE.length - 1;
          return (
            <li
              key={item.text}
              data-lego=""
              className={`lego-hover-sm flex items-center gap-3.5 rounded-2xl px-5 py-4 lg:col-span-2 ${
                startsTail ? 'lg:col-start-2' : ''
              } ${isLone ? 'lg:col-start-3' : ''}`}
              style={{
                ...legoBrick(idx, 60),
                border: `1px solid ${C.line}`,
                background: C.canvas,
              }}
            >
              <span
                className="lego-stud inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                style={{ background: C.goldPale }}
              >
                <item.icon weight="duotone" className="h-4 w-4" style={{ color: C.goldInk }} />
              </span>
              <span className="text-[14.5px] leading-snug" style={{ color: C.inkSoft }}>
                {item.text}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ══ 12 · Two options ══════════════════════════════════════════════════════
   A decision with two sides, so it is argued with visual weight rather than
   with a red ✗ and a green ✓: Option 1 is set back (quiet surface, no border
   emphasis, muted type) and Option 2 is the lifted plum card that carries the
   click. The layout decides before the copy is read.

   The button uses the standard CTA_LABEL, like every other in-page button. */
function TwoOptions() {
  return (
    <section className="px-4 py-12 sm:py-20 lg:py-24" style={{ background: C.canvas }}>
      <SectionHeading sub="Now you have two options from here.">
        You Already Know How Another Morning{' '}
        <span style={{ color: C.goldDeep }}>On Autopilot</span> Feels
      </SectionHeading>

      <div className="mx-auto mt-12 grid max-w-[940px] items-start gap-5 sm:grid-cols-2">
        {/* The one being set down. */}
        <div
          data-lego="x"
          className="rounded-3xl p-7 sm:p-8"
          style={{
            ['--lego-from' as string]: '-30px',
            background: C.canvasAlt,
            border: `1px solid ${C.line}`,
            opacity: 0.86,
          }}
        >
          <span
            className="lego-stud inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em]"
            style={{ background: C.canvas, color: C.inkSoft, border: `1px solid ${C.line}` }}
          >
            <Minus weight="bold" className="h-3 w-3" />
            OPTION 1
          </span>
          <p className="mt-5 text-[15px] leading-relaxed" style={{ color: C.inkSoft }}>
            Keep waking up and slipping into the same autopilot routine, hoping
            your energy, mindset and life will somehow feel different while the
            way you begin every day stays exactly the same.
          </p>
        </div>

        {/* The one being picked up. */}
        <div
          data-lego="x"
          className="rounded-3xl p-7 sm:p-8"
          style={{
            ['--lego-from' as string]: '30px',
            ['--lego-d' as string]: '110ms',
            background: C.plumDeep,
            boxShadow: '0 26px 56px -28px rgba(88,51,79,0.6)',
          }}
        >
          <span
            className="lego-stud inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em]"
            style={{ background: 'rgba(242,180,95,0.16)', color: C.gold }}
          >
            <Plus weight="bold" className="h-3 w-3" />
            OPTION 2
          </span>
          <p className="mt-5 text-[15px] leading-relaxed" style={{ color: C.onDark }}>
            Give yourself 60 intentional minutes for just 5 mornings, experience
            the complete S.T.A.R.T. Right Method live, and see what changes when
            you begin the day taking care of your mind, body &amp; inner self
            first.
          </p>

          <Link
            href={CHECKOUT_HREF}
            data-cta
            className="lego-press cta-shimmer group mt-7 inline-flex min-h-[54px] w-full items-center justify-center gap-2.5 rounded-full px-6 font-body text-[15px] font-bold"
            style={{
              background: C.gold,
              color: C.inkBody,
              border: `1px solid ${C.goldDeep}`,
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
      </div>
    </section>
  );
}

/* ══ 13 · Recap ════════════════════════════════════════════════════════════
 *
 * The premium peak. The last thing the reader touches before paying, so it is
 * the most finished object on the page: a layered frame with a gold flourish
 * and ornament, a medallion seal, a hairline-ruled ledger with a value on
 * EVERY row (never one lump), and the value collapse dramatised: the ₹5,485
 * draws its own strike-through, then ₹497 pops in lit.
 *
 * The total is computed from the rows, never typed, so the ledger and the
 * total cannot disagree.
 *
 * It stays on the cream page. The brief is light-theme-only below the hero, so
 * the peak is earned with craft and depth rather than by turning the lights
 * off.
 */
const RECAP = [
  { what: '5-Day Live ‘Start Your Morning Right’ Challenge', value: 2500 },
  { what: 'The ‘Say It To Yourself’ Affirmation Guide', value: 497 },
  { what: 'The S.T.A.R.T. Right Scorecard', value: 497 },
  { what: 'The Wind Down Breathwork Track', value: 497 },
  { what: 'The S.T.A.R.T. Right Inner Circle', value: 997 },
  { what: 'The ‘One Good Story’ Collection', value: 497 },
];

const RECAP_TOTAL = RECAP.reduce((sum, r) => sum + r.value, 0);

function Recap() {
  return (
    <section
      data-final
      className="px-4 py-20 sm:py-28"
      style={{
        background: `radial-gradient(ellipse 68% 44% at 50% 0%, rgba(242,180,95,0.34), transparent 62%), ${C.canvasAlt}`,
      }}
    >
      <div data-lego="" className="kz-recap">
        <div className="kz-seal" aria-hidden>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3Z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>

        <h2
          className="text-center font-display font-bold text-[clamp(26px,3.6vw,40px)] leading-[1.14]"
          style={{ color: C.ink, textWrap: 'balance' } as React.CSSProperties}
        >
          Recap of Everything{' '}
          <span style={{ color: C.goldDeep }}>You’ll Get</span>
        </h2>

        {/* Column headers in the page's spec voice: tracked uppercase. */}
        <div
          className="mt-10 flex items-center justify-between border-b pb-3 text-[10.5px] font-bold uppercase tracking-[0.2em]"
          style={{ borderColor: C.lineStrong, color: C.inkSoft }}
        >
          <span>INCLUDED</span>
          <span>VALUE</span>
        </div>

        <ul className="kz-ledger">
          {RECAP.map((r) => (
            <li key={r.what} className="flex items-center justify-between gap-5 py-4">
              <span className="flex min-w-0 items-start gap-3">
                <span
                  className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                  style={{ background: C.goldPale }}
                >
                  <Check weight="bold" className="h-2.5 w-2.5" style={{ color: C.goldInk }} />
                </span>
                <span className="text-[14.5px] leading-snug" style={{ color: C.ink }}>
                  {r.what}
                </span>
              </span>
              <span
                className="shrink-0 font-display font-bold text-[16px] "
                style={{ color: C.inkSoft }}
              >
                {rupees(r.value)}
              </span>
            </li>
          ))}
        </ul>

        {/* The value moment. Total value is struck as it arrives; the price
            you actually pay lands lit, a beat later. */}
        <div
          className="mt-3 flex items-center justify-between gap-5 border-t py-5"
          style={{ borderColor: C.lineStrong }}
        >
          <span
            className="text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: C.inkSoft }}
          >
            TOTAL VALUE
          </span>
          <span
            className="kz-strike font-display font-bold text-[22px] "
            style={{ color: C.inkSoft }}
          >
            {rupees(RECAP_TOTAL)}
          </span>
        </div>

        <div
          className="mt-2 rounded-2xl px-6 py-8 text-center"
          style={{ background: C.goldWash, border: `1px solid ${C.lineStrong}` }}
        >
          <p
            className="text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: C.goldInk }}
          >
            GET EVERYTHING TODAY FOR
          </p>
          <p className="kz-price kz-lit mt-3 font-display font-bold text-[56px] leading-none">
            {FREE_LABEL}
          </p>
          <p className="mt-2 text-[13px]" style={{ color: C.inkSoft }}>
            (No payment required · Limited seats)
          </p>
        </div>

        <div className="mx-auto mt-9 flex max-w-[520px] flex-col items-center">
          <PrimaryCTA label={CTA_LABEL} full />
          <CtaNote text={CTA_NOTE} />
        </div>
      </div>
    </section>
  );
}

/* ══ 14 · Colophon ════════════════════════════════════════════════════════
   The disclaimer lives in the shared SiteFooter, so it appears on the checkout
   and the thank-you page too rather than only on the landing page. Its wording
   is the client's, unchanged. */
function Colophon() {
  return (
    <SiteFooter>
      <p className="mx-auto mb-8 max-w-[640px] text-[13px]" style={{ color: C.onDarkMute }}>
        <span className="inline-block">
          Starts {START_DATE} · {SESSION_TIMES} · Live on Zoom
        </span>
        <span aria-hidden className="hidden sm:inline">
          {' · '}
        </span>
        <span className="block sm:inline">Free To Join · Limited Seats</span>
      </p>
    </SiteFooter>
  );
}

export default function Close() {
  return (
    <>
      <Guide />
      <Mechanism />
      <Results />
      <TwoOptions />
      <Recap />
      <Colophon />
    </>
  );
}
