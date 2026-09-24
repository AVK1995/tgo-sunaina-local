'use client';

/**
 * The docked CTA (page chrome, not a section).
 *
 * Visible from the very first screen, with NO reveal delay or dock-in motion:
 * it is server-rendered visible, so it paints with the page. It hides only once
 * the closing recap is in view, because a docked bar duplicating a CTA the
 * reader can already see is two primaries, which is none.
 *
 * Layout:
 *   mobile   guarantee • start date
 *                 [ CTA button ]
 *   desktop  guarantee • start date ............... [ CTA button ]
 *
 * Because it hides at the final CTA it is never on screen at the foot of the
 * page, so it carries NO flow spacer.
 */
import { ArrowRight, ShieldCheck } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { CHECKOUT_HREF, CTA_LABEL_INSTANT, STICKY_NOTE } from './offer';
import { C } from './shared';

export default function StickyCta() {
  const [atFinal, setAtFinal] = useState(false);

  useEffect(() => {
    const final = document.querySelector('[data-final]');
    if (!final) return;

    const io = new IntersectionObserver(
      ([e]) => setAtFinal(e.isIntersecting),
      { threshold: 0 },
    );
    io.observe(final);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 transition-opacity duration-200 ${
        atFinal ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      style={{
        background: 'rgba(255,249,241,0.96)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderTop: `1px solid ${C.lineStrong}`,
        boxShadow: '0 -12px 36px -24px rgba(88,51,79,0.45)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* The lit hairline that makes the bar read as a lifted surface rather
          than as a panel taped to the bottom of the window. */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${C.goldMid}, transparent)`,
        }}
      />

      <div className="mx-auto flex max-w-[1180px] flex-col items-stretch gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8 sm:py-3">
        <p
          className="flex items-center justify-center gap-1.5 text-[12px] font-medium sm:justify-start sm:text-[13.5px]"
          style={{ color: C.inkSoft }}
        >
          <ShieldCheck weight="fill" className="h-4 w-4 shrink-0" style={{ color: C.coral }} />
          {STICKY_NOTE}
        </p>

        <Link
          href={CHECKOUT_HREF}
          data-cta
          className="lego-press cta-shimmer group inline-flex min-h-[50px] w-full shrink-0 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-bold sm:w-auto sm:px-8"
          style={{
            background: C.gold,
            color: C.inkBody,
            border: `1px solid ${C.goldDeep}`,
            boxShadow: '0 14px 30px -14px rgba(88,51,79,0.5)',
            ['--shimmer' as string]: 'rgba(255,255,255,0.45)',
          }}
        >
          <span className="inline-flex items-center gap-2">
            {CTA_LABEL_INSTANT}
            <ArrowRight
              weight="bold"
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </span>
        </Link>
      </div>
    </div>
  );
}
