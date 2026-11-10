/**
 * Shared landing primitives: the palette, and the framer-free leaf components
 * used by BOTH the static hero and the lazily-hydrated below-the-fold chunk.
 *
 * Kept animation-runtime-free on purpose so it can be imported from a Server
 * Component without dragging anything into the initial bundle.
 *
 * The colour derivation and the contrast maths behind every value here live in
 * ../../design-system.project.md. The short version:
 *
 *   SUNRISE. Warm IVORY is the environment, DEEP PLUM is the structure, GOLDEN
 *   APRICOT is the accent, and SUNRISE CORAL is the CTA. Espresso reads, warm
 *   taupe supports. Four icon beds, not seven.
 *
 *   The `gold*` token names hold apricot and the `coral*` names hold sunrise
 *   coral: each hue moved within its own family, so the names still describe
 *   what they carry. The plum family WAS called navy and was renamed, because
 *   that one no longer did.
 */
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

import { CHECKOUT_HREF } from './offer';

export const C = {
  /* ══ SUNRISE · early morning light on soft earth ═══════════════════════
     Warm ivory ground, a deep plum stage, and one sunrise that arrives in two
     temperatures: apricot for the light that is already up, coral for the
     moment it breaks. Espresso does the reading.

     Every value below is measured, not picked. The rule that governs the whole
     palette: a colour warm enough to feel like sunrise is never dark enough to
     be text. So each accent has a SURFACE tone and a separate INK tone, and
     they are not interchangeable. Using the surface tone as text is how a page
     ends up with an illegible eyebrow. ── */

  /* ── environment. Never pure white: ivory is warm and does not glare ── */
  canvas: '#FFF9F1',    // Warm Ivory. 60 to 70% of the page
  canvasAlt: '#FBEDE5', // Blush Cream. The alternating band

  /* ── the plum stage ────────────────────────────────────────────────────
     One dark section (the hero) plus contained dark objects. plumDeep is also
     the HEADLINE ink on light, at 10:1: the same colour doing both jobs is
     what ties the stage to the page. */
  plumDeep: '#58334F',    // Deep Plum. Stage floor, and every headline
  plumDeeper: '#40243A',  // The gradient floor beneath it, so the stage has depth
  plumBed: '#F3E8EF',     // A plum-tinted bed on light. Plum reads 8.8:1 on it

  /* ── ink. Three levels, and the split is the brief's own ───────────────
     Deep Plum is the HEADLINE, Espresso is the body, Warm Taupe is support.
     `ink` holds the plum because every existing call site for it is a
     font-display heading or a <strong>, which is exactly the headline job.
     Body copy is not styled inline at all: it inherits Espresso from the
     cascade (`body { color: var(--ink-body) }` in globals.css). */
  ink: '#58334F',       // Deep Plum. Headings and emphasis, 10:1 on the canvas
  inkBody: '#302724',   // Espresso. Body copy, 13.9:1. Set on <body>, inherited
  inkSoft: '#746763',   // Warm Taupe. Supporting text, 5.2:1 ivory / 4.8:1 blush
  onDark: '#FFF9F1',    // ivory on the stage, 10:1
  onDarkMute: 'rgba(255,249,241,0.74)',

  /* ── apricot: the accent, spent like a spotlight ───────────────────────
     THREE tones and they are not interchangeable. `gold` is a MARK on light
     (1.75:1, so never text there) but reads as text ON THE STAGE at 5.7:1.
     `goldDeep` is 4.0:1 and is the headline highlight only. Anything at label
     or eyebrow size uses `goldInk` at 5.5:1. */
  gold: '#F2B45F',      // Golden Apricot. Icons, marks, the S.T.A.R.T. method
  /* Icon beds stay NEUTRAL-warm on purpose. An apricot bed behind an apricot
     glyph makes every icon on the page one apricot object, and the accent
     stops being a spotlight. The glyph keeps the colour, the bed does not. */
  goldPale: '#F5F0E8',
  /* The ONE apricot surface, spent on the two money moments: the lead item in
     the toolkit and the price box in the recap. Apricot as a ground anywhere
     else is what makes a page read as a template. */
  goldWash: '#FDF0DC',
  goldMid: '#E0A44F',   // hairline flourishes and rules only, never a numeral
  goldDeep: '#A96F17',  // headline highlight on light: LARGE TEXT ONLY (4.0:1)
  goldInk: '#8F5B0D',   // small text and eyebrows on light (5.5:1)

  /* ── coral: the sunrise breaking. The CTA, and almost nothing else ─────
     Sunrise Coral is the button on light ground, carrying an ESPRESSO label at
     4.8:1. White on it is 3.1:1 and fails, which is why the label is espresso
     and not white: it is also the warmer, more expensive-looking answer. */
  coral: '#E96F55',     // Sunrise Coral. The CTA fill on light, and the live dot
  coralBed: '#FDEBE5',
  coralInk: '#B93B23',  // coral as readable TEXT, 5.4:1 ivory / 4.9:1 blush

  /* ── dusty rose ────────────────────────────────────────────────────────
     Ships as its WASH only. At full strength (#DDA49B) it is a 2:1 surface
     that can carry espresso and nothing else, and more to the point it is a
     warm mid-tone sitting a few degrees from Sunrise Coral: putting the two
     near each other makes them compete at the exact moment the CTA has to
     win. As a wash it does the job the brief actually asks of it, a subtle
     card ground, without spending any of the coral's authority. */
  roseBed: '#F7E6E1',

  /* ── rules ── */
  line: '#EFE3D8',
  lineStrong: '#E0CDBC',
} as const;

