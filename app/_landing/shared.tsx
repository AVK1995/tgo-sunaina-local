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
 *   NIGHT SKY. Soft WHITE and NIGHT NAVY sections alternate, and GOLDEN APRICOT
 *   (the site's original CTA colour) is the accent and the button. Navy comes
 *   from the client's reference page. Flat colours only on surfaces.
 *
 *   The token NAMES are kept from the previous skin so no call site changes:
 *   `plum*` now holds navy, `gold*` holds apricot, `coral*` holds a soft amber.
 */
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

import { CHECKOUT_HREF } from './offer';

export const C = {
  /* ══ NIGHT SKY · calm, flat, easy on the eye ════════════════════════════
     Each accent has a SURFACE tone and a separate INK tone, and they are not
     interchangeable: apricot is a fill, never small text on white.
     Contrast measured against canvas (#FFFEFB) unless stated. ── */

  /* ── environment. Never pure white: the slight warmth stops the glare ── */
  canvas: '#FFFEFB',    // Soft White. Most of the page
  canvasAlt: '#F3F5FA', // Mist. The alternating band

  /* ── the navy structure. Dark sections, and every headline ── */
  plumDeep: '#26304A',    // Night Navy. Dark bands and headlines, 13:1
  plumDeeper: '#1D2539',  // A step darker, for depth beneath it
  plumBed: '#E8ECF4',     // A navy-tinted bed on light. Navy reads 11:1 on it

  /* ── ink ── */
  ink: '#26304A',       // Night Navy. Headings and emphasis, 13:1
  inkBody: '#2E3443',   // Slate. Body copy and button labels, 12.3:1
  inkSoft: '#5E6577',   // Grey. Supporting text, 5.8:1 / 5.3:1 on Mist
  onDark: '#FFFFFF',    // white on navy, 13:1
  onDarkMute: 'rgba(255,255,255,0.78)',

  /* ── golden apricot: the accent and the button (the original CTA colours) ── */
  gold: '#F2B45F',      // Golden Apricot. THE CTA fill (the original), and text on navy
  goldPale: '#F5F0E8',  // icon beds and eyebrows
  goldWash: '#FDF0DC',  // the one yellow surface for highlighted panels
  goldMid: '#E0A44F',   // hairlines and rules only
  goldDeep: '#A96F17',  // the CTA rim, and large text only (4.0:1)
  goldInk: '#8F5B0D',   // small text and eyebrows on light (5.5:1)

  /* ── soft amber: live dots and the occasional marker, nothing large ── */
  coral: '#F0A35E',
  coralBed: '#FDF0E4',
  coralInk: '#A24E16',  // amber as readable text, 5.2:1 on its bed

  /* ── a cool card ground ── */
  roseBed: '#EEF2F8',

  /* ── rules ── */
  line: '#E5E8EF',
  lineStrong: '#D2D8E3',
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
          ['--dot-pulse' as string]: 'rgba(240, 163, 94,0.5)',
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
  onDark = false,
}: {
  eyebrow?: string;
  children: React.ReactNode;
  sub?: React.ReactNode;
  /** For the navy sections: white headline, softened white deck. */
  onDark?: boolean;
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
        style={{ color: onDark ? C.onDark : C.ink, textWrap: 'balance' } as React.CSSProperties}
      >
        {children}
      </h2>
      {sub && (
        <p
          className="mx-auto mt-5 max-w-[660px] text-[15.5px] leading-relaxed sm:text-[16.5px]"
          style={{ color: onDark ? C.onDarkMute : C.inkSoft }}
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
        boxShadow: '0 14px 30px -14px rgba(38, 48, 74,0.5)',
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
