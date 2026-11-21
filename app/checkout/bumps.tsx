'use client';

/**
 * The two checkout add-ons (order bumps).
 *
 * Each is a real <input type="checkbox"> inside a <label>, so the whole card
 * is one tap target, works with a keyboard and is read correctly by a screen
 * reader. The motion (the dashed border's glow, the nudging hand, the tick
 * pop) lives in globals.css under .kz-bump and is switched off for anyone who
 * asks for reduced motion.
 */
import { Check } from '@phosphor-icons/react/dist/ssr';

import { CALL_PRICE_RUPEES, RECORDING_PRICE_RUPEES, rupees } from '../_landing/offer';
import { C } from '../_landing/shared';
import { BUMPS } from './included';

type Bump = (typeof BUMPS)[keyof typeof BUMPS];

function BumpCard({
  bump,
  price,
  checked,
  onChange,
  badgeBg,
  badgeFg,
}: {
  bump: Bump;
  price: number;
  checked: boolean;
  onChange: (next: boolean) => void;
  badgeBg: string;
  badgeFg: string;
}) {
  /* The visible box. Pops in navy when ticked. Rendered twice: in its own
     left column from sm up, and beside the badge on phones, so the text
     below can use the card's full width there. */
  const box = (where: string) => (
    <span
      aria-hidden
      className={`kz-bump-box shrink-0 place-items-center rounded-lg ${where}`}
      style={{
        background: checked ? C.plumDeep : C.canvas,
        border: `2px solid ${checked ? C.plumDeep : C.goldMid}`,
      }}
    >
      {checked && <Check weight="bold" className="h-4 w-4" style={{ color: C.gold }} />}
    </span>
  );

  return (
    <label
      className="kz-bump block cursor-pointer rounded-[20px] p-4 sm:p-6"
      data-on={checked ? 'true' : 'false'}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />

      <div className="flex items-start gap-4">
        {box('mt-0.5 hidden h-7 w-7 sm:grid')}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            {box('grid h-7 w-7 sm:hidden')}
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ background: badgeBg, color: badgeFg }}
            >
              <span
                className="lego-pulse-dot inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: badgeFg }}
              />
              {bump.badge}
            </span>
          </div>

          <div className="mt-2.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <span
              className="font-display font-bold text-[17px] leading-snug sm:text-[18px]"
              style={{ color: C.ink }}
            >
              {bump.title}
            </span>
            {/* The price tag pulses gently until ticked, then pops into the
                navy "added" state. */}
            <span className="kz-price-tag shrink-0 rounded-full px-3 py-1 font-display font-bold text-[16px] tabular-nums">
              + {rupees(price)}
            </span>
          </div>

          <p className="mt-2 text-[14px] leading-relaxed" style={{ color: C.inkSoft }}>
            {bump.body}
          </p>

          <ul className="mt-3 space-y-1.5">
            {bump.points.map((p) => (
              <li
                key={p}
                className="flex items-start gap-2 text-[13.5px] leading-snug"
                style={{ color: C.inkSoft }}
              >
                <Check
                  weight="bold"
                  className="mt-[3px] h-3.5 w-3.5 shrink-0"
                  style={{ color: C.goldDeep }}
                />
                {p}
              </li>
            ))}
          </ul>

          <p
            className="mt-4 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.1em]"
            style={{ color: checked ? C.ink : C.coralInk }}
          >
            {checked ? (
              <>
                <Check weight="bold" className="h-4 w-4" />
                Added to your order
              </>
            ) : (
              <>
                <span aria-hidden className="kz-nudge inline-block text-[18px] leading-none">👉</span>
                Tap to add for {rupees(price)} more
              </>
            )}
          </p>
        </div>
      </div>
    </label>
  );
}

export default function Bumps({
  recordings,
  call,
  onRecordings,
  onCall,
}: {
  recordings: boolean;
  call: boolean;
  onRecordings: (v: boolean) => void;
  onCall: (v: boolean) => void;
}) {
  return (
    <div className="mt-7 space-y-4">
      <BumpCard
        bump={BUMPS.recordings}
        price={RECORDING_PRICE_RUPEES}
        checked={recordings}
        onChange={onRecordings}
        badgeBg={C.coralInk}
        badgeFg="#FFFFFF"
      />
      <BumpCard
        bump={BUMPS.call}
        price={CALL_PRICE_RUPEES}
        checked={call}
        onChange={onCall}
        badgeBg={C.plumDeep}
        badgeFg={C.gold}
      />
    </div>
  );
}