/* ══════════════════════════════════════════════════════════════════════════
 *  Eyebrow. ALWAYS uppercase, every section that has one.
 *
 *  Sections whose source copy supplies no eyebrow run without one rather than
 *  with an invented label: the copy is the client's, and a two-word kicker is
 *  still copy.
 * ═══════════════════════════════════════════════════════════════════════ */
export function SectionEyebrow({ text }: { text: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.2em]"
      style={{ background: C.goldPale, color: C.goldInk }}
    >
      <span
        className="lego-pulse-dot inline-block h-1.5 w-1.5 shrink-0 rounded-full"
        style={{
          background: C.coral,
          ['--dot-pulse' as string]: 'rgba(233,111,85,0.5)',
        }}
      />
      {text}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
 *  Section masthead: eyebrow → display headline (one lit word) → deck.
 *  Capped measure on both, centred, ≤820px. (R1 / C13.)
 * ═══════════════════════════════════════════════════════════════════════ */
export function SectionHeading({
  eyebrow,
  children,
  sub,
}: {
  eyebrow?: string;
  children: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[820px] px-1 text-center">
      {eyebrow && (
        <div className="mb-5 flex justify-center">
          <SectionEyebrow text={eyebrow} />
        </div>
      )}
      <h2
        className="font-display font-bold text-[clamp(28px,4.4vw,46px)] leading-[1.14]"
        style={{ color: C.ink, textWrap: 'balance' } as React.CSSProperties}
      >
        {children}
      </h2>
      {sub && (
        <p
          className="mx-auto mt-5 max-w-[660px] text-[15.5px] leading-relaxed sm:text-[16.5px]"
          style={{ color: C.inkSoft }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
 *  The primary CTA (R3).
 *
 *  One saturated pill, generous padding, a layered plum-tinted shadow, a slow
 *  shimmer with a long rest, and the price IN the label. `breathe` is the idle
 *  glow and belongs to exactly one instance per screen, never to two buttons
 *  the reader can see at the same time.
 *
 *  The fill is GOLDEN APRICOT, on every ground, with NO tone variants. There
 *  used to be three (coral on ivory, apricot on the stage, ivory on a dark
 *  card) and the page ended up with three different-looking buttons, so
 *  whichever one was rarest read as a mistake rather than as the CTA. One offer
 *  gets one button: the reader should recognise it instantly the fifth time
 *  they scroll past it, and that only works if it never changes colour. The
 *  prop is gone rather than defaulted, so a second appearance cannot come back.
 *
 *  Apricot beats coral here on both grounds and on the eye. On the plum stage
 *  it is 5.73:1 against 3.43:1, and on ivory it is the warmer, less alarming
 *  object: a coral button on a morning-practice page reads as an alert.
 *
 *  The label is ESPRESSO. 7.96:1 on the fill, and it never changes either,
 *  because the label's contrast is against the FILL rather than the ground.
 * ═══════════════════════════════════════════════════════════════════════ */
export function PrimaryCTA({
  href = CHECKOUT_HREF,
  label,
  sub,
  breathe = false,
  full = false,
}: {
  href?: string;
  label: string;
  sub?: string;
  breathe?: boolean;
  full?: boolean;
}) {

  return (
    <Link
      href={href}
      data-cta
      className={`lego-press cta-shimmer group inline-flex min-h-[58px] items-center justify-center gap-2.5 rounded-full px-8 py-4 font-body text-[15.5px] font-bold ${
        breathe ? 'cta-breath' : ''
      } ${full ? 'w-full' : 'w-full sm:w-auto'}`}
      style={{
        background: C.gold,
        color: C.inkBody,
        /* The rim, and it is structural. Apricot is only 1.75:1 on ivory, far
           under the 3:1 a UI boundary needs, so without this the button has no
           edge at all on the light page. goldDeep is 4.04:1 and carries it,
           while sitting 2.4:1 against its own fill so it reads as a rim rather
           than an outline. On the plum stage the fill is already 5.73:1 and the
           rim recedes to 1.83:1, so it stops working exactly where it stops
           being needed. */
        border: `1px solid ${C.goldDeep}`,
        boxShadow: '0 14px 30px -14px rgba(88,51,79,0.5)',
        ['--shimmer' as string]: 'rgba(255,255,255,0.45)',
      }}
    >
      <span className="flex flex-col items-center text-center leading-tight">
        <span className="inline-flex items-center gap-2.5">
          {label}
          <ArrowRight
            weight="bold"
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </span>
        {sub && <span className="mt-1 text-[13px] font-semibold">{sub}</span>}
      </span>
    </Link>
  );
}
